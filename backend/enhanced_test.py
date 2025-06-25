
import cv2
import numpy as np
import mediapipe as mp
from skimage.morphology import skeletonize, remove_small_objects
from skimage.filters import meijering
from skimage.util import img_as_ubyte

def process_image(image_path):
    # 1. Load image
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError("Image not found or cannot be read.")

    original = img.copy()
    height, width = img.shape[:2]

    # 2. Background removal with MediaPipe
    with mp.solutions.selfie_segmentation.SelfieSegmentation(model_selection=1) as segmentor:
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        result = segmentor.process(rgb_img)
        mask = result.segmentation_mask
        binary_mask = (mask > 0.5).astype(np.uint8) * 255
        binary_mask = cv2.erode(binary_mask, np.ones((5, 5), np.uint8), iterations=2)
        img = cv2.bitwise_and(img, img, mask=binary_mask)

    # 3. CLAHE + TopHat + Meijering filter
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(9, 9))
    enhanced = clahe.apply(gray)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 30))
    tophat = cv2.morphologyEx(enhanced, cv2.MORPH_TOPHAT, kernel)
    combined = cv2.addWeighted(enhanced, 0.8, tophat, 0.8, 0)

    meij = meijering(combined / 255.0, sigmas=range(3, 8), black_ridges=True)
    meij = img_as_ubyte(meij)

    # 4. Threshold + Skeletonization
    _, binary = cv2.threshold(meij, 50, 255, cv2.THRESH_BINARY)
    skeleton = skeletonize(binary // 255).astype(np.uint8) * 255

    # 5. Remove outer hand boundary and small noise
    skeleton = cv2.bitwise_and(skeleton, skeleton, mask=binary_mask)
    cleaned = remove_small_objects(skeleton.astype(bool), min_size=300, connectivity=2)
    cleaned = (cleaned * 255).astype(np.uint8)
    cleaned = cv2.GaussianBlur(cleaned, (3, 3), 0)

    # 6. Final line filtering based on contour size
    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    final_mask = np.zeros_like(cleaned)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        x, y, w, h = cv2.boundingRect(cnt)
        if area > 350 and (w > 60 or h > 60):
            cv2.drawContours(final_mask, [cnt], -1, 255, -1)

    # 7. Overlay result on original
    result_img = cv2.cvtColor(final_mask, cv2.COLOR_GRAY2BGR)
    overlay = cv2.addWeighted(original, 0.6, result_img, 0.6, 0)

    cv2.imwrite("palm_lines_isolated.png", final_mask)
    cv2.imwrite("palm_lines_overlay.png", overlay)

    print("✔ Saved: palm_lines_isolated.png")
    print("✔ Saved: palm_lines_overlay.png")
    return final_mask, overlay

if __name__ == "__main__":
    process_image("test2.png")
