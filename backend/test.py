import cv2
import numpy as np
import mediapipe as mp
from skimage.morphology import skeletonize
from skimage.filters import meijering
from skimage.util import img_as_ubyte
import matplotlib.pyplot as plt

def process_image(image_path):
    """
    Processes a hand image to extract and identify the Heart, Head, and Life lines.
    This version includes refined pre-processing and classification heuristics for improved robustness.

    Args:
        image_path (str): The path to the input hand image.
    """
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Image not loaded from {image_path}. Check path or format.")
        return

    print(f"Processing image: {image_path}")

    # --- 1. Robust Background Removal using MediaPipe ---
    # This helps in isolating the hand regardless of skin tone or complex backgrounds.
    mp_selfie_segmentation = mp.solutions.selfie_segmentation
    with mp_selfie_segmentation.SelfieSegmentation(model_selection=1) as segmentor:
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        result = segmentor.process(rgb_img)
        mask = result.segmentation_mask

        # Apply a Gaussian blur to the mask to smooth edges
        # Reduced blur slightly from default 15x15 to 11x11, as per your change
        mask = cv2.GaussianBlur(mask, (11, 11), 0) 

        # Create a 3-channel mask for element-wise multiplication
        mask_3ch = np.stack([mask] * 3, axis=-1)

        # Threshold the mask to create a binary mask of the hand (foreground)
        # Using 0.1 for more inclusive hand segmentation.
        hand_mask_binary = (mask_3ch > 0.1).astype(np.uint8)

        # Create a white background for the output image
        white_bg = np.ones_like(img, dtype=np.uint8) * 255

        # Apply the mask: hand remains, background becomes white
        img_no_bg = (img * hand_mask_binary + white_bg * (1 - hand_mask_binary)).astype(np.uint8)

    # --- 2. Line Enhancement Filters ---
    gray = cv2.cvtColor(img_no_bg, cv2.COLOR_BGR2GRAY)

    # --- Global Histogram Equalization ---
    # This step helps to normalize the overall brightness and contrast
    # across different images, making subsequent processing more consistent.
    equalized_gray = cv2.equalizeHist(gray)

    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) for better contrast
    # CLAHE is applied AFTER global equalization for local fine-tuning.
    clahe = cv2.createCLAHE(clipLimit=3, tileGridSize=(8, 8)) # Your adjusted tile size
    enhanced = clahe.apply(equalized_gray) # Apply CLAHE to the globally equalized image

    # Apply Top-Hat transform to highlight bright features (lines) on a dark background
    kernel_tophat = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 30))
    tophat = cv2.morphologyEx(enhanced, cv2.MORPH_TOPHAT, kernel_tophat)
    
    # Combine enhanced image with tophat result for overall line prominence
    # Adjusted weights to give slightly more prominence to the 'tophat' features
    combined = cv2.addWeighted(enhanced, 0.6, tophat, 0.4, 0) # Adjusted weights

    # Meijering filter: specializes in detecting vessel-like (line-like) structures
    meij = meijering(combined / 255.0, sigmas=range(1, 10), black_ridges=True) 
    meij = img_as_ubyte(meij)

    # Adaptive Thresholding: Use OTSU's method.
    _, binary = cv2.threshold(meij, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Debug visualization for thresholding result
    # cv2.imshow("Debug: Binary Image after OTSU", binary)

    # Skeletonization: Reduces lines to 1-pixel width, simplifying contour analysis
    skeleton = skeletonize(binary // 255) 
    skeleton = (skeleton * 255).astype(np.uint8)

    # --- 3. Morphological Closing ---
    kernel_close = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    # Can increase iterations if lines are very broken, but be careful of merging separate lines.
    closed = cv2.morphologyEx(skeleton, cv2.MORPH_CLOSE, kernel_close, iterations=1) 
    
    # Debug visualization for line connectivity
    # cv2.imshow("Debug: Closed Image (Lines Connected)", closed)

    # --- 4. Line Detection (Contours) ---
    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    height, width = gray.shape

    # --- 5. Filter Longest and Smallest Lines ---
    filtered_contours = []
    if contours:
        contour_lengths = [cv2.arcLength(c, False) for c in contours]

        # Dynamic length thresholds based on image dimensions
        # Tuned `min_length_ratio` lower to capture more fragmented main lines
        min_length_ratio = 0.01 # Adjusted
        max_length_ratio = 0.80  

        min_length_threshold = min(height, width) * min_length_ratio
        max_length_threshold = max(height, width) * max_length_ratio

        print(f"\nInitial contours found: {len(contours)}")
        print(f"Length thresholds: Min={min_length_threshold:.2f}, Max={max_length_threshold:.2f}")

        for contour, length in zip(contours, contour_lengths):
            if length > min_length_threshold and length < max_length_threshold:
                filtered_contours.append(contour)

        print(f"Contours after length filtering: {len(filtered_contours)}")

        # Optional refinement: remove a few absolute shortest/longest from the remaining
        if len(filtered_contours) > 5:
            filtered_contours.sort(key=lambda c: cv2.arcLength(c, False))
            num_to_remove_shortest = min(1, len(filtered_contours) // 10) 
            filtered_contours = filtered_contours[num_to_remove_shortest:]

    # --- Initialize Variables for the Three Main Lines ---
    heart_line = None
    head_line = None
    life_line = None
    heart_line_data = None 
    head_line_data = None
    life_line_data = None

    # --- 6. Feature Extraction for Classification ---
    line_candidates_info = []
    for i, contour in enumerate(filtered_contours):
        x, y, w, h = cv2.boundingRect(contour)
        
        M = cv2.moments(contour)
        cx, cy = (int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"])) if M["m00"] != 0 else (x + w // 2, y + h // 2)

        length = cv2.arcLength(contour, False)

        angle = 0
        straightness = 0
        if len(contour) >= 5: # minAreaRect requires at least 5 points
            rect = cv2.minAreaRect(contour)
            center, dims, raw_angle = rect
            
            # Normalize angle to be 0-90 degrees (0 = horizontal, 90 = vertical)
            if dims[0] < dims[1]: 
                angle = 90 + raw_angle
            else: 
                angle = abs(raw_angle)
            
            straightness = min(dims) / max(dims) if max(dims) > 0 else 0
        
        relative_cy = cy / height
        relative_cx = cx / width

        line_candidates_info.append({
            'id': i,
            'contour': contour,
            'bbox': (x, y, w, h),
            'cx': cx, 'cy': cy,
            'relative_cx': relative_cx,
            'relative_cy': relative_cy,
            'length': length,
            'angle': angle, # Angle in degrees (0 = horizontal, 90 = vertical)
            'straightness': straightness, # 1 for very straight, <1 for curved
        })
    
    print(f"\nCandidates for main line classification: {len(line_candidates_info)}")
    for i, lc in enumerate(line_candidates_info):
        print(f"Cand {lc['id']}: Len={lc['length']:.1f}, Angle={lc['angle']:.1f}, Straight={lc['straightness']:.2f}, "
              f"RCY={lc['relative_cy']:.2f}, RCX={lc['relative_cx']:.2f}, BBox=({lc['bbox'][0]},{lc['bbox'][1]},{lc['bbox'][2]},{lc['bbox'][3]})")

    classified_contours_ids = set()

    # --- 7. Heuristic-Based Line Classification ---

    # --- 7.1. Identify Heart Line ---
    heart_candidates = []
    for i, lc in enumerate(line_candidates_info):
        # Increased relative_cy upper bound (0.70) to be more lenient for lower heart lines.
        # Increased angle tolerance (65) to allow for more curved heart lines.
        # Decreased minimum length (0.20) to capture partial or faint heart line segments.
        if lc['relative_cy'] < 0.70 and \
           lc['length'] > width * 0.20 and \
           lc['angle'] < 65: 
            heart_candidates.append(lc)
    
    if heart_candidates:
        heart_candidates.sort(key=lambda x: x['relative_cy'])
        heart_line_data = heart_candidates[0]
        heart_line = heart_line_data['contour']
        classified_contours_ids.add(heart_line_data['id'])
        print(f"Heart line candidate found (ID: {heart_line_data['id']}). Relative CY: {heart_line_data['relative_cy']:.2f}")

    # --- 7.2. Identify Head Line ---
    head_candidates = []
    for i, lc in enumerate(line_candidates_info):
        if lc['id'] not in classified_contours_ids:
            # More strict relative_cy bounds for head line (0.40 to 0.85)
            # Increased minimum length (0.35) for robustness.
            # Slightly tightened angle tolerance (55) for more specific horizontal/slanted lines.
            if lc['relative_cy'] > 0.40 and lc['relative_cy'] < 0.85 and \
               lc['length'] > width * 0.35 and lc['angle'] < 55: # Adjusted angle and length
                # Ensure it's below the heart line if heart line was found
                if heart_line_data is None or lc['relative_cy'] > heart_line_data['relative_cy'] + 0.04:
                    head_candidates.append(lc)
    
    if head_candidates:
        head_candidates.sort(key=lambda x: (x['relative_cy'], -x['length'])) 
        head_line_data = head_candidates[0]
        head_line = head_line_data['contour']
        classified_contours_ids.add(head_line_data['id'])
        print(f"Head line candidate found (ID: {head_line_data['id']}). Relative CY: {head_line_data['relative_cy']:.2f}")


    # --- 7.3. Identify Life Line ---
    life_candidates = []
    for i, lc in enumerate(line_candidates_info):
        if lc['id'] not in classified_contours_ids:
            # Origin point (for a left hand): Top-left region
            # These thresholds are crucial. Tune based on your image set.
            is_origin_in_thumb_base_area = (lc['relative_cx'] < 0.45 and lc['relative_cy'] < 0.50) 
            
            # Shape characteristics: Long, significant vertical and horizontal spread, curved.
            # Life line is usually more vertical/diagonal than heart/head lines.
            is_long_and_curved = (lc['length'] > width * 0.25 and # Lowered minimum length significantly
                                  lc['bbox'][3] > height * 0.25 and # Significant vertical span
                                  lc['bbox'][2] > width * 0.12 and # Significant horizontal span
                                  lc['straightness'] < 0.75 and # Not very straight (more lenient)
                                  lc['angle'] > 25 and lc['angle'] < 75) # More specific angle range for typical curve
            
            # Combine conditions and assign a score for each candidate
            score = 0
            if is_origin_in_thumb_base_area: score += 2 # Strong weight for correct origin
            if is_long_and_curved: score += 3 # Strong weight for shape and length
            
            # Additional score for being among the longest remaining lines
            if lc['length'] > width * 0.40: score += 1
            if lc['bbox'][3] > height * 0.40: score += 1 # Very tall line
            
            if score > 0: # Only consider candidates that meet at least some criteria
                life_candidates.append({'score': score, 'info': lc})

    if life_candidates:
        # Prioritize by highest score, then by length (longer preferred among same scores),
        # then by straightness (more curved preferred)
        life_candidates.sort(key=lambda x: (x['score'], -x['info']['length'], x['info']['straightness']), reverse=True)
        
        life_line_data = life_candidates[0]['info']
        life_line = life_line_data['contour']
        classified_contours_ids.add(life_line_data['id'])
        print(f"Life line candidate found (ID: {life_line_data['id']}). Length: {life_line_data['length']:.1f}, Score: {life_candidates[0]['score']}")
    
    # --- Final Classification Summary ---
    print("\n--- Final Classification Results ---")
    if heart_line is None: print("Heart Line: NOT FOUND")
    if head_line is None: print("Head Line: NOT FOUND")
    if life_line is None: print("Life Line: NOT FOUND")
    
    if len(classified_contours_ids) < 3:
        print("\n--- Remaining unclassified lines (potential missed main lines or noise): ---")
        for lc in line_candidates_info:
            if lc['id'] not in classified_contours_ids:
                print(f"Unclassified Cand {lc['id']}: Len={lc['length']:.1f}, Angle={lc['angle']:.1f}, Straight={lc['straightness']:.2f}, "
                      f"RCY={lc['relative_cy']:.2f}, RCX={lc['relative_cx']:.2f}, BBox=({lc['bbox'][0]},{lc['bbox'][1]},{lc['bbox'][2]},{lc['bbox'][3]})")


    # --- 8. Draw the Identified Lines on the Original Image ---
    three_lines_img_gray = np.zeros((height, width), dtype=np.uint8)
    three_lines_img = cv2.cvtColor(three_lines_img_gray, cv2.COLOR_GRAY2BGR)

    output_on_original = img_no_bg.copy()

    # Draw identified lines in distinct colors
    if heart_line is not None:
        cv2.drawContours(three_lines_img, [heart_line], -1, (0, 0, 255), 2) # Red
        cv2.drawContours(output_on_original, [heart_line], -1, (0, 0, 255), 2)
    if head_line is not None:
        cv2.drawContours(three_lines_img, [head_line], -1, (0, 255, 255), 2) # Yellow
        cv2.drawContours(output_on_original, [head_line], -1, (0, 255, 255), 2)
    if life_line is not None:
        cv2.drawContours(three_lines_img, [life_line], -1, (0, 255, 0), 2) # Green
        cv2.drawContours(output_on_original, [life_line], -1, (0, 255, 0), 2)

    # Display results
    cv2.imshow("Extracted Main Palm Lines (Isolated)", three_lines_img)
    cv2.imshow("Main Lines Overlayed on Hand", output_on_original)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# --- Example Usage ---
# Make sure 'Main Lines Overlayed on Hand.jpg' is in the same directory as this script.
process_image("./image.png")
