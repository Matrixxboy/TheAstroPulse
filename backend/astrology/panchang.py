
import swisseph as swe
from datetime import datetime, timedelta
import pytz
from timezonefinder import TimezoneFinder
import os

# --- Configuration ---
# Set ephemeris path
current_dir = os.path.dirname(os.path.abspath(__file__))
# Try to find 'ephe' directory in backend root (parent of astrology)
backend_root = os.path.dirname(current_dir)
ephe_path = os.path.join(backend_root, 'ephe')

if os.path.exists(ephe_path):
    # Check if files are valid (size > 3000 bytes)
    valid_files = False
    try:
        if os.path.exists(os.path.join(ephe_path, 'sepl_18.se1')) and os.path.getsize(os.path.join(ephe_path, 'sepl_18.se1')) > 3000:
            valid_files = True
    except:
        pass
        
    if valid_files:
        swe.set_ephe_path(ephe_path)
    else:
        print(f"Warning: Ephemeris files in {ephe_path} seem invalid (too small). Using Moshier fallback.")
        swe.set_ephe_path('') # Use internal Moshier
else:
    print(f"Warning: Ephemeris directory {ephe_path} not found. Using Moshier fallback.")
    swe.set_ephe_path('')

# Constants
NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

TITHIS = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
    "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
    "Trayodashi", "Chaturdashi", "Purnima",  # 1-15 Shukla
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
    "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
    "Trayodashi", "Chaturdashi", "Amavasya"  # 16-30 Krishna
]

YOGAS = [
    "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
    "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
    "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
    "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
    "Brahma", "Indra", "Vaidhriti"
]

KARANAS = [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", # Moveable
    "Shakuni", "Chatushpada", "Naga", "Kimstughna" # Fixed
]

CHOGHADIYA_NAMES = ["Udvega", "Amrita", "Labha", "Chara", "Roga", "Kaal", "Shubha"]
CHOGHADIYA_QUALITY = {
    "Udvega": "Bad",
    "Amrita": "Best",
    "Labha": "Gain",
    "Chara": "Neutral",
    "Roga": "Evil",
    "Kaal": "Loss",
    "Shubha": "Good"
}

# Day Choghadiya Start Indices (0=Mon, ... 6=Sun)
DAY_CHOGHADIYA_ORDER = {
    0: [1, 5, 6, 4, 0, 3, 2, 1], # Mon: Amrita, Kaal, Shubha, Roga, Udvega, Chara, Labha, Amrita.
    1: [4, 0, 3, 2, 1, 5, 6, 4], # Tue: Roga...
    2: [2, 1, 5, 6, 4, 0, 3, 2], # Wed: Labha...
    3: [6, 4, 0, 3, 2, 1, 5, 6], # Thu: Shubha...
    4: [3, 2, 1, 5, 6, 4, 0, 3], # Fri: Chara...
    5: [5, 6, 4, 0, 3, 2, 1, 5], # Sat: Kaal...
    6: [0, 3, 2, 1, 5, 6, 4, 0]  # Sun: Udvega...
}

# Night Choghadiya Start Indices
NIGHT_CHOGHADIYA_ORDER = {
    0: [3, 4, 5, 2, 0, 6, 1, 3], # Mon: Chara, Roga, Kaal, Labha, Udvega, Shubha, Amrita, Chara
    1: [5, 2, 0, 6, 1, 3, 4, 5], # Tue: Kaal...
    2: [0, 6, 1, 3, 4, 5, 2, 0], # Wed: Udvega...
    3: [1, 3, 4, 5, 2, 0, 6, 1], # Thu: Amrita...
    4: [4, 5, 2, 0, 6, 1, 3, 4], # Fri: Roga...
    5: [2, 0, 6, 1, 3, 4, 5, 2], # Sat: Labha...
    6: [6, 1, 3, 4, 5, 2, 0, 6]  # Sun: Shubha...
}

def get_julian_day(dt):
    return swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute/60 + dt.second/3600)

def normalize_degrees(deg):
    return deg % 360

def get_planet_pos(jd, planet_id):
    flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_NONUT
    try:
        res = swe.calc_ut(jd, planet_id, flags)
        return res[0][0] # Longitude
    except swe.Error:
        # Fallback without SWIEPH flag (uses moshier)
        flags = swe.FLG_SIDEREAL | swe.FLG_NONUT
        res = swe.calc_ut(jd, planet_id, flags)
        return res[0][0]

def get_nakshatra(moon_lon):
    index = int(moon_lon / 13.3333333333)
    return NAKSHATRAS[index % 27]

def get_tithi(sun_lon, moon_lon):
    diff = normalize_degrees(moon_lon - sun_lon)
    tithi_num = int(diff / 12) + 1
    tithi_name = TITHIS[(tithi_num - 1) % 30]
    paksha = "Shukla" if tithi_num <= 15 else "Krishna"
    return {"index": tithi_num, "name": tithi_name, "paksha": paksha}

def get_yoga(sun_lon, moon_lon):
    total = normalize_degrees(sun_lon + moon_lon)
    index = int(total / 13.3333333333)
    return YOGAS[index % 27]

def get_karana(tithi_index, tithi_elapsed_deg):
    return "Bava" # Placeholder for MVP

def get_sunrise_sunset(jd, lat, lon):
    flags = swe.FLG_SWIEPH
    geopos = (lon, lat, 0.0)
    try:
        res_rise = swe.rise_trans(jd, swe.SUN, b"", flags, swe.CALC_RISE, geopos, 0.0, 0.0)
        res_set = swe.rise_trans(jd, swe.SUN, b"", flags, swe.CALC_SET, geopos, 0.0, 0.0)
        return res_rise[1][0], res_set[1][0]
    except Exception as e:
        print(f"Error calculating sunrise/sunset with SWIEPH: {e}. Trying fallback.")
        try:
             # Fallback without SWIEPH flag
            res_rise = swe.rise_trans(jd, swe.SUN, b"", 0, swe.CALC_RISE, geopos, 0.0, 0.0)
            res_set = swe.rise_trans(jd, swe.SUN, b"", 0, swe.CALC_SET, geopos, 0.0, 0.0)
            return res_rise[1][0], res_set[1][0]
        except Exception as e2:
             print(f"Fallback failed: {e2}")
             return jd, jd + 0.5

def jd_to_datetime(jd, tz):
    y, m, d, h = swe.revjul(jd)
    h_int = int(h)
    m_int = int((h - h_int) * 60)
    s_int = int(((h - h_int) * 60 - m_int) * 60)
    dt_utc = datetime(y, m, d, h_int, m_int, s_int, tzinfo=pytz.utc)
    return dt_utc.astimezone(tz)

def calculate_choghadiya(sunrise_dt, sunset_dt, next_sunrise_dt, weekday):
    day_duration = (sunset_dt - sunrise_dt).total_seconds()
    night_duration = (next_sunrise_dt - sunset_dt).total_seconds()
    
    day_part = day_duration / 8
    night_part = night_duration / 8
    
    day_indices = DAY_CHOGHADIYA_ORDER[weekday]
    night_indices = NIGHT_CHOGHADIYA_ORDER[weekday]
    
    day_choghadiya = []
    current_time = sunrise_dt
    for idx_wrapper in day_indices:
        # idx_wrapper is index in CHOGHADIYA_NAMES
        name = CHOGHADIYA_NAMES[idx_wrapper]
        quality = CHOGHADIYA_QUALITY[name]
        end_time = current_time + timedelta(seconds=day_part)
        day_choghadiya.append({
            "name": name,
            "quality": quality,
            "start": current_time.strftime("%I:%M %p"),
            "end": end_time.strftime("%I:%M %p")
        })
        current_time = end_time

    night_choghadiya = []
    current_time = sunset_dt
    for idx_wrapper in night_indices:
        name = CHOGHADIYA_NAMES[idx_wrapper]
        quality = CHOGHADIYA_QUALITY[name]
        end_time = current_time + timedelta(seconds=night_part)
        night_choghadiya.append({
            "name": name,
            "quality": quality,
            "start": current_time.strftime("%I:%M %p"),
            "end": end_time.strftime("%I:%M %p")
        })
        current_time = end_time
        
    return day_choghadiya, night_choghadiya

def calculate_rahu_abhijit(weekday, sunrise_dt, sunset_dt):
    duration = (sunset_dt - sunrise_dt).total_seconds()
    
    # Rahu
    rahu_indices = {0: 1, 1: 6, 2: 4, 3: 5, 4: 3, 5: 2, 6: 7} # Mon=0..Sun=6
    part_duration = duration / 8
    start_second = rahu_indices[weekday] * part_duration
    rahu_start = sunrise_dt + timedelta(seconds=start_second)
    rahu_end = rahu_start + timedelta(seconds=part_duration)
    
    # Abhijit
    muhurat_duration = duration / 15
    abhijit_start = sunrise_dt + timedelta(seconds=7 * muhurat_duration)
    abhijit_end = abhijit_start + timedelta(seconds=muhurat_duration)
    
    return (
        f"{rahu_start.strftime('%I:%M %p')} - {rahu_end.strftime('%I:%M %p')}",
        f"{abhijit_start.strftime('%I:%M %p')} - {abhijit_end.strftime('%I:%M %p')}"
    )

def get_panchang(date_str, lat, lon, timezone_str=None, time_str="12:00"):
    # 1. Setup Timezone
    if not timezone_str:
        tf = TimezoneFinder()
        timezone_str = tf.timezone_at(lat=lat, lng=lon)
    
    local_tz = pytz.timezone(timezone_str)
    
    # 2. Parse Date & Time
    dt_str = f"{date_str} {time_str}"
    local_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
    local_dt = local_tz.localize(local_dt)
    
    # 3. Convert to UT for Swiss Ephemeris
    utc_dt = local_dt.astimezone(pytz.utc)
    jd = get_julian_day(utc_dt)
    
    # 4. Planetary Positions
    swe.set_sid_mode(swe.SIDM_LAHIRI) # Vedic Sidereal
    
    sun_lon = get_planet_pos(jd, swe.SUN)
    moon_lon = get_planet_pos(jd, swe.MOON)
    
    # 5. Calculations
    nakshatra = get_nakshatra(moon_lon)
    tithi_info = get_tithi(sun_lon, moon_lon)
    yoga = get_yoga(sun_lon, moon_lon)
    karana = get_karana(tithi_info["index"], 0)
    
    # 6. Sunrise/Sunset & Choghadiya
    morning_dt = datetime.strptime(f"{date_str} 06:00", "%Y-%m-%d %H:%M")
    morning_dt = local_tz.localize(morning_dt)
    morning_jd = get_julian_day(morning_dt.astimezone(pytz.utc))
    
    # Get Today's Sunrise/Sunset
    rise_jd, set_jd = get_sunrise_sunset(morning_jd, lat, lon)
    sunrise_dt = jd_to_datetime(rise_jd, local_tz)
    sunset_dt = jd_to_datetime(set_jd, local_tz)
    
    # Get Next Day's Sunrise for Night Choghadiya
    next_day_dt = morning_dt + timedelta(days=1)
    next_morning_jd = get_julian_day(next_day_dt.astimezone(pytz.utc))
    next_rise_jd, _ = get_sunrise_sunset(next_morning_jd, lat, lon)
    next_sunrise_dt = jd_to_datetime(next_rise_jd, local_tz)
    
    weekday = local_dt.weekday() # 0=Mon, 6=Sun
    
    day_choghadiya, night_choghadiya = calculate_choghadiya(sunrise_dt, sunset_dt, next_sunrise_dt, weekday)
    rahu_kalam, abhijit_muhurat = calculate_rahu_abhijit(weekday, sunrise_dt, sunset_dt)

    return {
        "date": date_str,
        "location": {"lat": lat, "lon": lon, "timezone": timezone_str},
        "sunrise": sunrise_dt.strftime("%I:%M %p"),
        "sunset": sunset_dt.strftime("%I:%M %p"),
        "tithi": tithi_info,
        "nakshatra": nakshatra,
        "yoga": yoga,
        "karana": karana,
        "rahu_kalam": rahu_kalam,
        "abhijit_muhurat": abhijit_muhurat,
        "moon_angle": moon_lon,
        "sun_angle": sun_lon,
        "day_choghadiya": day_choghadiya,
        "night_choghadiya": night_choghadiya,
        "weekday": local_dt.strftime("%A")
    }
