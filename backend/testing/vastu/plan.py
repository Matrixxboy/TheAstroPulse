import cv2
import numpy as np
import matplotlib.pyplot as plt


def detect_structure_boundary(
    image_path,
    show_steps=True
):
    """
    Detect the ACTUAL layout / structure boundary
    from architectural / factory drawings.
    """

    # --------------------------------------------------
    # 1️⃣ Read Image
    # --------------------------------------------------
    img = cv2.imread(image_path)
    if img is None:
        print(f"Image not found: {image_path}")
        return None

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape

    if show_steps:
        plt.imshow(img_rgb)
        plt.title("Original Image")
        plt.axis("off")
        plt.show()

    # --------------------------------------------------
    # 2️⃣ Strong Binary Threshold (Blueprint Style)
    # --------------------------------------------------
    _, binary = cv2.threshold(
        gray,
        200,           # HIGH threshold → keeps thick lines
        255,
        cv2.THRESH_BINARY_INV
    )

    # --------------------------------------------------
    # 2.5️⃣ Mask Border (Sever Frame Connections)
    # --------------------------------------------------
    # Draw a black border around the image to cut connections
    # between the outer frame and the inner building
    margin = 15
    cv2.rectangle(binary, (0, 0), (w, margin), 0, -1)
    cv2.rectangle(binary, (0, h - margin), (w, h), 0, -1)
    cv2.rectangle(binary, (0, 0), (margin, h), 0, -1)
    cv2.rectangle(binary, (w - margin, 0), (w, h), 0, -1)

    if show_steps:
        plt.imshow(binary, cmap="gray")
        plt.title("Binary Threshold (Border Masked)")
        plt.axis("off")
        plt.show()

    # --------------------------------------------------
    # 3️⃣ Morphological Closing (Join Broken Walls)
    # --------------------------------------------------
    kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (5, 5)          # Smaller kernel to avoid merging frame with walls
    )

    closed = cv2.morphologyEx(
        binary,
        cv2.MORPH_CLOSE,
        kernel,
        iterations=1
    )

    if show_steps:
        plt.imshow(closed, cmap="gray")
        plt.title("Morphological Closing (Boundary Joined)")
        plt.axis("off")
        plt.show()

    # --------------------------------------------------
    # 4️⃣ Find Contours
    # --------------------------------------------------
    contours, _ = cv2.findContours(
        closed,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    # --------------------------------------------------
    # 5️⃣ Select REAL Structure Boundary (Aggregate)
    # --------------------------------------------------
    image_area = h * w
    valid_contours = []
    
    print(f"Total contours found: {len(contours)}")

    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < image_area * 0.001:  # 0.1% area
            print(f"Rejected Small: Area={area:.1f} < {image_area*0.001:.1f}")
            continue

        x, y, cw, ch = cv2.boundingRect(cnt)
        bbox_area = cw * ch
        density = area / bbox_area if bbox_area > 0 else 0

        # 1. ❌ Reject Page Border (Frame)
        if x <= 10 or y <= 10 or (x + cw) >= (w - 10) or (y + ch) >= (h - 10):
            print(f"Rejected Border: BBox=({x},{y},{cw},{ch}) Image=({w}x{h})")
            continue
        
        # 2. ❌ Reject Thin Lines / Hollow Frames
        # A solid building block will have high density (e.g. > 0.5)
        # A thin frame line will have low density (e.g. < 0.1)
        if density < 0.1:
            print(f"Rejected Low Density (Frame): Density={density:.3f}, BBox=({cw}x{ch})")
            continue

        print(f"Accepted: Area={area:.1f}, Density={density:.3f}, BBox=({x},{y},{cw},{ch})")
        valid_contours.append(cnt)

    if not valid_contours:
        print("X Structure boundary not found (No valid internal contours)")
        return None

    # --------------------------------------------------
    # 6️⃣ Aggregate & Convex Hull
    # --------------------------------------------------
    # Combine all valid structural layouts into one set of points
    all_points = np.vstack(valid_contours)
    hull = cv2.convexHull(all_points)

    print(f"Found {len(valid_contours)} valid structural components. Computed combined hull.")

    # --------------------------------------------------
    # 7️⃣ Draw Result
    # --------------------------------------------------
    result = img_rgb.copy()
    cv2.drawContours(result, [hull], -1, (255, 0, 0), 4)

    if show_steps:
        plt.imshow(result)
        plt.title("Detected STRUCTURE Boundary")
        plt.axis("off")
        plt.show()

    return hull


# ==================================================
# 🧪 RUN ON YOUR IMAGE
# ==================================================
if __name__ == "__main__":
    boundary = detect_structure_boundary(
        image_path="./test.png",
        show_steps=True
    )

    print("Structure boundary detected")
