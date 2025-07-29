from datetime import datetime
from dateutil.relativedelta import relativedelta
from collections import OrderedDict

# Sample Vimshottari Dasha Sequence (planet, duration in years)
DASHA_SEQUENCE = [
    ("Ketu", 7),
    ("Venus", 20),
    ("Sun", 6),
    ("Moon", 10),
    ("Mars", 7),
    ("Rahu", 18),
    ("Jupiter", 16),
    ("Saturn", 19),
    ("Mercury", 17),
]

def get_vimshottari_dasha_full(dob_str, tob_str, moon_nakshatra_lord):
    dob = datetime.strptime(f"{dob_str} {tob_str}", "%d-%m-%Y %H:%M")

    # Find the starting point in the dasha cycle
    start_index = next(i for i, (planet, _) in enumerate(DASHA_SEQUENCE) if planet == moon_nakshatra_lord)
    reordered = DASHA_SEQUENCE[start_index:] + DASHA_SEQUENCE[:start_index]

    result = OrderedDict()
    current_start = dob

    for planet, duration in reordered:
        current_end = current_start + relativedelta(years=duration)
        result[planet] = {
            "start_date": current_start.strftime("%d-%m-%Y"),
            "end_date": current_end.strftime("%d-%m-%Y")
        }
        current_start = current_end

    return result

dasha_data = get_vimshottari_dasha_full("14-07-2004", "07:15", "Moon")
from pprint import pprint
pprint(dasha_data)
