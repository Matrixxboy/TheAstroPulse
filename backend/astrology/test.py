import math
from datetime import datetime
from pprint import pprint 

# Input
dob_utc = datetime(2004, 7, 14, 7, 15)  # UTC time for 2000-06-05 05:10 IST
latitude = 21.202245
longitude = 72.840770

# Julian Day
def julian_day(dt):
    y, m = dt.year, dt.month
    if m <= 2:
        y -= 1
        m += 12
    A = y // 100
    B = 2 - A + A // 4
    D = dt.day + dt.hour / 24 + dt.minute / 1440 + dt.second / 86400
    JD = int(365.25 * (y + 4716)) + int(30.6001 * (m + 1)) + D + B - 1524.5
    return JD

JD = julian_day(dob_utc)

# Sidereal Time at Greenwich
T = (JD - 2451545.0) / 36525
GST = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T**2 - (T**3) / 38710000
GST = GST % 360

# Local Sidereal Time
LST = (GST + longitude) % 360

# Ascendant calculation
ε = math.radians(23.439291)  # obliquity
LST_rad = math.radians(LST)
lat_rad = math.radians(latitude)

asc_rad = math.atan2(
    -math.cos(LST_rad),
    math.sin(LST_rad) * math.cos(ε) + math.tan(lat_rad) * math.sin(ε)
)
asc_deg = (math.degrees(asc_rad) + 180) % 360

# Lahiri Ayanamsa (approx.)
ayanamsa = 23.85
sidereal_asc = (asc_deg - ayanamsa) % 360

# Convert to sign
signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]
sign_index = int(sidereal_asc // 30)
deg_in_sign = sidereal_asc % 30
d = int(deg_in_sign)
m = int((deg_in_sign - d) * 60)
s = int((((deg_in_sign - d) * 60) - m) * 60)

# Final result
result ={
    "Julian_Day": JD,
    "LST": round(LST, 6),
    "Tropical_Ascendant": round(asc_deg, 6),
    "Sidereal_Ascendant": round(sidereal_asc, 6),
    "Vedic_Lagna": f"{signs[sign_index]} {d}°{m}'{s}″"
}

pprint(result)

