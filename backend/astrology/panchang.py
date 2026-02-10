import swisseph as swe
from datetime import datetime, timedelta
import pytz
from timezonefinder import TimezoneFinder
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.dirname(current_dir)
ephe_path = os.path.join(backend_root, 'ephe')

if os.path.exists(ephe_path):
    swe.set_ephe_path(ephe_path)
else:
    swe.set_ephe_path('')

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
    "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
    "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
    "Trayodashi", "Chaturdashi", "Amavasya"
]

YOGAS = [
    "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
    "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
    "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
    "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
    "Brahma", "Indra", "Vaidhriti"
]

CHOGHADIYA_NAMES = ["Udvega", "Amrita", "Labha", "Chara", "Roga", "Kaal", "Shubha"]
CHOGHADIYA_QUALITY = {
    "Udvega": "Bad", "Amrita": "Best", "Labha": "Gain",
    "Chara": "Neutral", "Roga": "Evil", "Kaal": "Loss", "Shubha": "Good"
}

DAY_CHOGHADIYA_ORDER = {
    0: [1, 5, 6, 4, 0, 3, 2, 1], 1: [4, 0, 3, 2, 1, 5, 6, 4], 2: [2, 1, 5, 6, 4, 0, 3, 2],
    3: [6, 4, 0, 3, 2, 1, 5, 6], 4: [3, 2, 1, 5, 6, 4, 0, 3], 5: [5, 6, 4, 0, 3, 2, 1, 5],
    6: [0, 3, 2, 1, 5, 6, 4, 0]
}

NIGHT_CHOGHADIYA_ORDER = {
    0: [3, 4, 5, 2, 0, 6, 1, 3], 1: [5, 2, 0, 6, 1, 3, 4, 5], 2: [0, 6, 1, 3, 4, 5, 2, 0],
    3: [1, 3, 4, 5, 2, 0, 6, 1], 4: [4, 5, 2, 0, 6, 1, 3, 4], 5: [2, 0, 6, 1, 3, 4, 5, 2],
    6: [6, 1, 3, 4, 5, 2, 0, 6]
}

def get_julian_day(dt):
    return float(swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute/60 + dt.second/3600))

def normalize_degrees(deg):
    return float(deg % 360.0)

def get_planet_pos(jd, planet_id):
    flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_NONUT
    res = swe.calc_ut(float(jd), int(planet_id), flags)
    return float(res[0][0])

def get_nakshatra_info(jd):
    lon = get_planet_pos(jd, swe.MOON)
    index = int(lon / (360.0/27.0))
    return NAKSHATRAS[index % 27], index, lon

def get_tithi_info(jd):
    try:
        s_lon = get_planet_pos(jd, swe.SUN)
        m_lon = get_planet_pos(jd, swe.MOON)
        diff = normalize_degrees(m_lon - s_lon)
        tithi_num = int(diff / 12.0) + 1
        tithi_name = TITHIS[(tithi_num - 1) % 30]
    except Exception as e:
        print("Error in get_tithi_info:", e)
        raise e
    return tithi_name, tithi_num, diff

def get_sunrise_sunset(jd_ut, lat, lon):
    geopos = (lon, lat, 0.0)  # longitude, latitude, altitude (meters)

    # Flags:
    # CALC_RISE / CALC_SET → sunrise/sunset
    # BIT_DISC_CENTER     → visible solar disc
    rsmi_rise = swe.CALC_RISE | swe.BIT_DISC_CENTER
    rsmi_set  = swe.CALC_SET  | swe.BIT_DISC_CENTER

    atpress = 1013.25  # standard pressure (hPa)
    attemp = 15.0      # standard temperature (°C)

    try:
        rise = swe.rise_trans(
            jd_ut,
            swe.SUN,
            rsmi_rise,
            geopos,
            atpress,
            attemp,
            swe.FLG_SWIEPH
        )

        set_ = swe.rise_trans(
            jd_ut,
            swe.SUN,
            rsmi_set,
            geopos,
            atpress,
            attemp,
            swe.FLG_SWIEPH
        )

        return rise[1][0], set_[1][0]

    except swe.Error as e:
        print("Swiss Ephemeris sunrise/sunset error:", e)
        return jd_ut, jd_ut + 0.5

def jd_to_datetime(jd, tz):
    y, m, d, h = swe.revjul(float(jd))
    h_int = int(h)
    m_rem = (h - h_int) * 60.0
    m_int = int(m_rem)
    s_int = int((m_rem - m_int) * 60.0)
    dt_utc = datetime(y, m, d, h_int, m_int, s_int, tzinfo=pytz.utc)
    return dt_utc.astimezone(tz)

def find_end_time(jd_start, func, current_val):
    jd = float(jd_start)
    step = 1.0/1440.0
    for _ in range(2880):
        jd += step
        new_val, _, _ = func(jd)
        if new_val != current_val:
            return float(jd)
    return float(jd)

def get_panchang(date_str, lat, lon, timezone_str=None, time_str="12:00"):
    lat_f = float(lat)
    lon_f = float(lon)
    
    if not timezone_str:
        tf = TimezoneFinder()
        timezone_str = tf.timezone_at(lat=lat_f, lng=lon_f)
    
    local_tz = pytz.timezone(timezone_str)
    local_dt = datetime.strptime(date_str, "%Y-%m-%d")
    local_dt = local_tz.localize(local_dt)
    utc_dt = local_dt.astimezone(pytz.utc)
    jd_midnight = get_julian_day(utc_dt)

    swe.set_sid_mode(swe.SIDM_LAHIRI, 0.0, 0.0)

    rise_jd, set_jd = get_sunrise_sunset(jd_midnight, lat_f, lon_f)
    sunrise_dt = jd_to_datetime(rise_jd, local_tz)
    sunset_dt = jd_to_datetime(set_jd, local_tz)

    next_day_jd = jd_midnight + 1.0
    next_rise_jd, _ = get_sunrise_sunset(next_day_jd, lat_f, lon_f)
    next_sunrise_dt = jd_to_datetime(next_rise_jd, local_tz)

    t_name, t_idx, _ = get_tithi_info(rise_jd)
    t_end_jd = find_end_time(rise_jd, get_tithi_info, t_name)
    t_end_dt = jd_to_datetime(t_end_jd, local_tz)

    n_name, n_idx, _ = get_nakshatra_info(rise_jd)
    n_end_jd = find_end_time(rise_jd, get_nakshatra_info, n_name)
    n_end_dt = jd_to_datetime(n_end_jd, local_tz)

    sun_lon = get_planet_pos(rise_jd, swe.SUN)
    moon_lon = get_planet_pos(rise_jd, swe.MOON)
    total_yoga = normalize_degrees(sun_lon + moon_lon)
    yoga_name = YOGAS[int(total_yoga / (360.0/27.0)) % 27]

    weekday = sunrise_dt.weekday()
    day_duration = float((sunset_dt - sunrise_dt).total_seconds())
    night_duration = float((next_sunrise_dt - sunset_dt).total_seconds())
    
    day_indices = DAY_CHOGHADIYA_ORDER[weekday]
    night_indices = NIGHT_CHOGHADIYA_ORDER[weekday]

    day_chog = []
    curr = sunrise_dt
    for idx in day_indices:
        name = CHOGHADIYA_NAMES[idx]
        end = curr + timedelta(seconds=day_duration/8.0)
        day_chog.append({"name": name, "quality": CHOGHADIYA_QUALITY[name], "start": curr.strftime("%I:%M %p"), "end": end.strftime("%I:%M %p")})
        curr = end

    night_chog = []
    curr = sunset_dt
    for idx in night_indices:
        name = CHOGHADIYA_NAMES[idx]
        end = curr + timedelta(seconds=night_duration/8.0)
        night_chog.append({"name": name, "quality": CHOGHADIYA_QUALITY[name], "start": curr.strftime("%I:%M %p"), "end": end.strftime("%I:%M %p")})
        curr = end

    rahu_indices = {0: 1, 1: 6, 2: 4, 3: 5, 4: 3, 5: 2, 6: 7}
    rahu_start = sunrise_dt + timedelta(seconds=(day_duration/8.0) * float(rahu_indices[weekday]))
    rahu_end = rahu_start + timedelta(seconds=day_duration/8.0)

    abhijit_start = sunrise_dt + timedelta(seconds=(day_duration/15.0) * 7.0)
    abhijit_end = abhijit_start + timedelta(seconds=day_duration/15.0)

    return {
        "date": date_str,
        "sunrise": sunrise_dt.strftime("%I:%M %p"),
        "sunset": sunset_dt.strftime("%I:%M %p"),
        "tithi": f"{t_name} upto {t_end_dt.strftime('%I:%M %p')}",
        "nakshatra": f"{n_name} upto {n_end_dt.strftime('%I:%M %p')}",
        "yoga": yoga_name,
        "rahu_kalam": f"{rahu_start.strftime('%I:%M %p')} - {rahu_end.strftime('%I:%M %p')}",
        "abhijit_muhurat": f"{abhijit_start.strftime('%I:%M %p')} - {abhijit_end.strftime('%I:%M %p')}",
        "day_choghadiya": day_chog,
        "night_choghadiya": night_chog,
        "weekday": sunrise_dt.strftime("%A")
    }