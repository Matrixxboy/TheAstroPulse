import json
import os
from .panchang import get_panchang

# Load rules
current_dir = os.path.dirname(os.path.abspath(__file__))
rules_path = os.path.join(current_dir, "rules.json")

with open(rules_path, "r", encoding="utf-8") as f:
    FESTIVAL_RULES = json.load(f)

import json
import os
from datetime import date, timedelta
from .panchang import get_panchang

# Load rules
current_dir = os.path.dirname(os.path.abspath(__file__))
rules_path = os.path.join(current_dir, "rules.json")

with open(rules_path, "r", encoding="utf-8") as f:
    FESTIVAL_RULES = json.load(f)

import json
import os
from datetime import date, timedelta
from .panchang import get_panchang

# Load rules
current_dir = os.path.dirname(os.path.abspath(__file__))
rules_path = os.path.join(current_dir, "rules.json")

with open(rules_path, "r", encoding="utf-8") as f:
    FESTIVAL_RULES = json.load(f)

def detect_festivals(date_obj, override_lunar_month=None):
    """
    Detect festivals for a given date using Accurate Panchang Engine.
    """
    panchang = get_panchang(date_obj)
    
    matches = []

    # Calculate JD for specific times if needed
    # We'll calculate these on demand to save compute if not needed
    
    for name, rule in FESTIVAL_RULES.items():
        is_match = True
        
        # Determine the moment to check Tithi/Nakshatra
        # Default is Sunrise (which we already have in `panchang`)
        check_panchang = panchang
        
        timing = rule.get("timing")
        if timing:
            # Calculate specific time JD
            # Sunrise is roughly 6:00 Local Mean Time or similar. 
            # We used `get_sunrise` in panchang.py.
            # Here we need an approximation or exact calculation.
            # Ideally `panchang.py` should expose a `get_panchang_at_time` or we use `get_julian_day`.
            
            # Let's map timings to approximate hours (IST is UTC+5.5)
            # We need to pass the correct hour to get_julian_day.
            # get_julian_day converts local date + hour to JD.
            # Note: swe.julday expects UT if not otherwise specified? 
            # Wait, `get_julian_day` in `panchang.py` takes (date, hour).
            # SWISSEPH julday takes (year, month, day, hour). 
            # If we pass local hour, does it return UT JD or ET JD? 
            # Usually strict inputs.
            # Let's assume input date is local date. 
            # To get specific time, we add hour to JD start of day?
            
            # Let's simple use utils from panchang if available or recreate logic.
            # In `panchang.py`: `swe.julday(..., time_hour)`
            
            # Approximate times in Local Time (IST):
            if timing == "noon":
                hour = 12.0
            elif timing == "afternoon":
                hour = 14.5 # ~2:30 PM (Aparahna)
            elif timing == "evening":
                hour = 18.5 # Pradosh / Sunset time
            elif timing == "midnight":
                hour = 24.0 # Midnight (technically next day 0.0 or 24.0 of current day)
            else:
                hour = 6.0 # Default/Sunrise
                
            # If timing is midnight, it might be 00:00 of NEXT day or 24:00 of CURRENT day.
            # Effect is same.
            
            # Recalculate Panchang for this specific time
            from .panchang import get_julian_day, calculate_tithi, calculate_nakshatra, get_amanta_lunar_month
            
            # Note: get_julian_day expects hour in UT if we want strictness, 
            # but standard usage often implies local if consistent.
            # However, swisseph defaults to UT. 
            # IST is +5.30. So 12.00 Noon IST = 6.5 UT.
            # We should probably subtract 5.5 from local hours to get UT.
            
            ut_hour = hour - 5.5
            jd_timing = get_julian_day(date_obj, ut_hour)
            
            t_name, t_paksha, t_index = calculate_tithi(jd_timing)
            n_name = calculate_nakshatra(jd_timing)
            # Lunar month typically doesn't change fast, but let's use sunrise month to keep it stable
            # or recalculate if boundary crossing. Usually determined by New Moon.
            # Let's use sunrise lunar month for consistency unless it's a month-boundary sensitive festival?
            # Safe to use sunrise month for now.
            
            check_panchang = {
                "tithi": t_name,
                "paksha": t_paksha,
                "nakshatra": n_name,
                "lunar_month": panchang["lunar_month"], # Keep sunrise month
                "sun_sign": panchang["sun_sign"] # Keep sunrise sign
            }

        
        # 0. Fixed Gregorian Date Logic
        if rule.get("type") == "fixed":
            if date_obj.month == rule.get("month") and date_obj.day == rule.get("day"):
                matches.append({
                    "name": name,
                    "type": "National/Fixed Festival",
                    "date": date_obj.isoformat()
                })
            continue

        # 1. Solar Rule (Makar Sankranti etc.)
        if rule.get("type") == "solar":
            target_sign = rule.get("sun_sign")
            
            # Check Sun Sign at start of today vs start of tomorrow
            # If it changes TO target_sign, today is the transition day.
            
            # Current day already calculated in `panchang` (Sunrise)
            current_sign = panchang["sun_sign"]
            
            if current_sign != target_sign:
                 # It's not in the sign at Sunrise. 
                 # Did it enter later today?
                 tomorrow = date_obj + timedelta(days=1)
                 tomorrow_panchang = get_panchang(tomorrow)
                 next_sign = tomorrow_panchang["sun_sign"]
                 
                 if next_sign == target_sign:
                     # TRANSIT HAPPENS TODAY! (Between today sunrise and tomorrow sunrise)
                     matches.append({
                        "name": name,
                        "type": "Solar Festival",
                        "details": f"Sun enters {target_sign}",
                        "date": date_obj.isoformat()
                    })
            
            if current_sign == target_sign:
                # Sun is ALREADY in sign at sunrise.
                # Was it there yesterday?
                yesterday = date_obj - timedelta(days=1)
                yesterday_panchang = get_panchang(yesterday)
                prev_sign = yesterday_panchang["sun_sign"]
                
                if prev_sign != target_sign:
                     # It entered yesterday but maybe after sunrise? 
                     # If we flagged it yesterday (via the block above), we shouldn't flag it today again?
                     # Actually, the logic above (current != target, next == target) flags day PRECEDING the full presence.
                     # This block (current == target, prev != target) flags the first FULL day.
                     # Sankranti is the TRANSIT day.
                     # If transit was at 2 PM Jan 14:
                     # Jan 14 Sunrise: Sag. Jan 15 Sunrise: Cap.
                     # On Jan 14: current(Sag) != target(Cap). next(Cap) == target(Cap). -> MATCH Jan 14.
                     # On Jan 15: current(Cap) == target(Cap). prev(Sag) != target(Cap). -> MATCH Jan 15?
                     # We need to avoid double detection.
                     # If we matched on Jan 14, we shouldn't match Jan 15.
                     # Usually Sankranti is strictly the transit event.
                     # So the first block (Ingress) is the correct one.
                     pass 
            
            continue 

        # 2. Lunar Month Match
        # Use calculated month unless override provided (override unused in yearly logic now)
        current_month = check_panchang["lunar_month"]
        if "lunar_month" in rule and rule["lunar_month"] != current_month:
            is_match = False
            
        # 3. Paksha Match
        if is_match and "paksha" in rule and rule["paksha"] != check_panchang["paksha"]:
             is_match = False
             
        # 4. Tithi Match
        if is_match and "tithi" in rule and rule["tithi"] != check_panchang["tithi"]:
            is_match = False
            
        # 5. Nakshatra Match (optional)
        if is_match and "nakshatra" in rule:
            if rule["nakshatra"] != check_panchang["nakshatra"]:
                is_match = False

        if is_match:
            matches.append({
                "name": name,
                "tithi": check_panchang["tithi"],
                "paksha": check_panchang["paksha"],
                "lunar_month": check_panchang["lunar_month"],
                "nakshatra": check_panchang["nakshatra"],
                "type": rule.get("type", "Hindu Festival").title(), # Capitalize type
                "date": date_obj.isoformat()
            })

    return matches

def get_yearly_festivals(year):
    """
    Scan the entire year (Jan 1 to Dec 31) for festivals.
    """
    start_date = date(year, 1, 1)
    end_date = date(year, 12, 31)
    delta = timedelta(days=1)
    
    all_festivals = []
    
    current_date = start_date
    while current_date <= end_date:
        # Optimization: Only check if there are rules for the current Tithi? 
        # For now, running detection daily is fast enough (~0.001s per day -> ~0.4s for year)
        daily_matches = detect_festivals(current_date)
        if daily_matches:
            all_festivals.extend(daily_matches)
        current_date += delta
        
    return all_festivals
