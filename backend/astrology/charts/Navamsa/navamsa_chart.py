# Define the zodiac signs in order
ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

def is_odd_sign(sign):
    """Returns True if the Rasi sign is odd-numbered (1st, 3rd, etc.)"""
    odd_signs = ["Aries", "Gemini", "Leo", "Libra", "Sagittarius", "Aquarius"]
    return sign in odd_signs

def get_navamsa_sequence(rasi_sign):
    """Returns the correct Navamsa sequence for a given sign"""
    index = ZODIAC_SIGNS.index(rasi_sign)
    if is_odd_sign(rasi_sign):
        return [(ZODIAC_SIGNS[(index + i) % 12]) for i in range(9)]
    else:
        return [(ZODIAC_SIGNS[(index - i) % 12]) for i in range(9)]

def get_navamsa_sign(sign, degree_in_sign):
    """
    Calculates the Navamsa sign based on Rasi and degree within the sign
    degree_in_sign: should be 0–30 (i.e., Degree in Sign)
    """
    if degree_in_sign < 0 or degree_in_sign > 30:
        raise ValueError("Degree in sign must be between 0 and 30.")

    navamsa_index = int(degree_in_sign / (30 / 9))  # 3.333... deg per Navamsa
    sequence = get_navamsa_sequence(sign)
    return sequence[navamsa_index]

# Example usage on your planet data:
planet_data = {
    "Jupiter": {"Sign": "Leo", "Degree in sign": 21.4629},
    "Ketu": {"Sign": "Libra", "Degree in sign": 13.4553},
    "Mars": {"Sign": "Cancer", "Degree in sign": 18.8073},
    "Mercury": {"Sign": "Cancer", "Degree in sign": 21.5774},
    "Moon": {"Sign": "Taurus", "Degree in sign": 20.8479},
    "Neptune": {"Sign": "Capricorn", "Degree in sign": 20.6827},
    "Pluto": {"Sign": "Scorpio", "Degree in sign": 26.1801},
    "Rahu": {"Sign": "Aries", "Degree in sign": 13.4553},
    "Saturn": {"Sign": "Gemini", "Degree in sign": 23.6117},
    "Sun": {"Sign": "Gemini", "Degree in sign": 28.0438},
    "Uranus": {"Sign": "Aquarius", "Degree in sign": 12.4480},
    "Venus": {"Sign": "Taurus", "Degree in sign": 19.1714}
}

# Print Navamsa sign for each planet
for planet, info in planet_data.items():
    navamsa = get_navamsa_sign(info["Sign"], info["Degree in sign"])
    print(f"{planet} → Navamsa: {navamsa}")
