import decimal
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from decimal import Decimal, getcontext
from collections import OrderedDict
from pprint import pprint

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

DASHA_SEQUENCE_ant = [
    "Ketu", "Venus", "Sun", "Moon", "Mars",
    "Rahu", "Jupiter", "Saturn", "Mercury"
]

NAKSHATRA_SPAN_DEG = 13.3333

def ymd_to_dmy(date_str):
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    return dt.strftime("%d-%m-%Y")

def dms_to_decimal(degree: int, minute: int, second: int) -> float:
    return degree + minute / 60 + second / 3600

def get_absolute_moon_degree(sign_index: int, deg_in_sign: float) -> float:
    return sign_index * 30 + deg_in_sign

def get_nakshatra_start_deg(abs_moon_deg: float) -> float:
    nak_index = int(abs_moon_deg // NAKSHATRA_SPAN_DEG)
    return nak_index * NAKSHATRA_SPAN_DEG

def calculate_moon_dasha_start(dob, moon_deg_within_nakshatra, moon_lord_years):
    proportion_passed = moon_deg_within_nakshatra / NAKSHATRA_SPAN_DEG
    passed_years = moon_lord_years * proportion_passed
    moon_dasha_start = dob - relativedelta(days=int(passed_years * 365))
    remaining_years = moon_lord_years - passed_years
    return moon_dasha_start, remaining_years

def get_vimshottari_dasha_from_dms(dob_str, tob_str, d, m, s, sign_index, moon_nakshatra_lord):
    deg_in_sign = dms_to_decimal(d, m, s)
    dt = ymd_to_dmy(dob_str)
    dob = datetime.strptime(f"{dt} {tob_str}", "%d-%m-%Y %H:%M")
    moon_deg_abs = get_absolute_moon_degree(sign_index, deg_in_sign)
    nakshatra_start_deg = get_nakshatra_start_deg(moon_deg_abs)
    moon_deg_within_nakshatra = moon_deg_abs - nakshatra_start_deg

    moon_lord_years = dict(DASHA_SEQUENCE)[moon_nakshatra_lord]
    moon_dasha_start, moon_remaining_years = calculate_moon_dasha_start(
        dob, moon_deg_within_nakshatra, moon_lord_years
    )

    start_index = next(i for i, (planet, _) in enumerate(DASHA_SEQUENCE) if planet == moon_nakshatra_lord)
    reordered = DASHA_SEQUENCE[start_index:] + DASHA_SEQUENCE[:start_index]

    result = OrderedDict()
    current_start = dob
    moon_end = current_start + relativedelta(days=int(moon_remaining_years * 365))
    result[moon_nakshatra_lord] = (current_start.strftime("%Y-%m-%d"), moon_end.strftime("%Y-%m-%d"))
    current_start = moon_end

    for planet, duration in reordered[1:]:
        current_end = current_start + relativedelta(years=duration)
        result[planet] = (current_start.strftime("%Y-%m-%d"), current_end.strftime("%Y-%m-%d"))
        current_start = current_end

    return result, moon_deg_abs, nakshatra_start_deg

def get_antardasha_dates(maha, start_date, end_date):
    total_days = (end_date - start_date).days
    current = start_date
    results = OrderedDict()

    idx = DASHA_SEQUENCE_ant.index(maha)
    reordered = DASHA_SEQUENCE_ant[idx:] + DASHA_SEQUENCE_ant[:idx]

    dasha_years = dict(DASHA_SEQUENCE)

    for antar in reordered:
        antar_years = dasha_years[antar]
        duration = round((antar_years / 120) * total_days)
        end = current + timedelta(days=duration)

        # Use cross-platform date formatting
        formatted_date_start = current.strftime('%d-%m-%Y').lstrip("0").replace("/0", "/")
        formatted_date_end = end.strftime('%d-%m-%Y').lstrip("0").replace("/0", "/")

        results[antar] = {
            "start_date":formatted_date_start,
            "end_date":formatted_date_end,
        }
        current = end

    return results


def vim_deg_to_dms(deg):
    d = int(deg)
    remainder = abs(deg - d) * 60
    m = int(remainder)
    s = round((remainder - m) * 60)
    if s == 60:
        s = 0
        m += 1
    if m == 60:
        m = 0
        d += 1
    return d, m, s

def get_rashi_number(rashi_name: str) -> int:
    rashi_map = {
        "Aries": 0, "Taurus": 1, "Gemini": 2, "Cancer": 3,
        "Leo": 4, "Virgo": 5, "Libra": 6, "Scorpio": 7,
        "Sagittarius": 8, "Capricorn": 9, "Aquarius": 10, "Pisces": 11
    }
    return rashi_map.get(rashi_name.capitalize(), -1)

def find_vimashotry_dasha(DOB, TOB, MOON_DEG, SIGN_NAME, MOON_NAKSHATRA_LORD):
    D, M, S = vim_deg_to_dms(MOON_DEG)
    SIGN_INDEX = get_rashi_number(SIGN_NAME)

    dasha_result, moon_abs_deg, nakshatra_start_deg = get_vimshottari_dasha_from_dms(
        DOB, TOB, D, M, S, SIGN_INDEX, MOON_NAKSHATRA_LORD
    )

    full_dasha = {}
    for maha_lord, period in dasha_result.items():
        start_dt = datetime.strptime(period[0], "%Y-%m-%d")
        end_dt = datetime.strptime(period[1], "%Y-%m-%d")
        antardasha = get_antardasha_dates(maha_lord, start_dt, end_dt)
        full_dasha[maha_lord] = {
            "start_date": start_dt.strftime("%d-%m-%Y"),
            "end_date": end_dt.strftime("%d-%m-%Y"),
            "antardasha": antardasha
        }

    return {"vimshottari_dasha": full_dasha}
