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

    for name, rule in FESTIVAL_RULES.items():
        is_match = True
        
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
        current_month = panchang["lunar_month"]
        if "lunar_month" in rule and rule["lunar_month"] != current_month:
            is_match = False
            
        # 3. Paksha Match
        if is_match and "paksha" in rule and rule["paksha"] != panchang["paksha"]:
             is_match = False
             
        # 4. Tithi Match
        if is_match and "tithi" in rule and rule["tithi"] != panchang["tithi"]:
            is_match = False
            
        # 5. Nakshatra Match (optional)
        if is_match and "nakshatra" in rule:
            if rule["nakshatra"] != panchang["nakshatra"]:
                is_match = False

        if is_match:
            matches.append({
                "name": name,
                "tithi": panchang["tithi"],
                "paksha": panchang["paksha"],
                "lunar_month": panchang["lunar_month"],
                "nakshatra": panchang["nakshatra"],
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
