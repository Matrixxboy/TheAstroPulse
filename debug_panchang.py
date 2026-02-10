
from backend.festivals.panchang import get_panchang, get_julian_day, calculate_tithi, calculate_nakshatra
from datetime import date, timedelta

def debug_panchang():
    # Check Pitru Paksha period (Late Aug - Early Sep 2026)
    print("--- Debugging Pitru Paksha (Aug-Sep 2026) ---")
    start_date = date(2026, 8, 25)
    for i in range(10):
        d = start_date + timedelta(days=i)
        p = get_panchang(d)
        print(f"Date: {d}, Sunrise Tithi: {p['tithi']}, Paksha: {p['paksha']}, Month: {p['lunar_month']}")
        
        # Check Afternoon Tithi (approx 14.5h IST = 9.0 UT)
        jd_afternoon = get_julian_day(d, 9.0)
        t_name, t_paksha, _ = calculate_tithi(jd_afternoon)
        print(f"    Afternoon Tithi: {t_name}, Paksha: {t_paksha}")

    # Check Ganga Dussehra (May-June 2026)
    print("\n--- Debugging Ganga Dussehra (May-June 2026) ---")
    dates_to_check = [date(2026, 5, 25), date(2026, 6, 24)]
    for d in dates_to_check:
        p = get_panchang(d)
        print(f"Date: {d}, Sunrise Tithi: {p['tithi']}, Paksha: {p['paksha']}, Month: {p['lunar_month']}")
        # Check Noon Tithi (12.0 IST = 6.5 UT)
        jd_noon = get_julian_day(d, 6.5)
        t_name, t_paksha, _ = calculate_tithi(jd_noon)
        print(f"    Noon Tithi: {t_name}, Paksha: {t_paksha}")

if __name__ == "__main__":
    debug_panchang()
