import swisseph as swe
from datetime import datetime, timedelta
import pytz
import os
import math

# Set ephemeris path
current_dir = os.path.dirname(os.path.abspath(__file__))
swe.set_ephe_path(current_dir)

# Constants
# Add Sidereal Flag (Critical for Indian Astrology)
FLAG_SIDEREAL = swe.FLG_SWIEPH | swe.FLG_SIDEREAL

# Set Ayanamsa to Lahiri (Chitra Paksha)
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

# Default Location (Ujjain - standard for Indian Panchang)
DEFAULT_LAT = 23.1765
DEFAULT_LON = 75.7885

def get_julian_day(date_obj, time_hour=6.0):
    """Convert date to Julian Day."""
    return swe.julday(date_obj.year, date_obj.month, date_obj.day, time_hour)

def get_sunrise(date_obj, lat=DEFAULT_LAT, lon=DEFAULT_LON):
    """
    Calculate sunrise time for a given date and location.
    Returns Julian Day of sunrise.
    """
    jd_start = get_julian_day(date_obj, 0) # Start of day UTC
    
    # swe.rise_trans signature: (tjdut, ipl, starname, epheflag, rsmi, geopos, atpress, attemp)
    # geopos is (long, lat, height)
    
    geopos = (lon, lat, 0.0)
    rsmi = swe.CALC_RISE | swe.BIT_DISC_CENTER
    epheflag = swe.FLG_SWIEPH
    
    try:
        # Pyswisseph signature:
        # rise_trans(tjdut, body, rsmi, geopos, atpress=0.0, attemp=0.0, flags=FLG_SWIEPH)
        res = swe.rise_trans(
            jd_start,       # tjdut
            swe.SUN,        # body
            rsmi,           # rsmi (Note: comes BEFORE geopos in python binding)
            geopos,         # geopos
            1013.25,        # atpress
            15.0,           # attemp
            epheflag        # flags
        )
    except swe.Error as e:
         print(f"Swe error: {e}")
         return jd_start + 0.25

    # res[1][0] is the rise time in JD
    if res[0] == -2: # Error
        print("Sunrise calc error, using 6 AM default")
        return jd_start + 0.25 
        
    return res[1][0] # Rise time JD

def calculate_tithi(jd):
    """Calculate Tithi and Paksha at a specific JD."""
    # Tithi depends on separation (Moon - Sun). 
    # Ayanamsa cancels out in subtraction, but consistent usage is good practice.
    sun = swe.calc_ut(jd, swe.SUN, FLAG_SIDEREAL)[0][0]
    moon = swe.calc_ut(jd, swe.MOON, FLAG_SIDEREAL)[0][0]
    
    diff = (moon - sun) % 360
    tithi_index = int(diff / 12) + 1 # 1-30 system for internal logic
    
    # Paksha Logic
    # 1-15: Shukla (15=Purnima)
    # 16-30: Krishna (30=Amavasya)
    
    if 1 <= tithi_index <= 15:
        paksha = "Shukla"
        tithi_name = TITHIS[tithi_index - 1] # 0-14 maps to Pratipada..Purnima
    else:
        paksha = "Krishna"
        idx = tithi_index - 16 # 0-14
        # Krishna 15 is Amavasya (Index 14 for Purnima/Amavasya naming in TITHIS list?)
        # TITHIS = [Pratipada...Purnima, Amavasya] (16 items)
        # 1-14 -> TITHIS[0..13]
        # 15 (Purnima) -> TITHIS[14]
        # 16 (K. Pratipada) -> TITHIS[0]
        # 30 (Amavasya) -> TITHIS[15]
        
        if tithi_index == 30:
            tithi_name = "Amavasya"
        else:
            tithi_name = TITHIS[idx]

    return tithi_name, paksha, tithi_index

def calculate_nakshatra(jd):
    """Calculate Nakshatra at a specific JD (Sidereal is MANDATORY here)."""
    moon = swe.calc_ut(jd, swe.MOON, FLAG_SIDEREAL)[0][0]
    # Each Nakshatra is 13deg 20min = 13.3333 degrees
    # Each Nakshatra is 13deg 20min = 13.3333 degrees
    nak_index = int(moon / 13.333333)
    return NAKSHATRAS[nak_index % 27]

def calculate_solar_sign(jd):
    """Calculate Sun Sign at a specific JD (Sidereal mandatory for Indian Zodiac)."""
    sun = swe.calc_ut(jd, swe.SUN, FLAG_SIDEREAL)[0][0]
    sign_index = int(sun / 30)
    sign_index = int(sun / 30)
    return ZODIAC[sign_index % 12]

def get_amanta_lunar_month(jd):
    """
    Calculate Amanta Lunar Month.
    Finds the last New Moon and checks Sun's sign at that moment.
    
    Logic:
    1. Calculate current Moon-Sun difference.
    2. Backtrack to when diff was 0 (New Moon).
    3. Determine Sun Sign at that New Moon.
    4. Map Sun Sign to Month (Pisces=Chaitra, Aries=Vaisakha...)
    """
    sun = swe.calc_ut(jd, swe.SUN, FLAG_SIDEREAL)[0][0]
    moon = swe.calc_ut(jd, swe.MOON, FLAG_SIDEREAL)[0][0]
    
    diff = (moon - sun) % 360
    
    # Approximation: Moon moves ~12 deg/day relative to Sun.
    # Time since last new moon (in days) ~= diff / 12
    days_since_new_moon = diff / 12.19 # slightly more precise
    
    jd_new_moon = jd - days_since_new_moon
    
    
    # Get Sun position at New Moon
    sun_at_nm = swe.calc_ut(jd_new_moon, swe.SUN, FLAG_SIDEREAL)[0][0]
    sun_sign_index = int(sun_at_nm / 30)
    
    # Map: Pisces (11) -> Chaitra (0)
    # (Index + 1) % 12
    month_index = (sun_sign_index + 1) % 12
    
    return MONTHS[month_index]

def get_panchang(date_obj):
    """
    Get Accurate Panchang details for a given date.
    Calculations are done at *Sunrise* of that date (Udaya Tithi logic).
    """
    # 1. Calculate Sunrise JD
    jd_sunrise = get_sunrise(date_obj)
    
    # 2. Calculate Tithi & Paksha at Sunrise
    tithi_name, paksha, tithi_index = calculate_tithi(jd_sunrise)
    
    # 3. Calculate Nakshatra at Sunrise
    nakshatra = calculate_nakshatra(jd_sunrise)
    
    # 4. Calculate Lunar Month (Amanta)
    lunar_month = get_amanta_lunar_month(jd_sunrise)
    
    # 5. Solar details
    solar_sign = calculate_solar_sign(jd_sunrise)

    return {
        "date": date_obj.isoformat(),
        "sunrise_jd": jd_sunrise,
        "tithi": tithi_name,
        "paksha": paksha,
        "nakshatra": nakshatra,
        "lunar_month": lunar_month,
        "sun_sign": solar_sign,
        "tithi_index": tithi_index # Helpful for debugging or complex rules
    }
