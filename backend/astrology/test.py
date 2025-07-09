from datetime import datetime
from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder
import pytz
import math

# Zodiac Signs
signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

def julian_day(dt):
    """Calculate Julian Day from UTC datetime"""
    y, m = dt.year, dt.month
    d = dt.day + dt.hour / 24 + dt.minute / 1440 + dt.second / 86400

    if m <= 2:
        y -= 1
        m += 12

    A = y // 100
    B = 2 - A + A // 4
    JD = int(365.25 * (y + 4716)) + int(30.6001 * (m + 1)) + d + B - 1524.5
    return JD

def true_local_sidereal_time(utc_dt, longitude):
    """Calculate True Local Sidereal Time in degrees"""
    jd0 = julian_day(datetime(utc_dt.year, utc_dt.month, utc_dt.day, 0, 0, 0))
    T = (jd0 - 2451545.0) / 36525

    # Sidereal time at 0h UT in degrees
    S0 = 100.46061837 + 36000.770053608 * T + 0.000387933 * T**2 - (T**3) / 38710000

    # Time in UT hours
    UT = utc_dt.hour + utc_dt.minute / 60 + utc_dt.second / 3600

    # GST at given UT
    GST = (S0 + 360.98564724 * (UT / 24)) % 360

    # Local Sidereal Time
    LST = (GST + longitude) % 360
    return LST

def calculate_ascendant(lst_deg, latitude_deg):
    """Calculate Ascendant from LST and Latitude"""
    ε = math.radians(23.4397)  # Obliquity of the ecliptic
    φ = math.radians(latitude_deg)
    lst_rad = math.radians(lst_deg)

    asc_rad = math.atan2(
        -math.cos(lst_rad),
        math.sin(lst_rad) * math.cos(ε) + math.tan(φ) * math.sin(ε)
    )

    asc_deg = math.degrees(asc_rad)
    if asc_deg < 0:
        asc_deg += 360

    return asc_deg % 360

def format_dms(degree):
    d = int(degree)
    m = int((degree - d) * 60)
    s = int((((degree - d) * 60) - m) * 60)
    return f"{d}° {m}′ {s}″"

def full_lagna_calc(dob, tob, location_name):
    # Get location
    geo = Nominatim(user_agent="manual_lagna")
    loc = geo.geocode(location_name)
    lat = loc.latitude
    lon = loc.longitude

    # Get timezone
    tf = TimezoneFinder()
    tz_str = tf.timezone_at(lat=lat, lng=lon)
    tz = pytz.timezone(tz_str)

    # Convert to UTC datetime
    local_dt = tz.localize(datetime.strptime(f"{dob} {tob}", "%Y-%m-%d %H:%M"))
    utc_dt = local_dt.astimezone(pytz.utc)

    # Julian Day and Sidereal Time
    jd = julian_day(utc_dt)
    lst = true_local_sidereal_time(utc_dt, lon)
    asc_deg = calculate_ascendant(lst, lat)

    sign_index = int(asc_deg // 30)
    sign = signs[sign_index]
    deg_in_sign = asc_deg % 30

    return {
        "local_time": local_dt.strftime("%Y-%m-%d %H:%M:%S %Z"),
        "utc_time": utc_dt.strftime("%Y-%m-%d %H:%M:%S %Z"),
        "julian_day": round(jd, 6),
        "lst_deg": round(lst, 4),
        "ascendant_deg": round(asc_deg, 4),
        "rising_sign": sign,
        "degree_in_sign": format_dms(deg_in_sign)
    }

# Example usage
if __name__ == "__main__":
    result = full_lagna_calc("2004-07-14", "07:15", "Surat, India")
    print("🕒 Local Time :", result["local_time"])
    print("🌍 UTC Time   :", result["utc_time"])
    print("📅 Julian Day :", result["julian_day"])
    print("🕒 LST        :", result["lst_deg"], "°")
    print("🌅 Lagna Sign :", result["rising_sign"])
    print("📈 Degree     :", result["degree_in_sign"])
