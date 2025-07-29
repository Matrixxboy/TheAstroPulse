from datetime import timedelta ,datetime

VIMSHOTTARI_YEARS = {
    "Ketu": 7,
    "Venus": 20,
    "Sun": 6,
    "Moon": 10,
    "Mars": 7,
    "Rahu": 18,
    "Jupiter": 16,
    "Saturn": 19,
    "Mercury": 17
}

VIMSHOTTARI_SEQUENCE = list(VIMSHOTTARI_YEARS.keys())

def calculate_pratyantardasha(antardasha_lord, antardasha_start, antardasha_end):
    pratyantardasha_list = []
    total_days = (antardasha_end - antardasha_start).days
    total_weight = sum(VIMSHOTTARI_YEARS.values())

    # Start from the Antardasha lord
    start_index = VIMSHOTTARI_SEQUENCE.index(antardasha_lord)
    praty_sequence = VIMSHOTTARI_SEQUENCE[start_index:] + VIMSHOTTARI_SEQUENCE[:start_index]

    current_start = antardasha_start
    for sublord in praty_sequence:
        portion = (VIMSHOTTARI_YEARS[sublord] / total_weight)
        duration_days = int(round(portion * total_days))
        current_end = current_start + timedelta(days=duration_days)

        pratyantardasha_list.append({
            "lord": sublord,
            "start": current_start,
            "end": current_end
        })

        current_start = current_end

    return pratyantardasha_list

