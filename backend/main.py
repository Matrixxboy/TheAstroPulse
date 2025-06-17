from flask import Flask, request, jsonify ,send_file
from flask_cors import CORS
from astrology.horoscope import fetch_horoscope ,get_zodiac_sign
import numpy as np
import cv2
import io
from datetime import datetime
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
        # Convert image to grayscale array
        in_memory_file = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(in_memory_file, cv2.IMREAD_GRAYSCALE)

        # Apply binary threshold
        _, binary_img = cv2.threshold(img, 182, 255, cv2.THRESH_BINARY)

        # Encode to PNG
        _, buffer = cv2.imencode('.png', binary_img)

        # Send image as response using a memory stream
        return send_file(
            io.BytesIO(buffer.tobytes()),
            mimetype='image/png',
            as_attachment=False,
            download_name='processed_image.png'
        )

    except Exception as e:
        return {"error": str(e)}, 500


if __name__ == '__main__':
    app.run(debug=True) # debug=True allows for automatic reloading on code changes
