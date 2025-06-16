from flask import Flask, request, jsonify
from flask_cors import CORS
# Assuming horoscope_fetcher.py (the code from your 'horoscope-fetcher' immersive)
# is in the same directory as this file.
from astrology.horoscope import fetch_horoscope

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

    if horoscope_text:
        return jsonify({
            "dob": dob_str,
            "day_type": day_type,
            "horoscope": horoscope_text,
            "message": "Horoscope fetched successfully."
        }), 200
    else:
        return jsonify({"error": "Could not fetch horoscope. Please check the DOB and try again.", "dob": dob_str, "day_type": day_type}), 500

if __name__ == '__main__':
    app.run(debug=True) # debug=True allows for automatic reloading on code changes
