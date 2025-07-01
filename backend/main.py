import io
import os
import cv2
import numpy as np
from PIL import Image
import mediapipe as mp
from rembg import remove
from flask_cors import CORS
from datetime import datetime
from skimage.filters import meijering
from skimage.util import img_as_ubyte
from skimage.restoration import denoise_tv_chambolle
from flask import Flask, request, jsonify ,send_file
from skimage.morphology import skeletonize, remove_small_objects
from astrology.horoscope import fetch_horoscope , get_zodiac_sign
from chatbotassistant.chatmodel import chat_bot_reply
from numerology.numlogycalcu import numlogy_basic_sums
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

# toekn for api verification
API_KEY_TOKEN = os.getenv("API_KEY_TOKEN")

app = Flask(__name__)

#secured routes (Allow CORS for specific routes)
CORS(app, resources={
    r"/numerology": {"origins": ["http://localhost:5173"]},
    r"/horoscope": {"origins": ["http://localhost:5173"]},
    r"/process-image": {"origins": ["http://localhost:5173"]}
})  

limiter = Limiter(get_remote_address, app=app, default_limits=["10 per minute"])


# Convert OpenCV image to PNG bytes
def cv2_to_bytes(image):
    success, encoded_image = cv2.imencode('.png', image)
    return io.BytesIO(encoded_image.tobytes()) if success else None

# Background remover using rembg
def remove_background_opencv(img):
    # Convert OpenCV image to PIL
    image_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(image_rgb)

    # Remove background using rembg
    byte_io = io.BytesIO()
    pil_image.save(byte_io, format="PNG")
    byte_io.seek(0)
    result_bytes = remove(byte_io.read())

    # Convert back to OpenCV
    no_bg_image = Image.open(io.BytesIO(result_bytes)).convert("RGB")
    return cv2.cvtColor(np.array(no_bg_image), cv2.COLOR_RGB2BGR)


@app.route('/horoscope', methods=['GET'])
@limiter.limit("5 per minute")  # Limit to 10 requests per minute
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
@limiter.limit("5 per minute")  # Limit to 5 requests per minute
def process_image():
    if 'image' not in request.files:
        return {"error": "No image file provided"}, 400

    file = request.files['image']
    if file.filename == '':
        return {"error": "Empty filename"}, 400

    try:
        # Decode the uploaded image
        image = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(image, cv2.IMREAD_COLOR)
        original = img.copy()
        if img is None:
            return {"error": "Invalid image format"}, 400

        # 2. Background removal using MediaPipe
        img = remove_background_opencv(img)
        
        # 3. Negative filter + grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (1, 1), 0)

        # 4. Remove small noise (initial)
        cleaned = remove_small_objects(gray.astype(bool), min_size=50, connectivity=2)
        cleaned = (cleaned * 255).astype(np.uint8)


        # 6. CLAHE + TopHat
        clahe = cv2.createCLAHE(clipLimit=5.0, tileGridSize=(13, 13))
        enhanced = clahe.apply(gray)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 12))
        tophat = cv2.morphologyEx(enhanced, cv2.MORPH_TOPHAT, kernel)
        combined = cv2.addWeighted(enhanced, 0.8, tophat, 0.8, 0)
        combined = cv2.GaussianBlur(combined, (3, 3), 0)
        combined = denoise_tv_chambolle(combined / 255.0, weight=0.2)
        combined = (combined * 255).astype(np.uint8)
        

        # 7. Meijering line enhancement
        meij = meijering(combined / 255.0, sigmas=range(4, 8), black_ridges=True)
        meij = img_as_ubyte(meij)

        # 8. Threshold + Skeleton
        _, binary = cv2.threshold(meij, 50, 255, cv2.THRESH_BINARY)
        skeleton = skeletonize(binary // 255).astype(np.uint8) * 255
        # ✅ Make skeleton lines thicker
        kernel_thick = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))  # or (5, 5)
        skeleton = cv2.dilate(skeleton, kernel_thick, iterations=1)

        # 9. Apply mask again
        skeleton = cv2.bitwise_and(skeleton, skeleton, mask=cleaned)
        
        # 10. Remove small objects after skeleton
        cleaned = remove_small_objects(skeleton.astype(bool), min_size=500, connectivity=1)
        cleaned = (cleaned * 255).astype(np.uint8)
        
        # 11. Overlay result on original
        result_img = cv2.cvtColor(cleaned, cv2.COLOR_GRAY2BGR)
        overlay = cv2.addWeighted(original, 0.6, result_img, 0.6, 0)

        # ------------------ 7. Return the Result ------------------
        success, encoded_image = cv2.imencode('.png', overlay)
        if not success:
            return {"error": "Failed to encode image"}, 500

        return send_file(
            io.BytesIO(encoded_image.tobytes()),
            mimetype='image/png',
            as_attachment=False,
            download_name='palm_lines_highlighted.png'
        )

    except Exception as e:
        return {"error": str(e)}, 500

#api = /numerology?fname=Utsavlankapati&dob=14-07-2004
@app.route('/numerology', methods=['GET'])
# @limiter.limit("5 per minute") 
def numerology():
    """API endpoint to calculate numerology based on full name and date of birth.
    Expected URL parameters:
    - fname (required): Full name of the person (e.g., "Utsav Lankapati").
    - dob (required): Date of birth in 'DD-MM-YYYY' format (e.g., "14-07-2004").
    Example usage:
    GET /numerology?fname=Utsav%20Lankapati&dob=14-07-2004
    This endpoint will return a JSON response with the numerology calculations.
    """
    client_api = request.headers.get('Numlogy-API-KEY') or request.args.get('Numlogy-API-KEY')
    # print(f"{client_api}") use for debugging
    if client_api != API_KEY_TOKEN:
        return jsonify({"error":"Unauthorised request"}) , 401
    
    req_name = request.args.get('fname')
    req_dob = request.args.get('dob')
    
    if not req_name or not req_dob:
        return jsonify({"error": "Both 'fname' and 'dob' parameters are required."}), 400
    try:
        # Call the numerology calculation function
        result = numlogy_basic_sums(req_name, req_dob)
        # Return the result as JSON
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API : /chat?question=this%20is%my%question
@app.route("/chat", methods=["POST"])
def chat_bot():
    req_question = request.args.get('question')
    if not req_question:
        return jsonify({"error": "Empty Question"})
    try:
        chat_reply =  chat_bot_reply(req_question)
        return jsonify(chat_reply),200
    except Exception as e :
        return jsonify({"error":str(e)}),500

if __name__ == '__main__':
    app.run(debug=True) # debug=True allows for automatic reloading on code changes