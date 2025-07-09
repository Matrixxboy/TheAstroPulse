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
    
NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
    "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
    "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
]

NAKSHTRA_DETAILS = {
    "Ashwini": {
        "varna": "Vaishya",
        "yoni": "Ashwa (Horse)",
        "gana": "Deva (Divine)",
        "nadi": "Aadi (Vata)",
        "fav_sign": "Aries", # Full Nakshatra in Aries
        "ruling_planet": "Ketu",
        "fast_day" : "Tuesday",
        "mantra" :"ॐ केतवे नमः",
        "deity": "Ashwini Kumars (Twin Horsemen)",
        "symbol": "Horse Head",
        "gender": "Male",
        "guna": "Sattvic",
        "dosha": "Vata",
        "fav_alphabet": ["Chu", "Che", "Cho", "La"],
        "direction": "East",
        "tara":"Janma Tara",
        "paya":"Swarna (Gold)",
        "pada" : {
            "1": {
                "rashi": "Aries",
                "navamsa_sign": "Aries",
                "akshara": "Chu"
            },
            "2": {
                "rashi": "Aries",
                "navamsa_sign": "Taurus",
                "akshara": "Che"
            },
            "3": {
                "rashi": "Aries",
                "navamsa_sign": "Gemini",
                "akshara": "Cho"
            },
            "4": {
                "rashi": "Aries",
                "navamsa_sign": "Cancer",
                "akshara": "La"
            }
        }
    },
    "Bharani": {
        "varna": "Shudra",
        "yoni": "Gaja (Elephant)",
        "gana": "Manushya (Human)",
        "nadi": "Madhya (Pitta)",
        "fav_sign": "Aries", # Full Nakshatra in Aries
        "ruling_planet": "Venus",
        "fast_day":"Friday",
        "mantra" :"ॐ शुक्राय नमः",
        "deity": "Yama (God of Death/Dharma)",
        "symbol": "Female reproductive organ / Yoni",
        "gender": "Male",
        "guna": "Rajasic",
        "dosha": "Pitta",
        "fav_alphabet": ["Li", "Lu", "Le", "Lo"],
        "direction": "South",
        "tara":"Sampat Tara",
        "paya":"Rajata (Silver)",
        "pada":
        {
            "1": {
                "rashi": "Aries",
                "navamsa_sign": "Leo",
                "akshara": "Li"
            },
            "2": {
                "rashi": "Aries",
                "navamsa_sign": "Virgo",
                "akshara": "Lu"
            },
            "3": {
                "rashi": "Aries",
                "navamsa_sign": "Libra",
                "akshara": "Le"
            },
            "4": {
                "rashi": "Aries",
                "navamsa_sign": "Scorpio",
                "akshara": "Lo"
            }
        }
    },
    "Krittika": {
        "varna": "Vaishya",
        "yoni": "Mesha (Ram)",
        "gana": "Rakshasa (Demonic)",
        "nadi": "Antya (Kapha)",
        "fav_sign": "Aries", # Starts in Aries (1 Pada), rest in Taurus
        "ruling_planet": "Sun",
        "fast_day":"Sunday",
        "mantra" : "ॐ सूर्याय नमः",
        "deity": "Agni (God of Fire)",
        "symbol": "Knife, Axe, or Flame",
        "gender": "Female",
        "guna": "Sattvic",
        "dosha": "Pitta",
        "fav_alphabet": ["A", "Ee", "U", "A", "O"], # Note: First pada often uses 'A'
        "direction": "South-East",
        "tara":"Vipat Tara",
        "paya":"Tamra (Copper)",
        "pada":{
            "1": {
                "rashi": "Aries",
                "navamsa_sign": "Sagittarius",
                "akshara": "A"
            },
            "2": {
                "rashi": "Taurus",
                "navamsa_sign": "Capricorn",
                "akshara": "Ee"
            },
            "3": {
                "rashi": "Taurus",
                "navamsa_sign": "Aquarius",
                "akshara": "U"
            },
            "4": {
                "rashi": "Taurus",
                "navamsa_sign": "Pisces",
                "akshara": "Ae"
            }
        },
    },
    "Rohini": {
        "varna": "Shudra",
        "yoni": "Sarpa (Snake)",
        "gana": "Manushya (Human)",
        "nadi": "Antya (Kapha)",
        "fav_sign": "Taurus", # Full Nakshatra in Taurus
        "ruling_planet": "Moon",
        "fast_day":"Monday",
        "mantra" :"ॐ सोमाय नमः",
        "deity": "Brahma (Creator God)",
        "symbol": "Cart or Chariot, Temple, Banyan Tree",
        "gender": "Female",
        "guna": "Rajasic",
        "dosha": "Kapha",
        "fav_alphabet": ["O", "Va", "Vi", "Vu"],
        "direction": "East",
        "tara":"Kshema Tara",
        "paya":"Loha (Iron)",
        "pada":{
            "1": {
                "rashi": "Taurus",
                "navamsa_sign": "Aries",
                "akshara": "O"
            },
            "2": {
                "rashi": "Taurus",
                "navamsa_sign": "Taurus",
                "akshara": "Va"
            },
            "3": {
                "rashi": "Taurus",
                "navamsa_sign": "Gemini",
                "akshara": "Vi"
            },
            "4": {
                "rashi": "Taurus",
                "navamsa_sign": "Cancer",
                "akshara": "Vu"
            }
        },
    },
    "Mrigashira": {
        "varna": "Shudra",
        "yoni": "Sarpa (Snake)",
        "gana": "Deva (Divine)",
        "nadi": "Madhya (Pitta)",
        "fav_sign": "Taurus", # Starts in Taurus (2 Padas), rest in Gemini
        "ruling_planet": "Mars",
        "fast_day":"Tuesday",
        "mantra" :"ॐ अंगारकाय नमः",
        "deity": "Soma (Moon God / Chandra)",
        "symbol": "Deer's Head",
        "gender": "Male",
        "guna": "Tamasic",
        "dosha": "Pitta",
        "fav_alphabet": ["Ve", "Vo", "Ka", "Kee"],
        "direction": "South",
        "tara":"Pratyari Tara",
        "paya":"Rajata (Silver)",
        "pada":{
            "1": {
                "rashi": "Taurus",
                "navamsa_sign": "Leo",
                "akshara": "Ve"
            },
            "2": {
                "rashi": "Taurus",
                "navamsa_sign": "Virgo",
                "akshara": "Vo"
            },
            "3": {
                "rashi": "Gemini",
                "navamsa_sign": "Libra",
                "akshara": "Ka"
            },
            "4": {
                "rashi": "Gemini",
                "navamsa_sign": "Scorpio",
                "akshara": "Kee"
            }
        },
    },
    "Ardra": {
        "varna": "Shudra",
        "yoni": "Shwan (Dog)",
        "gana": "Manushya (Human)",
        "nadi": "Aadi (Vata)",
        "fav_sign": "Gemini", # Full Nakshatra in Gemini
        "ruling_planet": "Rahu",
        "fast_day":"Saturday",
        "mantra" :"ॐ राहवे नमः",
        "deity": "Rudra (God of Storms, Shiva's fierce form)",
        "symbol": "Teardrop, Human Head",
        "gender": "Female",
        "guna": "Tamasic",
        "dosha": "Vata",
        "fav_alphabet": ["Ku", "Gha", "Na", "Chha"],
        "direction": "South-East",
        "tara":"Sadhaka Tara",
        "paya":"Tamra (Copper)",
        "pada":{
            "1": {
                "rashi": "Gemini",
                "navamsa_sign": "Sagittarius",
                "akshara": "Ku"
            },
            "2": {
                "rashi": "Gemini",
                "navamsa_sign": "Capricorn",
                "akshara": "Gha"
            },
            "3": {
                "rashi": "Gemini",
                "navamsa_sign": "Aquarius",
                "akshara": "Nga"
            },
            "4": {
                "rashi": "Gemini",
                "navamsa_sign": "Pisces",
                "akshara": "Chha"
            }
        },
    },
    "Punarvasu": {
        "varna": "Vaishya",
        "yoni": "Marjar (Cat)",
        "gana": "Deva (Divine)",
        "nadi": "Aadi (Vata)",
        "fav_sign": "Gemini", # Starts in Gemini (3 Padas), rest in Cancer
        "ruling_planet": "Jupiter",
        "fast_day":"Thursday",
        "mantra" : "ॐ गुरवे नमः",
        "deity": "Aditi (Mother of Gods)",
        "symbol": "Quiver of Arrows",
        "gender": "Male",
        "guna": "Sattvic",
        "dosha": "Vata",
        "fav_alphabet": ["Ke", "Ko", "Ha", "Hee"],
        "direction": "North",
        "tara":"Vadha Tara",
        "paya":"Rajata (Silver)",
        "pada":{
            "1": {
                "rashi": "Gemini",
                "navamsa_sign": "Aries",
                "akshara": "Ke"
            },
            "2": {
                "rashi": "Gemini",
                "navamsa_sign": "Taurus",
                "akshara": "Ko"
            },
            "3": {
                "rashi": "Gemini",
                "navamsa_sign": "Gemini",
                "akshara": "Ha"
            },
            "4": {
                "rashi": "Cancer",
                "navamsa_sign": "Cancer",
                "akshara": "Hee"
            }
        },
    },
    "Pushya": {
        "varna": "Kshatriya",
        "yoni": "Mesha (Ram)",
        "gana": "Deva (Divine)",
        "nadi": "Madhya (Pitta)",
        "fav_sign": "Cancer", # Full Nakshatra in Cancer
        "ruling_planet": "Saturn",
        "fast_day":"Saturday",
        "mantra" :"ॐ शनैश्चराय नमः",
        "deity": "Brihaspati (Jupiter, God of Wisdom)",
        "symbol": "Cow's Udder, Lotus, Arrow, Circle",
        "gender": "Male",
        "guna": "Rajasic",
        "dosha": "Kapha",
        "fav_alphabet": ["Hu", "He", "Ho", "Da"],
        "direction": "West",
        "tara":"Mitra Tara",
        "paya": "Tamra (Copper)",
        "pada":{
            "1": {
                "rashi": "Cancer",
                "navamsa_sign": "Leo",
                "akshara": "Hu"
            },
            "2": {
                "rashi": "Cancer",
                "navamsa_sign": "Virgo",
                "akshara": "He"
            },
            "3": {
                "rashi": "Cancer",
                "navamsa_sign": "Libra",
                "akshara": "Ho"
            },
            "4": {
                "rashi": "Cancer",
                "navamsa_sign": "Scorpio",
                "akshara": "Da"
            }
        },
    },
    "Ashlesha": {
        "varna": "Mleccha",
        "yoni": "Marjar (Cat)",
        "gana": "Rakshasa (Demonic)",
        "nadi": "Antya (Kapha)",
        "fav_sign": "Cancer", # Full Nakshatra in Cancer
        "ruling_planet": "Mercury",
        "fast_day":"Wednesday",
        "mantra" :"ॐ बुधाय नमः",
        "deity": "Nagas (Serpent Deities)",
        "symbol": "Coiled Serpent",
        "gender": "Female",
        "guna": "Tamasic",
        "dosha": "Kapha",
        "fav_alphabet": ["Dee", "Du", "De", "Do"],
        "direction": "North-East",
        "tara":"Ari Mitra Tara",
        "paya":"Swarna (Gold)",
        "pada":{
            "1": {
                "rashi": "Cancer",
                "navamsa_sign": "Sagittarius",
                "akshara": "Dee"
            },
            "2": {
                "rashi": "Cancer",
                "navamsa_sign": "Capricorn",
                "akshara": "Du"
            },
            "3": {
                "rashi": "Cancer",
                "navamsa_sign": "Aquarius",
                "akshara": "De"
            },
            "4": {
                "rashi": "Cancer",
                "navamsa_sign": "Pisces",
                "akshara": "Do"
            }
        },
    },
    "Magha": {
        "varna": "Shudra",
        "yoni": "Mushak (Rat)",
        "gana": "Rakshasa (Demonic)",
        "nadi": "Antya (Kapha)",
        "fav_sign": "Leo", # Full Nakshatra in Leo
        "ruling_planet": "Ketu",
        "fast_day":"Tuesday",
        "mantra" :"ॐ केतवे नमः",
        "deity": "Pitri (Ancestors)",
        "symbol": "Royal Throne",
        "gender": "Female",
        "guna": "Sattvic",
        "dosha": "Kapha",
        "fav_alphabet": ["Ma", "Mee", "Mu", "Me"],
        "direction": "East",
        "tara":"Janma Tara",
        "paya":"Rajata (Silver)",
        "pada":{
            "1": {
                "rashi": "Leo",
                "navamsa_sign": "Aries",
                "akshara": "Ma"
            },
            "2": {
                "rashi": "Leo",
                "navamsa_sign": "Taurus",
                "akshara": "Mee"
            },
            "3": {
                "rashi": "Leo",
                "navamsa_sign": "Gemini",
                "akshara": "Mu"
            },
            "4": {
                "rashi": "Leo",
                "navamsa_sign": "Cancer",
                "akshara": "Me"
            }
        },
    },
    "Purva Phalguni": {
        "varna": "Brahmin",
        "yoni": "Mushak (Rat)",
        "gana": "Manushya (Human)",
        "nadi": "Madhya (Pitta)",
        "fav_sign": "Leo", # Full Nakshatra in Leo
        "ruling_planet": "Venus",
        "fast_day":"Friday",
        "mantra" :"ॐ शुक्राय नमः",
        "deity": "Bhaga (God of Prosperity)",
        "symbol": "Front Legs of a Bed/Couch, Hammock",
        "gender": "Female",
        "guna": "Rajasic",
        "dosha": "Pitta",
        "fav_alphabet": ["Mo", "Ta", "Tee", "Tu"],
        "direction": "South",
        "tara":"Sampat Tara",
        "paya":"Tamra (Copper)",
        "pada":{
            "1": {
                "rashi": "Leo",
                "navamsa_sign": "Leo",
                "akshara": "Mo"
            },
            "2": {
                "rashi": "Leo",
                "navamsa_sign": "Virgo",
                "akshara": "Ta"
            },
            "3": {
                "rashi": "Leo",
                "navamsa_sign": "Libra",
                "akshara": "Tee"
            },
            "4": {
                "rashi": "Leo",
                "navamsa_sign": "Scorpio",
                "akshara": "Tu"
            }
        },
    },
    "Uttara Phalguni": {
        "varna": "Kshatriya",
        "yoni": "Gau (Cow)",
        "gana": "Manushya (Human)",
        "nadi": "Aadi (Vata)",
        "fav_sign": "Leo", # Starts in Leo (1 Pada), rest in Virgo
        "ruling_planet": "Sun",
        "fast_day":"Sunday",
        "mantra" : "ॐ सूर्याय नमः",
        "deity": "Aryaman (God of Patronage/Unions)",
        "symbol": "Four Legs of a Bed/Couch, Hammock",
        "gender": "Female",
        "guna": "Sattvic",
        "dosha": "Pitta",
        "fav_alphabet": ["Te", "To", "Pa", "Pee"],
        "direction": "South-East",
        "tara":"Vipat Tara",
        "paya":"Loha (Iron)",
        "pada":{
            "1": {
                "rashi": "Leo",
                "navamsa_sign": "Sagittarius",
                "akshara": "Te"
            },
            "2": {
                "rashi": "Virgo",
                "navamsa_sign": "Capricorn",
                "akshara": "To"
            },
            "3": {
                "rashi": "Virgo",
                "navamsa_sign": "Aquarius",
                "akshara": "Pa"
            },
            "4": {
                "rashi": "Virgo",
                "navamsa_sign": "Pisces",
                "akshara": "Pee"
            }
        },
    },
    "Hasta": {
        "varna": "Vaishya",
        "yoni": "Mahisha (Buffalo)",
        "gana": "Deva (Divine)",
        "nadi": "Aadi (Vata)",
        "fav_sign": "Virgo", # Full Nakshatra in Virgo
        "ruling_planet": "Moon",
        "fast_day":"Monday",
        "mantra" :"ॐ सोमाय नमः",
        "deity": "Savitar (Sun God of Creativity)",
        "symbol": "Hand",
        "gender": "Male",
        "guna": "Rajasic",
        "dosha": "Vata",
        "fav_alphabet": ["Pu", "Sha", "Na", "Tha"],
        "direction": "West",
        "tara":"Keshma Tara",
        "paya":"Rajata (Silver)",
        "pada":{
            "1": {
                "rashi": "Virgo",
                "navamsa_sign": "Aries",
                "akshara": "Pu"
            },
            "2": {
                "rashi": "Virgo",
                "navamsa_sign": "Taurus",
                "akshara": "Sha"
            },
            "3": {
                "rashi": "Virgo",
                "navamsa_sign": "Gemini",
                "akshara": "Na"
            },
            "4": {
                "rashi": "Virgo",
                "navamsa_sign": "Cancer",
                "akshara": "Tha"
            }
        },
    },
    "Chitra": {
        "varna": "Shudra",
        "yoni": "Vyaghra (Tiger)",
        "gana": "Rakshasa (Demonic)",
        "nadi": "Madhya (Pitta)",
        "fav_sign": "Virgo", # Starts in Virgo (2 Padas), rest in Libra
        "ruling_planet": "Mars",
        "fast_day":"Tuesday",
        "mantra" :"ॐ अंगारकाय नमः",
        "deity": "Vishwakarma (Divine Architect)",
        "symbol": "Large Bright Jewel or Pearl",
        "gender": "Female",
        "guna": "Tamasic",
        "dosha": "Pitta",
        "fav_alphabet": ["Pe", "Po", "Ra", "Ree"],
        "direction": "North-West",
        "tara":"Pratyari Tara",
        "paya":"Tamra (Copper)",
        "pada":{
            "1": {
                "rashi": "Virgo",
                "navamsa_sign": "Leo",
                "akshara": "Pe"
            },
            "2": {
                "rashi": "Virgo",
                "navamsa_sign": "Virgo",
                "akshara": "Po"
            },
            "3": {
                "rashi": "Libra",
                "navamsa_sign": "Libra",
                "akshara": "Ra"
            },
            "4": {
                "rashi": "Libra",
                "navamsa_sign": "Scorpio",
                "akshara": "Ree"
            }
        },
    },
    "Swati": {
        "varna": "Shudra",
        "yoni": "Mahisha (Buffalo)",
        "gana": "Deva (Divine)",
        "nadi": "Antya (Kapha)",
        "fav_sign": "Libra", # Full Nakshatra in Libra
        "ruling_planet": "Rahu",
        "fast_day":"Saturday",
        "mantra" :"ॐ राहवे नमः",
        "deity": "Vayu (Wind God)",
        "symbol": "Blade of Grass Swaying in the Wind, Coral",
        "gender": "Female",
        "guna": "Tamasic",
        "dosha": "Pitta",
        "fav_alphabet": ["Ru", "Re", "Ro", "Taa"],
        "direction": "North",
        "tara":"Sadhaka Tara",
        "paya":"Swarna (Gold)",
        "pada":{
            "1": {
                "rashi": "Libra",
                "navamsa_sign": "Sagittarius",
                "akshara": "Ru"
            },
            "2": {
                "rashi": "Libra",
                "navamsa_sign": "Capricorn",
                "akshara": "Re"
            },
            "3": {
                "rashi": "Libra",
                "navamsa_sign": "Aquarius",
                "akshara": "Ro"
            },
            "4": {
                "rashi": "Libra",
                "navamsa_sign": "Pisces",
                "akshara": "Ta"
            }
        },
    },
    "Vishakha": {
        "varna": "Mleccha",
        "yoni": "Vyaghra (Tiger)",
        "gana": "Rakshasa (Demonic)",
        "nadi": "Antya (Kapha)",
        "fav_sign": "Libra", # Starts in Libra (3 Padas), rest in Scorpio
        "ruling_planet": "Jupiter",
        "fast_day":"Thursday",
        "mantra" : "ॐ गुरवे नमः",
        "deity": "Indra-Agni (Indra & Agni)",
        "symbol": "Triumphal Archway, Potters Wheel",
        "gender": "Female",
        "guna": "Sattvic",
        "dosha": "Pitta",
        "fav_alphabet": ["Tee", "Tu", "Te", "To"],
        "direction": "West",
        "tara":"Vadha Tara",
        "paya":"Loha (Iron)",
        "pada":{
            "1": {
                "rashi": "Libra",
                "navamsa_sign": "Aries",
                "akshara": "Tee"
            },
            "2": {
                "rashi": "Libra",
                "navamsa_sign": "Taurus",
                "akshara": "Tu"
            },
            "3": {
                "rashi": "Libra",
                "navamsa_sign": "Gemini",
                "akshara": "Te"
            },
            "4": {
                "rashi": "Scorpio",
                "navamsa_sign": "Cancer",
                "akshara": "To"
            }
        },
    },
    "Anuradha": {
        "varna": "Shudra",
        "yoni": "Mriga (Deer/Stag)",
        "gana": "Deva (Divine)",
        "nadi": "Madhya (Pitta)",
        "fav_sign": "Scorpio", # Full Nakshatra in Scorpio
        "ruling_planet": "Saturn",
        "fast_day":"Saturday",
        "mantra" :"ॐ शनैश्चराय नमः",
        "deity": "Mitra (God of Friendship & Partnerships)",
        "symbol": "Lotus, Staff, Triumphal Archway",
        "gender": "Male",
        "guna": "Tamasic",
        "dosha": "Pitta",
        "fav_alphabet": ["Na", "Nee", "Nu", "Ne"],
        "direction": "North-West",
        "tara":"Mitra Tara",
        "paya": "Tamra (Copper)",
        "pada":{
            "1": {
                "rashi": "Scorpio",
                "navamsa_sign": "Leo",
                "akshara": "Na"
            },
            "2": {
                "rashi": "Scorpio",
                "navamsa_sign": "Virgo",
                "akshara": "Nee"
            },
            "3": {
                "rashi": "Scorpio",
                "navamsa_sign": "Libra",
                "akshara": "Nu"
            },
            "4": {
                "rashi": "Scorpio",
                "navamsa_sign": "Scorpio",
                "akshara": "Ne"
            }
        },
    },
    "Jyeshtha": {
        "varna": "Shudra",
        "yoni": "Mriga (Deer/Stag)",
        "gana": "Rakshasa (Demonic)",
        "nadi": "Aadi (Vata)",
        "fav_sign": "Scorpio", # Full Nakshatra in Scorpio
        "ruling_planet": "Mercury",
        "fast_day":"Wednesday",
        "mantra" :"ॐ बुधाय नमः",
        "deity": "Indra (King of Gods)",
        "symbol": "Earring, Umbrella, Circular amulet",
        "gender": "Male",
        "guna": "Sattvic",
        "dosha": "Vata",
        "fav_alphabet": ["No", "Ya", "Yee", "Yu"],
        "direction": "North-East",
        "tara":"Ati Mitra Tara",
        "paya":"Rajata (Silver)",
        "pada":{
            "1": {
                "rashi": "Scorpio",
                "navamsa_sign": "Sagittarius",
                "akshara": "No"
            },
            "2": {
                "rashi": "Scorpio",
                "navamsa_sign": "Capricorn",
                "akshara": "Ya"
            },
            "3": {
                "rashi": "Scorpio",
                "navamsa_sign": "Aquarius",
                "akshara": "Yee"
            },
            "4": {
                "rashi": "Scorpio",
                "navamsa_sign": "Pisces",
                "akshara": "Yu"
            }
        },
    },
    "Moola": {
        "varna": "Rakshasa", # Sometimes Mleccha or just Rakshasa
        "yoni": "Shwan (Dog)",
        "gana": "Rakshasa (Demonic)",
        "nadi": "Aadi (Vata)",
        "fav_sign": "Sagittarius", # Full Nakshatra in Sagittarius
        "ruling_planet": "Ketu",
        "fast_day":"Tuesday",
        "mantra" :"ॐ केतवे नमः",
        "deity": "Nirriti (Goddess of Calamity/Destruction)",
        "symbol": "Tied bunch of roots, Elephant's prod",
        "gender": "Neuter", # Sometimes male, depends on interpretation
        "guna": "Tamasic",
        "dosha": "Vata",
        "fav_alphabet": ["Ye", "Yo", "Bha", "Bhee"],
        "direction": "South",
        "tara":"Janma Tara",
        "paya": "Loha (Iron)",
        "pada":{
            "1": {
                "rashi": "Sagittarius",
                "navamsa_sign": "Aries",
                "akshara": "Ye"
            },
            "2": {
                "rashi": "Sagittarius",
                "navamsa_sign": "Taurus",
                "akshara": "Yo"
            },
            "3": {
                "rashi": "Sagittarius",
                "navamsa_sign": "Gemini",
                "akshara": "Bha"
            },
            "4": {
                "rashi": "Sagittarius",
                "navamsa_sign": "Cancer",
                "akshara": "Bhee"
            }
        },
    },
    "Purva Ashadha": {
        "varna": "Brahmin",
        "yoni": "Vanara (Monkey)",
        "gana": "Manushya (Human)",
        "nadi": "Madhya (Pitta)",
        "fav_sign": "Sagittarius", # Full Nakshatra in Sagittarius
        "ruling_planet": "Venus",
        "fast_day":"Friday",
        "mantra" :"ॐ शुक्राय नमः",
        "deity": "Apah (Water Goddesses)",
        "symbol": "Elephant's Tusk, Fan, Sieve",
        "gender": "Female",
        "guna": "Rajasic",
        "dosha": "Pitta",
        "fav_alphabet": ["Bhu", "Dha", "Pha", "Dhaa"],
        "direction": "South-East",
        "tara":"Samapt Tara",   
        "paya":"Tamra (Copper)",
        "pada":{
            "1": {
                "rashi": "Sagittarius",
                "navamsa_sign": "Leo",
                "akshara": "Bhu"
            },
            "2": {
                "rashi": "Sagittarius",
                "navamsa_sign": "Virgo",
                "akshara": "Dha"
            },
            "3": {
                "rashi": "Sagittarius",
                "navamsa_sign": "Libra",
                "akshara": "Pha"
            },
            "4": {
                "rashi": "Sagittarius",
                "navamsa_sign": "Scorpio",
                "akshara": "Dhaa"
            }
        },
    },
    "Uttara Ashadha": {
        "varna": "Kshatriya",
        "yoni": "Nakula (Mongoose)",
        "gana": "Manushya (Human)",
        "nadi": "Antya (Kapha)",
        "fav_sign": "Sagittarius", # Starts in Sagittarius (1 Pada), rest in Capricorn
        "ruling_planet": "Sun",
        "fast_day":"Sunday",
        "mantra" : "ॐ सूर्याय नमः",
        "deity": "Vishvadevas (All-Gods)",
        "symbol": "Elephant's Tusk, Cot boards",
        "gender": "Female",
        "guna": "Sattvic",
        "dosha": "Kapha",
        "fav_alphabet": ["Be", "Bo", "Ja", "Jee"],
        "direction": "East",
        "tara":"Vipat Tara",
        "paya":"Rajata (Silver)",
        "pada":{
            "1": {
                "rashi": "Sagittarius",
                "navamsa_sign": "Sagittarius",
                "akshara": "Be"
            },
            "2": {
                "rashi": "Capricorn",
                "navamsa_sign": "Capricorn",
                "akshara": "Bo"
            },
            "3": {
                "rashi": "Capricorn",
                "navamsa_sign": "Aquarius",
                "akshara": "Ja"
            },
            "4": {
                "rashi": "Capricorn",
                "navamsa_sign": "Pisces",
                "akshara": "Jee"
            }
        },
    },
    "Sravana": { # Also spelled Shravana
        "varna": "Mleccha",
        "yoni": "Vanara (Monkey)",
        "gana": "Deva (Divine)",
        "nadi": "Antya (Kapha)",
        "fav_sign": "Capricorn", # Full Nakshatra in Capricorn
        "ruling_planet": "Moon",
        "fast_day":"Monday",
        "mantra" :"ॐ सोमाय नमः",
        "deity": "Vishnu (Preserver God)",
        "symbol": "Ear, Three Footprints",
        "gender": "Male",
        "guna": "Rajasic",
        "dosha": "Kapha",
        "fav_alphabet": ["Khee", "Khu", "Khe", "Kho"],
        "direction": "North",
        "tara":"Keshman Tara",
        "paya":"Tamra (Copper)",
        "pada":{
            "1": {
                "rashi": "Capricorn",
                "navamsa_sign": "Aries",
                "akshara": "Khee"
            },
            "2": {
                "rashi": "Capricorn",
                "navamsa_sign": "Taurus",
                "akshara": "Khu"
            },
            "3": {
                "rashi": "Capricorn",
                "navamsa_sign": "Gemini",
                "akshara": "Khe"
            },
            "4": {
                "rashi": "Capricorn",
                "navamsa_sign": "Cancer",
                "akshara": "Kho"
            }
        },
    },
    "Dhanishtha": {
        "varna": "Shudra",
        "yoni": "Simha (Lion)",
        "gana": "Rakshasa (Demonic)",
        "nadi": "Madhya (Pitta)",
        "fav_sign": "Capricorn", # Starts in Capricorn (2 Padas), rest in Aquarius
        "ruling_planet": "Mars",
        "fast_day":"Tuesday",
        "mantra" :"ॐ अंगारकाय नमः",
        "deity": "Ashta Vasus (Gods of Wealth)",
        "symbol": "Drum, Flute",
        "gender": "Female",
        "guna": "Tamasic",
        "dosha": "Pitta",
        "fav_alphabet": ["Ga", "Gee", "Gu", "Ge"],
        "direction": "West",
        "tara":"Pratyari Tara",
        "paya":"Loha (Iron)",
        "pada":{
            "1": {
                "rashi": "Capricorn",
                "navamsa_sign": "Leo",
                "akshara": "Ga"
            },
            "2": {
                "rashi": "Capricorn",
                "navamsa_sign": "Virgo",
                "akshara": "Gee"
            },
            "3": {
                "rashi": "Aquarius",
                "navamsa_sign": "Libra",
                "akshara": "Gu"
            },
            "4": {
                "rashi": "Aquarius",
                "navamsa_sign": "Scorpio",
                "akshara": "Ge"
            }
        },
    },
    "Shatabhisha": {
        "varna": "Shudra",
        "yoni": "Ashwa (Horse)",
        "gana": "Rakshasa (Demonic)",
        "nadi": "Aadi (Vata)",
        "fav_sign": "Aquarius", # Full Nakshatra in Aquarius
        "ruling_planet": "Rahu",
        "fast_day":"Saturday",
        "mantra" :"ॐ राहवे नमः",
        "deity": "Varuna (God of Cosmic Waters/Laws)",
        "symbol": "Empty Circle, 100 Physicians/Flowers",
        "gender": "Female",
        "guna": "Tamasic",
        "dosha": "Vata",
        "fav_alphabet": ["Go", "Saa", "See", "Su"],
        "direction": "South-West",
        "tara":"Sadhaka Tara",
        "paya":"Swarna (Gold)",
        "pada":{
        "1": {
            "rashi": "Aquarius",
            "navamsa_sign": "Sagittarius",
            "akshara": "Go"
        },
        "2": {
            "rashi": "Aquarius",
            "navamsa_sign": "Capricorn",
            "akshara": "Saa"
        },
        "3": {
            "rashi": "Aquarius",
            "navamsa_sign": "Aquarius",
            "akshara": "See"
        },
        "4": {
            "rashi": "Aquarius",
            "navamsa_sign": "Pisces",
            "akshara": "Su"
        }
    },
    },
    "Purva Bhadrapada": {
        "varna": "Brahmin",
        "yoni": "Simha (Lion)",
        "gana": "Manushya (Human)",
        "nadi": "Aadi (Vata)",
        "fav_sign": "Aquarius", # Starts in Aquarius (3 Padas), rest in Pisces
        "ruling_planet": "Jupiter",
        "fast_day":"Thursday",
        "mantra" : "ॐ गुरवे नमः",
        "deity": "Ajaikapada (One-footed Goat)",
        "symbol": "Front two legs of a bed, Sword",
        "gender": "Male",
        "guna": "Sattvic",
        "dosha": "Vata",
        "fav_alphabet": ["Se", "So", "Da", "Dee"],
        "direction": "North",
        "tara":"Vadha Tara",
        "paya":"Swarna (Gold)",
        "pada":{
            "1": {
                "rashi": "Aquarius",
                "navamsa_sign": "Aries",
                "akshara": "Se"
            },
            "2": {
                "rashi": "Aquarius",
                "navamsa_sign": "Taurus",
                "akshara": "So"
            },
            "3": {
                "rashi": "Aquarius",
                "navamsa_sign": "Gemini",
                "akshara": "Da"
            },
            "4": {
                "rashi": "Pisces",
                "navamsa_sign": "Cancer",
                "akshara": "Dee"
            }
        },
    },
    "Uttara Bhadrapada": {
        "varna": "Kshatriya",
        "yoni": "Gau (Cow)",
        "gana": "Manushya (Human)",
        "nadi": "Madhya (Pitta)",
        "fav_sign": "Pisces", # Full Nakshatra in Pisces
        "ruling_planet": "Saturn",
        "fast_day":"Saturday",
        "mantra" :"ॐ शनैश्चराय नमः",
        "deity": "Ahir Budhnya (Serpent of the Deep)",
        "symbol": "Back two legs of a bed, Twin-faced man",
        "gender": "Male",
        "guna": "Sattvic",
        "dosha": "Pitta",
        "fav_alphabet": ["Du", "Jha", "Nya", "Tha"],
        "direction": "East",
        "tara":"Mitra Tara",
        "paya":"Rajata (Silver)",
        "pada":{
            "1": {
                "rashi": "Pisces",
                "navamsa_sign": "Leo",
                "akshara": "Du"
            },
            "2": {
                "rashi": "Pisces",
                "navamsa_sign": "Virgo",
                "akshara": "Jha"
            },
            "3": {
                "rashi": "Pisces",
                "navamsa_sign": "Libra",
                "akshara": "Nga"
            },
            "4": {
                "rashi": "Pisces",
                "navamsa_sign": "Scorpio",
                "akshara": "Tha"
            }
        },
    },
    "Revati": {
        "varna": "Shudra",
        "yoni": "Gaja (Elephant)",
        "gana": "Deva (Divine)",
        "nadi": "Antya (Kapha)",
        "fav_sign": "Pisces", # Full Nakshatra in Pisces
        "ruling_planet": "Mercury",
        "fast_day":"Wednesday",
        "mantra" :"ॐ बुधाय नमः",
        "deity": "Pushan (God of Journeys/Nourishment)",
        "symbol": "Drum, Fish, Pair of Fish",
        "gender": "Female",
        "guna": "Sattvic",
        "dosha": "Kapha",
        "fav_alphabet": ["De", "Do", "Cha", "Chee"],
        "direction": "West",
        "tara":"Ati Mitra Tara",
        "paya":"Loha (Iron)",
        "pada":{
            "1": {
                "rashi": "Pisces",
                "navamsa_sign": "Sagittarius",
                "akshara": "De"
            },
            "2": {
                "rashi": "Pisces",
                "navamsa_sign": "Capricorn",
                "akshara": "Do"
            },
            "3": {
                "rashi": "Pisces",
                "navamsa_sign": "Aquarius",
                "akshara": "Cha"
            },
            "4": {
                "rashi": "Pisces",
                "navamsa_sign": "Pisces",
                "akshara": "Chee"
            }
        }
    }
}

# --- Global Data / Constants ---
RASHI_DETAILS = {
    0:{
        "Aries": { # Mesha
            "ruler": "Mars",
            "element": "Fire",
            "quality": "Cardinal (Movable)",
            "gender": "Male",
            "vashya": "Chatushpada (Quadruped)", 
            "nature": "Cruel, Fiery",
            "dosha": "Pitta",
            "direction": "East",
            "body_part": "Head, Brain, Face"
        },
    },
    1:{
        "Taurus": { # Vrishabha
            "ruler": "Venus",
            "element": "Earth",
            "quality": "Fixed",
            "gender": "Female",
            "vashya": "Chatushpada (Quadruped)",
            "nature": "Gentle, Steady",
            "dosha": "Kapha",
            "direction": "South",
            "body_part": "Face, Neck, Throat, Teeth"
        },
    },
    2:{
        "Gemini": { # Mithuna
            "ruler": "Mercury",
            "element": "Air",
            "quality": "Mutable (Dual)",
            "gender": "Male",
            "vashya": "Manushya (Human)",
            "nature": "Talkative, Intellectual",
            "dosha": "Vata",
            "direction": "West",
            "body_part": "Arms, Shoulders, Lungs, Hands"
        },
    },
    3:{
        "Cancer": { # Karka
            "ruler": "Moon",
            "element": "Water",
            "quality": "Cardinal (Movable)",
            "gender": "Female",
            "vashya": "Jalachara (Aquatic)",
            "nature": "Gentle, Emotional",
            "dosha": "Kapha",
            "direction": "North",
            "body_part": "Chest, Breasts, Stomach, Ribs"
        },
    },
    4:{
        "Leo": { # Simha
            "ruler": "Sun",
            "element": "Fire",
            "quality": "Fixed",
            "gender": "Male",
            "vashya": "Chatushpada (Quadruped)",
            "nature": "Cruel, Fiery",
            "dosha": "Pitta",
            "direction": "East",
            "body_part": "Heart, Upper back, Spine"
        },
    },
    5:{
        "Virgo": { # Kanya
            "ruler": "Mercury",
            "element": "Earth",
            "quality": "Mutable (Dual)",
            "gender": "Female",
            "vashya": "Manushya (Human)",
            "nature": "Gentle, Analytical",
            "dosha": "Pitta",
            "direction": "South",
            "body_part": "Abdomen, Navel, Intestines"
        },
    },
    6:{
        "Libra": { # Tula
            "ruler": "Venus",
            "element": "Air",
            "quality": "Cardinal (Movable)",
            "gender": "Male",
            "vashya": "Chatushpada (Quadruped)", # Some classify as human, but quadruped is common for Vashya
            "nature": "Gentle, Balanced",
            "dosha": "Vata",
            "direction": "West",
            "body_part": "Kidneys, Lower back, Skin"
        },
    },
    7:{
        "Scorpio": { # Vrishchika
            "ruler": "Mars",
            "element": "Water",
            "quality": "Fixed",
            "gender": "Female",
            "vashya": "Keeta (Insect/Reptile)",
            "nature": "Cruel, Intense",
            "dosha": "Kapha",
            "direction": "North",
            "body_part": "Genitals, Reproductive organs, Anus"
        },
    },
    8:{
        "Sagittarius": { # Dhanu
            "ruler": "Jupiter",
            "element": "Fire",
            "quality": "Mutable (Dual)",
            "gender": "Male",
            "vashya": "Chatushpada (Quadruped)",
            "nature": "Cruel, Fiery",
            "dosha": "Pitta",
            "direction": "East",
            "body_part": "Thighs, Hips, Sacrum"
        },
    },
    9:{
        "Capricorn": { # Makara
            "ruler": "Saturn",
            "element": "Earth",
            "quality": "Cardinal (Movable)",
            "gender": "Female",
            "vashya": "Chatushpada (Quadruped)",
            "nature": "Gentle, Practical",
            "dosha": "Vata",
            "direction": "South",
            "body_part": "Knees, Bones, Skeleton"
        },
    },
    10:{
         "Aquarius": { # Kumbha
            "ruler": "Saturn",
            "element": "Air",
            "quality": "Fixed",
            "gender": "Male",
            "vashya": "Jalachara (Aquatic)",
            "nature": "Gentle, Independent",
            "dosha": "Vata",
            "direction": "West",
            "body_part": "Ankles, Calves, Circulatory system"
        },
    },
    11:{
        "Pisces": { # Meena
            "ruler": "Jupiter",
            "element": "Water",
            "quality": "Mutable (Dual)",
            "gender": "Female",
            "vashya": "Jalachara (Aquatic)",
            "nature": "Gentle, Spiritual",
            "dosha": "Kapha",
            "direction": "North",
            "body_part": "Feet, Lymphatic system"
        },
    },
}

# Karna 
PAKSHA_NAMES = ["Shukla Paksha (Waxing)", "Krishna Paksha (Waning)"]
CHARA_KARANS = ["Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti"]
STHIRA_KARANS = ["Shakuni", "Chatushpada", "Naga", "Kimstughna"]

YOGA_NAMES = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma",
    "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
    "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha",
    "Shukla", "Brahma", "Indra", "Vaidhriti"
]

TITHI_NAMES = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami",
    "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
    "Purnima", # Full Moon (Shukla Paksha 15th)
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami",
    "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
    "Amavasya" # New Moon (Krishna Paksha 15th)
]
NAKSHATRA_SPAN_DEG = 13 + (20/60) # 13 degrees 20 minutes
PADA_SPAN_DEG = NAKSHATRA_SPAN_DEG / 4 # 3 degrees 20 minutes

#longitude and letitude formater
def format_longitude_to_dms(longitude_deg):
    """Converts total degrees (0-360) to Zodiac Sign, Degree, Minute, Second format."""
    total_degrees = longitude_deg % 360 

    sign_index_0based = int(total_degrees / 30)
    degrees_in_sign_decimal = total_degrees % 30

    degrees = int(degrees_in_sign_decimal)
    minutes_decimal = (degrees_in_sign_decimal - degrees) * 60
    minutes = int(minutes_decimal)
    seconds = int((minutes_decimal - minutes) * 60)

    sign_name = RASHI_DETAILS[sign_index_0based]
    
    return f"{degrees}° {minutes}' {seconds}\" {sign_name.split(' ')[0]}"


#basic nakshtra name 
def get_nakshatra_info(moon_long_sidereal):
    """Determines Nakshatra number, name, and Pada from Moon's sidereal longitude."""
    moon_long_sidereal = moon_long_sidereal % 360
    
    nak_index = int(moon_long_sidereal / NAKSHATRA_SPAN_DEG) 
    print(f"nak_index : {nak_index}")
    nakshatra_remainder_deg = moon_long_sidereal % NAKSHATRA_SPAN_DEG
    pada_index = int(nakshatra_remainder_deg / PADA_SPAN_DEG) 
    
    nakshatra_num = nak_index + 1 
    nakshatra_name = NAKSHATRA_NAMES[nak_index]
    nakshatra_details = NAKSHTRA_DETAILS.get(nakshatra_name)
    
    pada_num = pada_index + 1

    return nak_index, nakshatra_num, nakshatra_name, pada_num , nakshatra_details

#rashi name from the nakshtra number and pada number
def get_rashi_from_nakshatra_pada(nakshatra_num, pada_num):
    """Determines the Vedic Moon sign (Chandra Rashi) based on Nakshatra number and Pada."""
    if not (1 <= nakshatra_num <= 27) or not (1 <= pada_num <= 4):
        return "Invalid Input: Nakshatra number must be 1-27, 1-4."

    total_pada_index = (nakshatra_num - 1) * 4 + (pada_num - 1)
    rashi_index = total_pada_index // 9
    print(f"total pada index : {total_pada_index}")
    if 0 <= rashi_index < 12:
        return RASHI_DETAILS.get(rashi_index)
    else:
        return "Error in calculation"
    

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

# yoga finnding logic (no need to change working properly)
def get_yoga(sun_long_sidereal, moon_long_sidereal):
    """Calculates the Yoga based on sum of Sun's and Moon's longitudes."""
    yoga_longitude_total = (sun_long_sidereal + moon_long_sidereal) % 360
    
    yoga_index = int(yoga_longitude_total / NAKSHATRA_SPAN_DEG) 
    
    if 0 <= yoga_index < 27:
        return YOGA_NAMES[yoga_index]
    else:
        return "N/A" 

# vara, tithi_name, paksha, karan, yoga
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

# --- Main Calculation Logic ---
# ----- Input -----
DOB = "2019-12-08"
TOB = "23:59"
LOCATION = "Surat ,Gujarat"

def final_astro_report(DOB:str,TOB:str,LOCATION:str)->dict:
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
            pos_rahu = swe.calc(jd, swe.MEAN_NODE, flags)
            rahu_lon = pos_rahu[0][0]
            ketu_lon = (rahu_lon + 180) % 360
            planet_positions_sidereal["Ketu"] = (ketu_lon, pos_rahu[0][1], pos_rahu[0][2])
        else:
            pos = swe.calc(jd, pid, flags)[0]
            planet_positions_sidereal[name] = pos


    # ----- Panchang Calculations -----
    sun_long_sidereal = planet_positions_sidereal["Sun"][0]
    moon_long_sidereal = planet_positions_sidereal["Moon"][0]


    vara, tithi_name_simple, paksha_name, karan_name, yoga_name = get_vara_tithi_karan_yoga(jd, sun_long_sidereal, moon_long_sidereal)
    full_tithi_name = f"{tithi_name_simple} ({paksha_name})"

    # ----- Nakshatra, Pada, and Rashi for Moon -----
    nakshatra_idx_0based, nakshatra_index_1based, nakshatra_name, nakshatra_pada, nakshtra_all_details = get_nakshatra_info(moon_long_sidereal)
    moon_sign_rashi = get_rashi_from_nakshatra_pada(nakshatra_index_1based, nakshatra_pada)

    # ----- Ascendant and Houses -----
    cusps, ascmc = swe.houses(jd, lat, lon, b'A') 

    output = {
        "DOB":DOB,
        "TOB" :TOB,
        "timezone" : timezone_str,
        "UTC_time" : utc_dt.strftime('%H:%M UTC'),
        "location": LOCATION,
        "latitude":lat,
        "longitude" :lon,
        "julian_Day" : jd,
        "ayanamasa_Used":ayanamsa_used_display,
        "vara":vara,
        "tithi":full_tithi_name,
        "nakshatra_index" : nakshatra_index_1based,
        "nakshatra_name" : nakshatra_name,
        "nakshatra_pada" : nakshatra_pada,
        "nakshtra_all_details" :  nakshtra_all_details,
        "rashi_all_details" : moon_sign_rashi,
        "karan_name" : karan_name,
        "yog_name": yoga_name,
    }
    return output