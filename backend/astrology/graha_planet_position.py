import math

def get_sign_from_degree(absolute_degree):
    """
    Determines the zodiac sign and degree within that sign from an absolute degree (0-360).
    """
    zodiac_signs = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    sign_index = math.floor(absolute_degree / 30)
    degree_in_sign = absolute_degree % 30
    return zodiac_signs[sign_index], degree_in_sign

def get_absolute_degree(sign_name, degree_in_sign):
    """
    Converts a sign name and degree within sign to an absolute degree (0-360).
    """
    zodiac_signs = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    if sign_name not in zodiac_signs:
        raise ValueError(f"Invalid zodiac sign name: {sign_name}")
    
    sign_index = zodiac_signs.index(sign_name)
    absolute_degree = (sign_index * 30) + degree_in_sign
    return absolute_degree

def create_lagna_kundali(lagna_sign, lagna_degree_in_sign, planet_positions):
    """
    Generates a basic Lagna Kundali showing house signs and planet placements.

    Args:
        lagna_sign (str): The zodiac sign of the Lagna (e.g., "Leo").
        lagna_degree_in_sign (float): The degree of the Lagna within its sign (0.0 to 29.99).
        planet_positions (dict): A dictionary where keys are planet names (str)
                                 and values are dictionaries containing:
                                 'sign' (str): The zodiac sign of the planet.
                                 'degree_in_sign' (float): The degree of the planet within its sign.

    Returns:
        dict: A dictionary containing:
              'house_signs': A list of 12 strings, where index i corresponds to the sign in House i+1.
              'planet_house_placements': A dictionary mapping planet names to their house numbers (1-12).
    """
    zodiac_signs = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]

    # 1. Calculate Lagna Absolute Degree
    try:
        lagna_abs_deg = get_absolute_degree(lagna_sign, lagna_degree_in_sign)
    except ValueError as e:
        print(f"Error with Lagna input: {e}")
        return None

    # 2. Determine House Signs (Equal House System)
    house_signs = []
    lagna_sign_index = zodiac_signs.index(lagna_sign)
    for i in range(12):
        current_sign_index = (lagna_sign_index + i) % 12
        house_signs.append(zodiac_signs[current_sign_index])

    # 3. Calculate House Cusps (Start Degrees for each house)
    # For an equal house system, the cusp of house 1 is lagna_abs_deg.
    # The cusp of house N is lagna_abs_deg + (N-1)*30.
    # We don't strictly need all cusps for planet placement with the relative degree method,
    # but it's good for understanding the house ranges.
    house_cusps_start_abs_deg = []
    for i in range(12):
        cusp_deg = (lagna_abs_deg + (i * 30)) % 360
        house_cusps_start_abs_deg.append(cusp_deg)

    # 4. Place Planets into Houses
    planet_house_placements = {}
    for planet, pos_data in planet_positions.items():
        try:
            planet_sign = pos_data['sign']
            planet_deg_in_sign = pos_data['degree_in_sign']
            planet_abs_deg = get_absolute_degree(planet_sign, planet_deg_in_sign)

            # Calculate relative position from Lagna
            relative_degree = (planet_abs_deg - lagna_abs_deg + 360) % 360

            # Determine house number (1-indexed)
            house_number = math.floor(relative_degree / 30) + 1
            planet_house_placements[planet] = house_number
        except KeyError:
            print(f"Warning: Missing 'sign' or 'degree_in_sign' for planet {planet}. Skipping.")
        except ValueError as e:
            print(f"Error with planet {planet} position: {e}. Skipping.")

    return {
        "house_signs": house_signs,
        "planet_house_placements": planet_house_placements
    }

def display_kundali(kundali_data, lagna_sign, lagna_degree_in_sign):
    """
    Prints a formatted representation of the Kundali.
    Simulates a North Indian chart layout.
    """
    if not kundali_data:
        print("Could not generate Kundali data.")
        return

    house_signs = kundali_data['house_signs']
    planet_placements = kundali_data['planet_house_placements']

    print("\n--- Lagna Kundali (Basic Birth Chart) ---")
    print(f"Lagna (Ascendant): {lagna_sign} {lagna_degree_in_sign:.2f}°")
    print("-" * 40)

    # Simulate North Indian Chart Layout (Diamond shape)
    # House numbering:
    #      10       11
    #   9               12
    #      8        1
    #   7                2
    #      6        5
    #         4         3

    # Map house numbers to display positions for North Indian chart
    # This is a visual representation, not the actual house calculation
    # The actual calculation is done by the algorithm above.
    display_map = {
        1: 'Center-Right', 2: 'Bottom-Right', 3: 'Bottom-Center', 4: 'Bottom-Left',
        5: 'Center-Left', 6: 'Top-Left', 7: 'Top-Center', 8: 'Top-Right',
        9: 'Center-Top', 10: 'Top-Mid-Left', 11: 'Top-Mid-Right', 12: 'Bottom-Mid-Right'
    }

    # Simplified textual representation for clarity
    print("\nHouse Signs:")
    for i, sign in enumerate(house_signs):
        print(f"House {i+1}: {sign}")

    print("\nPlanet Placements:")
    for planet, house_num in planet_placements.items():
        sign_in_house = house_signs[house_num - 1]
        print(f"{planet}: House {house_num} ({sign_in_house})")

    print("\n--- Visual Aid (Conceptual North Indian Chart Layout) ---")
    print("This is a simplified textual representation of the chart's structure.")
    print("The numbers indicate the house, and the signs are placed within them.")
    print("The planets are then placed into the house their sign falls into.")
    print("\n        -------------------------")
    print(f"        | {house_signs[9]:<7} | {house_signs[10]:<7} |") # House 10, 11
    print(f"        | (H10)   | (H11)   |")
    print(f"-----------------------------------------")
    print(f"| {house_signs[8]:<7} |           | {house_signs[11]:<7} |") # House 9, 12
    print(f"| (H9)    |           | (H12)   |")
    print(f"|---------|-----------|---------|")
    print(f"| {house_signs[7]:<7} | {house_signs[0]:<7} | {house_signs[1]:<7} |") # House 8, 1, 2
    print(f"| (H8)    | (H1)    | (H2)    |")
    print(f"|---------|-----------|---------|")
    print(f"| {house_signs[6]:<7} |           | {house_signs[2]:<7} |") # House 7, 3
    print(f"| (H7)    |           | (H3)    |")
    print(f"-----------------------------------------")
    print(f"        | {house_signs[5]:<7} | {house_signs[4]:<7} |") # House 6, 5
    print(f"        | (H6)    | (H5)    |")
    print(f"        -------------------------")

    print("\nPlanet Positions in Chart Layout:")
    # Create a dictionary to hold planets for each house for display
    house_planets = {i: [] for i in range(1, 13)}
    for planet, house_num in planet_placements.items():
        house_planets[house_num].append(planet)

    # Display planets within the simplified chart structure
    # This is a very basic textual representation and not a graphical chart.
    print("\n        -------------------------")
    print(f"        | {house_signs[9]:<7} | {house_signs[10]:<7} |")
    print(f"        | {' '.join(house_planets[10]):<7} | {' '.join(house_planets[11]):<7} |")
    print(f"-----------------------------------------")
    print(f"| {house_signs[8]:<7} |           | {house_signs[11]:<7} |")
    print(f"| {' '.join(house_planets[9]):<7} |           | {' '.join(house_planets[12]):<7} |")
    print(f"|---------|-----------|---------|")
    print(f"| {house_signs[7]:<7} | {house_signs[0]:<7} | {house_signs[1]:<7} |")
    print(f"| {' '.join(house_planets[8]):<7} | {' '.join(house_planets[1]):<7} | {' '.join(house_planets[2]):<7} |")
    print(f"|---------|-----------|---------|")
    print(f"| {house_signs[6]:<7} |           | {house_signs[2]:<7} |")
    print(f"| {' '.join(house_planets[7]):<7} |           | {' '.join(house_planets[3]):<7} |")
    print(f"-----------------------------------------")
    print(f"        | {house_signs[5]:<7} | {house_signs[4]:<7} |")
    print(f"        | {' '.join(house_planets[6]):<7} | {' '.join(house_planets[5]):<7} |")
    print(f"        -------------------------")


# --- Example Usage ---
if __name__ == "__main__":
    # --- IMPORTANT: You need to provide your Lagna (Ascendant) and Planet Positions ---
    # Lagna (Ascendant) details
    # This is the sign and degree that was rising on the eastern horizon at your birth.
    # For accurate Lagna calculation, you need precise birth time, date, and location (latitude/longitude).
    # For this code, we assume you have this information.
    my_lagna_sign = "Leo"  # Example: If Leo was rising
    my_lagna_degree_in_sign = 15.30 # Example: 15 degrees and 30 minutes into Leo

    # Planet positions (these are example values, replace with your actual data)
    # These are typically obtained from an ephemeris or astrological software.
    # The degree_in_sign should be between 0.0 and 29.99
    my_planet_positions = {
        "Sun": {"sign": "Gemini", "degree_in_sign": 28.04},
        "Moon": {"sign": "Taurus", "degree_in_sign": 20.84},
        "Mars": {"sign": "Cancer", "degree_in_sign": 18.8},
        "Mercury": {"sign": "Cancer", "degree_in_sign": 21.57},
        "Jupiter": {"sign": "Leo", "degree_in_sign": 21.46},
        "Venus": {"sign": "Taurus", "degree_in_sign": 49.17},
        "Saturn": {"sign": "Gemini", "degree_in_sign": 23.61},
        "Rahu": {"sign": "Aries", "degree_in_sign": 13.45},
        "Ketu": {"sign": "Libra", "degree_in_sign": 13.45} # Ketu is always 180 degrees from Rahu
    }

    # Generate the Kundali
    kundali_results = create_lagna_kundali(my_lagna_sign, my_lagna_degree_in_sign, my_planet_positions)

    # Display the results
    display_kundali(kundali_results, my_lagna_sign, my_lagna_degree_in_sign)

    # # --- You can test with different Lagna and planet positions ---
    # print("\n" + "="*50 + "\n")
    # print("--- Another Example ---")
    # another_lagna_sign = "Scorpio"
    # another_lagna_degree_in_sign = 2.0
    # another_planet_positions = {
    #     "Sun": {"sign": "Scorpio", "degree_in_sign": 25.0},
    #     "Moon": {"sign": "Pisces", "degree_in_sign": 10.0},
    #     "Mars": {"sign": "Gemini", "degree_in_sign": 15.0},
    # }
    # another_kundali_results = create_lagna_kundali(another_lagna_sign, another_lagna_degree_in_sign, another_planet_positions)
    # display_kundali(another_kundali_results, another_lagna_sign, another_lagna_degree_in_sign)
