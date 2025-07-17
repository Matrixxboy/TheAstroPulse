import swisseph as swe
from geopy.geocoders import Nominatim ,Photon
from timezonefinder import TimezoneFinder
import pytz
from datetime import datetime, timedelta
import math


# Sign and Nakshatra lists
signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]
nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]
sign_lords = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}
nakshatra_lords = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
]

# Helpers
planet_friends = {
    "Sun": {"own": ["Leo"], "friends": ["Moon", "Mars", "Jupiter"], "enemies": ["Venus", "Saturn"], "neutral": ["Mercury"]},
    "Moon": {"own": ["Cancer"], "friends": ["Sun", "Mercury"], "enemies": [], "neutral": ["Mars", "Jupiter", "Venus", "Saturn"]},
    "Mars": {"own": ["Aries", "Scorpio"], "friends": ["Sun", "Moon", "Jupiter"], "enemies": ["Mercury"], "neutral": ["Venus", "Saturn"]},
    "Mercury": {"own": ["Gemini", "Virgo"], "friends": ["Sun", "Venus"], "enemies": ["Moon"], "neutral": ["Mars", "Jupiter", "Saturn"]},
    "Jupiter": {"own": ["Sagittarius", "Pisces"], "friends": ["Sun", "Moon", "Mars"], "enemies": ["Venus", "Mercury"], "neutral": ["Saturn"]},
    "Venus": {"own": ["Taurus", "Libra"], "friends": ["Mercury", "Saturn"], "enemies": ["Sun", "Moon"], "neutral": ["Mars", "Jupiter"]},
    "Saturn": {"own": ["Capricorn", "Aquarius"], "friends": ["Mercury", "Venus"], "enemies": ["Sun", "Moon"], "neutral": ["Mars", "Jupiter"]},
    "Rahu": {"own": ["--"], "friends": ["Venus", "Saturn", "Mercury"], "enemies": ["Sun", "Moon"], "neutral": ["--"]},
    "Ketu": {"own": ["--"], "friends": ["Mars", "Venus", "Saturn"], "enemies": ["Sun", "Moon"], "neutral": ["--"]},
    "Uranus": {"own": ["--"],"friends": ["Saturn", "Mercury", "Venus"],"enemies": ["Moon", "Mars"],"neutral": ["Sun", "Jupiter"]},
    "Neptune": {"own": [],"friends": ["Venus", "Moon", "Jupiter"],"enemies": ["Saturn", "Mars"],"neutral": ["Sun", "Mercury", "Rahu", "Ketu"]},
    "Pluto": {"own": [],"friends": ["Mars", "Saturn", "Ketu"],"enemies": ["Moon", "Venus"],"neutral": ["Sun", "Mercury", "Jupiter", "Rahu"]}
}

def deg_to_dms(deg):
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

    return f"{d}° {m}' {s}\""

def get_avastha(deg, sign_number):
    # Ensure 0 ≤ deg < 30
    deg = deg % 30

    # 6° slices
    avasthas = ["Bala (Child)", "Kumara (Teen)", "Yuva (Adult)", "Vriddha (Old)", "Mrita (Dead)"]
    
    # Get index for 6° step
    index = int(deg // 6)

    if 1 <= sign_number <= 12:
        if sign_number % 2 == 1:  # Odd signs: Aries, Gemini, ...
            return avasthas[index]
        else:  # Even signs: Taurus, Cancer, ...
            return avasthas[::-1][index]  # Reverse order
    else:
        return "Invalid Sign Number"


def get_status(planet, sign):
    rel = planet_friends.get(planet, {})
    if sign in rel.get("own", []):
        return "Own Sign"
    elif sign_lords[sign] in rel.get("friends", []):
        return "Friendly"
    elif sign_lords[sign] in rel.get("enemies", []):
        return "Enemy"
    elif sign_lords[sign] in rel.get("neutral", []):
        return "Neutral"
    else:
        return "--"

def is_combust(planet, planet_lon, sun_lon):
    limits = {"Mercury": 12, "Venus": 10, "Mars": 17, "Jupiter": 11, "Saturn": 15}
    if planet in ["Sun", "Moon", "Rahu", "Ketu"]:
        return False
    diff = abs(planet_lon - sun_lon)
    if diff > 180:
        diff = 360 - diff
    return diff <= limits.get(planet, 0)

def calculate_vedic_lagna(dob, tob, location, lat, lon):
    # Step 1: Parse datetime and timezone
    dt_str = f"{dob} {tob}"
    naive_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
    timezone = pytz.timezone(location)
    aware_dt = timezone.localize(naive_dt)
    
    # Step 2: Convert to UTC
    utc_dt = aware_dt.astimezone(pytz.utc)
    
    # Step 3: Julian Day for UTC
    jd_ut = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute / 60)
    
    # Step 4: Set Ayanamsa (Lahiri = traditional Indian)
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    
    # Step 5: Calculate Houses with sidereal mode
    cusps, ascmc = swe.houses(jd_ut, lat, lon, b'W')  # You can also try 'E' or 'P'
    
    # Step 6: Ascendant Degree (Sidereal)
    asc_sidereal = (ascmc[0] - swe.get_ayanamsa(jd_ut)) % 360
    
    # Step 7: Map to Rashi
    rashis = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    rashi_index = int(asc_sidereal // 30)
    return asc_sidereal,rashis[rashi_index] , rashi_index



def planet_position_details(DOB,TOB,LOCATION,TIMEZONE):
    # Geolocation and Time
    try:
        geolocator = Nominatim(user_agent="vedic_astrology_app", timeout=10)
        location = geolocator.geocode(LOCATION)
        if not location:
            raise Exception("Nominatim failed")
    except Exception:
        geolocator = Photon(user_agent="vedic_astrology_app", timeout=10)
        location = geolocator.geocode(LOCATION)

    if not location:
        raise ValueError(f"Could not find location for '{LOCATION}'")

    lat, lon = location.latitude, location.longitude

    # Timezone and UTC conversion
    tf = TimezoneFinder()
    timezone_str = tf.timezone_at(lat=lat, lng=lon)
    local_tz = pytz.timezone(timezone_str)
    naive_dt = datetime.strptime(f"{DOB} {TOB}", "%Y-%m-%d %H:%M")
    local_dt = local_tz.localize(naive_dt)
    utc_dt = local_dt.astimezone(pytz.utc)
    asc_aide , asc_rashi , asc_rashi_index_number  = calculate_vedic_lagna(DOB,TOB,TIMEZONE,lat,lon)
    print(asc_rashi)
    # Swiss Ephemeris setup
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day,
                    utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0)
    # --- Calculation Flags ---
    flags =swe.FLG_SWIEPH | swe.FLG_SIDEREAL| swe.FLG_NONUT    

    # --- CALCULATE HOUSES (Ascendant is index 0) ---
    cusps, ascmc = swe.houses(jd, lat, lon, b'P')
    ascendant_deg = ascmc[0]
    rashi_index = int(ascendant_deg / 30)
    rashi_names = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    rising_sign = rashi_names[rashi_index]

    # Planet definitions
    planets = {
        "Ascendant": ascendant_deg,"Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS, "Mercury": swe.MERCURY,
        "Jupiter": swe.JUPITER, "Venus": swe.VENUS, "Saturn": swe.SATURN,
        "Rahu": swe.MEAN_NODE, "Ketu": swe.MEAN_NODE , "Uranus":swe.URANUS  ,"Neptune":swe.NEPTUNE , "Pluto" :swe.PLUTO
    }

    # Get planet positions
    planet_positions = {}
    sun_lon = swe.calc(jd, swe.SUN, flags)[0][0]

    for planet, pid in planets.items():
        if planet=="Ascendant":
            lon = asc_aide
            house_number = asc_rashi_index_number+1
            nak_idx = int(lon // (360 / 27))
            nak = nakshatras[nak_idx]
            nak_lord = nakshatra_lords[nak_idx]
            deg_in_sign = lon % 30
            sign_number = asc_rashi_index_number
            avastha = get_avastha(deg_in_sign,sign_number)
            status = get_status(planet, rising_sign)
            combust = is_combust(planet, lon, sun_lon)
            planet_positions[planet] = {
                "house":house_number,
                "Longitude": f"{lon:.2f}°",
                "Degree in sign":deg_in_sign, 
                "DMS": deg_to_dms(deg_in_sign),
                "Sign": asc_rashi,
                "SignLord": sign_lords[asc_rashi],
                "Nakshatra": nak,
                "NakLord": nak_lord,
                "Avastha": avastha,
                "Combust": "Yes" if combust else "No",
                "Status": status
            }
        else:            
            if planet == "Ketu":
                rahu_pos = swe.calc(jd, swe.MEAN_NODE, flags)[0][0]
                ketu_pos = (rahu_pos + 180) % 360
                lon = ketu_pos
            else:
                lon = swe.calc(jd, pid, flags)[0][0]

            sign_idx = int(lon // 30)
            sign = signs[sign_idx]
            house_number = sign_idx+1
            nak_idx = int(lon // (360 / 27))
            nak = nakshatras[nak_idx]
            nak_lord = nakshatra_lords[nak_idx]
            deg_in_sign = lon % 30
            sign_number = sign_idx+1
            avastha = get_avastha(deg_in_sign,sign_number)
            status = get_status(planet, sign)
            combust = is_combust(planet, lon, sun_lon)
            

            planet_positions[planet] = {
                "house":house_number,
                "Longitude": f"{lon:.2f}°",
                "Degree in sign":deg_in_sign, 
                "DMS": deg_to_dms(deg_in_sign),
                "Sign": sign,
                "SignLord": sign_lords[sign],
                "Nakshatra": nak,
                "NakLord": nak_lord,
                "Avastha": avastha,
                "Combust": "Yes" if combust else "No",
                "Status": status
            }
    
    return planet_positions



# DOB = "2004-07-14"
# TOB = "07:15"
# LOCATION = "Surat Gujarat"

# planet_positions = planet_position_details(DOB,TOB,LOCATION)
# print("\n--- Planetary Positions ---")
# for planet, data in planet_positions.items():
#     print(f"\n{planet}:")
#     for key, value in data.items():
#         print(f"  {key}: {value}")
