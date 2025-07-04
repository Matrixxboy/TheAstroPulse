# --- Mappings for Astrological Calculations ---

# 1. Rashi (Moon Sign) to its Lord Planet
RASHI_LORD_MAP = {
    "Aries": "Mars", "Mesha": "Mars",
    "Taurus": "Venus", "Vrishabha": "Venus",
    "Gemini": "Mercury", "Mithuna": "Mercury",
    "Cancer": "Moon", "Karka": "Moon",
    "Leo": "Sun", "Simha": "Sun",
    "Virgo": "Mercury", "Kanya": "Mercury",
    "Libra": "Venus", "Tula": "Venus",
    "Scorpio": "Mars", "Vrishchika": "Mars",
    "Sagittarius": "Jupiter", "Dhanu": "Jupiter",
    "Capricorn": "Saturn", "Makara": "Saturn",
    "Aquarius": "Saturn", "Kumbha": "Saturn",
    "Pisces": "Jupiter", "Meena": "Jupiter",
}

# 2. Planetary Friendships (for Graha Maitri)
# Dictionary format: {Planet: {Friends: [list], Neutrals: [list], Enemies: [list]}}
PLANETARY_RELATIONSHIPS = {
    "Sun": {"Friends": ["Moon", "Mars", "Jupiter"], "Neutrals": ["Mercury"], "Enemies": ["Venus", "Saturn"]},
    "Moon": {"Friends": ["Sun", "Mercury"], "Neutrals": [], "Enemies": []}, # Moon has no enemies
    "Mars": {"Friends": ["Sun", "Moon", "Jupiter"], "Neutrals": ["Venus", "Saturn"], "Enemies": ["Mercury"]},
    "Mercury": {"Friends": ["Sun", "Venus"], "Neutrals": ["Mars", "Jupiter", "Saturn"], "Enemies": ["Moon"]},
    "Jupiter": {"Friends": ["Sun", "Moon", "Mars"], "Neutrals": ["Saturn"], "Enemies": ["Venus", "Mercury"]},
    "Venus": {"Friends": ["Mercury", "Saturn"], "Neutrals": ["Jupiter"], "Enemies": ["Sun", "Moon", "Mars"]},
    "Saturn": {"Friends": ["Mercury", "Venus"], "Neutrals": ["Jupiter"], "Enemies": ["Sun", "Moon", "Mars"]},
}

# 3. Nakshatra Order (for Tara)
NAKSHATRA_ORDER = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
    "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
    "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha",
    "Uttara Ashadha", "Sravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
]

# 4. Rashi Order (for Bhakoot)
RASHI_ORDER = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# --- Functions for Compatibility Calculations ---

def get_planet_relationship(planet1: str, planet2: str) -> str:
    """
    Determines the relationship between two planets (Friend, Neutral, Enemy, or Same).
    Used internally by calculate_graha_maitri.
    """
    if planet1 == planet2:
        return "Same"
    if planet2 in PLANETARY_RELATIONSHIPS[planet1]["Friends"]:
        return "Friend"
    if planet2 in PLANETARY_RELATIONSHIPS[planet1]["Neutrals"]:
        return "Neutral"
    if planet2 in PLANETARY_RELATIONSHIPS[planet1]["Enemies"]:
        return "Enemy"
    return "Unknown" # Should not happen if data is complete

def calculate_graha_maitri(rashi1: str, rashi2: str) -> dict:
    """
    Calculates Graha Maitri (Planetary Friendship) compatibility points.
    This Koota assesses mental compatibility and mutual love between partners based on their Moon Sign lords.

    Args:
        rashi1 (str): Moon Sign (Rashi) of the first person (e.g., "Aries", "Mesha").
        rashi2 (str): Moon Sign (Rashi) of the second person.

    Returns:
        dict: A dictionary containing the score (out of 5) and a description.
    """
    lord1 = RASHI_LORD_MAP.get(rashi1)
    lord2 = RASHI_LORD_MAP.get(rashi2)

    if not lord1 or not lord2:
        return {"score": 0, "description": "Invalid Rashi provided for Graha Maitri."}

    rel1_to_2 = get_planet_relationship(lord1, lord2)
    rel2_to_1 = get_planet_relationship(lord2, lord1)

    score = 0
    description = ""

    if lord1 == lord2:
        score = 5
        description = f"{rashi1} and {rashi2} have the same Rashi Lord ({lord1}), indicating excellent mental compatibility."
    elif rel1_to_2 == "Friend" and rel2_to_1 == "Friend":
        score = 5
        description = f"Rashi Lords {lord1} and {lord2} are mutual friends, indicating excellent mental compatibility."
    elif (rel1_to_2 == "Friend" and rel2_to_1 == "Neutral") or \
         (rel1_to_2 == "Neutral" and rel2_to_1 == "Friend"):
        score = 4
        description = f"One Rashi Lord is a friend, the other is neutral. Good compatibility."
    elif rel1_to_2 == "Neutral" and rel2_to_1 == "Neutral":
        score = 3
        description = f"Rashi Lords {lord1} and {lord2} are mutually neutral. Average compatibility."
    elif (rel1_to_2 == "Friend" and rel2_to_1 == "Enemy") or \
         (rel1_to_2 == "Enemy" and rel2_to_1 == "Friend"):
        score = 1
        description = f"One Rashi Lord is a friend, the other is an enemy. Weak compatibility."
    elif (rel1_to_2 == "Neutral" and rel2_to_1 == "Enemy") or \
         (rel1_to_2 == "Enemy" and rel2_to_1 == "Neutral"):
        score = 0.5
        description = f"One Rashi Lord is neutral, the other is an enemy. Very weak compatibility."
    elif rel1_to_2 == "Enemy" and rel2_to_1 == "Enemy":
        score = 0
        description = f"Rashi Lords {lord1} and {lord2} are mutual enemies. Poor mental compatibility."
    else:
        score = 0
        description = "Undefined planetary relationship for Graha Maitri. Check input data."

    return {"score": score, "description": description}

def calculate_bhakoot(rashi1: str, rashi2: str) -> dict:
    """
    Calculates Bhakoot (Moon Sign Relationship) compatibility points.
    This Koota assesses overall health, prosperity, and emotional understanding based on the relative positions of Moon Signs.

    Args:
        rashi1 (str): Moon Sign (Rashi) of the first person.
        rashi2 (str): Moon Sign (Rashi) of the second person.

    Returns:
        dict: A dictionary containing the score (out of 7), a description, and the Bhakoot type.
    """
    try:
        idx1 = RASHI_ORDER.index(rashi1)
        idx2 = RASHI_ORDER.index(rashi2)
    except ValueError:
        return {"score": 0, "description": "Invalid Rashi provided for Bhakoot.", "type": "Invalid"}

    # Distance from rashi1 to rashi2 (1-indexed)
    dist1_to_2 = (idx2 - idx1 + 12) % 12 + 1
    # Distance from rashi2 to rashi1 (1-indexed)
    dist2_to_1 = (idx1 - idx2 + 12) % 12 + 1

    bhakoot_type = ""
    score = 0
    description = ""

    if (dist1_to_2 == 1 and dist2_to_1 == 1): # Both same
        bhakoot_type = "Same Rashi (1/1)"
        score = 7
        description = "Excellent Bhakoot compatibility (same Rashi), indicating strong understanding and prosperity."
    elif (dist1_to_2 == 7 and dist2_to_1 == 7): # Opposite
        bhakoot_type = "Saptama (1/7)"
        score = 7
        description = "Excellent Bhakoot compatibility (opposite Rashis), indicating good complementarity and balance."
    elif (dist1_to_2 == 3 and dist2_to_1 == 11) or (dist1_to_2 == 11 and dist2_to_1 == 3):
        bhakoot_type = "Tridasha (3/11)"
        score = 7
        description = "Excellent Bhakoot compatibility (3rd/11th from each other), indicating growth and mutual benefit."
    elif (dist1_to_2 == 4 and dist2_to_1 == 10) or (dist1_to_2 == 10 and dist2_to_1 == 4):
        bhakoot_type = "Dashama (4/10)"
        score = 7
        description = "Excellent Bhakoot compatibility (4th/10th from each other), indicating support and progress."
    elif (dist1_to_2 == 2 and dist2_to_1 == 12) or (dist1_to_2 == 12 and dist2_to_1 == 2):
        bhakoot_type = "Dwirdwadash (2/12) Dosha"
        score = 0
        description = "Poor Bhakoot compatibility (2nd/12th). Can lead to financial and health issues."
    elif (dist1_to_2 == 5 and dist2_to_1 == 9) or (dist1_to_2 == 9 and dist2_to_1 == 5):
        bhakoot_type = "Nav Pancham (5/9) Dosha"
        score = 0
        description = "Poor Bhakoot compatibility (5th/9th). Can lead to progeny issues and differences in opinion."
    elif (dist1_to_2 == 6 and dist2_to_1 == 8) or (dist1_to_2 == 8 and dist2_to_1 == 6):
        bhakoot_type = "Shadashtaka (6/8) Dosha"
        score = 0
        description = "Very poor Bhakoot compatibility (6th/8th). Can lead to severe health, accidents, and life-threatening issues."
    else:
        bhakoot_type = "Unknown Bhakoot Type"
        score = 0
        description = "Unexpected Rashi combination. Check input data."

    return {"score": score, "description": description, "type": bhakoot_type}

def calculate_tara(nakshatra1: str, nakshatra2: str) -> dict:
    """
    Calculates Tara (Nakshatra Compatibility) points.
    This Koota assesses the health, longevity, and general well-being of the couple.

    Args:
        nakshatra1 (str): Nakshatra of the first person.
        nakshatra2 (str): Nakshatra of the second person.

    Returns:
        dict: A dictionary containing the score (out of 3), a description,
              and the Tara type and count for each direction.
    """
    try:
        idx1 = NAKSHATRA_ORDER.index(nakshatra1)
        idx2 = NAKSHATRA_ORDER.index(nakshatra2)
    except ValueError:
        return {"score": 0, "description": "Invalid Nakshatra provided for Tara.",
                "person1_to_person2_tara": {"type": "Invalid", "count": 0},
                "person2_to_person1_tara": {"type": "Invalid", "count": 0}}

    # Count from nakshatra1 to nakshatra2 (1-indexed)
    count1_to_2 = (idx2 - idx1 + 27) % 27 + 1
    # Count from nakshatra2 to nakshatra1 (1-indexed)
    count2_to_1 = (idx1 - idx2 + 27) % 27 + 1

    # Map count to Tara type and determine its auspiciousness
    def get_tara_info(count: int) -> tuple[str, bool]:
        remainder = count % 9
        if remainder == 0: remainder = 9 # Remainder 0 maps to the 9th Tara

        if remainder == 1: return "Janma Tara", False
        elif remainder == 2: return "Sampat Tara", True
        elif remainder == 3: return "Vipat Tara", False
        elif remainder == 4: return "Kshema Tara", True
        elif remainder == 5: return "Pratyari Tara", False
        elif remainder == 6: return "Sadhaka Tara", True
        elif remainder == 7: return "Vadha Tara", False
        elif remainder == 8: return "Maitra Tara", True
        elif remainder == 9: return "Ati Maitra Tara", True
        return "Unknown Tara", False # Should not happen

    tara1_type, is_tara1_auspicious = get_tara_info(count1_to_2)
    tara2_type, is_tara2_auspicious = get_tara_info(count2_to_1)

    score = 0
    description = ""

    if is_tara1_auspicious and is_tara2_auspicious:
        score = 3
        description = f"Both directions ({tara1_type} and {tara2_type}) are auspicious. Excellent Tara compatibility for health and longevity."
    elif is_tara1_auspicious or is_tara2_auspicious:
        score = 1.5
        description = f"One direction ({tara1_type} or {tara2_type}) is auspicious, the other is not. Moderate Tara compatibility."
    else: # Both are inauspicious
        score = 0
        description = f"Both directions ({tara1_type} and {tara2_type}) are inauspicious. Poor Tara compatibility."
        if "Vipat Tara" in [tara1_type, tara2_type] or \
           "Pratyari Tara" in [tara1_type, tara2_type] or \
           "Vadha Tara" in [tara1_type, tara2_type]:
            description = "Highly inauspicious Tara compatibility due to Vipat, Pratyari, or Vadha Tara."

    return {
        "score": score,
        "description": description,
        "person1_to_person2_tara": {"type": tara1_type, "count": count1_to_2},
        "person2_to_person1_tara": {"type": tara2_type, "count": count2_to_1}
    }



print(f"\n Graha maitri : ",calculate_graha_maitri("Taurus","Libra"))
print(f"\nbhakoot : ",calculate_bhakoot("Taurus","Libra"))