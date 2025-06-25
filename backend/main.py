from flask import Flask, request, jsonify ,send_file
from flask_cors import CORS
from astrology.horoscope import fetch_horoscope ,get_zodiac_sign
import numpy as np
import cv2
import io
from datetime import datetime
import mediapipe as mp
from skimage.filters import meijering
from skimage.morphology import skeletonize
from skimage.util import img_as_ubyte

# Assuming horoscope_fetcher.py (the code from your 'horoscope-fetcher' immersive)
# is in the same directory as this file.

app = Flask(__name__)
CORS(app,origins=["http://localhost:5173"])

@app.route('/horoscope', methods=['GET'])
def get_horoscope():
    """
    API endpoint to fetch horoscope for a given date of birth and day type.
    
    Expected URL parameters:
    - dob (required): Date of birth in YYYY-MM-DD format (e.g., 1990-05-15).
    - day (optional): Type of day (e.g., "today", "yesterday", "tomorrow"). Defaults to "today".
    
    Example usage:
    GET /horoscope?dob=1990-05-15&day=today
    """
    dob_str = request.args.get('dob')
    day_type = request.args.get('day', 'today') # Default to 'today' if not provided

    if not dob_str:
        return jsonify({"error": "Date of birth (dob) parameter is required in YYYY-MM-DD format."}), 400

    print(f"API request received: dob={dob_str}, day_type={day_type}")

    horoscope_text = fetch_horoscope(dob_str, day_type)
    dob = datetime.strptime(dob_str, "%Y-%m-%d").date()
    zodiac_sign = get_zodiac_sign(dob)
    if horoscope_text:
        return jsonify({
            "dob": dob_str,
            "day_type": day_type,
            "zodiac_sign" :zodiac_sign,
            "horoscope": horoscope_text,
            "message": "Horoscope fetched successfully."
        }), 200
    else:
        return jsonify({"error": "Could not fetch horoscope. Please check the DOB and try again.", "dob": dob_str, "day_type": day_type}), 500


@app.route('/process-image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return {"error": "No image file provided"}, 400

    file = request.files['image']
    if file.filename == '':
        return {"error": "Empty filename"}, 400

    try:
        in_memory_file = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(in_memory_file, cv2.IMREAD_COLOR)
        if img is None:
            return {"error": "Invalid image format"}, 400

        # 1. Background Removal
        mp_selfie_segmentation = mp.solutions.selfie_segmentation
        with mp_selfie_segmentation.SelfieSegmentation(model_selection=1) as segmentor:
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            result = segmentor.process(rgb_img)
            mask = result.segmentation_mask
            mask = cv2.GaussianBlur(mask, (15, 15), 0)
            mask_3ch = np.stack([mask] * 3, axis=-1)
            mask_3ch = (mask_3ch > 0.2).astype(np.uint8)
            white_bg = np.ones_like(img, dtype=np.uint8) * 255
            img = (img * mask_3ch + white_bg * (1 - mask_3ch)).astype(np.uint8)

        # 2. Grayscale + CLAHE
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)

        # 3. TopHat + Meijering filter for palm lines
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
        tophat = cv2.morphologyEx(enhanced, cv2.MORPH_TOPHAT, kernel)
        combined = cv2.addWeighted(enhanced, 0.6, tophat, 0.4, 0)

        meij = meijering(combined / 255.0, sigmas=range(1, 6), black_ridges=True)
        meij = img_as_ubyte(meij)

        # 4. Threshold + Skeleton
        _, binary = cv2.threshold(meij, 25, 255, cv2.THRESH_BINARY)
        skeleton = skeletonize(binary // 255)
        skeleton = (skeleton * 255).astype(np.uint8)

        # 5. Morph closing
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        closed = cv2.morphologyEx(skeleton, cv2.MORPH_CLOSE, kernel, iterations=1)

        # 6. Edge-based line detection (for heart/head)
        edges = cv2.Canny(closed, 30, 120)
        lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=50, minLineLength=80, maxLineGap=15)

        # 7. Contour-based detection (for curved life line)
        contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        height, width = gray.shape
        line_img = cv2.cvtColor(closed, cv2.COLOR_GRAY2BGR)

        # if lines is not None:
        #     for line in lines:
        #         x1, y1, x2, y2 = line[0]
        #         dx, dy = abs(x2 - x1), abs(y2 - y1)
        #         avg_x = (x1 + x2) // 2
        #         avg_y = (y1 + y2) // 2

        #         if avg_y < height * 0.4 and dx > dy:
        #             color = (0, 0, 255)  # Red: Heart
        #         elif height * 0.4 <= avg_y < height * 0.65 and dx > dy:
        #             color = (255, 0, 0)  # Blue: Head
        #         elif avg_x < width * 0.4 and dy > dx:
        #             color = (0, 255, 255)  # Yellow: Life
        #         else:
        #             continue
        #         cv2.line(line_img, (x1, y1), (x2, y2), color, 2)

        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < 100:
                continue
            x, y, w, h = cv2.boundingRect(cnt)
            cx, cy = x + w // 2, y + h // 2
            aspect = w / (h + 1e-5)

            if cx < width * 0.4 and aspect < 1.2 and h > 60:
                cv2.drawContours(line_img, [cnt], -1, (0, 255, 255), 2)  # Yellow: Life

        # 8. Encode and return image
        success, encoded_image = cv2.imencode('.png', line_img)
        if not success:
            return {"error": "Failed to encode image"}, 500

        return send_file(
            io.BytesIO(encoded_image.tobytes()),
            mimetype='image/png',
            as_attachment=False,
            download_name='highlighted_palm_lines.png'
        )

    except Exception as e:
        return {"error": str(e)}, 500



if __name__ == '__main__':
    app.run(debug=True) # debug=True allows for automatic reloading on code changes
