from datetime import datetime
from dateutil.relativedelta import relativedelta

# === Vimshottari Dasha Sequence ===
DASHA_SEQUENCE = [
    ("Ketu", 7),
    ("Venus", 20),
    ("Sun", 6),
    ("Moon", 10),
    ("Mars", 7),
    ("Rahu", 18),
    ("Jupiter", 16),
    ("Saturn", 19),
    ("Mercury", 17)
]

NAKSHATRA_SPAN_DEG = 13.3333  # degrees

# === 1. DMS to Decimal Degrees ===
def dms_to_decimal(degree: int, minute: int, second: int) -> float:
    return degree + minute / 60 + second / 3600

# === 2. Absolute Longitude from Sign Index ===
def get_absolute_moon_degree(sign_index: int, deg_in_sign: float) -> float:
    return sign_index * 30 + deg_in_sign

# === 3. Nakshatra Start Degree ===
def get_nakshatra_start_deg(abs_moon_deg: float) -> float:
    nak_index = int(abs_moon_deg // NAKSHATRA_SPAN_DEG)
    return nak_index * NAKSHATRA_SPAN_DEG

# === 4. Calculate Moon Dasha Start from Passed Proportion ===
def calculate_moon_dasha_start(dob, moon_deg_within_nakshatra, moon_lord_years):
    proportion_passed = moon_deg_within_nakshatra / NAKSHATRA_SPAN_DEG
    passed_years = moon_lord_years * proportion_passed
    moon_dasha_start = dob - relativedelta(days=int(passed_years * 365.25))
    remaining_years = moon_lord_years - passed_years
    return moon_dasha_start, remaining_years

# === 5. Main Function ===
def get_vimshottari_dasha_from_dms(dob_str, tob_str, d, m, s, sign_index, moon_nakshatra_lord):
    # Convert to decimal degrees
    deg_in_sign = dms_to_decimal(d, m, s)
    dob = datetime.strptime(f"{dob_str} {tob_str}", "%d-%m-%Y %H:%M")
    moon_deg_abs = get_absolute_moon_degree(sign_index, deg_in_sign)
    nakshatra_start_deg = get_nakshatra_start_deg(moon_deg_abs)
    moon_deg_within_nakshatra = moon_deg_abs - nakshatra_start_deg

    # Get Moon Dasha Start & Remaining
    moon_lord_years = dict(DASHA_SEQUENCE)[moon_nakshatra_lord]
    moon_dasha_start, moon_remaining_years = calculate_moon_dasha_start(
        dob, moon_deg_within_nakshatra, moon_lord_years
    )

    # Reorder the Dasha sequence from given nakshatra lord
    start_index = next(i for i, (planet, _) in enumerate(DASHA_SEQUENCE) if planet == moon_nakshatra_lord)
    reordered = DASHA_SEQUENCE[start_index:] + DASHA_SEQUENCE[:start_index]

    # Create Dasha Timeline
    result = []
    current_start = dob
    moon_end = current_start + relativedelta(days=int(moon_remaining_years * 365.25))
    result.append((moon_nakshatra_lord, current_start.strftime("%d-%b-%Y"), moon_end.strftime("%d-%b-%Y")))
    current_start = moon_end

    for planet, duration in reordered[1:]:
        current_end = current_start + relativedelta(years=duration)
        result.append((planet, current_start.strftime("%d-%b-%Y"), current_end.strftime("%d-%b-%Y")))
        current_start = current_end

    return result, moon_deg_abs, nakshatra_start_deg


# === 🧾 INPUT ===
DOB = "08-12-2004" #done
TOB = "23:59"   #done
D, M, S = 11, 30, 20      #done
SIGN_INDEX = 0   #done        # 0 = Aries, so Moon is in Aries
MOON_NAKSHATRA_LORD = "Ketu"  #done

# === 🔍 RUN ===
dasha_result, moon_abs_deg, nakshatra_start_deg = get_vimshottari_dasha_from_dms(
    DOB, TOB, D, M, S, SIGN_INDEX, MOON_NAKSHATRA_LORD
)

# === 🖨️ OUTPUT ===
print(f"🌓 Moon Absolute Longitude : {moon_abs_deg:.4f}°")
print(f"🌌 Nakshatra Start Degree  : {nakshatra_start_deg:.4f}°")
print(f"🔱 Nakshatra Lord          : {MOON_NAKSHATRA_LORD}\n")
print("📆 Vimshottari Dasha Periods:")
for planet, start, end in dasha_result:
    print(f"{planet:8} {start}   {end}")
