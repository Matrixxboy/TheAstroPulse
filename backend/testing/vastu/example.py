import json
import cv2
import numpy as np
import os
import matplotlib.pyplot as plt

def labelme_to_mask(json_path):
    with open(json_path, "r") as f:
        data = json.load(f)

    h, w = data["imageHeight"], data["imageWidth"]
    mask = np.zeros((h, w), dtype=np.uint8)
    
    found_any_shape = False

    for shape in data["shapes"]:
        label = shape["label"]
        print(f"Checking shape with label: '{label}'") # DEBUG PRINT
        
        # Check against your target label
        if label == "proparea": 
            print(" -> Match found! Drawing polygon...")
            pts = np.array(shape["points"], dtype=np.int32)
            cv2.fillPoly(mask, [pts], 255)
            found_any_shape = True
            
    if not found_any_shape:
        print("WARNING: No shapes matches 'house'. Mask will be empty.")

    return mask
# Setup directories
input_dir = "Data"
output_dir = "Data/processed"
os.makedirs(output_dir, exist_ok=True)

for image_json in os.listdir(input_dir):
    if image_json.endswith(".json"):
        print(f"Starting for image: {image_json}")
        
        try:
            mask = labelme_to_mask(os.path.join(input_dir, image_json))
            
            # OPTIONAL: Visualize loop (comment out for speed)
            # plt.imshow(mask, cmap="gray")
            # plt.title("House Mask")
            # plt.show() 

            # --- KEY CHANGE: Save as Image, not JSON ---
            # Remove .json extension and add .png
            base_name = os.path.splitext(image_json)[0]
            output_path = os.path.join(output_dir, f"{base_name}_mask.png")
            
            cv2.imwrite(output_path, mask)
            print(f"Saved mask to: {output_path}")
            
        except Exception as e:
            print(f"Failed to process {image_json}: {e}")

print("All completed.")