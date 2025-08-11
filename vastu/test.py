import cv2
import numpy as np

# Load the blueprint
image_path = "blueprint.jpg"  # Replace with your blueprint image
img = cv2.imread(image_path)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Threshold to binary (invert: white becomes black)
_, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Get the largest contour (assumed as the house boundary)
main_contour = max(contours, key=cv2.contourArea)
cv2.drawContours(img, [main_contour], -1, (0, 255, 0), 2) 
# Get the centroid of the shape
M = cv2.moments(main_contour)
if M["m00"] == 0:
    raise ValueError("Cannot find centroid — zero area detected.")
cx = int(M["m10"] / M["m00"])
cy = int(M["m01"] / M["m00"])
center = (cx, cy)

# Draw center point
cv2.circle(img, center, 10, (0, 0, 255), -1)

# Draw Brahma Chakra (Vastu Purusha Mandala)
# Let's draw a 9x9 grid (optional: make it 3x3 for simple Chakra)
chakra_size = 450  # Size of the full grid (adjust as needed)
chakra_divisions = 9
cell_size = chakra_size // chakra_divisions

# Top-left corner of chakra
start_x = cx - chakra_size // 2
start_y = cy - chakra_size // 2

# Draw vertical and horizontal lines
for i in range(chakra_divisions + 1):
    # Vertical lines
    x = start_x + i * cell_size
    cv2.line(img, (x, start_y), (x, start_y + chakra_size), (255, 0, 0), 1)
    # Horizontal lines
    y = start_y + i * cell_size
    cv2.line(img, (start_x, y), (start_x + chakra_size, y), (255, 0, 0), 1)

# Optional: Label center as "Brahmasthan"
cv2.putText(img, "Brahmasthan", (cx - 50, cy - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 100, 255), 2)

# Save the result
output_path = "blueprint_with_brahma_chakra.png"
cv2.imwrite(output_path, img)
print(f"Saved: {output_path}")
