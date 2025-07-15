# Rewriting a minimal offline-friendly version of the functional code without external APIs
from pprint import pprint
import swisseph as swe
import datetime

# Constants
ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE,
    "Ketu": swe.MEAN_NODE
}

NAVAMSA_STARTS = {
    "Aries": "Aries", "Taurus": "Capricorn", "Gemini": "Libra", "Cancer": "Aries",
    "Leo": "Sagittarius", "Virgo": "Capricorn", "Libra": "Gemini", "Scorpio": "Cancer",
    "Sagittarius": "Aries", "Capricorn": "Capricorn", "Aquarius": "Libra", "Pisces": "Cancer"
}

def get_rashi(degree):
    return ZODIAC_SIGNS[int(degree // 30)]

def get_nakshatra(degree):
    nak = (degree % 360) / (13 + 1/3)
    index = int(nak)
    pada = int((nak - index) * 4) + 1
    return index, pada

def calculate_navamsa_sign(rashi, deg_in_sign):
    base_sign = NAVAMSA_STARTS[rashi]
    base_index = ZODIAC_SIGNS.index(base_sign)
    nav_index = (base_index + int(deg_in_sign // (30 / 9))) % 12
    return ZODIAC_SIGNS[nav_index], int(deg_in_sign // (30 / 9)) + 1

def calculate_navamsa_lagna(ascendant_deg):
    rashi = get_rashi(ascendant_deg)
    deg_in_sign = ascendant_deg % 30
    return calculate_navamsa_sign(rashi, deg_in_sign)[0]

def calculate_navamsa_house(nav_sign, nav_lagna):
    i1 = ZODIAC_SIGNS.index(nav_sign)
    i2 = ZODIAC_SIGNS.index(nav_lagna)
    return (i1 - i2 + 12) % 12 + 1
# Improved version: includes ascendant as a planet, and avoids any casting errors

# Enhancing navamsa house calculation by rotating signs according to navamsa lagna
# The house is the relative position from the navamsa lagna in the zodiac circle

def calculate_navamsa_house_fixed(nav_sign, nav_lagna):
    """
    Calculates the Navamsa house number for a planet based on its navamsa sign
    and the navamsa lagna (ascendant) sign.
    """
    sign_index = ZODIAC_SIGNS.index(nav_sign)
    lagna_index = ZODIAC_SIGNS.index(nav_lagna)
    house = ((sign_index - lagna_index) % 12) + 1
    return house

def calculate_navamsa_chart_final_v2(jd, lat, lon):
    swe.set_topo(lon, lat, 0)
    ascendant = swe.houses(jd, lat, lon)[0][0]
    nav_lagna = calculate_navamsa_lagna(ascendant)

    planets_data = {}

    for name, pid in PLANETS.items():
        lon_data, _ = swe.calc_ut(jd, pid)
        degree = (lon_data[0] + 180) % 360 if name == "Ketu" else lon_data[0]

        rashi = get_rashi(degree)
        deg_in_sign = degree % 30
        nak_idx, nak_pada = get_nakshatra(degree)
        nav_sign, nav_pada = calculate_navamsa_sign(rashi, deg_in_sign)
        nav_house = calculate_navamsa_house_fixed(nav_sign, nav_lagna)

        planets_data[name] = {
            "rashi": rashi,
            "absolute_degree": round(degree, 2),
            "degree_in_sign": round(deg_in_sign, 2),
            "nakshatra_index": nak_idx,
            "nakshatra_pada": nak_pada,
            "navamsa_sign": nav_sign,
            "navamsa_pada": nav_pada,
            "navamsa_house": nav_house
        }

    # Add ascendant (Lagna) as a "planet" for completeness
    asc_rashi = get_rashi(ascendant)
    asc_deg_in_sign = ascendant % 30
    asc_nak_idx, asc_nak_pada = get_nakshatra(ascendant)
    asc_nav_sign, asc_nav_pada = calculate_navamsa_sign(asc_rashi, asc_deg_in_sign)

    planets_data["Ascendant"] = {
        "rashi": asc_rashi,
        "absolute_degree": round(ascendant, 2),
        "degree_in_sign": round(asc_deg_in_sign, 2),
        "nakshatra_index": asc_nak_idx,
        "nakshatra_pada": asc_nak_pada,
        "navamsa_sign": asc_nav_sign,
        "navamsa_pada": asc_nav_pada,
        "navamsa_house": 1  # Always 1st house for ascendant
    }

    return {
        "ascendant_degree": round(ascendant, 2),
        "navamsa_lagna": nav_lagna,
        "planets": planets_data
    }

# Execute the fixed house calculation version


# Run the corrected final version

# Sample test input (to be replaced with actual lat/lon and JD)
# Surat, India: 21.1702° N, 72.8311° E
# DOB: 2004-07-14, TOB: 07:15 IST -> UTC = 01:45
dob_dt = datetime.datetime(2004, 7, 14, 1, 45)
jd = swe.julday(dob_dt.year, dob_dt.month, dob_dt.day, dob_dt.hour + dob_dt.minute / 60)
navamsa_result_fixed_houses = calculate_navamsa_chart_final_v2(jd, 21.1702, 72.8311)
pprint(navamsa_result_fixed_houses)