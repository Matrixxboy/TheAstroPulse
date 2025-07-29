from datetime import datetime, timedelta

# Vimshottari Dasha years (planet abbreviation: years)
DASHA_YEARS = {
    "Ke": 7, "Ve": 20, "Su": 6, "Mo": 10,
    "Ma": 7, "Ra": 18, "Ju": 16, "Sa": 19, "Me": 17
}

# Ordered Vimshottari sequence
DASHA_SEQUENCE = ["Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"]

def get_antardasha_dates(maha, start_date, end_date):
    total_days = (end_date - start_date).days
    current = start_date
    results = []

    # Reorder Antardasha sequence to start from the Mahadasha planet
    idx = DASHA_SEQUENCE.index(maha)
    reordered = DASHA_SEQUENCE[idx:] + DASHA_SEQUENCE[:idx]

    for antar in reordered:
        antar_years = DASHA_YEARS[antar]
        duration = round((antar_years / 120) * total_days)
        current = current  # no change
        end = current + timedelta(days=duration)
        results.append(f"{maha}-{antar} - {end.strftime('%d-%m-%Y')}")
        current = end

    return results

# Example
maha = "Ju"  # Mars
start = datetime(2031, 5, 25)
end = datetime(2047, 5, 25)

output = get_antardasha_dates(maha, start, end)

# Print result
for line in output:
    print(line)
