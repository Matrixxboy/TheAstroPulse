import swisseph as swe
from datetime import datetime, timedelta

def calculate_vimshottari_dasha(birth_date, birth_time, birth_place):
    """
    Calculate the complete Vimshottari Dasha timeline for a given birth date.
    
    Args:
        birth_date (str): DD/MM/YYYY format
        birth_time (str): HH:MM format (24-hour)
        birth_place (str): City, Country
    
    Returns:
        dict: Complete Dasha timeline with Mahadashas and Antardashas
    """
    # Initialize Swiss Ephemeris
    swe.set_ephe_path("")
    
    # Parse birth details
    day, month, year = map(int, birth_date.split("/"))
    hour, minute = map(int, birth_time.split(":"))
    birth_dt = datetime(year, month, day, hour, minute)
    jd = swe.julday(year, month, day, hour + minute/60)
    
    # Vimshottari sequence (planet, years)
    DASHA_SEQUENCE = [
        ("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10),
        ("Mars", 7), ("Rahu", 18), ("Jupiter", 16), ("Saturn", 19), ("Mercury", 17)
    ]
    
    # Nakshatra rulers (27 nakshatras mapped to 9 planets)
    NAKSHATRA_RULERS = [
        0, 1, 2, 3, 4, 5, 6, 7, 8,  # First 9 nakshatras
        0, 1, 2, 3, 4, 5, 6, 7, 8,  # Next 9
        0, 1, 2, 3, 4, 5, 6, 7, 8   # Last 9
    ]
    
    # Get Moon's position and nakshatra
    moon_pos = swe.calc_ut(jd, swe.MOON)[0][0]
    nakshatra_index = int(moon_pos // 13.3333)
    ruler_index = NAKSHATRA_RULERS[nakshatra_index]
    planet, total_years = DASHA_SEQUENCE[ruler_index]
    
    # Calculate remaining dasha at birth
    remaining_deg = (nakshatra_index + 1) * 13.3333 - moon_pos
    remaining_years = (remaining_deg / 13.3333) * total_years
    
    # Generate complete dasha timeline
    dashas = []
    current_date = birth_dt - timedelta(days=(total_years - remaining_years)*365.25)
    
    for i in range(9):
        planet, years = DASHA_SEQUENCE[(ruler_index + i) % 9]
        if i == 0:
            years = remaining_years
        
        end_date = current_date + timedelta(days=years*365.25)
        
        # Calculate antardashas
        antardashas = []
        antardasha_start = current_date
        for j in range(9):
            sub_planet, sub_years = DASHA_SEQUENCE[(ruler_index + i + j) % 9]
            sub_duration = (sub_years / 120) * years
            antardasha_end = antardasha_start + timedelta(days=sub_duration*365.25)
            antardashas.append({
                "Planet": sub_planet,
                "Start": antardasha_start.strftime("%d-%b-%Y"),
                "End": antardasha_end.strftime("%d-%b-%Y"),
                "Duration": f"{sub_duration:.2f} years"
            })
            antardasha_start = antardasha_end
        
        dashas.append({
            "Mahadasha": planet,
            "Start": current_date.strftime("%d-%b-%Y"),
            "End": end_date.strftime("%d-%b-%Y"),
            "Duration": f"{years:.2f} years",
            "Antardashas": antardashas
        })
        current_date = end_date
    
    return {
        "birth_details": {
            "date": birth_dt.strftime("%d-%b-%Y"),
            "time": birth_time,
            "place": birth_place,
            "moon_nakshatra": get_nakshatra_name(nakshatra_index),
            "dasha_ruler": planet
        },
        "dasha_timeline": dashas
    }

def get_nakshatra_name(index):
    """Get the name of the nakshatra from its index"""
    nakshatras = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
        "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
        "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
        "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
        "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
        "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ]
    return nakshatras[index]

# Example usage
if __name__ == "__main__":
    birth_date = "14/07/2004"
    birth_time = "07:15"
    birth_place = "Surat, India"
    
    result = calculate_vimshottari_dasha(birth_date, birth_time, birth_place)
    
    # Print birth details
    print("\nBirth Details:")
    print(f"Date: {result['birth_details']['date']}")
    print(f"Time: {result['birth_details']['time']}")
    print(f"Place: {result['birth_details']['place']}")
    print(f"Moon Nakshatra: {result['birth_details']['moon_nakshatra']}")
    print(f"First Dasha Ruler: {result['birth_details']['dasha_ruler']}\n")
    
    # Print Mahadashas
    print("Vimshottari Dasha Timeline:")
    for dasha in result['dasha_timeline']:
        print(f"\n{dasha['Mahadasha']} Mahadasha: {dasha['Start']} to {dasha['End']} ({dasha['Duration']})")
        print("Antardashas:")
        for antardasha in dasha['Antardashas']:
            print(f"  - {antardasha['Planet']}: {antardasha['Start']} to {antardasha['End']} ({antardasha['Duration']})")