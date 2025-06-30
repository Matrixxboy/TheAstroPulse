from rembg import remove
from PIL import Image
import numpy as np
import io

def remove_background(input_path, output_path="output.png"):
    try:
        # Load image
        with open(input_path, 'rb') as input_file:
            input_image = input_file.read()

        # Remove background
        output_image = remove(input_image)

        # Convert to PIL image
        result = Image.open(io.BytesIO(output_image)).convert("RGBA")
        result.save(output_path, format="PNG")
        print(type(result))
        print(f"✅ {input_image}'s Background removed successfully! Saved to: {output_path}")
        return output_path

    except Exception as e:
        print(f"❌ Error removing background from {input_path}: {e}")
        return None

