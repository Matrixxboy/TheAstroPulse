from collections import Counter

# Mapping digits to Lo Shu Grid positions
grid_map = {
    '1': (2, 1), '2': (0, 2), '3': (1, 0), '4': (0, 0), '5': (1, 1),
    '6': (2, 2), '7': (1, 2), '8': (2, 0), '9': (0, 1),
}

# Numerology meanings
meanings = {
    '1': 'Leader, ambitious, confident',
    '2': 'Emotional, cooperative, sensitive',
    '3': 'Creative, expressive, joyful',
    '4': 'Disciplined, practical, stable',
    '5': 'Balanced, freedom-loving',
    '6': 'Responsible, caring, family-oriented',
    '7': 'Spiritual, wise, introspective',
    '8': 'Business-minded, organized, goal-driven',
    '9': 'Compassionate, humanitarian',
}

# Helper to reduce to single digit
def reduce_to_single_digit(n):
    while n > 9:
        n = sum(int(d) for d in str(n))
    return n

# Calculate driver, connector, kua
def calculate_driver_connector_kua(day, month, year, gender):
    driver = day if day < 10 else int(str(day)[0])
    connector = sum(int(d) for d in f"{day:02d}{month:02d}{year}")
    connector = reduce_to_single_digit(connector)

    year_sum = sum(int(d) for d in str(year))
    reduced_year = reduce_to_single_digit(year_sum)

    if gender.lower() == 'male':
        kua = 11 - reduced_year
    else:
        kua = reduced_year + 4

    kua = reduce_to_single_digit(kua)
    if kua == 5:
        kua = 2 if gender.lower() == 'male' else 8

    return driver, connector, kua

# Generate Lo Shu Grid with extras
def generate_lo_shu_grid_with_extras(birthdate, driver, connector, kua):
    digits = [ch for ch in birthdate if ch.isdigit()]
    digits += [str(driver), str(connector), str(kua)]
    freq = Counter(digits)
    grid = [[' ' for _ in range(3)] for _ in range(3)]
    for num, (i, j) in grid_map.items():
        count = freq.get(num, 0)
        grid[i][j] = num * count if count > 0 else '-'
    return grid, freq

# Print report
def print_report_with_extras(date_str, gender='male'):
    output = []
    output.append(f"📅 Birthdate: {date_str} | Gender: {gender.capitalize()}")
    day, month, year = map(int, date_str.split('-'))
    driver, connector, kua = calculate_driver_connector_kua(day, month, year, gender)
    grid, freq = generate_lo_shu_grid_with_extras(date_str, driver, connector, kua)

    output.append("\n🔮 Lo Shu Grid (with Driver, Connector, Kua):")
    for row in grid:
        output.append(' | '.join(row))

    output.append("\n📘 Digit Interpretation:")
    for i in range(1, 10):
        num = str(i)
        output.append(f"{num} → {meanings[num]} ({freq.get(num, 0)} times)")

    output.append(f"\n🚗 Driver Number: {driver}")
    output.append(f"🔗 Connector Number: {connector}")
    output.append(f"🧭 Kua Number: {kua}")

    result = '\n'.join(output)
    print(result)
    return result

# Example test
print_report_with_extras("14-07-2004", "male")
