import decimal
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from decimal import Decimal, getcontext
from collections import OrderedDict
from pprint import pprint

# Set higher precision for Decimal calculations
getcontext().prec = 50

NAKSHATRA_SPAN_DEG = Decimal(40) / Decimal(3)  # 13.333... degrees

DASHA_SEQUENCE = OrderedDict([
    ("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10),
    ("Mars", 7), ("Rahu", 18), ("Jupiter", 16),
    ("Saturn", 19), ("Mercury", 17)
])

def ymd_to_dmy(date_str):
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    return dt.strftime("%d-%m-%Y")

def dms_to_decimal(degree: int, minute: int, second: int) -> Decimal:
    return Decimal(degree) + Decimal(minute) / Decimal(60) + Decimal(second) / Decimal(3600)

def get_absolute_moon_degree(sign_index: int, deg_in_sign: Decimal) -> Decimal:
    return Decimal(sign_index) * Decimal(30) + deg_in_sign

def get_nakshatra_start_deg(abs_moon_deg: Decimal) -> Decimal:
    nak_index = int(abs_moon_deg // NAKSHATRA_SPAN_DEG)
    return Decimal(nak_index) * NAKSHATRA_SPAN_DEG

def get_vimshottari_dasha_from_dms(dob_str, tob_str, d, m, s, sign_index, moon_nakshatra_lord):
    vim_dashas = OrderedDict()

    deg_in_sign = dms_to_decimal(d, m, s)
    abs_deg = get_absolute_moon_degree(sign_index, deg_in_sign)

    nakshatra_total_covered = abs_deg / NAKSHATRA_SPAN_DEG
    nak_fraction = nakshatra_total_covered % Decimal('1')

    dt = datetime.strptime(f"{ymd_to_dmy(dob_str)} {tob_str}", "%d-%m-%Y %H:%M")

    total_years = Decimal(DASHA_SEQUENCE[moon_nakshatra_lord])
    remaining_years = (Decimal('1') - nak_fraction) * total_years
    total_days = remaining_years * Decimal('360')
    days_to_add = int(total_days.quantize(Decimal('1.'), rounding=decimal.ROUND_HALF_UP))
    moon_end = dt + timedelta(days=days_to_add)

    vim_dashas[moon_nakshatra_lord] = {
        "start_date": dt.strftime("%d-%b-%Y"),
        "end_date": moon_end.strftime("%d-%b-%Y")
    }

    start_index = list(DASHA_SEQUENCE).index(moon_nakshatra_lord)
    reordered = list(DASHA_SEQUENCE.items())[start_index+1:] + list(DASHA_SEQUENCE.items())[:start_index]

    current_start = moon_end
    for planet, duration in reordered:
        end_date = current_start + relativedelta(years=duration)
        vim_dashas[planet] = {
            "start_date": current_start.strftime("%d-%b-%Y"),
            "end_date": end_date.strftime("%d-%b-%Y")
        }
        current_start = end_date

    return vim_dashas, abs_deg, get_nakshatra_start_deg(abs_deg)

def calculate_antardasha(mahadasha_lord, mahadasha_start_str, mahadasha_end_str):
    antardashas = OrderedDict()
    mahadasha_start = datetime.strptime(mahadasha_start_str, "%d-%b-%Y")
    mahadasha_end = datetime.strptime(mahadasha_end_str, "%d-%b-%Y")
    total_days = Decimal((mahadasha_end - mahadasha_start).days)

    start_idx = next(i for i, (planet, _) in enumerate(DASHA_SEQUENCE.items()) if planet == mahadasha_lord)
    reordered = list(DASHA_SEQUENCE.items())[start_idx:] + list(DASHA_SEQUENCE.items())[:start_idx]
    total_weight = Decimal(sum(years for _, years in DASHA_SEQUENCE.items()))

    current_start = mahadasha_start
    for i, (antar_lord, antar_years) in enumerate(reordered):
        proportion = Decimal(antar_years) / total_weight
        raw_days = total_days * proportion
        rounded_days = int(raw_days.to_integral_value(rounding=decimal.ROUND_HALF_UP))

        if i == len(reordered) - 1:
            duration_days = int((mahadasha_end - current_start).days)
        else:
            duration_days = rounded_days

        antar_end = current_start + timedelta(days=duration_days)
        antardashas[antar_lord] = {
            "start_date": current_start.strftime("%d-%b-%Y"),
            "end_date": antar_end.strftime("%d-%b-%Y")
        }
        current_start = antar_end

    return antardashas

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

    full_dasha = OrderedDict()
    for maha_lord, period in dasha_result.items():
        antardashas = calculate_antardasha(maha_lord, period['start_date'], period['end_date'])
        full_dasha[maha_lord] = {
            "start_date": period["start_date"],
            "end_date": period["end_date"],
            # "antardashas": antardashas
        }

    return {"vimshottari_dasha": full_dasha}