import cv2
import numpy as np
from pyproj import Proj, transform
from PIL import Image
import io
import os
from ultralytics import YOLO
from .server import allowed_file
# ------------------------------------------------------------------
# CONFIG
# ------------------------------------------------------------------
OVERLAY_IMAGE_PATH = os.path.join(os.path.dirname(__file__), "shakti_chakra.png")

HOUSE_MODEL_PATH = "ai-models/HouseModel/best.pt"

try:
    house_model = YOLO(HOUSE_MODEL_PATH)
    print("✅ YOLO model loaded")
except Exception as e:
    print("⚠️ YOLO not available, using vision fallback")
    house_model = None

# ------------------------------------------------------------------
# GEO / NORTH CALCULATION
# ------------------------------------------------------------------
def calculate_north_angle(center_lat, center_lon, point_lat, point_lon):
    in_proj = Proj("epsg:4326")
    out_proj = Proj("epsg:3857")

    cx, cy = transform(in_proj, out_proj, center_lon, center_lat, always_xy=True)
    px, py = transform(in_proj, out_proj, point_lon, point_lat, always_xy=True)

    dx = px - cx
    dy = py - cy

    angle = np.degrees(np.arctan2(dy, dx))
    return 90 - angle

# ------------------------------------------------------------------
# CLEAN HOUSE CONTOUR (CRITICAL)
# ------------------------------------------------------------------
def get_clean_house_contour(binary):
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    best = None
    best_score = 0

    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < 3000:
            continue

        hull = cv2.convexHull(cnt)
        hull_area = cv2.contourArea(hull)
        if hull_area == 0:
            continue

        solidity = area / hull_area
        x, y, w, h = cv2.boundingRect(cnt)
        aspect_ratio = max(w, h) / (min(w, h) + 1e-6)

        if solidity > 0.75 and aspect_ratio < 3.0:
            score = area * solidity
            if score > best_score:
                best_score = score
                best = cnt

    return best

# ------------------------------------------------------------------
# CHAKRA OVERLAY
# ------------------------------------------------------------------
def overlay_chakra(base, chakra, center, width, height, angle, scale=0.92, opacity=0.85):
    if chakra is None:
        return base

    if chakra.shape[2] != 4:
        raise ValueError("Chakra must be PNG with alpha")

    w = int(width * scale)
    h = int(height * scale)
    chakra = cv2.resize(chakra, (w, h), interpolation=cv2.INTER_AREA)

    M = cv2.getRotationMatrix2D((w // 2, h // 2), -angle, 1.0)
    chakra = cv2.warpAffine(chakra, M, (w, h))

    chakra[:, :, 3] = (chakra[:, :, 3] * opacity).astype(np.uint8)

    x = center[0] - w // 2
    y = center[1] - h // 2

    for c in range(3):
        base[y:y+h, x:x+w, c] = (
            chakra[:, :, c] * (chakra[:, :, 3] / 255.0) +
            base[y:y+h, x:x+w, c] * (1 - chakra[:, :, 3] / 255.0)
        )

    return base

# ------------------------------------------------------------------
# MAIN PROCESSOR
# ------------------------------------------------------------------
def process_blueprint(
    blueprint_image,
    center_lat,
    center_lon,
    point_lat,
    point_lon
):
    output = blueprint_image.copy()

    if output.shape[2] == 4:
        output = cv2.cvtColor(output, cv2.COLOR_BGRA2BGR)

    chakra = cv2.imread(OVERLAY_IMAGE_PATH, cv2.IMREAD_UNCHANGED)

    # ------------------------------------------------------------
    # YOLO FIRST
    # ------------------------------------------------------------
    if house_model:
        results = house_model(output)
        best_box = None
        max_area = 0

        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                w = x2 - x1
                h = y2 - y1
                area = w * h
                ar = max(w, h) / (min(w, h) + 1e-6)

                if ar < 4.0 and area > max_area:
                    max_area = area
                    best_box = (x1, y1, w, h)

        if best_box:
            x, y, w, h = best_box
            contour = np.array([
                [[x, y]],
                [[x+w, y]],
                [[x+w, y+h]],
                [[x, y+h]]
            ])
        else:
            contour = None
    else:
        contour = None

    # ------------------------------------------------------------
    # FALLBACK VISION
    # ------------------------------------------------------------
    if contour is None:
        gray = cv2.cvtColor(output, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        closed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)

        contour = get_clean_house_contour(closed)
        if contour is None:
            print("❌ House boundary not found")
            return None

    # ------------------------------------------------------------
    # GEOMETRY
    # ------------------------------------------------------------
    rect = cv2.minAreaRect(contour)
    (cx, cy), (w, h), _ = rect
    center = (int(cx), int(cy))

    box = cv2.boxPoints(rect)
    box = np.intp(box)

    angle = calculate_north_angle(center_lat, center_lon, point_lat, point_lon)

    # ------------------------------------------------------------
    # APPLY CHAKRA
    # ------------------------------------------------------------
    output = overlay_chakra(
        output,
        chakra,
        center,
        max(w, h),
        min(w, h),
        angle
    )

    # Draw boundary (visual confirmation)
    cv2.drawContours(output, [box], 0, (0, 255, 0), 3)

    return output
