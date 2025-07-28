#vimashotry dasha 
from datetime import datetime
from dateutil.relativedelta import relativedelta
from datetime import datetime
import json
from collections import OrderedDict
# === Vimshottari Dasha Sequence ===
DASHA_SEQUENCE = [
    ("Ketu", 7),
    ("Venus", 20),
    ("Sun", 6),
    ("Moon", 10),
    ("Mars", 7),
    ("Rahu", 18),
    ("Jupiter", 16),
    ("Saturn", 19),
    ("Mercury", 17)
]

NAKSHATRA_SPAN_DEG = 13.3333  # degrees

def ymd_to_dmy(date_str):
    # Input: "2025-07-28"
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    return dt.strftime("%d-%m-%Y")
# === 1. DMS to Decimal Degrees ===
def dms_to_decimal(degree: int, minute: int, second: int) -> float:
    return degree + minute / 60 + second / 3600

# === 2. Absolute Longitude from Sign Index ===
def get_absolute_moon_degree(sign_index: int, deg_in_sign: float) -> float:
    return sign_index * 30 + deg_in_sign

# === 3. Nakshatra Start Degree ===
def get_nakshatra_start_deg(abs_moon_deg: float) -> float:
    nak_index = int(abs_moon_deg // NAKSHATRA_SPAN_DEG)
    return nak_index * NAKSHATRA_SPAN_DEG

# === 4. Calculate Moon Dasha Start from Passed Proportion ===
def calculate_moon_dasha_start(dob, moon_deg_within_nakshatra, moon_lord_years):
    proportion_passed = moon_deg_within_nakshatra / NAKSHATRA_SPAN_DEG
    passed_years = moon_lord_years * proportion_passed
    moon_dasha_start = dob - relativedelta(days=int(passed_years * 365.25))
    remaining_years = moon_lord_years - passed_years
    return moon_dasha_start, remaining_years

# === 5. Main Function ===
def get_vimshottari_dasha_from_dms(dob_str, tob_str, d, m, s, sign_index, moon_nakshatra_lord):
    # Convert to decimal degrees
    vim_dashas = OrderedDict()
    deg_in_sign = dms_to_decimal(d, m, s)
    dt = ymd_to_dmy(dob_str)
    dob = datetime.strptime(f"{dt} {tob_str}", "%d-%m-%Y %H:%M")
    moon_deg_abs = get_absolute_moon_degree(sign_index, deg_in_sign)
    nakshatra_start_deg = get_nakshatra_start_deg(moon_deg_abs)
    moon_deg_within_nakshatra = moon_deg_abs - nakshatra_start_deg

    # Get Moon Dasha Start & Remaining
    moon_lord_years = dict(DASHA_SEQUENCE)[moon_nakshatra_lord]
    moon_dasha_start, moon_remaining_years = calculate_moon_dasha_start(
        dob, moon_deg_within_nakshatra, moon_lord_years
    )

    # Reorder the Dasha sequence from given nakshatra lord
    start_index = next(i for i, (planet, _) in enumerate(DASHA_SEQUENCE) if planet == moon_nakshatra_lord)
    reordered = DASHA_SEQUENCE[start_index:] + DASHA_SEQUENCE[:start_index]

    # Create Dasha Timeline
    current_start = dob
    moon_end = current_start + relativedelta(days=int(moon_remaining_years * 365.25))
    vim_dashas[moon_nakshatra_lord] ={
            "start_date": current_start.strftime("%d-%b-%Y"),
            "end_date":moon_end.strftime("%d-%b-%Y"),
        }
    current_start = moon_end

    for planet, duration in reordered[1:]:
        current_end = current_start + relativedelta(years=duration)
        vim_dashas[planet] ={
            "start_date": current_start.strftime("%d-%b-%Y"),
            "end_date":current_end.strftime("%d-%b-%Y"),
        }
        current_start = current_end

    return vim_dashas, moon_deg_abs, nakshatra_start_deg
   

def vim_deg_to_dms(deg):
        d = int(deg)
        remainder = abs(deg - d) * 60
        m = int(remainder)
        s = round((remainder - m) * 60)

        # Correct rounding overflow (e.g., 59.999 -> 60)
        if s == 60:
            s = 0
            m += 1
        if m == 60:
            m = 0
            d += 1

        return d,m,s

def get_rashi_number(rashi_name: str) -> int:
    rashi_map = {
        "Aries": 0,
        "Taurus": 1,
        "Gemini": 2,
        "Cancer": 3,
        "Leo": 4,
        "Virgo": 5,
        "Libra": 6,
        "Scorpio": 7,
        "Sagittarius": 8,
        "Capricorn": 9,
        "Aquarius": 10,
        "Pisces": 11
    }
    return rashi_map.get(rashi_name.capitalize(), -1)  # Returns -1 if not found

#final Function
def find_vimashotry_dasha( DOB, TOB, MOON_DEG, SIGN_NAME, MOON_NAKSHATRA_LORD):
    D,M,S = vim_deg_to_dms(MOON_DEG)
    SIGN_INDEX = get_rashi_number(SIGN_NAME)
    dasha_result, moon_abs_deg, nakshatra_start_deg = get_vimshottari_dasha_from_dms(
        DOB, TOB, D, M, S, SIGN_INDEX, MOON_NAKSHATRA_LORD
    )
    
    return dasha_result