import io
import os
import cv2
import json
import base64
import math
import numpy as np
from datetime import datetime, date
from numerology.numlogycalcu import name_numlogy_basic_sums , business_numerology_basic_sums
from astrology.horoscope import fetch_horoscope , get_zodiac_sign
from astrology.nakshtra_details import final_astro_report
from astrology.planet_positions import planet_position_details
from astrology.Dasha.vimashotryDasha import find_vimashotry_dasha
from astrology.panchang import get_panchang
from vastu.vastuProcess import allowed_file, process_blueprint, image_to_pdf_in_memory, OVERLAY_IMAGE_PATH 
from vastu.compass import process_compass_image
import fitz
import fitz
import urllib.parse
import urllib.request
from festivals.festivals import detect_festivals, get_yearly_festivals  
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import Flask, request, jsonify ,send_file
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file
from PIL import Image
from rembg import remove
# from chatbotassistant.chatmodelGroq import chat_bot_replypip install PyMuPDF
from skimage.filters import meijering
from skimage.util import img_as_ubyte
from skimage.restoration import denoise_tv_chambolle
from skimage.morphology import skeletonize, remove_small_objects
import mediapipe as mp


# toekn for api verification
API_KEY_TOKEN = os.getenv("API_KEY_TOKEN")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


limiter = Limiter(get_remote_address, app=app, default_limits=["10 per minute"])

def is_palm(image):
    try:
        resized = cv2.resize(image, (224, 224))
        normalized = resized.astype('float32') / 255.0
        input_tensor = np.expand_dims(normalized, axis=0)
        prediction = model.predict(input_tensor, verbose=0)[0][0]
        return prediction > 0.5
    except Exception as e:
        print("Prediction failed:", e)
        return False

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
@limiter.limit("5 per minute")
def process_image():
    import mediapipe as mp
    from mediapipe.python.solutions import hands as mp_hands

    if 'image' not in request.files:
        return {"error": "No image file provided"}, 400

    file = request.files['image']

    if file.filename == '':
        return {"error": "Empty filename"}, 400

    try:

        # -------------------------
        # Decode Image
        # -------------------------
        image_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

        if img is None:
            return {"error": "Invalid image format"}, 400

        original = img.copy()

        # -------------------------
        # Background Removal
        # -------------------------
        img_no_bg = remove_background_opencv(img.copy())

        # -------------------------
        # MediaPipe Hand Detection
        # -------------------------
        hands = mp_hands.Hands(
            static_image_mode=True,
            max_num_hands=1,
            min_detection_confidence=0.5
        )

        image_rgb = cv2.cvtColor(img_no_bg, cv2.COLOR_BGR2RGB)
        results = hands.process(image_rgb)

        palm_mask = np.ones(img_no_bg.shape[:2], dtype=np.uint8) * 255
        cropped_palm = None

        if results.multi_hand_landmarks:

            for hand_landmarks in results.multi_hand_landmarks:

                h, w, _ = img_no_bg.shape

                palm_indices = [0, 1, 2, 5, 9, 13, 17]

                palm_points = []

                for idx in palm_indices:
                    lm = hand_landmarks.landmark[idx]
                    x, y = int(lm.x * w), int(lm.y * h)
                    palm_points.append([x, y])

                palm_points = np.array(palm_points, dtype=np.int32)

                palm_mask = np.zeros((h, w), dtype=np.uint8)

                palm_hull = cv2.convexHull(palm_points)

                cv2.fillConvexPoly(palm_mask, palm_hull, 255)

                # Remove fingers
                finger_groups = [
                    [1,2,3,4],
                    [5,6,7,8],
                    [9,10,11,12],
                    [13,14,15,16],
                    [17,18,19,20]
                ]

                for group in finger_groups:

                    finger_pts = []

                    for idx in group:
                        lm = hand_landmarks.landmark[idx]
                        x, y = int(lm.x * w), int(lm.y * h)
                        finger_pts.append([x,y])

                    finger_pts = np.array(finger_pts, dtype=np.int32)

                    cv2.fillConvexPoly(palm_mask, finger_pts, 0)

                # Expand palm area
                dilation_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(55,55))
                palm_mask = cv2.dilate(palm_mask, dilation_kernel, iterations=1)

                # Crop palm
                x, y, w_box, h_box = cv2.boundingRect(palm_hull)
                palm_crop = img_no_bg[y:y+h_box, x:x+w_box]

                if palm_crop.shape[0] > 10 and palm_crop.shape[1] > 10:

                    if is_palm(palm_crop):
                        cropped_palm = palm_crop
                    else:
                        return {"error":"Palm not detected by model"},400

        hands.close()

        if cropped_palm is None:
            return {"error":"No palm detected"},400

        # -------------------------
        # Apply Palm Mask
        # -------------------------
        img_masked = cv2.bitwise_and(img_no_bg, img_no_bg, mask=palm_mask)

        # -------------------------
        # Grayscale
        # -------------------------
        gray = cv2.cvtColor(img_masked, cv2.COLOR_BGR2GRAY)

        cleaned = remove_small_objects(gray.astype(bool), min_size=50, connectivity=2)
        cleaned = (cleaned * 255).astype(np.uint8)

        outerline = cleaned.copy()

        # -------------------------
        # CLAHE + TopHat
        # -------------------------
        clahe = cv2.createCLAHE(clipLimit=5.0, tileGridSize=(10,10))
        enhanced = clahe.apply(gray)

        kernel = cv2.getStructuringElement(cv2.MORPH_RECT,(9,14))

        tophat = cv2.morphologyEx(enhanced, cv2.MORPH_TOPHAT, kernel)

        combined = cv2.addWeighted(enhanced,0.8,tophat,0.8,0)

        # -------------------------
        # Meijering Filter
        # -------------------------
        meij = meijering(combined/255.0, sigmas=range(2,8), black_ridges=True)
        meij = img_as_ubyte(meij)

        # -------------------------
        # Threshold + Skeleton
        # -------------------------
        _, binary = cv2.threshold(meij,50,255,cv2.THRESH_BINARY)

        skeleton = skeletonize(binary//255).astype(np.uint8)*255

        kernel_thick = cv2.getStructuringElement(cv2.MORPH_RECT,(6,6))
        skeleton = cv2.dilate(skeleton, kernel_thick, iterations=1)

        # Apply masks
        _, binary_mask = cv2.threshold(meij,60,255,cv2.THRESH_BINARY)

        skeleton = cv2.bitwise_and(skeleton,skeleton,mask=outerline)
        skeleton = cv2.bitwise_and(skeleton,skeleton,mask=binary_mask)

        # -------------------------
        # Remove small objects
        # -------------------------
        cleaned_lines = remove_small_objects(
            skeleton.astype(bool),
            min_size=600,
            connectivity=1
        )

        cleaned_lines = (cleaned_lines*255).astype(np.uint8)

        # Morphological opening
        kernel_opening = cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5))
        cleaned_lines = cv2.morphologyEx(cleaned_lines, cv2.MORPH_OPEN, kernel_opening)

        # -------------------------
        # Overlay result
        # -------------------------
        result_img = cv2.cvtColor(cleaned_lines, cv2.COLOR_GRAY2BGR)

        overlay = cv2.addWeighted(original,0.6,result_img,0.6,0)

        # -------------------------
        # Return Image
        # -------------------------
        success, encoded_image = cv2.imencode('.png', overlay)

        if not success:
            return {"error":"Failed to encode image"},500

        return send_file(
            io.BytesIO(encoded_image.tobytes()),
            mimetype='image/png',
            as_attachment=False,
            download_name="palm_lines.png"
        )

    except Exception as e:
        print("\n\n")
        print(e)
        print("\n\n")
        return {"error":str(e)},500

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
    # client_api = request.headers.get('Numlogy-API-KEY') or request.args.get('Numlogy-API-KEY')
    # print(f"{client_api}") use for debugging
    # if client_api != API_KEY_TOKEN:
    #     return jsonify({"error":"Unauthorised request"}) , 401
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
    if req_tob:
        req_tob = ":".join(req_tob.split(":")[:2])
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

from astrology.pdf_report import generate_pdf

@app.route("/astro-report/pdf", methods=['GET'])
def astro_report_pdf():
    client_api = request.headers.get('Astro-API-KEY') or request.args.get('Astro-API-KEY')
    if client_api != API_KEY_TOKEN:
        return jsonify({"error":"Unauthorised request"}) , 401
    
    req_dob = request.args.get('dob')
    req_tob = request.args.get('tob')
    req_lob = request.args.get('lob')
    req_timezone = request.args.get('timezone')
    req_name = request.args.get('name', 'Seeker')
    req_gender = request.args.get('gender', '')
    
    if not all([req_dob, req_tob, req_lob]):
        return jsonify({"error": "Missing params: dob, tob, lob"}), 400
        
    try:
        # Fetch Data (Reuse logic)
        report = []
        # 1. Basic Details
        report.append(final_astro_report(req_dob, req_tob, req_lob))
        # 2. Planetary Positions
        report.append(planet_position_details(req_dob, req_tob, req_lob, req_timezone))
        
        # 3. Dasha
        moon_info = report[1]["Moon"]
        moon_nak_deg = moon_info["Degree in sign"]
        moon_nak_lord = moon_info["NakLord"]
        rashi_sign = next(iter(report[0]["rashi_all_details"]))
        dasha_data = find_vimashotry_dasha(req_dob, req_tob, moon_nak_deg, rashi_sign, moon_nak_lord)
        report.append(dasha_data)
        
        # Determine Filename
        filename = f"AstroPulse_Report_{req_name.replace(' ', '_')}.pdf"
        
        # Generate PDF
        user_details = {
            "name": req_name,
            "dob": req_dob,
            "tob": req_tob,
            "lob": req_lob,
            "gender": req_gender
        }
        pdf_buffer = generate_pdf(report, user_details)
        
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
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


from vastu.compass import process_compass_image

@app.route('/vastu/compass', methods=['POST'])
def process_compass_endpoint():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file part in the request"}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        file_bytes = file.read()
        
        result = process_compass_image(file_bytes, file.content_type)

        return jsonify(result)


    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": f"Failed to process image: {e}"}), 500


@app.route('/festivals', methods=['GET'])
def get_festivals_route():
    try:
        year = int(request.args.get('year'))
        month = int(request.args.get('month'))
        day = int(request.args.get('day'))
        
        # Determine lunar month (MVP: Hardcoded or passed via query param if needed)
        # For now, defaulting to Kartika as per prompt example if not calculated.
        # Ideally, we should receive it or calculate it.
        lunar_month = request.args.get('lunar_month', "Kartika")
        
        date_obj = date(year, month, day)
        festivals = detect_festivals(date_obj, lunar_month)
        
        return jsonify({
            "date": date_obj.isoformat(),
            "festivals": festivals
        })
    except ValueError:
        return jsonify({"error": "Invalid date parameters"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500






@app.route('/proxy/nominatim', methods=['GET'])
def proxy_nominatim():
    try:
        q = request.args.get('q')
        limit = request.args.get('limit', 5)
        
        if not q:
            return jsonify([]), 200

        if not q:
            return jsonify([]), 200

        # Nominatim requires a User-Agent
        headers = {
            'User-Agent': 'TheAstroPulse/1.0' 
        }
        
        base_url = "https://nominatim.openstreetmap.org/search"
        params = {
            'format': 'json',
            'q': q,
            'limit': limit
        }
        
        query_string = urllib.parse.urlencode(params)
        full_url = f"{base_url}?{query_string}"
        
        req = urllib.request.Request(full_url, headers=headers)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            return jsonify(data)
        
    except Exception as e:
        print(f"Proxy error: {e}")
        return jsonify([]), 500


@app.route('/festivals/year', methods=['GET'])
def get_yearly_festivals_route():
    try:
        year = int(request.args.get('year'))
        festivals = get_yearly_festivals(year)
        return jsonify({
            "year": year,
            "count": len(festivals),
            "festivals": festivals
        })
    except ValueError:
        return jsonify({"error": "Invalid year parameter"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500



from api.live_darshan import check_live_status

@app.route('/live-darshan', methods=['GET'])
def get_live_darshan():
    """
    API Endpoint to check for live darshan on YouTube.
    Optional Query Param: channel_id
    """
    channel_id = request.args.get('channel_id')
    result = check_live_status(channel_id)
    
    if "error" in result:
        return jsonify(result), 500
        
    return jsonify(result), 200

@app.route('/api/panchang', methods=['GET'])
def get_panchang_route():
    try:
        date = request.args.get('date')
        lat = request.args.get('latitude')
        lon = request.args.get('longitude')
        timezone = request.args.get('timezone')
        time = request.args.get('time', "12:00")

        if not all([date, lat, lon]):
            return jsonify({"error": "Missing required parameters: date, latitude, longitude"}), 400

        result = get_panchang(date, float(lat), float(lon), timezone, time)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(8005)
    app.run(debug=True,host="0.0.0.0",port=port) # debug=True allows for automatic reloading on code changes