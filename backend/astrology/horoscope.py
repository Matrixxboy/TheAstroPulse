import requests
from bs4 import BeautifulSoup
from datetime import datetime, date

# --- 1. Zodiac Sign Mapping (Detailed for Date Calculation) ---
def get_zodiac_mapping_detailed():
    """
    Returns a dictionary containing zodiac sign details with date ranges.
    This is used to determine the zodiac sign from a given date.
    """
    zodiac_signs = {
        "Aries": {"start_month": 3, "start_day": 21, "end_month": 4, "end_day": 19},
        "Taurus": {"start_month": 4, "start_day": 20, "end_month": 5, "end_day": 20},
        "Gemini": {"start_month": 5, "start_day": 21, "end_month": 6, "end_day": 20},
        "Cancer": {"start_month": 6, "start_day": 21, "end_month": 7, "end_day": 22},
        "Leo": {"start_month": 7, "start_day": 23, "end_month": 8, "end_day": 22},
        "Virgo": {"start_month": 8, "start_day": 23, "end_month": 9, "end_day": 22},
        "Libra": {"start_month": 9, "start_day": 23, "end_month": 10, "end_day": 22},
        "Scorpio": {"start_month": 10, "start_day": 23, "end_month": 11, "end_day": 21},
        "Sagittarius": {"start_month": 11, "start_day": 22, "end_month": 12, "end_day": 21},
        "Capricorn": {"start_month": 12, "start_day": 22, "end_month": 1, "end_day": 19}, # Spans across year end
        "Aquarius": {"start_month": 1, "start_day": 20, "end_month": 2, "end_day": 18},
        "Pisces": {"start_month": 2, "start_day": 19, "end_month": 3, "end_day": 20},
    }
    return zodiac_signs

# --- 2. Zodiac Name to Number Mapping (for horoscope.com URL) ---
# This maps the canonical zodiac sign name to the number used in horoscope.com URLs.
zodiac_name_to_number_mapping = {
    "Aries": 1,
    "Taurus": 2,
    "Gemini": 3,
    "Cancer": 4,
    "Leo": 5,
    "Virgo": 6,
    "Libra": 7,
    "Scorpio": 8,
    "Sagittarius": 9,
    "Capricorn": 10,
    "Aquarius": 11,
    "Pisces": 12,
}

# --- 3. Function to Determine Zodiac Sign from Date of Birth ---
def get_zodiac_sign(dob: date) -> str | None:
    """
    Determines the zodiac sign based on a given date of birth.

    Args:
        dob (datetime.date): The date of birth.

    Returns:
        str | None: The name of the zodiac sign (e.g., "Aries") or None if not found.
    """
    detailed_mapping = get_zodiac_mapping_detailed()
    
    # Special handling for Capricorn as its date range spans across year end
    if (dob.month == 12 and dob.day >= 22) or \
       (dob.month == 1 and dob.day <= 19):
        return "Capricorn"

    for sign_name, details in detailed_mapping.items():
        # Create dummy dates for comparison in a single year (e.g., 2000)
        # This simplifies comparison for signs that don't cross December-January.
        start_date = date(2000, details['start_month'], details['start_day'])
        end_date = date(2000, details['end_month'], details['end_day'])
        current_date_for_comparison = date(2000, dob.month, dob.day)

        if start_date <= current_date_for_comparison <= end_date:
            return sign_name
    
    return None # Should not happen if all signs are covered

# --- 4. Main Horoscope Fetching Function ---
def fetch_horoscope(dob_str: str, day_type: str = "today") -> str | None:
    """
    Fetches the horoscope for a given date of birth and day type from horoscope.com.

    Args:
        dob_str (str): The date of birth in 'YYYY-MM-DD' format.
        day_type (str): The type of horoscope to fetch (e.g., "today", "yesterday", "tomorrow").
                        Defaults to "today".

    Returns:
        str | None: The scraped horoscope text if successful, otherwise None.
    """
    try:
        dob = datetime.strptime(dob_str, "%Y-%m-%d").date() # Convert to date object
    except ValueError as e:
        print(f"Error parsing date of birth '{dob_str}': {e}. Please use YYYY-MM-DD format.")
        return None
    
    # Get the zodiac sign
    zodiac_sign = get_zodiac_sign(dob)
    if not zodiac_sign:
        print(f"Could not determine zodiac sign for DOB: {dob_str}")
        return None
    
    # Get the sign number for the URL
    sign_number = zodiac_name_to_number_mapping.get(zodiac_sign)
    if sign_number is None:
        print(f"Error: No sign number found for zodiac sign '{zodiac_sign}'.")
        return None
    
    # Construct the URL for horoscope.com
    # Example URL: https://www.horoscope.com/us/horoscopes/general/horoscope-general-daily-today.aspx?sign=1
    url = f"https://www.horoscope.com/us/horoscopes/general/horoscope-general-daily-{day_type.lower()}.aspx?sign={sign_number}"
    
    print(f"Attempting to scrape: {url}")

    try:
        # Fetch the web page content
        response = requests.get(url, timeout=15)
        response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)

        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')

        # --- IMPORTANT: HTML Structure for Horoscope.com ---
        # The daily horoscope text on horoscope.com is typically found within
        # <div class="personal-horoscope__text"> and its child <p> tags.
        # This selector needs to be accurate and might change if the website updates.
        
        horoscope_container = soup.find('div', class_='main-horoscope')
        
        if horoscope_container:
            # Extract text from all <p> tags within the container, joining the
            # Check if the extracted text is not empty
            print(f"Successfully scraped horoscope for {zodiac_sign} ({day_type}).")
            return horoscope_container.p.get_text(strip=True)
            
        else:
            print(f"Found container but no text within for {zodiac_sign} ({day_type}).")
            print(f"Could not find horoscope content container for {zodiac_sign} ({day_type}) on {url}.")
            print("Please check the website's HTML structure for changes (e.g., class names).")
            return None

    except requests.exceptions.RequestException as e:
        print(f"Network error or invalid URL '{url}': {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred during scraping: {e}")
        return None

if __name__ == '__main__':
    # --- Example Usage ---
    
    print("--- Testing Horoscope Fetcher ---")

    # Example 1: Fetch today's horoscope for a specific DOB (Aries)
    dob1 = "2004-07-14" # Aries
    print(f"\nFetching today's horoscope for DOB: {dob1}")
    horoscope1 = fetch_horoscope(dob1, "today")
    if horoscope1:
        print(f"Horoscope for Aries (Today):\n{horoscope1[:300]}...") # Print first 300 chars
    else:
        print("Failed to fetch horoscope 1.")