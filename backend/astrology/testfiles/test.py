import swisseph as swe
from datetime import datetime, timedelta
import pytz
from pprint import pprint
def calculate_vedic_lagna(dob, tob, location, lat, lon, ayanamsa=swe.SIDM_LAHIRI):
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
    swe.set_sid_mode(ayanamsa)
    
    # Step 5: Calculate Houses with sidereal mode
    cusps, ascmc = swe.houses(jd_ut, lat, lon, b'W')  # You can also try 'E' or 'P'
    
    # Step 6: Ascendant Degree (Sidereal)
    asc_sidereal = (ascmc[0] - swe.get_ayanamsa(jd_ut)) % 360
    print(asc_sidereal)
    
    # Step 7: Map to Rashi
    rashis = [
        "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
        "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrischika (Scorpio)",
        "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
    ]
    rashi_index = int(asc_sidereal // 30)
    return {
        "asc_deg_sidereal": asc_sidereal,
        "rashi": rashis[rashi_index],
        "rashi_index": rashi_index + 1  # 1-based for Indian use
    }


result = calculate_vedic_lagna("2019-12-08","23:59",'Asia/Kolkata',21.1702,72.8311,swe.SIDM_LAHIRI)
pprint(result)