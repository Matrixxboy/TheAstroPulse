import swisseph as swe
from datetime import datetime, timedelta
from pytz import timezone
from timezonefinder import TimezoneFinder
import decimal
from collections import OrderedDict
from decimal import Decimal, getcontext
from dateutil.relativedelta import relativedelta # Import relativedelta for year calculations

getcontext().prec = 10 # Set precision for Decimal calculations

# Nakshatra Lords in Vimshottari Dasha order (in degrees of moon)
NAKSHATRA_LORDS = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',
    'Rahu', 'Jupiter', 'Saturn', 'Mercury'
]

# Total Dasha Years per Nakshatra Lord
DASHA_YEARS = {
    'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10,
    'Mars': 7, 'Rahu': 18, 'Jupiter': 16,
    'Saturn': 19, 'Mercury': 17
}

# Each Nakshatra is 13°20′ = 13.3333...
NAKSHATRA_SPAN = Decimal(13) + Decimal(20) / Decimal(60) # Use Decimal for NAKSHATRA_SPAN

# Constants for Dasha calculation
DAYS_IN_DASHA_YEAR = Decimal(360) # Standard Vedic Dasha year


def get_timezone_name(lat, lon):
    tf = TimezoneFinder()
    return tf.timezone_at(lat=lat, lng=lon)


def get_julian_day(dt_utc):
    # swe.julday expects time as decimal hours
    return swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, dt_utc.hour + dt_utc.minute / Decimal(60.0))


def get_moon_position(jd):
    # swe.calc_ut returns a tuple, we need the longitude which is the first element
    return Decimal(swe.calc_ut(jd, swe.MOON)[0][0])


def dms_to_decimal(degree: int, minute: int, second: int) -> Decimal:
    """
    Converts degrees, minutes, and seconds to a decimal degree value.
    """
    return Decimal(degree) + Decimal(minute) / Decimal(60) + Decimal(second) / Decimal(3600)

def get_absolute_moon_degree(sign_index: int, deg_in_sign: Decimal) -> Decimal:
    """
    Calculates the absolute degree of the Moon (from 0 Aries) given its sign index and degree within the sign.
    """
    return Decimal(sign_index) * Decimal(30) + deg_in_sign


def get_moon_nakshatra_and_lord(moon_deg):
    # Ensure moon_deg is Decimal for consistent calculations
    moon_deg_decimal = Decimal(moon_deg)

    # Calculate Nakshatra number (0-26)
    nakshatra_num_zero_indexed = int(moon_deg_decimal // NAKSHATRA_SPAN)
    
    # Determine Nakshatra Lord index (0-8)
    nakshatra_lord_index = nakshatra_num_zero_indexed % 9
    lord = NAKSHATRA_LORDS[nakshatra_lord_index]

    # Calculate degree covered within the current Nakshatra
    nakshatra_deg_covered = moon_deg_decimal % NAKSHATRA_SPAN
    
    # Calculate balance of the Dasha (remaining fraction)
    balance_fraction = (NAKSHATRA_SPAN - nakshatra_deg_covered) / NAKSHATRA_SPAN
    
    return nakshatra_num_zero_indexed + 1, lord, balance_fraction


def get_vimshottari_dasha_durations(start_lord, balance_fraction):
    """
    Calculates the durations of each Dasha period in years.
    The first Dasha's duration is the balance of its full period.
    """
    dasha_durations = []
    start_index = NAKSHATRA_LORDS.index(start_lord)

    for i in range(9):
        lord = NAKSHATRA_LORDS[(start_index + i) % 9]
        total_lord_years = Decimal(DASHA_YEARS[lord])
        
        if i == 0: # This is the starting Dasha
            duration = total_lord_years * balance_fraction
        else: # Subsequent Dashas run for their full period
            duration = total_lord_years
        
        dasha_durations.append((lord, duration))
    return dasha_durations


def vimshottari_from_birth(birth_date_str, birth_time_str, lat, lon, 
                           moon_abs_deg_override=None, nakshatra_lord_override=None):
    """
    Calculates and returns the Vimshottari Dasha periods (Mahadasha)
    with precise start and end dates based on birth details.

    Args:
        birth_date_str (str): Date of Birth in "YYYY-MM-DD" format.
        birth_time_str (str): Time of Birth in "HH:MM" format.
        lat (float): Latitude of birth place.
        lon (float): Longitude of birth place.
        moon_abs_deg_override (Decimal, optional): Override Moon's absolute degree.
                                                  If provided, swisseph is bypassed for Moon position.
        nakshatra_lord_override (str, optional): Override Moon's Nakshatra Lord.
                                                If provided, swisseph is bypassed for Nakshatra Lord.

    Returns:
        dict: A dictionary containing Moon's details and a list of Dasha periods.
    """
    # Combine date and time to a naive datetime object
    dt_naive = datetime.strptime(f"{birth_date_str} {birth_time_str}", "%Y-%m-%d %H:%M")
    
    # Get timezone and localize the birth datetime
    tz_name = get_timezone_name(lat, lon)
    if not tz_name:
        raise ValueError("Could not determine timezone for the given coordinates.")
    tz = timezone(tz_name)
    dt_local = tz.localize(dt_naive)
    dt_utc = dt_local.astimezone(timezone('UTC'))

    if moon_abs_deg_override is not None and nakshatra_lord_override is not None:
        moon_deg = Decimal(moon_abs_deg_override)
        nakshatra_num, derived_nakshatra_lord, balance_fraction = get_moon_nakshatra_and_lord(moon_deg)
        nakshatra_lord = nakshatra_lord_override # Prioritize user's explicit override
        # Optional: Add a warning if derived lord doesn't match override
        if derived_nakshatra_lord != nakshatra_lord_override:
            print(f"Warning: Derived Nakshatra Lord '{derived_nakshatra_lord}' for Moon degree {moon_deg} does not match provided Lord '{nakshatra_lord_override}'. Using provided Lord.")
    else:
        # Original swisseph calculation
        jd = get_julian_day(dt_utc)
        moon_deg = get_moon_position(jd)
        nakshatra_num, nakshatra_lord, balance_fraction = get_moon_nakshatra_and_lord(moon_deg)
    
    # Get the Dasha sequence with calculated durations (in years)
    dasha_durations = get_vimshottari_dasha_durations(nakshatra_lord, balance_fraction)

    # Calculate start and end dates for each Dasha period
    dasha_periods_with_dates = []
    current_start_date = dt_local # Start from the local birth date and time

    for i, (lord, duration_years) in enumerate(dasha_durations):
        # Convert Dasha years to days using the 360-day Vedic year
        # Corrected: Use decimal.ROUND_HALF_UP instead of Decimal(ROUND_HALF_UP)
        duration_days = int((duration_years * DAYS_IN_DASHA_YEAR).quantize(Decimal('1.'), rounding=decimal.ROUND_HALF_UP))
        
        # Calculate end date by adding days
        # Subtract 1 microsecond to represent the end of the day before the next Dasha starts
        end_date = current_start_date + timedelta(days=duration_days) - timedelta(microseconds=1) 

        dasha_periods_with_dates.append({
            "Mahadasha": lord,
            "Start": current_start_date.strftime("%d-%b-%Y"),
            "End": end_date.strftime("%d-%b-%Y")
        })
        
        # The next Dasha starts on the day after the current one ends
        current_start_date = end_date + timedelta(microseconds=1)


    return {
        "Moon Longitude": f"{moon_deg:.4f}°",
        "Nakshatra Info": f"Nakshatra #{nakshatra_num}, Lord: {nakshatra_lord}, Balance left: {balance_fraction * 100:.2f}%",
        "Vimshottari Dasha Periods": dasha_periods_with_dates
    }


# Example Usage
if __name__ == "__main__":
    print("\n" + "="*40 + "\n")

    # Example 2: Using your provided precise Moon position and Nakshatra Lord override
    # This will calculate Dashas based on your explicit astrological input.
    print("--- Vimshottari Dasha Calculation (Using provided Moon position and Lord) ---")
    DOB_user = "2004-07-14"
    TOB_user = "07:15"
    D_user, M_user, S_user = 20, 50, 53
    SIGN_INDEX_user = 1 # Taurus (0=Aries, 1=Taurus, ...)
    MOON_NAKSHATRA_LORD_user = "Moon"

    # Convert user's D, M, S, SIGN_INDEX to absolute decimal degree
    deg_in_sign_user = dms_to_decimal(D_user, M_user, S_user)
    moon_abs_deg_user = get_absolute_moon_degree(SIGN_INDEX_user, deg_in_sign_user)

    # Use a dummy latitude/longitude as swisseph won't be used for Moon position
    # but timezone is still needed for localizing the birth time.
    dummy_lat = 21.1702
    dummy_lon = 72.8311

    try:
        result_2 = vimshottari_from_birth(
            DOB_user, TOB_user, dummy_lat, dummy_lon,
            moon_abs_deg_override=moon_abs_deg_user,
            nakshatra_lord_override=MOON_NAKSHATRA_LORD_user
        )
        print(f"Moon Longitude (Provided): {result_2['Moon Longitude']}")
        print(f"Nakshatra Info (Using Provided Lord): {result_2['Nakshatra Info']}")
        print("\nMahadasha Periods:")
        print(f"{'Mahadasha':<10} {'Start':<15} {'End':<15}")
        for period in result_2["Vimshottari Dasha Periods"]:
            print(f"{period['Mahadasha']:<10} {period['Start']:<15} {period['End']:<15}")

    except Exception as e:
        print(f"An error occurred: {e}")
