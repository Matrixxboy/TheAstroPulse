import swisseph as swe
from geopy.geocoders import Nominatim ,Photon
from timezonefinder import TimezoneFinder
import pytz
from datetime import datetime, timedelta

# --- Configuration ---
try:
    swe.set_ephe_path('ephe') # Try relative path first
except Exception as e:
    print(f"Error setting ephemeris path to 'ephe': {e}")
    print("Please set swe.set_ephe_path('FULL_PATH_TO_YOUR_SWEPH_EPHE_FOLDER') manually.")

# --- Global Data / Constants ---
RASHI_NAMES = [
    "Aries (Mesha)", "Taurus (Vrishabha)", "Gemini (Mithuna)", "Cancer (Karka)",
    "Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrishchika)",
    "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Meena)"
]

NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
    "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
    "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
]

TITHI_NAMES = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami",
    "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
    "Purnima", # Full Moon (Shukla Paksha 15th)
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami",
    "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
    "Amavasya" # New Moon (Krishna Paksha 15th)
]
PAKSHA_NAMES = ["Shukla Paksha (Waxing)", "Krishna Paksha (Waning)"]

CHARA_KARANS = ["Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti"]
STHIRA_KARANS = ["Shakuni", "Chatushpada", "Naga", "Kimstughna"]

YOGA_NAMES = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma",
    "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
    "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha",
    "Shukla", "Brahma", "Indra", "Vaidhriti"
]

DASH_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
DASH_YEARS = {"Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17}

NAKSHATRA_SPAN_DEG = 13 + (20/60) # 13 degrees 20 minutes
PADA_SPAN_DEG = NAKSHATRA_SPAN_DEG / 4 # 3 degrees 20 minutes

# --- Avakhada Lookup Tables ---

# Varna (based on Nakshatra Index 0-26) - CORRECTED
VARNA_MAPPING_NAKSHATRA = [
    "Vaishya", "Shudra", "Vaishya", "Shudra", "Mleccha", "Mleccha", "Brahmin", "Shudra", "Mleccha", # Ashwini to Ashlesha
    "Shudra", "Shudra", "Vaishya", "Vaishya", "Brahmin", "Mleccha", "Mleccha", "Brahmin", "Shudra", # Magha to Jyeshtha
    "Mleccha", "Mleccha", "Vaishya", "Shudra", "Mleccha", "Brahmin", "Mleccha", "Mleccha", "Vaishya" # Mula to Revati
    # Note: "Mleccha" is sometimes used for a mixed category or outside the traditional four.
    # More common mappings group some differently, but this is one standard interpretation.
    # For a strictly 4-varna mapping (Brahmin, Kshatriya, Vaishya, Shudra):
    # Ashwini: Vaishya, Bharani: Shudra, Krittika: Vaishya, Rohini: Shudra, Mrigashira: Shudra, Ardra: Shudra,
    # Punarvasu: Brahmin, Pushya: Shudra, Ashlesha: Shudra, Magha: Shudra, P. Phalguni: Kshatriya, U. Phalguni: Kshatriya,
    # Hasta: Vaishya, Chitra: Shudra, Swati: Vaishya, Vishakha: Kshatriya, Anuradha: Shudra, Jyeshtha: Shudra,
    # Mula: Shudra, P. Ashadha: Shudra, U. Ashadha: Kshatriya, Shravana: Shudra, Dhanishtha: Shudra, Shatabhisha: Shudra,
    # P. Bhadrapada: Shudra, U. Bhadrapada: Shudra, Revati: Vaishya.
    # I'll use a more common 4-varna mapping to be precise for the user's request.

    # Revised VARNA_MAPPING_NAKSHATRA for traditional 4 Varnas:
    # Source: Many traditional texts, e.g., Brihat Parashara Hora Shastra interpretations.
    "Vaishya",   # Ashwini
    "Shudra",    # Bharani
    "Vaishya",   # Krittika
    "Shudra",    # Rohini
    "Shudra",    # Mrigashira
    "Shudra",    # Ardra
    "Brahmin",   # Punarvasu
    "Shudra",    # Pushya
    "Shudra",    # Ashlesha
    "Shudra",    # Magha
    "Kshatriya", # Purva Phalguni
    "Kshatriya", # Uttara Phalguni
    "Vaishya",   # Hasta
    "Shudra",    # Chitra
    "Vaishya",   # Swati
    "Kshatriya", # Vishakha
    "Shudra",    # Anuradha
    "Shudra",    # Jyeshtha
    "Shudra",    # Mula
    "Shudra",    # Purva Ashadha
    "Kshatriya", # Uttara Ashadha
    "Shudra",    # Shravana
    "Shudra",    # Dhanishtha
    "Shudra",    # Shatabhisha
    "Shudra",    # Purva Bhadrapada
    "Shudra",    # Uttara Bhadrapada
    "Vaishya"    # Revati
]


# Vashya (based on Moon Rashi) - This mapping is generally correct.
VASHYA_MAPPING = {
    "Aries (Mesha)": "Chatushpada (Quadruped)",
    "Taurus (Vrishabha)": "Chatushpada (Quadruped)",
    "Gemini (Mithuna)": "Dwipada (Human)",
    "Cancer (Karka)": "Jalchar (Aquatic)",
    "Leo (Simha)": "Vanachar (Forest Dweller)",
    "Virgo (Kanya)": "Dwipada (Human)",
    "Libra (Tula)": "Dwipada (Human)",
    "Scorpio (Vrishchika)": "Keet (Insect)",
    "Sagittarius (Dhanu)": "Chatushpada (Quadruped)", # Can be Dwipada for last half, simplified here
    "Capricorn (Makara)": "Jalchar (Aquatic)", # Can be Chatushpada for last half, simplified here
    "Aquarius (Kumbha)": "Dwipada (Human)",
    "Pisces (Meena)": "Jalchar (Aquatic)"
}

# Yoni (based on Nakshatra Index 0-26) - This mapping is generally correct for the 14 animals.
# The list cycles through the 14 Yonis.
YONI_MAPPING = [
    "Ashwa (Horse)",    # Ashwini
    "Gaja (Elephant)",  # Bharani
    "Mesha (Sheep)",    # Krittika
    "Sarpa (Serpent)",  # Rohini
    "Mriga (Deer)",     # Mrigashira
    "Shwaan (Dog)",     # Ardra
    "Marjara (Cat)",    # Punarvasu
    "Mushaka (Mouse)",  # Pushya
    "Simha (Lion)",     # Ashlesha
    "Mahisha (Buffalo)",# Magha
    "Vyaghra (Tiger)",  # Purva Phalguni
    "Vanara (Monkey)",  # Uttara Phalguni
    "Nakula (Mongoose)",# Hasta
    "Vyaghra (Tiger)",  # Chitra (Repeats)
    "Mahisha (Buffalo)",# Swati (Repeats)
    "Mriga (Deer)",     # Vishakha (Repeats)
    "Shwaan (Dog)",     # Anuradha (Repeats)
    "Gaja (Elephant)",  # Jyeshtha (Repeats)
    "Ashwa (Horse)",    # Mula (Repeats)
    "Marjara (Cat)",    # Purva Ashadha (Repeats)
    "Nakula (Mongoose)",# Uttara Ashadha (Repeats)
    "Vanara (Monkey)",  # Shravana (Repeats)
    "Simha (Lion)",     # Dhanishtha (Repeats)
    "Sarpa (Serpent)",  # Shatabhisha (Repeats)
    "Mesha (Sheep)",    # Purva Bhadrapada (Repeats)
    "Mushaka (Mouse)",  # Uttara Bhadrapada (Repeats)
    "Gaja (Elephant)"   # Revati (Repeats - assuming same as Jyeshtha for some classifications)
]

# Gan (based on Nakshatra Index 0-26) - Correct.
GAN_NAKSHATRA_MAP = [
    "Deva", "Manushya", "Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Deva", "Manushya", "Manushya",
    "Manushya", "Rakshasa", "Deva", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Deva", "Manushya", "Rakshasa",
    "Manushya", "Deva", "Manushya", "Rakshasa", "Manushya", "Rakshasa", "Deva"
]

# Nadi (based on Nakshatra Index 0-26) - Correct.
# adhi = adhya
# madhya = madhya
# anya = antya
NADI_NAKSHATRA_MAP = [
    "Adya (Vata)", "Madhya (Pitta)", "Antya (Kapha)", "Antya (Kapha)", "Madhya (Pitta)", "Adya (Vata)",
    "Antya (Kapha)", "Madhya (Pitta)", "Adya (Vata)", "Antya (Kapha)", "Madhya (Pitta)", "Adya (Vata)",
    "Antya (Kapha)", "Madhya (Pitta)", "Adya (Vata)", "Antya (Kapha)", "Madhya (Pitta)", "Adya (Vata)",
    "Antya (Kapha)", "Madhya (Pitta)", "Adya (Vata)", "Antya (Kapha)", "Madhya (Pitta)", "Adya (Vata)",
    "Antya (Kapha)", "Madhya (Pitta)", "Adya (Vata)"
]

# Sign Lord (based on Rashi Name) - Correct.
SIGN_LORD_MAPPING = {
    "Aries (Mesha)": "Mars (Mangal)",
    "Taurus (Vrishabha)": "Venus (Shukra)",
    "Gemini (Mithuna)": "Mercury (Buddha)",
    "Cancer (Karka)": "Moon (Chandra)",
    "Leo (Simha)": "Sun (Surya)",
    "Virgo (Kanya)": "Mercury (Buddha)",
    "Libra (Tula)": "Venus (Shukra)",
    "Scorpio (Vrishchika)": "Mars (Mangal)",
    "Sagittarius (Dhanu)": "Jupiter (Guru)",
    "Capricorn (Makara)": "Saturn (Shani)",
    "Aquarius (Kumbha)": "Saturn (Shani)",
    "Pisces (Meena)": "Jupiter (Guru)"
}

# Tatva (Elements based on Rashi) - Correct.
TATVA_MAPPING = {
    "Aries (Mesha)": "Agni (Fire)", 
    "Leo (Simha)": "Agni (Fire)", 
    "Sagittarius (Dhanu)": "Agni (Fire)",
    "Taurus (Vrishabha)": "Prithvi (Earth)", 
    "Virgo (Kanya)": "Prithvi (Earth)", 
    "Capricorn (Makara)": "Prithvi (Earth)",
    "Gemini (Mithuna)": "Vayu (Air)", 
    "Libra (Tula)": "Vayu (Air)", 
    "Aquarius (Kumbha)": "Vayu (Air)",
    "Cancer (Karka)": "Jala (Water)", 
    "Scorpio (Vrishchika)": "Jala (Water)", 
    "Pisces (Meena)": "Jala (Water)"
}

# Paya (based on Nakshatra group) - Correct.
PAYA_NAKSHATRA_MAP = [
    "Swarna (Gold)", 
    "Rajata (Silver)", 
    "Tamra (Copper)", 
    "Loha (Iron)", 
    "Rajata (Silver)", 
    "Tamra (Copper)",
    "Rajata (Silver)", 
    "Tamra (Copper)", 
    "Swarna (Gold)", 
    "Rajata (Silver)", 
    "Tamra (Copper)", 
    "Loha (Iron)",
    "Rajata (Silver)", 
    "Tamra (Copper)", 
    "Swarna (Gold)", 
    "Loha (Iron)", 
    "Tamra (Copper)", 
    "Rajata (Silver)",
    "Loha (Iron)", 
    "Tamra (Copper)", 
    "Rajata (Silver)", 
    "Tamra (Copper)", 
    "Loha (Iron)", 
    "Swarna (Gold)",
    "Swarna (Gold)", 
    "Rajata (Silver)", 
    "Loha (Iron)"
]


# --- Helper Functions ---

def format_longitude_to_dms(longitude_deg):
    """Converts total degrees (0-360) to Zodiac Sign, Degree, Minute, Second format."""
    total_degrees = longitude_deg % 360 

    sign_index_0based = int(total_degrees / 30)
    degrees_in_sign_decimal = total_degrees % 30

    degrees = int(degrees_in_sign_decimal)
    minutes_decimal = (degrees_in_sign_decimal - degrees) * 60
    minutes = int(minutes_decimal)
    seconds = int((minutes_decimal - minutes) * 60)

    sign_name = RASHI_NAMES[sign_index_0based]
    
    return f"{degrees}° {minutes}' {seconds}\" {sign_name.split(' ')[0]}"

def get_nakshatra_info(moon_long_sidereal):
    """Determines Nakshatra number, name, and Pada from Moon's sidereal longitude."""
    moon_long_sidereal = moon_long_sidereal % 360
    
    nak_index = int(moon_long_sidereal / NAKSHATRA_SPAN_DEG) 
    
    nakshatra_remainder_deg = moon_long_sidereal % NAKSHATRA_SPAN_DEG
    pada_index = int(nakshatra_remainder_deg / PADA_SPAN_DEG) 
    
    nakshatra_num = nak_index + 1 
    nakshatra_name = NAKSHATRA_NAMES[nak_index]
    pada_num = pada_index + 1 
    
    return nak_index, nakshatra_num, nakshatra_name, pada_num 

def get_rashi_from_nakshatra_pada(nakshatra_num, pada_num):
    """Determines the Vedic Moon sign (Chandra Rashi) based on Nakshatra number and Pada."""
    if not (1 <= nakshatra_num <= 27) or not (1 <= pada_num <= 4):
        return "Invalid Input: Nakshatra number must be 1-27, Pada 1-4."

    total_pada_index = (nakshatra_num - 1) * 4 + (pada_num - 1)
    rashi_index = total_pada_index // 9

    if 0 <= rashi_index < 12:
        return RASHI_NAMES[rashi_index]
    else:
        return "Error in calculation"


# need to be correct as per the Indian Astrology
def calculate_vimshottari_dasha(moon_long_sidereal, dob_datetime_obj): 
    """
    Calculates the Vimshottari Mahadasha sequence.
    Args:
        moon_long_sidereal (float): Moon's sidereal longitude at birth.
        dob_datetime_obj (datetime.datetime): UTC datetime object of birth.
    Returns:
        tuple: (current_dasha_lord, years_left_in_current_dasha, full_dasha_sequence)
    """
    moon_long_sidereal = moon_long_sidereal % 360

    nakshatra_deg_span = 360 / 27 
    nak_index = int(moon_long_sidereal // nakshatra_deg_span) 
    
    current_dasha_lord = DASH_ORDER[nak_index % 9]
    
    deg_into_nakshatra = moon_long_sidereal % nakshatra_deg_span
    deg_remaining_in_nakshatra = nakshatra_deg_span - deg_into_nakshatra
    
    percent_remaining_in_nakshatra = deg_remaining_in_nakshatra / nakshatra_deg_span
    
    total_years_of_current_dasha = DASH_YEARS[current_dasha_lord]
    
    years_left_in_current_dasha = percent_remaining_in_nakshatra * total_years_of_current_dasha
    
    years_passed_in_current_dasha = total_years_of_current_dasha - years_left_in_current_dasha
    
    start_date_current_mahadasha = dob_datetime_obj - timedelta(days=years_passed_in_current_dasha * 365.25)

    sequence = []
    start_idx = DASH_ORDER.index(current_dasha_lord)
    
    current_cycle_start_date = start_date_current_mahadasha
    
    for i in range(9): # Generate one full cycle of 9 dashas
        dasha_lord = DASH_ORDER[(start_idx + i) % 9]
        years = DASH_YEARS[dasha_lord]
        dasha_end_date = current_cycle_start_date + timedelta(days=years * 365.25)
        sequence.append((dasha_lord, current_cycle_start_date.date(), dasha_end_date.date()))
        current_cycle_start_date = dasha_end_date
        
    return current_dasha_lord, years_left_in_current_dasha, sequence

#Karna finnding logic (no need to change working properly)
def get_karan(moon_long_sidereal, sun_long_sidereal):
    """
    Calculates the Karan based on the current Tithi number and whether it's the first or second half.
    There are 60 karans in a lunar month. Kimstughna appears at the start of Shukla Pratipada
    and again at the end of Krishna Chaturdashi/Amavasya.
    The 7 movable karans (Bava, Balava, Kaulava, Taitila, Garija, Vanija, Vishti) repeat 8 times.
    The 4 fixed karans (Shakuni, Chatushpada, Naga, Kimstughna) appear once each at specific points.
    """
    phase_angle = (moon_long_sidereal - sun_long_sidereal + 360) % 360
    
    karan_index_in_cycle = int(phase_angle / 6.0) 
    
    if karan_index_in_cycle == 0:
        return STHIRA_KARANS[3] # Kimstughna (initial)
    elif 1 <= karan_index_in_cycle <= 56: # 7 movable karans repeat 8 times
        return CHARA_KARANS[(karan_index_in_cycle - 1) % 7]
    elif karan_index_in_cycle == 57:
        return STHIRA_KARANS[0] # Shakuni
    elif karan_index_in_cycle == 58:
        return STHIRA_KARANS[1] # Chatushpada
    elif karan_index_in_cycle == 59:
        return STHIRA_KARANS[2] # Naga 
    else:
        return "N/A" 


def get_yoga(sun_long_sidereal, moon_long_sidereal):
    """Calculates the Yoga based on sum of Sun's and Moon's longitudes."""
    yoga_longitude_total = (sun_long_sidereal + moon_long_sidereal) % 360
    
    yoga_index = int(yoga_longitude_total / NAKSHATRA_SPAN_DEG) 
    
    if 0 <= yoga_index < 27:
        return YOGA_NAMES[yoga_index]
    else:
        return "N/A" 

def get_vara_tithi_karan_yoga(jd_ut, sun_long_sidereal, moon_long_sidereal):
    """Calculates Vara (Weekday), Tithi, Karan, and Yoga."""
    
    # Vara (Weekday)
    revjul_result = swe.revjul(jd_ut)
    
    year, month, day, hour = 0, 0, 0, 0 
    minute, second = 0, 0 

    if len(revjul_result) == 7: 
        year, month, day, hour, minute, second, swe_weekday_num = revjul_result
    elif len(revjul_result) == 4: 
        year, month, day, hour = revjul_result
        swe_weekday_num = 0 
    else:
        print(f"Warning: swe.revjul returned {len(revjul_result)} values. Expected 4 or 7. Cannot reliably determine weekday.")
        swe_weekday_num = 0 
        
    try:
        dt_utc_for_vara = datetime(int(year), int(month), int(day), int(hour), int(minute), int(second), tzinfo=pytz.utc)
        python_weekday = dt_utc_for_vara.weekday() 
        vara_index = (python_weekday + 1) % 7 
    except ValueError as e:
        print(f"Error converting Julian Day to datetime for weekday calculation: {e}. Defaulting to Sunday.")
        vara_index = 0 

    vara_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    vara = vara_names[vara_index]
    
    # Tithi 
    phase_angle = (moon_long_sidereal - sun_long_sidereal + 360) % 360
    tithi_index_raw = int(phase_angle / 12) 
    
    paksha = ""
    tithi_name = ""
    
    if tithi_index_raw < 15: 
        paksha = PAKSHA_NAMES[0]
        tithi_name = TITHI_NAMES[tithi_index_raw]
    else:
        paksha = PAKSHA_NAMES[1]
        tithi_name = TITHI_NAMES[tithi_index_raw % 15] 
        
    # Karan
    karan = get_karan(moon_long_sidereal, sun_long_sidereal)

    # Yoga
    yoga = get_yoga(sun_long_sidereal, moon_long_sidereal)

    return vara, tithi_name, paksha, karan, yoga

def get_avakhada_details(nakshatra_idx, moon_rashi_name, nakshatra_pada, yoga_name, karan_name, tithi_name_str):
    """
    Calculates Avakhada details based on provided astrological data.
    Args:
        nakshatra_idx (int): 0-based index of the Moon Nakshatra.
        moon_rashi_name (str): The name of the Moon Sign (Chandra Rashi).
        nakshatra_pada (int): The 1-based Nakshatra Pada.
        yoga_name (str): The calculated Yoga name.
        karan_name (str): The calculated Karan name.
        tithi_name_str (str): The calculated Tithi name string (e.g., "Pratipada (Shukla Paksha)").
    Returns:
        dict: A dictionary containing all Avakhada details.
    """
    avakhada = {}

    # Varna (based on Nakshatra Index) - CORRECTED
    if 0 <= nakshatra_idx < len(VARNA_MAPPING_NAKSHATRA):
        avakhada["Varna"] = VARNA_MAPPING_NAKSHATRA[nakshatra_idx]
    else:
        avakhada["Varna"] = "N/A"

    avakhada["Vashya"] = VASHYA_MAPPING.get(moon_rashi_name, "N/A")

    # Yoni (based on Nakshatra Index)
    if 0 <= nakshatra_idx < len(YONI_MAPPING):
        avakhada["Yoni"] = YONI_MAPPING[nakshatra_idx]
    else:
        avakhada["Yoni"] = "N/A"

    # Gan (based on Nakshatra Index)
    if 0 <= nakshatra_idx < len(GAN_NAKSHATRA_MAP):
        avakhada["Gan"] = GAN_NAKSHATRA_MAP[nakshatra_idx]
    else:
        avakhada["Gan"] = "N/A"

    # Nadi (based on Nakshatra Index)
    if 0 <= nakshatra_idx < len(NADI_NAKSHATRA_MAP):
        avakhada["Nadi"] = NADI_NAKSHATRA_MAP[nakshatra_idx]
    else:
        avakhada["Nadi"] = "N/A"

    # Sign (Moon Sign)
    avakhada["Sign"] = moon_rashi_name

    # Sign Lord (of Moon Sign)
    avakhada["Sign Lord"] = SIGN_LORD_MAPPING.get(moon_rashi_name, "N/A")

    # Nakshatra Charan (Pada)
    avakhada["Nakshatra Charan (pada)"] = nakshatra_pada

    # Yoga, Karan, Tithi (Already calculated, just assign)
    avakhada["Yoga"] = yoga_name
    avakhada["Karan"] = karan_name
    avakhada["Tithi"] = tithi_name_str 

    # Yunja - REMOVED as it's typically synonymous with Yoni or not a distinct Avakhada element.
    # avakhada["Yunja"] = yoga_name # Removed

    # Tatva (Element based on Moon Rashi)
    avakhada["Tatva"] = TATVA_MAPPING.get(moon_rashi_name, "N/A")

    # Paya (based on Nakshatra Index)
    if 0 <= nakshatra_idx < len(PAYA_NAKSHATRA_MAP):
        avakhada["Paya"] = PAYA_NAKSHATRA_MAP[nakshatra_idx]
    else:
        avakhada["Paya"] = "N/A"

    return avakhada

# These can be more elaborate or mapped via nakshatra/rashi

def get_favorable_sign(nakshatra_name):
    return {
        "Ashwini": "Aries",
        "Bharani": "Aries",
        "Krittika": "Taurus",
        "Rohini": "Taurus",
        "Mrigashira": "Gemini",
        "Ardra": "Gemini",
        "Punarvasu": "Cancer",
        "Pushya": "Cancer",
        "Ashlesha": "Cancer",
        "Magha": "Leo",
        "Purva Phalguni": "Leo",
        "Uttara Phalguni": "Virgo",
        "Hasta": "Virgo",
        "Chitra": "Libra",
        "Swati": "Libra",
        "Vishakha": "Scorpio",
        "Anuradha": "Scorpio",
        "Jyeshtha": "Scorpio",
        "Mula": "Sagittarius",
        "Purva Ashadha": "Sagittarius",
        "Uttara Ashadha": "Capricorn",
        "Shravana": "Capricorn",
        "Dhanishta": "Aquarius",
        "Shatabhisha": "Aquarius",
        "Purva Bhadrapada": "Pisces",
        "Uttara Bhadrapada": "Pisces",
        "Revati": "Pisces"
    }.get(nakshatra_name, "Unknown")
def get_tara_name(nakshatra_name):
    return {
        "Ashwini": "Janma Tara",
        "Bharani": "Sampat tara",
        "Krittika": "Vipat Tara",
        "Rohini": "Kshema Tara",
        "Mrigashira": "Pratyari Tara",
        "Ardra": "Sadhaka Tara",
        "Punarvasu": "Vadha Tara",
        "Pushya": "Mitra Tara",
        "Ashlesha": "Ari Mitra Tara",
        "Magha":"Janma Tara" ,
        "Purva Phalguni":"Sampat tara" ,
        "Uttara Phalguni": "Vipat Tara",
        "Hasta":"Kshema Tara" ,
        "Chitra":"Pratyari Tara" ,
        "Swati": "Sadhaka Tara",
        "Vishakha":"Vadha Tara" ,
        "Anuradha": "Mitra Tara",
        "Jyeshtha": "Ati Mitra Tara",
        "Mula": "Janma Tara",
        "Purva Ashadha":"Sampat tara" ,
        "Uttara Ashadha":"Vipat Tara" ,
        "Shravana": "Kshema Tara",
        "Dhanishta":"Pratyari Tara" ,
        "Shatabhisha":"Sadhaka Tara" ,
        "Purva Bhadrapada": "Vadha Tara",
        "Uttara Bhadrapada": "Mitra Tara",
        "Revati":"Ati Mitra Tara" 
    }.get(nakshatra_name, "Unknown")


def get_favorable_alphabet(nakshatra_name, pada):
    nakshatra_syllables = {
       "Ashwini": ["Chu", "Che", "Cho", "La"],
        "Bharani": ["Lee", "Lu", "Le", "Lo"],
        "Krittika": ["A", "E", "U", "Ea"],
        "Rohini": ["O", "Va", "Vi", "Vu"],
        "Mrigashira": ["Ve", "Vo", "Ka", "Ki"],
        "Ardra": ["Ku", "Gha", "Na", "Chha"],
        "Punarvasu": ["Ke", "Ko", "Ha", "Hi"],
        "Pushya": ["Hu", "He", "Ho", "Da"],
        "Ashlesha": ["De", "Du", "Dee", "Do"],
        "Magha": ["Ma", "Me", "Mu", "Me"],
        "Purva Phalguni": ["Mo", "Ta", "Ti", "Tu"],
        "Uttara Phalguni": ["Te", "To", "Pa", "Pi"],
        "Hasta": ["Pu", "Sha", "Na", "Tha"],
        "Chitra": ["Pe", "Po", "Ra", "Re"],
        "Swati": ["Ru", "Re", "Ro", "Ta"],
        "Vishakha": ["Ti", "Tu", "Te", "To"],
        "Anuradha": ["Na", "Ni", "Nu", "Ne"],
        "Jyeshtha": ["No", "Ya", "Yi", "Yu"],
        "Mula": ["Ye", "Yo", "Ba", "Be"],
        "Purva Ashadha": ["Bhu", "Dha", "Pha", "Da"],
        "Uttara Ashadha": ["Be", "Bo", "Ja", "Ji"],
        "Shravana": ["Ju", "Je", "Jo", "Kha"],
        "Dhanishta": ["Ga", "Gi", "Gu", "Ge"],
        "Shatabhisha": ["Go", "Sa", "Si", "Su"],
        "Purva Bhadrapada": ["Se", "So", "Da", "Di"],
        "Uttara Bhadrapada": ["Du", "Tha", "Jha", "Na"],
        "Revati": ["De", "Do", "Cha", "Chi"]
    }
    return nakshatra_syllables.get(nakshatra_name, ["--"])[pada - 1]

def get_favorable_number(nakshatra_name):
    return {
        "Ashwini": 9,
        "Bharani": 8,
        "Krittika": 1,
        "Rohini": 6,
        "Mrigashira": 5,
        "Ardra": 4,
        "Punarvasu": 3,
        "Pushya": 4,
        "Ashlesha": 7,
        "Magha": 1,
        "Purva Phalguni": 6,
        "Uttara Phalguni": 5,
        "Hasta": 2,
        "Chitra": 3,
        "Swati": 5,
        "Vishakha": 9,
        "Anuradha": 8,
        "Jyeshtha": 7,
        "Mula": 7,
        "Purva Ashadha": 6,
        "Uttara Ashadha": 3,
        "Shravana": 2,
        "Dhanishta": 8,
        "Shatabhisha": 4,
        "Purva Bhadrapada": 7,
        "Uttara Bhadrapada": 6,
        "Revati": 3
    }.get(nakshatra_name, 5)

def get_favorable_date(nakshatra_name):
    return {
        "Ashwini": "9th, 18th, 27th",
        "Bharani": "8th, 17th, 26th",
        "Krittika": "1st, 10th, 19th, 28th",
        "Rohini": "6th, 15th, 24th",
        "Mrigashira": "5th, 14th, 23rd",
        "Ardra": "4th, 13th, 22nd",
        "Punarvasu": "3rd, 12th, 21st, 30th",
        "Pushya": "4th, 13th, 22nd",
        "Ashlesha": "7th, 16th, 25th",
        "Magha": "1st, 10th, 19th, 28th",
        "Purva Phalguni": "6th, 15th, 24th",
        "Uttara Phalguni": "5th, 14th, 23rd",
        "Hasta": "2nd, 11th, 20th, 29th",
        "Chitra": "3rd, 12th, 21st, 30th",
        "Swati": "5th, 14th, 23rd",
        "Vishakha": "9th, 18th, 27th",
        "Anuradha": "8th, 17th, 26th",
        "Jyeshtha": "7th, 16th, 25th",
        "Mula": "7th, 16th, 25th",
        "Purva Ashadha": "6th, 15th, 24th",
        "Uttara Ashadha": "3rd, 12th, 21st, 30th",
        "Shravana": "2nd, 11th, 20th, 29th",
        "Dhanishta": "8th, 17th, 26th",
        "Shatabhisha": "4th, 13th, 22nd",
        "Purva Bhadrapada": "7th, 16th, 25th",
        "Uttara Bhadrapada": "6th, 15th, 24th",
        "Revati": "3rd, 12th, 21st, 30th"
        }.get(nakshatra_name, "5th, 14th, 23rd")

def get_favorable_direction(rashi_name):
    return {
        "Aries (Mesha)": "East",
        "Taurus (Vrishabha)": "South",
        "Gemini (Mithuna)": "West",
        "Cancer (Karka)": "North",
        "Leo (Simha)": "East",
        "Virgo (Kanya)": "South",
        "Libra (Tula)": "West",
        "Scorpio (Vrishchika)": "North",
        "Sagittarius (Dhanu)": "East",
        "Capricorn (Makara)": "South",
        "Aquarius (Kumbha)": "West",
        "Pisces (Meena)": "North"
    }.get(rashi_name, "North-East")

def get_ruling_planet(nakshatra_name):
    ruling = {
        "Ashwini": "Ketu",
        "Bharani": "Venus",
        "Krittika": "Sun",
        "Rohini": "Moon",
        "Mrigashira": "Mars",
        "Ardra": "Rahu",
        "Punarvasu": "Jupiter",
        "Pushya": "Saturn",
        "Ashlesha": "Mercury",
        "Magha": "Ketu",
        "Purva Phalguni": "Venus",
        "Uttara Phalguni": "Sun",
        "Hasta": "Moon",
        "Chitra": "Mars",
        "Swati": "Rahu",
        "Vishakha": "Jupiter",
        "Anuradha": "Saturn",
        "Jyeshtha": "Mercury",
        "Mula": "Ketu",
        "Purva Ashadha": "Venus",
        "Uttara Ashadha": "Sun",
        "Shravana": "Moon",
        "Dhanishta": "Mars",
        "Shatabhisha": "Rahu",
        "Purva Bhadrapada": "Jupiter",
        "Uttara Bhadrapada": "Saturn",
        "Revati": "Mercury"
    }
    return ruling.get(nakshatra_name, "Unknown")

def get_deity(nakshatra_name):
    deities = {
        "Ashwini": "Ashwini Kumars (Twin Horsemen)",
        "Bharani": "Yama (God of Death)",
        "Krittika": "Agni (God of Fire)",
        "Rohini": "Brahma (Creator)",
        "Mrigashira": "Soma/Chandra (Moon God)",
        "Ardra": "Rudra (Fierce form of Shiva)",
        "Punarvasu": "Aditi (Mother of Gods)",
        "Pushya": "Brihaspati (Guru of Devas)",
        "Ashlesha": "Nagas (Serpent Deities)",
        "Magha": "Pitrs (Ancestors)",
        "Purva Phalguni": "Bhaga (God of Enjoyment)",
        "Uttara Phalguni": "Aryaman (God of Contracts/Alliances)",
        "Hasta": "Savitar (Sun God - Creative aspect)",
        "Chitra": "Tvashtar (Celestial Architect)",
        "Swati": "Vayu (God of Wind)",
        "Vishakha": "Indra and Agni (King of Gods and Fire)",
        "Anuradha": "Mitra (God of Friendship)",
        "Jyeshtha": "Indra (King of Gods)",
        "Mula": "Nirriti (Goddess of Destruction)",
        "Purva Ashadha": "Apah (Cosmic Waters)",
        "Uttara Ashadha": "Vishwadevas (Universal Gods)",
        "Shravana": "Vishnu (Preserver of the Universe)",
        "Dhanishta": "Vasu (8 Elemental Gods)",
        "Shatabhisha": "Varuna (God of Cosmic Waters & Truth)",
        "Purva Bhadrapada": "Aja Ekapada (One-Footed Goat/Storm Deity)",
        "Uttara Bhadrapada": "Ahir Budhnya (Serpent of the Deep Sea)",
        "Revati": "Pushan (Protector of Travelers and Herds)"
    }
    return deities.get(nakshatra_name, "Your Kuldevta")

def get_best_fast_day(ruling_planet):
    days = {
        "Sun": "Sunday",
        "Moon": "Monday",
        "Mars": "Tuesday",
        "Mercury": "Wednesday",
        "Jupiter": "Thursday",
        "Venus": "Friday",
        "Saturn": "Saturday",
        "Rahu": "Saturday",
        "Ketu": "Tuesday"
    }
    return days.get(ruling_planet, "Monday")

def get_mantra(ruling_planet):
    mantras = {
        "Sun": "ॐ सूर्याय नमः",
        "Moon": "ॐ सोमाय नमः",
        "Mars": "ॐ अंगारकाय नमः",
        "Mercury": "ॐ बुधाय नमः",
        "Jupiter": "ॐ गुरवे नमः",
        "Venus": "ॐ शुक्राय नमः",
        "Saturn": "ॐ शनैश्चराय नमः",
        "Rahu": "ॐ राहवे नमः",
        "Ketu": "ॐ केतवे नमः"
    }
    return mantras.get(ruling_planet, "ॐ नमः शिवाय")


def favorable_lists(nakshatra_name, nakshatra_pada, rashi_name):
    ruling = get_ruling_planet(nakshatra_name)
    return {
        "Favorable Sign": get_favorable_sign(nakshatra_name),
        "Favorable Alphabet": get_favorable_alphabet(nakshatra_name, nakshatra_pada),
        "Favorable Number": get_favorable_number(nakshatra_name),
        "Favorable Date": get_favorable_date(nakshatra_name),
        "Direction": get_favorable_direction(rashi_name),
        "Ruling Planet": ruling,
        "Deity to Pray": get_deity(nakshatra_name),
        "Best Fast Day": get_best_fast_day(ruling),
        "Mantra": get_mantra(ruling),
    }

# --- Main Calculation Logic ---
# ----- Input -----
DOB = "2004-07-14"
TOB = "07:15"
LOCATION = "surat ,Gujarat"

# ----- Get Geolocation -----
try:
    geolocator = Nominatim(user_agent="vedic_astrology_app", timeout=10)
    location = geolocator.geocode(LOCATION)
    if not location:
        raise Exception("Nominatim failed")
except Exception:
    geolocator = Photon(user_agent="vedic_astrology_app", timeout=10)
    location = geolocator.geocode(LOCATION)

if not location:
    raise ValueError(f"Could not find location for '{LOCATION}'")

lat, lon = location.latitude, location.longitude

# ----- Get Timezone and Local Time to UTC -----
tf = TimezoneFinder()
timezone_str = tf.timezone_at(lat=lat, lng=lon)
if not timezone_str:
    raise ValueError(f"Could not find timezone for Latitude: {lat}, Longitude: {lon}")
local_tz = pytz.timezone(timezone_str)

naive_dt = datetime.strptime(f"{DOB} {TOB}", "%Y-%m-%d %H:%M")
local_dt = local_tz.localize(naive_dt, is_dst=None)
utc_dt = local_dt.astimezone(pytz.utc)

# Calculate Julian Day for UTC time
jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day,
                utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0)

# --- Ayanamsa Setup ---
ayanamsa_flag_for_calc = 0 
ayanamsa_used_display = "Unknown / Default" 

try:
    if hasattr(swe, 'AYANAMSA_LAHIRI') and callable(getattr(swe, 'set_ayanamsa_arc', None)):
        swe.set_ayanamsa_arc(swe.AYANAMSA_LAHIRI)
        ayanamsa_used_display = "Lahiri (via swe.set_ayanamsa_arc)"
    else:
        print("\nWARNING: Modern Ayanamsa setting functions (swe.set_ayanamsa_arc, swe.AYANAMSA_LAHIRI) not found.")
        print("This indicates your pyswisseph version is outdated.")
        print("Attempting to use legacy Ayanamsa flag directly in swe.calc (assuming Lahiri = 2).")
        ayanamsa_flag_for_calc = 2 
        ayanamsa_used_display = "Lahiri (via legacy direct flag)"
except AttributeError as e:
    print(f"\nCRITICAL WARNING: Encountered AttributeError during Ayanamsa setup: {e}")
    print("Your pyswisseph library is severely outdated.")
    print("Please run: pip install --upgrade pyswisseph")
    print("If error persists after upgrade, verify your Python environment.")
    ayanamsa_flag_for_calc = 2 
    ayanamsa_used_display = "Lahiri (via forced legacy flag due to error)"


# ----- Ascendant and Houses -----
cusps, ascmc = swe.houses(jd, lat, lon, b'A') 
ascendant_long = ascmc[0] 
house_cusps_long = cusps 

# ----- Planet Positions (Sidereal) -----
planets_ids = {
    "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS, "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER, "Venus": swe.VENUS, "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE, "Ketu": swe.MEAN_NODE
}
planet_positions_sidereal = {} 

flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | ayanamsa_flag_for_calc | swe.FLG_NONUT 

for name, pid in planets_ids.items():
    if name == "Ketu":
        pos_rahu = swe.calc(jd, swe.MEAN_NODE, flags)[0]
        pos_ketu_lon = (pos_rahu[0] + 180) % 360 
        planet_positions_sidereal[name] = (pos_ketu_lon, pos_rahu[1], pos_rahu[2]) 
    else:
        pos = swe.calc(jd, pid, flags)[0] 
        planet_positions_sidereal[name] = pos

# ----- Panchang Calculations -----
sun_long_sidereal = planet_positions_sidereal["Sun"][0]
moon_long_sidereal = planet_positions_sidereal["Moon"][0]
print(f"moon postion array : {planet_positions_sidereal}")

vara, tithi_name_simple, paksha_name, karan_name, yoga_name = get_vara_tithi_karan_yoga(jd, sun_long_sidereal, moon_long_sidereal)
full_tithi_name = f"{tithi_name_simple} ({paksha_name})"

# ----- Nakshatra, Pada, and Rashi for Moon -----
nakshatra_idx_0based, nakshatra_index_1based, nakshatra_name, nakshatra_pada = get_nakshatra_info(moon_long_sidereal)
moon_sign_rashi = get_rashi_from_nakshatra_pada(nakshatra_index_1based, nakshatra_pada)


# ----- Vimshottari Dasha -----
dasha_info_lord, left_year_info, vimshottari_dasha_sequence = calculate_vimshottari_dasha(moon_long_sidereal, utc_dt)

# ----- Avakhada Details -----
avakhada_details = get_avakhada_details(
    nakshatra_idx_0based,
    moon_sign_rashi,
    nakshatra_pada,
    yoga_name,
    karan_name,
    full_tithi_name
)

#favorable list
favorable_list = favorable_lists(nakshatra_name, nakshatra_pada, moon_sign_rashi)
person_tara = get_tara_name(nakshatra_name)

# --- Print Results ---
print("\n" + "="*70)
print("             Vedic Astrology Birth Chart Report             ")
print("="*70 + "\n")

print("--- Birth Details ---")
print(f"Date of Birth: {DOB}")
print(f"Time of Birth: {TOB} ({timezone_str} / {utc_dt.strftime('%H:%M UTC')})")
print(f"Location: {LOCATION}")
print(f"Coordinates: Latitude: {lat:.2f}°, Longitude: {lon:.2f}°")
print(f"Julian Day: {jd:.4f}\n")
print(f"Ayanamsa Used: {ayanamsa_used_display}\n")


print("--- Panchang Details ---")
print(f"{'Vara (Weekday)':<20}: {vara}")
print(f"{'Tithi':<20}: {full_tithi_name}")
print(f"{'Nakshatra':<20}: {nakshatra_name} (No. {nakshatra_index_1based})")
print(f"{'Yoga':<20}: {yoga_name}")
print(f"{'Karan':<20}: {karan_name}\n")


print("--- Ascendant and Houses ---")
ascendant_rashi, asc_deg, asc_min, asc_sec = format_longitude_to_dms(ascendant_long).split(' ') 
print(f"Ascendant (Lagna): {asc_deg} {asc_min} {asc_sec} {ascendant_rashi}")
for i, cusp in enumerate(house_cusps_long):
    cusp_rashi, cusp_deg, cusp_min, cusp_sec = format_longitude_to_dms(cusp).split(' ')
    print(f"House {i+1} Cusp: {cusp_deg} {cusp_min} {cusp_sec} {cusp_rashi}")

print("\n--- Planetary Positions (Sidereal) ---")
for name, pos_data in planet_positions_sidereal.items():
    lon_str = format_longitude_to_dms(pos_data[0])
    print(f"{name:<10}: {lon_str:<20} | Lat: {pos_data[1]:.2f}° | Speed: {pos_data[2]:.2f}°/day")

print(f"\n--- Moon's Details ---")
print(f"Moon's Nakshatra: {nakshatra_name} (No. {nakshatra_index_1based})")
print(f"Nakshatra Pada: {nakshatra_pada}")
print(f"Moon Sign (Chandra Rashi): {moon_sign_rashi}")
print(f"Tara (star) : {person_tara}\n")

print("\n--- Avakhada Details ---")
for key, value in avakhada_details.items():
    print(f"{key:<20}: {value}")

print("\n--- Favoravle List ---")
for key, value in favorable_list.items():
    print(f"{key:<20}: {value}")

# print(f"\n--- Vimshottari Mahadasha ---")
# print(f"Current Dasha Lord: {dasha_info_lord}")
# print(f"Years Left in {dasha_info_lord} Dasha: {left_year_info:.2f} years")

# print("\n--- Full Vimshottari Mahadasha Sequence (One Cycle) ---")
# for dasha, start_date, end_date in vimshottari_dasha_sequence:
#     print(f"{dasha:<7}: {start_date} → {end_date}")

print("\n" + "="*70)
print("              End of Birth Chart Report             ")
print("="*70)