import io
import os
import cv2
import json
import numpy as np
from datetime import datetime
from numerology.numlogycalcu import name_numlogy_basic_sums , business_numerology_basic_sums
from astrology.horoscope import fetch_horoscope , get_zodiac_sign
from astrology.nakshtra_details import final_astro_report
from astrology.planet_positions import planet_position_details
from astrology.Dasha.vimashotryDasha import find_vimashotry_dasha
from vastu.vastuProcess import allowed_file, process_blueprint, image_to_pdf_in_memory, OVERLAY_IMAGE_PATH 
import fitz  
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import Flask, request, jsonify ,send_file
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file
# from PIL import Image
# from rembg import remove
# from chatbotassistant.chatmodelGroq import chat_bot_replypip install PyMuPDF
# from skimage.filters import meijering
# from skimage.util import img_as_ubyte
# from skimage.restoration import denoise_tv_chambolle
# from skimage.morphology import skeletonize, remove_small_objects
# import mediapipe as mp

# toekn for api verification
API_KEY_TOKEN = os.getenv("API_KEY_TOKEN")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


limiter = Limiter(get_remote_address, app=app, default_limits=["10 per minute"])


# Convert OpenCV image to PNG bytes
# def cv2_to_bytes(image):
#     success, encoded_image = cv2.imencode('.png', image)
#     return io.BytesIO(encoded_image.tobytes()) if success else None

# Background remover using rembg
# def remove_background_opencv(img):
#     # Convert OpenCV image to PIL
#     image_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#     pil_image = Image.fromarray(image_rgb)

#     # Remove background using rembg
#     byte_io = io.BytesIO()
#     pil_image.save(byte_io, format="PNG")
#     byte_io.seek(0)
#     result_bytes = remove(byte_io.read())

#     # Convert back to OpenCV
#     no_bg_image = Image.open(io.BytesIO(result_bytes)).convert("RGB")
#     return cv2.cvtColor(np.array(no_bg_image), cv2.COLOR_RGB2BGR)


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


# @app.route('/process-image', methods=['POST'])
# @limiter.limit("5 per minute")  # Limit to 5 requests per minute
# def process_image():
#     if 'image' not in request.files:
#         return {"error": "No image file provided"}, 400

#     file = request.files['image']
#     if file.filename == '':
#         return {"error": "Empty filename"}, 400

#     try:
#         # Decode the uploaded image
#         image = np.frombuffer(file.read(), np.uint8)
#         img = cv2.imdecode(image, cv2.IMREAD_COLOR)
#         original = img.copy()
#         if img is None:
#             return {"error": "Invalid image format"}, 400

#         # 2. Background removal using MediaPipe
#         img = remove_background_opencv(img)
        
#         # 3. Negative filter + grayscale
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         gray = cv2.GaussianBlur(gray, (1, 1), 0)

#         # 4. Remove small noise (initial)
#         cleaned = remove_small_objects(gray.astype(bool), min_size=50, connectivity=2)
#         cleaned = (cleaned * 255).astype(np.uint8)


#         # 6. CLAHE + TopHat
#         clahe = cv2.createCLAHE(clipLimit=5.0, tileGridSize=(13, 13))
#         enhanced = clahe.apply(gray)
#         kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 12))
#         tophat = cv2.morphologyEx(enhanced, cv2.MORPH_TOPHAT, kernel)
#         combined = cv2.addWeighted(enhanced, 0.8, tophat, 0.8, 0)
#         combined = cv2.GaussianBlur(combined, (3, 3), 0)
#         combined = denoise_tv_chambolle(combined / 255.0, weight=0.2)
#         combined = (combined * 255).astype(np.uint8)
        

#         # 7. Meijering line enhancement
#         meij = meijering(combined / 255.0, sigmas=range(4, 8), black_ridges=True)
#         meij = img_as_ubyte(meij)

#         # 8. Threshold + Skeleton
#         _, binary = cv2.threshold(meij, 50, 255, cv2.THRESH_BINARY)
#         skeleton = skeletonize(binary // 255).astype(np.uint8) * 255
#         # ✅ Make skeleton lines thicker
#         kernel_thick = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))  # or (5, 5)
#         skeleton = cv2.dilate(skeleton, kernel_thick, iterations=1)

#         # 9. Apply mask again
#         skeleton = cv2.bitwise_and(skeleton, skeleton, mask=cleaned)
        
#         # 10. Remove small objects after skeleton
#         cleaned = remove_small_objects(skeleton.astype(bool), min_size=500, connectivity=1)
#         cleaned = (cleaned * 255).astype(np.uint8)
        
#         # 11. Overlay result on original
#         result_img = cv2.cvtColor(cleaned, cv2.COLOR_GRAY2BGR)
#         overlay = cv2.addWeighted(original, 0.6, result_img, 0.6, 0)

#         # ------------------ 7. Return the Result ------------------
#         success, encoded_image = cv2.imencode('.png', overlay)
#         if not success:
#             return {"error": "Failed to encode image"}, 500

#         return send_file(
#             io.BytesIO(encoded_image.tobytes()),
#             mimetype='image/png',
#             as_attachment=False,
#             download_name='palm_lines_highlighted.png'
#         )

#     except Exception as e:
#         return {"error": str(e)}, 500

#api = /numerology?fname=Utsavlankapati&dob=14-07-2004
@app.route('/name-numerology', methods=['GET'])
# @limiter.limit("5 per minute") 
def name_numerology():
    """API endpoint to calculate numerology based on full name and date of birth.
    Expected URL parameters:
    - fname (required): Full name of the person (e.g., "Utsav Lankapati").
    - dob (required): Date of birth in 'DD-MM-YYYY' format (e.g., "14-07-2004").
    Example usage:
    GET /numerology?fname=Utsav%20Lankapati&dob=14-07-2004&gen=Male
    This endpoint will return a JSON response with the numerology calculations.
    """
    # client_api = request.headers.get('Numlogy-API-KEY') or request.args.get('Numlogy-API-KEY')
    # print(f"{client_api}") #use for debugging
    # if client_api != API_KEY_TOKEN:
    #     return jsonify({"error":"Unauthorised request"}) , 401
    
    req_name = request.args.get('fname')
    req_dob = request.args.get('dob')
    req_gender = request.args.get('gen')
    
    if not req_name or not req_dob:
        return jsonify({"error": "Both 'fname' and 'dob' parameters are required."}), 400
    try:
        # Call the numerology calculation function
        result = name_numlogy_basic_sums(req_name, req_dob,req_gender)
        # Return the result as JSON
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#api = /business-numerology?bname=theastropulse
@app.route('/business-numerology', methods=['GET'])
# @limiter.limit("5 per minute") 
def business_numerology():
    """API endpoint to calculate numerology based on full name and date of birth.
    Expected URL parameters:
    - bname (required): Full name of the business or company (e.g., "The astro pulse")
    Example usage:
    GET /business-numerology?bnmae=theastropulse
    This endpoint will return a JSON response with the numerology calculations.
    """
    client_api = request.headers.get('Numlogy-API-KEY') or request.args.get('Numlogy-API-KEY')
    # print(f"{client_api}") use for debugging
    if client_api != API_KEY_TOKEN:
        return jsonify({"error":"Unauthorised request"}) , 401
    req_name = request.args.get('bname')
    try:
        # Call the numerology calculation function
        result = business_numerology_basic_sums(req_name)
        # Return the result as JSON
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API : /chat?question=this%20is%my%question
# @app.route("/chat", methods=["POST"])
# def chat_bot():
#     client_api = request.headers.get('CHAT-API-KEY') or request.args.get('CHAT-API-KEY')
#     # print(f"{client_api}") use for debugging
#     if client_api != API_KEY_TOKEN:
#         return jsonify({"error":"Unauthorised request"}) , 401
#     req_question = request.args.get('question')
#     if not req_question:
#         return jsonify({"error": "Empty Question"})
#     try:
#         chat_reply =  chat_bot_reply(req_question)
#         return jsonify(chat_reply),200
#     except Exception as e :
#         return jsonify({"error":str(e)}),500
    


# API : /astro-report?dob=14-07-2004&tob=07:15&lob=surat,gujarat
@app.route("/astro-report",methods=['GET'])
def final_astro_report_generator():
    
    client_api = request.headers.get('Astro-API-KEY') or request.args.get('Astro-API-KEY')
    # print(f"{client_api}") use for debugging
    if client_api != API_KEY_TOKEN:
        return jsonify({"error":"Unauthorised request"}) , 401
    
    req_dob = request.args.get('dob') #date of birth
    req_tob = request.args.get('tob') #time of birth
    req_lob = request.args.get('lob')#location of birth
    req_timezone = request.args.get('timezone')
    
    if not req_dob:
        return jsonify({"error": "Empty Date of birth"}),400
    if not req_tob:
        return jsonify({"error": "Empty time of birth"}),400
    if not req_lob:
        return jsonify({"error": "Empty Location of birth"}),400
    try:
        report =[]
        report.append(final_astro_report(req_dob,req_tob,req_lob))
        report.append(planet_position_details(req_dob,req_tob,req_lob,req_timezone))
        moon_info = report[1]["Moon"]
        moon_nak_deg = moon_info["Degree in sign"]
        moon_nak_lord = moon_info["NakLord"]
        rashi_sign = next(iter(report[0]["rashi_all_details"]))
        dasha_data = find_vimashotry_dasha(req_dob, req_tob, moon_nak_deg, rashi_sign, moon_nak_lord)
        report.append(dasha_data)
        
        return app.response_class(
            response=json.dumps(report, indent=2, sort_keys=False),
            status=200,
            mimetype='application/json'
        )
    except Exception as e :
        return jsonify({"error":str(e)}),500
    
@app.route('/vastu', methods=['POST'])
def process_image_endpoint():
    try:
        # --- 1. Validate Input ---
        if 'blueprint' not in request.files:
            return jsonify({"error": "No blueprint file part in the request"}), 400
        
        file = request.files['blueprint']
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if not file or not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed. Use png, jpg, or pdf."}), 400

        try:
            center_lat = float(request.form['center_lat'])
            center_lon = float(request.form['center_lon'])
            point_lat = float(request.form['point_lat'])
            point_lon = float(request.form['point_lon'])
        except (KeyError, ValueError):
            return jsonify({"error": "Invalid or missing latitude/longitude form data"}), 400

        # --- 2. Load Images ---
        try:
            overlay_img = cv2.imread(OVERLAY_IMAGE_PATH, cv2.IMREAD_UNCHANGED)
            if overlay_img is None:
                raise FileNotFoundError(f"Server is missing the overlay image: {OVERLAY_IMAGE_PATH}")

            file_bytes = file.read()
            filename = file.filename.lower()

            if filename.endswith('.pdf'):
                # ALTERNATIVE: Use PyMuPDF (fitz) to convert PDF to image without external tools
                pdf_document = fitz.open(stream=file_bytes, filetype="pdf")
                if not pdf_document.page_count > 0:
                    return jsonify({"error": "PDF is empty or corrupted"}), 500
                
                page = pdf_document.load_page(0)  # Load the first page
                
                # Increase resolution for better quality
                zoom = 2  # 2x zoom => 144 dpi
                mat = fitz.Matrix(zoom, zoom)
                pix = page.get_pixmap(matrix=mat)
                
                # Convert pixmap to a NumPy array for OpenCV
                img_data = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
                
                # Convert color space from RGB/RGBA (PyMuPDF) to BGR (OpenCV)
                if img_data.shape[2] == 4: # RGBA
                    blueprint_cv = cv2.cvtColor(img_data, cv2.COLOR_RGBA2BGR)
                else: # RGB
                    blueprint_cv = cv2.cvtColor(img_data, cv2.COLOR_RGB2BGR)
            else:
                # It's an image file, decode it directly
                np_arr = np.frombuffer(file_bytes, np.uint8)
                blueprint_cv = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if blueprint_cv is None:
                return jsonify({"error": "Could not decode the uploaded image file"}), 500

        except Exception as e:
            print(f"Error during file loading: {e}")
            return jsonify({"error": f"An error occurred while loading files: {e}"}), 500

        # --- 3. Process the Image ---
        final_image = process_blueprint(
            blueprint_image=blueprint_cv,
            overlay_image=overlay_img,
            center_lat=center_lat,
            center_lon=center_lon,
            point_lat=point_lat,
            point_lon=point_lon
        )

        if final_image is None:
            return jsonify({"error": "Failed to process the blueprint. No suitable structure found."}), 500

        # --- 4. Return Result as PDF ---
        pdf_buffer = image_to_pdf_in_memory(final_image)
        if pdf_buffer is None:
            return jsonify({"error": "Failed to generate output PDF."}), 500

        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name='vastu_analysis_output.pdf',
            mimetype='application/pdf'
        )
    except Exception as e :
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": f"Failed to process image: {e}"}), 500




if __name__ == '__main__':
    port = int(5000)
    app.run(debug=True,host="0.0.0.0",port=port) # debug=True allows for automatic reloading on code changes