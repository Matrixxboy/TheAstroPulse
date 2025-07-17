from datetime import datetime, timedelta
import math
import swisseph as swe
import pytz

# Constants
SUN_ALTITUDE = -0.833  # standard refraction-corrected altitude for sunrise
DEG_TO_RAD = math.pi / 180
RAD_TO_DEG = 180 / math.pi

# Location (Surat, India)
date_str = "2004-04-14"
lat, lon = 21.1702, 72.8311
timezone_str = "Asia/Kolkata"

# Timezone and datetime setup
dt = datetime.strptime(date_str, "%Y-%m-%d")
tz = pytz.timezone(timezone_str)
local_midnight = tz.localize(datetime(dt.year, dt.month, dt.day, 0, 0, 0))
utc_midnight = local_midnight.astimezone(pytz.utc)

# Julian Day for midnight UTC
jd_ut = swe.julday(
    utc_midnight.year,
    utc_midnight.month,
    utc_midnight.day,
    utc_midnight.hour + utc_midnight.minute / 60 + utc_midnight.second / 3600
)

# Get Sun's RA and Declination at noon
jd_noon = jd_ut + 0.5
sun_ra_dec = swe.calc_ut(jd_noon, swe.SUN, flags=swe.FLG_SWIEPH | swe.FLG_EQUATORIAL)
ra, decl = sun_ra_dec[0][0], sun_ra_dec[0][1]

# Convert to radians
lat_rad = lat * DEG_TO_RAD
decl_rad = decl * DEG_TO_RAD
alt_rad = SUN_ALTITUDE * DEG_TO_RAD

# Compute hour angle
cos_H = (math.sin(alt_rad) - math.sin(lat_rad) * math.sin(decl_rad)) / (math.cos(lat_rad) * math.cos(decl_rad))
if abs(cos_H) > 1:
    raise ValueError("Sun does not rise on this date at this location")

H = math.acos(cos_H) * RAD_TO_DEG
delta_hours = H / 15.0

# Compute solar noon and sunrise in UTC
solar_noon_utc = 12.0 - (lon / 15.0)
sunrise_utc = solar_noon_utc - delta_hours

# UTC datetime for sunrise
sunrise_time_utc = datetime(dt.year, dt.month, dt.day) + timedelta(hours=sunrise_utc)
sunrise_time_local = pytz.utc.localize(sunrise_time_utc).astimezone(tz)

# Julian day for sunrise
sunrise_jd = swe.julday(
    sunrise_time_utc.year,
    sunrise_time_utc.month,
    sunrise_time_utc.day,
    sunrise_time_utc.hour + sunrise_time_utc.minute / 60 + sunrise_time_utc.second / 3600
)

# Set sidereal mode
swe.set_sid_mode(swe.SIDM_LAHIRI)

# Get sun's position in sidereal zodiac at sunrise
sun_position = swe.calc_ut(sunrise_jd, swe.SUN)[0][0]  # in degrees

# Zodiac sign
sign_index = int(sun_position // 30)
nakshatra_index = int((sun_position % 360) / (360 / 27))
pada = int(((sun_position % (360 / 27)) / (360 / 27 / 4))) + 1

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

sun_zodiac_sign = ZODIAC_SIGNS[sign_index]
sun_nakshatra = NAKSHATRAS[nakshatra_index]

print(sunrise_time_local.strftime("%H:%M:%S"), round(sun_position, 6), sun_zodiac_sign, sun_nakshatra, pada)
print(sun_zodiac_sign)
print(sun_nakshatra)
