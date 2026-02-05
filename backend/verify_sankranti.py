import sys
import os
from datetime import date, timedelta

# Add backend to path
sys.path.append(os.getcwd())

from festivals.panchang import get_panchang
from festivals.festivals import detect_festivals

print("--- Checking Makar Sankranti Range (Jan 10 - Jan 20, 2026) ---")
output_lines = []

start_date = date(2026, 1, 10)
for i in range(15):
    d = start_date + timedelta(days=i)
    
    # 1. Get Panchang directly
    p = get_panchang(d)
    
    # 2. Check Yesterday manually
    yesterday = d - timedelta(days=1)
    p_prev = get_panchang(yesterday)
    
    # 3. Detect Festivals
    matches = detect_festivals(d)
    is_sankranti = any(m['name'] == 'Makar Sankranti' for m in matches)
    
    # print(f"Date: {d} | Sun Sign: {p['sun_sign']:<12} | Prev: {p_prev['sun_sign']:<12} | Festivals: {len(matches)} {'[Makar Sankranti]' if is_sankranti else ''}")
    output_lines.append(f"Date: {d} | Sun Sign: {p['sun_sign']:<12} | Prev: {p_prev['sun_sign']:<12} | Festivals: {len(matches)} {'[Makar Sankranti]' if is_sankranti else ''}")

with open("check_transit.txt", "w") as f:
    f.write("\n".join(output_lines))
