import swisseph as swe
from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder
import pytz
from datetime import datetime, timedelta

# User Inputs
DOB = "2004-07-14"
TOB = "07:15"
LOCATION = "Surat, Gujarat"

# Geolocation and Time
geolocator = Nominatim(user_agent="vedic_astrology")
location = geolocator.geocode(LOCATION)
lat, lon = location.latitude, location.longitude

# Timezone and UTC conversion
tf = TimezoneFinder()
timezone_str = tf.timezone_at(lat=lat, lng=lon)
local_tz = pytz.timezone(timezone_str)
naive_dt = datetime.strptime(f"{DOB} {TOB}", "%Y-%m-%d %H:%M")
local_dt = local_tz.localize(naive_dt)
utc_dt = local_dt.astimezone(pytz.utc)

# Swiss Ephemeris setup
swe.set_sid_mode(swe.SIDM_LAHIRI)
jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day,
                utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0)
# --- Calculation Flags ---
flags = (
    swe.FLG_SWIEPH     # Swiss ephemeris computation
    | swe.FLG_SIDEREAL # Sidereal zodiac (for Vedic)
    | swe.FLG_NONUT    # Ignore nutation (used for pure sidereal)
    | swe.FLG_SPEED    # Return velocity of planets too (for combustion/retro checks)
)



cusps, ascmc = swe.houses(jd, lat, lon, b'P')
ascendant = ascmc[0]

# Planet definitions
planets = {
    "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS, "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER, "Venus": swe.VENUS, "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE, "Ketu": swe.MEAN_NODE , "Uranus":swe.URANUS  ,"Neptune":swe.NEPTUNE , "Pluto" :swe.PLUTO
}

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
    m = int((deg - d) * 60)
    s = int(((deg - d) * 60 - m) * 60)
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

# Get planet positions
planet_positions = {}
sun_lon = swe.calc(jd, swe.SUN, flags)[0][0]

for planet, pid in planets.items():
    if planet == "Ketu":
        rahu_pos = swe.calc(jd, swe.MEAN_NODE, flags)[0][0]
        ketu_pos = (rahu_pos + 180) % 360
        lon = ketu_pos
    else:
        lon = swe.calc(jd, pid, flags)[0][0]

    sign_idx = int(lon // 30)
    sign = signs[sign_idx]
    nak_idx = int(lon // (360 / 27))
    nak = nakshatras[nak_idx]
    nak_lord = nakshatra_lords[nak_idx]
    deg_in_sign = lon % 30
    sign_number = sign_idx+1
    avastha = get_avastha(deg_in_sign,sign_number)
    status = get_status(planet, sign)
    combust = is_combust(planet, lon, sun_lon)

    planet_positions[planet] = {
        "Longitude": f"{lon:.2f}°", 
        "DMS": deg_to_dms(deg_in_sign),
        "Sign": sign,
        "SignLord": sign_lords[sign],
        "Nakshatra": nak,
        "NakLord": nak_lord,
        "Avastha": avastha,
        "Combust": "Yes" if combust else "No",
        "Status": status
    }

# --- Display ---
print("\n--- Planetary Positions ---")
for planet, data in planet_positions.items():
    print(f"\n{planet}:")
    for key, value in data.items():
        print(f"  {key}: {value}")
