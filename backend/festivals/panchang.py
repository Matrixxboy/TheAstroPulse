import swisseph as swe
from datetime import datetime
import os

# Set ephemeris path
current_dir = os.path.dirname(os.path.abspath(__file__))
swe.set_ephe_path(current_dir)

# Constants
FLAG_SIDEREAL = swe.FLG_SWIEPH | swe.FLG_SIDEREAL
swe.set_sid_mode(swe.SIDM_LAHIRI)

TITHIS = [
    "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", "Amavasya"
]

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

MONTHS = [
    "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
    "Ashvina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"
]

ZODIAC = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

DEFAULT_LAT = 23.1765
DEFAULT_LON = 75.7885

def get_julian_day(date_obj, time_hour=6.0):
    return swe.julday(date_obj.year, date_obj.month, date_obj.day, time_hour)

def get_sunrise(date_obj, lat=DEFAULT_LAT, lon=DEFAULT_LON):
    jd_start = swe.julday(date_obj.year, date_obj.month, date_obj.day, 0)
    geopos = (lon, lat, 0.0)
    rsmi = swe.CALC_RISE | swe.BIT_DISC_CENTER
    try:
        res = swe.rise_trans(jd_start, swe.SUN, rsmi, geopos, 1013.25, 15.0, swe.FLG_SWIEPH)
        return res[1][0]
    except swe.Error:
        return jd_start + 0.25

def calculate_tithi(jd):
    sun = swe.calc_ut(jd, swe.SUN, FLAG_SIDEREAL)[0][0]
    moon = swe.calc_ut(jd, swe.MOON, FLAG_SIDEREAL)[0][0]
    diff = (moon - sun) % 360
    tithi_index = int(diff / 12) + 1
    
    if 1 <= tithi_index <= 15:
        paksha = "Shukla"
        tithi_name = TITHIS[tithi_index - 1]
    else:
        paksha = "Krishna"
        idx = tithi_index - 16
        tithi_name = "Amavasya" if tithi_index == 30 else TITHIS[idx]
    return tithi_name, paksha, tithi_index

def calculate_nakshatra(jd):
    moon = swe.calc_ut(jd, swe.MOON, FLAG_SIDEREAL)[0][0]
    nak_index = int(moon / (360/27))
    return NAKSHATRAS[nak_index % 27]

def calculate_solar_sign(jd):
    sun = swe.calc_ut(jd, swe.SUN, FLAG_SIDEREAL)[0][0]
    return ZODIAC[int(sun / 30) % 12]

def get_amanta_lunar_month(jd):
    # Find exact moment of the preceding New Moon
    def get_moon_sun_diff(t):
        s = swe.calc_ut(t, swe.SUN, FLAG_SIDEREAL)[0][0]
        m = swe.calc_ut(t, swe.MOON, FLAG_SIDEREAL)[0][0]
        return (m - s) % 360

    jd_nm = jd
    for _ in range(3): # Refine to find the 0-degree separation moment
        diff = get_moon_sun_diff(jd_nm)
        if diff > 180: diff -= 360
        jd_nm -= diff / 12.19075

    sun_at_nm = swe.calc_ut(jd_nm, swe.SUN, FLAG_SIDEREAL)[0][0]
    sun_sign_index = int(sun_at_nm / 30)
    return MONTHS[(sun_sign_index + 1) % 12]

def get_panchang(date_obj):
    jd_sunrise = get_sunrise(date_obj)
    tithi_name, paksha, tithi_index = calculate_tithi(jd_sunrise)
    nakshatra = calculate_nakshatra(jd_sunrise)
    lunar_month = get_amanta_lunar_month(jd_sunrise)
    solar_sign = calculate_solar_sign(jd_sunrise)

    return {
        "date": date_obj.isoformat(),
        "tithi": tithi_name,
        "paksha": paksha,
        "nakshatra": nakshatra,
        "lunar_month": lunar_month,
        "sun_sign": solar_sign,
        "tithi_index": tithi_index
    }