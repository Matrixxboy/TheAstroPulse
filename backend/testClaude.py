import cv2
import numpy as np
import base64
from flask import request, jsonify
from skimage.morphology import skeletonize, remove_small_objects
from skimage.filters import meijering
from skimage.util import img_as_ubyte
from skimage.restoration import denoise_tv_chambolle


# ─────────────────────────────────────────────
#  REAL-WORLD MEASUREMENT HELPER
# ─────────────────────────────────────────────

def pixels_to_real(px: float, dpi: int = 96, unit: str = "cm") -> float:
    """
    Convert pixel length to a real-world unit.

    The function uses DPI (dots-per-inch) extracted from the image metadata
    when available, otherwise falls back to the supplied default (96 dpi is
    the standard screen resolution).

    Args:
        px   – length in pixels
        dpi  – dots per inch (from EXIF or caller)
        unit – "cm" | "inch"

    Returns:
        length in the requested unit, rounded to 2 decimal places
    """
    inches = px / dpi
    if unit == "cm":
        return round(inches * 2.54, 2)
    return round(inches, 2)


def extract_dpi(filepath_or_bytes) -> int:
    """
    Try to read DPI from JPEG/PNG metadata using PIL.
    Falls back to 96 if metadata is missing or unreadable.
    """
    try:
        from PIL import Image
        import io
        img_pil = Image.open(io.BytesIO(filepath_or_bytes))
        info = img_pil.info
        dpi_val = info.get("dpi", (96, 96))
        # PIL returns (x_dpi, y_dpi); take the average
        return int((dpi_val[0] + dpi_val[1]) / 2) if isinstance(dpi_val, tuple) else int(dpi_val)
    except Exception:
        return 96   # safe default


# ─────────────────────────────────────────────
#  BACKGROUND REMOVAL  (MediaPipe Selfie-Seg)
# ─────────────────────────────────────────────

def remove_background_opencv(img: np.ndarray) -> np.ndarray:
    """
    Use MediaPipe Selfie-Segmentation to isolate the hand/palm from
    the background.  Returns the image with non-hand pixels zeroed out.
    """
    import mediapipe as mp
    mp_selfie = mp.solutions.selfie_segmentation
    with mp_selfie.SelfieSegmentation(model_selection=0) as seg:
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        result = seg.process(rgb)
        mask = (result.segmentation_mask > 0.5).astype(np.uint8) * 255
        # Morphological clean-up on the mask
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        return cv2.bitwise_and(img, img, mask=mask)


# ─────────────────────────────────────────────
#  PALM REGION CROP
# ─────────────────────────────────────────────

def crop_palm_region(img: np.ndarray, mask: np.ndarray) -> tuple[np.ndarray, tuple]:
    """
    Tight-crop to the bounding box of the palm mask so that subsequent
    processing works on a smaller, cleaner region.

    Returns:
        cropped image, (x_offset, y_offset) for re-projecting contours
    """
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return img, (0, 0)
    largest = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest)
    # Add 5 % padding
    pad_x = int(w * 0.05)
    pad_y = int(h * 0.05)
    x1 = max(x - pad_x, 0)
    y1 = max(y - pad_y, 0)
    x2 = min(x + w + pad_x, img.shape[1])
    y2 = min(y + h + pad_y, img.shape[0])
    return img[y1:y2, x1:x2], (x1, y1)


# ─────────────────────────────────────────────
#  HAND ORIENTATION (landmark-based)
# ─────────────────────────────────────────────

def get_hand_landmarks(img: np.ndarray):
    """
    Return normalised MediaPipe hand landmarks (21 points) or None.
    Landmarks give us reliable anatomical anchors for line classification.
    """
    import mediapipe as mp
    mp_hands = mp.solutions.hands
    with mp_hands.Hands(static_image_mode=True, max_num_hands=1,
                        min_detection_confidence=0.5) as hands:
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)
        if result.multi_hand_landmarks:
            return result.multi_hand_landmarks[0].landmark
    return None


def landmark_to_px(lm, w: int, h: int) -> tuple[int, int]:
    return int(lm.x * w), int(lm.y * h)


# ─────────────────────────────────────────────
#  LINE CLASSIFICATION
# ─────────────────────────────────────────────

def classify_palm_lines(
    contours: list,
    landmarks,
    img_shape: tuple,
    offset: tuple = (0, 0)
) -> dict:
    """
    Assign each detected contour to one of the four major palmistry lines
    using anatomical anchor points derived from MediaPipe hand landmarks.

    Palmistry anatomy:
        Heart Line  – runs below the fingers (top third of palm),
                      roughly at the level of the MCP joints.
        Head Line   – runs across the middle of the palm.
        Life Line   – curves around the thenar eminence (thumb mound).
        Fate Line   – runs roughly vertically through the centre of the palm.

    When landmarks are unavailable the function falls back to a purely
    geometric heuristic (relative vertical position of each contour's
    centre of mass).
    """
    h, w = img_shape[:2]
    ox, oy = offset

    classified: dict[str, dict | None] = {
        "Heart Line": None,
        "Head Line": None,
        "Life Line": None,
        "Fate Line": None,
    }

    if not contours:
        return classified

    # ── Build a list of (contour, properties) ──
    line_props = []
    for cnt in contours:
        M = cv2.moments(cnt)
        if M["m00"] == 0:
            continue
        cx = int(M["m10"] / M["m00"]) + ox
        cy = int(M["m01"] / M["m00"]) + oy
        # Bounding box (in original image coords)
        bx, by, bw, bh = cv2.boundingRect(cnt)
        bx += ox; by += oy
        length_px = int(cv2.arcLength(cnt, False))
        # Orientation: angle of the fitted ellipse (if enough points)
        angle = 0.0
        if len(cnt) >= 5:
            try:
                _, _, angle = cv2.fitEllipse(cnt)
            except Exception:
                pass
        line_props.append({
            "cnt": cnt,
            "cx": cx, "cy": cy,
            "bx": bx, "by": by, "bw": bw, "bh": bh,
            "length_px": length_px,
            "angle": angle,
            "rel_y": cy / h,   # 0 = top, 1 = bottom
            "rel_x": cx / w,
        })

    # ── Landmark-based classification ──
    if landmarks is not None:
        # Key reference y-positions (normalised 0-1)
        # Index MCP = landmark 5, Middle MCP = 9, Ring MCP = 13, Pinky MCP = 17
        # Wrist = 0, Middle TIP = 12
        mcp_y    = np.mean([landmarks[i].y for i in [5, 9, 13, 17]])   # finger base
        wrist_y  = landmarks[0].y
        mid_palm = (mcp_y + wrist_y) / 2   # midpoint between fingers and wrist
        # Thumb base (CMC) x-position for Life Line detection
        thumb_x  = landmarks[1].x  # landmark 1 = thumb CMC

        # Heart Line  ≈ 15-25 % below MCP line
        heart_y  = mcp_y + (wrist_y - mcp_y) * 0.20
        # Head Line   ≈ 40-55 % below MCP line
        head_y   = mcp_y + (wrist_y - mcp_y) * 0.47
        # Life Line   curves near thumb x-coord, lower half of palm
        # Fate Line   near vertical, centre x ≈ 0.45-0.55

        targets = {
            "Heart Line": {"rel_y": heart_y,  "rel_x": 0.5,  "weight_x": 0.1},
            "Head Line":  {"rel_y": head_y,   "rel_x": 0.5,  "weight_x": 0.1},
            "Life Line":  {"rel_y": mid_palm,  "rel_x": thumb_x, "weight_x": 0.5},
            "Fate Line":  {"rel_y": mid_palm,  "rel_x": 0.5,  "weight_x": 0.3},
        }

        used_indices: set[int] = set()
        # Score each line type against every contour
        for line_name, target in targets.items():
            best_score = float("inf")
            best_idx = -1
            for idx, lp in enumerate(line_props):
                if idx in used_indices:
                    continue
                dy = abs(lp["rel_y"] - target["rel_y"])
                dx = abs(lp["rel_x"] - target["rel_x"]) * target["weight_x"]
                score = dy + dx
                if score < best_score:
                    best_score = score
                    best_idx = idx
            if best_idx >= 0:
                classified[line_name] = line_props[best_idx]
                used_indices.add(best_idx)

    else:
        # ── Geometric fallback ──
        # Sort by vertical position (rel_y ascending = higher in image)
        sorted_by_y = sorted(line_props, key=lambda p: p["rel_y"])

        # Heart Line  → highest (smallest rel_y)
        # Head Line   → second
        # Life Line   → most leftward in the lower half (largest rel_x difference)
        # Fate Line   → most vertical in the centre

        # Detect Fate Line: most vertical contour (angle ≈ 90°) near centre x
        fate_candidates = [lp for lp in line_props if 0.35 < lp["rel_x"] < 0.65]
        fate_line = None
        if fate_candidates:
            fate_line = min(fate_candidates, key=lambda p: abs(p["angle"] - 90))

        remaining = [lp for lp in sorted_by_y if lp is not fate_line]

        classified["Heart Line"] = remaining[0] if len(remaining) > 0 else None
        classified["Head Line"]  = remaining[1] if len(remaining) > 1 else None

        # Life Line: lowest + leftmost among remaining
        lower_half = [lp for lp in remaining[2:] if lp["rel_y"] > 0.45]
        classified["Life Line"]  = min(lower_half, key=lambda p: p["rel_x"]) if lower_half else (
            remaining[2] if len(remaining) > 2 else None)
        classified["Fate Line"]  = fate_line

    return classified


# ─────────────────────────────────────────────
#  MAIN FLASK ROUTE
# ─────────────────────────────────────────────

@app.route('/process-image', methods=['POST'])
@limiter.limit("5 per minute")
def process_image():
    if 'image' not in request.files:
        return {"error": "No image file provided"}, 400

    file = request.files['image']
    if file.filename == '':
        return {"error": "Empty filename"}, 400

    # Measurement unit preference: query param ?unit=cm (default) or ?unit=inch
    unit = request.args.get("unit", "cm").lower()
    if unit not in ("cm", "inch"):
        unit = "cm"

    try:
        raw_bytes = file.read()

        # ── DPI from metadata (for accurate real-world measurement) ──
        dpi = extract_dpi(raw_bytes)

        # ── Decode image ──
        image_array = np.frombuffer(raw_bytes, np.uint8)
        img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        if img is None:
            return {"error": "Invalid image format"}, 400
        original = img.copy()
        H, W = img.shape[:2]

        # ── 1. MediaPipe hand landmarks (before bg removal for best accuracy) ──
        landmarks = get_hand_landmarks(img)

        # ── 2. Background removal ──
        img_nobg = remove_background_opencv(img)

        # ── 3. Palm mask for crop ──
        gray_mask = cv2.cvtColor(img_nobg, cv2.COLOR_BGR2GRAY)
        _, palm_mask = cv2.threshold(gray_mask, 1, 255, cv2.THRESH_BINARY)

        # ── 4. Crop to palm bounding box ──
        cropped, offset = crop_palm_region(img_nobg, palm_mask)
        gray = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)

        # ── 5. Noise reduction ──
        gray = cv2.GaussianBlur(gray, (3, 3), 0)

        # ── 6. CLAHE contrast enhancement ──
        clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)

        # ── 7. Top-hat morphology to isolate fine creases ──
        kernel_tophat = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 9))
        tophat = cv2.morphologyEx(enhanced, cv2.MORPH_TOPHAT, kernel_tophat)
        combined = cv2.addWeighted(enhanced, 0.7, tophat, 1.0, 0)
        combined = cv2.GaussianBlur(combined, (3, 3), 0)
        combined = denoise_tv_chambolle(combined / 255.0, weight=0.15)
        combined = (combined * 255).astype(np.uint8)

        # ── 8. Meijering ridge filter (tuned for palm creases) ──
        meij = meijering(combined / 255.0, sigmas=range(1, 5), black_ridges=True)
        meij = img_as_ubyte(meij)

        # ── 9. Adaptive threshold (handles uneven illumination better) ──
        binary = cv2.adaptiveThreshold(
            meij, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            blockSize=11, C=-2
        )

        # ── 10. Morphological closing to join broken line segments ──
        kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel_close, iterations=2)

        # ── 11. Remove tiny noise islands ──
        cleaned = remove_small_objects(binary.astype(bool), min_size=100, connectivity=2)
        cleaned = (cleaned * 255).astype(np.uint8)

        # ── 12. Skeletonise ──
        skeleton = skeletonize(cleaned // 255).astype(np.uint8) * 255

        # ── 13. Dilate skeleton for visibility & contour stability ──
        kernel_thick = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        skeleton = cv2.dilate(skeleton, kernel_thick, iterations=1)

        # ── 14. Re-apply palm mask (crop-space) ──
        palm_mask_crop = palm_mask[
            offset[1]: offset[1] + cropped.shape[0],
            offset[0]: offset[0] + cropped.shape[1]
        ]
        skeleton = cv2.bitwise_and(skeleton, skeleton, mask=palm_mask_crop)

        # ── 15. Remove small remnants after skeletonisation ──
        cleaned2 = remove_small_objects(skeleton.astype(bool), min_size=300, connectivity=1)
        cleaned2 = (cleaned2 * 255).astype(np.uint8)

        # ── 16. Extract contours (top 8 candidates for classification) ──
        contours, _ = cv2.findContours(cleaned2, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = sorted(contours, key=lambda c: cv2.arcLength(c, False), reverse=True)[:8]

        # ── 17. Classify into named palm lines ──
        classified = classify_palm_lines(contours, landmarks, (H, W), offset)

        # ── 18. Draw results on original image ──
        overlay = original.copy()
        temp_overlay = original.copy()

        line_config = {
            "Heart Line": {"bgr": (0,   20,  220), "hex": "#DC1400"},  # warm red
            "Head Line":  {"bgr": (30,  180, 255), "hex": "#FFB41E"},  # amber
            "Life Line":  {"bgr": (0,   210,  60), "hex": "#3CD200"},  # green
            "Fate Line":  {"bgr": (220,  60,  220), "hex": "#DC3CDC"}, # violet
        }

        lengths = []
        for line_name, lp in classified.items():
            if lp is None:
                continue
            cnt     = lp["cnt"]
            length_px = lp["length_px"]

            # ── Real-world conversion ──
            real_length = pixels_to_real(length_px, dpi=dpi, unit=unit)

            color_bgr = line_config[line_name]["bgr"]
            color_hex = line_config[line_name]["hex"]

            # Shift contour back to original image space
            cnt_shifted = cnt.copy()
            cnt_shifted[:, :, 0] += offset[0]
            cnt_shifted[:, :, 1] += offset[1]

            cv2.drawContours(temp_overlay, [cnt_shifted], -1, color_bgr, 4)

            # Label annotation
            label_x = int(lp["cx"])
            label_y = max(int(lp["cy"]) - 10, 20)
            cv2.putText(
                temp_overlay,
                f"{line_name}: {real_length} {unit}",
                (label_x, label_y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.55, color_bgr, 2, cv2.LINE_AA
            )

            lengths.append({
                "name":        line_name,
                "length_px":   length_px,
                "length_real": real_length,
                "unit":        unit,
                "color":       color_hex,
                "dpi_used":    dpi,
            })

        overlay = cv2.addWeighted(overlay, 0.45, temp_overlay, 0.85, 0)

        # ── 19. Encode and return ──
        success, encoded_image = cv2.imencode('.png', overlay)
        if not success:
            return {"error": "Failed to encode image"}, 500

        base64_img = base64.b64encode(encoded_image.tobytes()).decode('utf-8')

        return jsonify({
            "image":   base64_img,
            "lines":   lengths,
            "message": "Palm lines mapped successfully",
            "dpi":     dpi,
            "unit":    unit,
        })

    except Exception as e:
        return {"error": str(e)}, 500