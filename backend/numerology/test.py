import re
from datetime import datetime

def reduce_to_single_digit(n: int) -> int:
    """
    Reduces a number to a single digit by repeatedly summing its digits.
    This is also known as the digital root.
    """
    if not isinstance(n, int):
        raise TypeError("Input must be an integer.")
    if n < 0:
        n = abs(n) # Handle negative numbers by taking their absolute value

    while n > 9:
        n = sum(int(d) for d in str(n))
    return n

def calculate_driver_number(dob_day: int) -> int:
    """Calculates the Driver Number from the day of birth."""
    return reduce_to_single_digit(dob_day)

def calculate_connector_number(dob_day: int, dob_month: int, dob_year: int) -> int:
    """Calculates the Connector Number from the full date of birth."""
    full_dob_sum = reduce_to_single_digit(dob_day) + reduce_to_single_digit(dob_month) + reduce_to_single_digit(dob_year)
    return reduce_to_single_digit(full_dob_sum)

def calculate_kua_number(dob_year: int, gender: str) -> int:
    """
    Calculates the Kua Number based on the birth year and gender.
    This uses the traditional Chinese solar calendar year for Kua calculations,
    which typically starts around February 4th. For simplicity, this function
    uses the Gregorian year, which is a common simplification in popular numerology.
    For strict accuracy, a more complex date range check for the Chinese New Year
    would be needed.
    """
    if gender.lower() not in ['male', 'female']:
        raise ValueError("Gender must be 'male' or 'female'.")

    # Kua number calculation typically uses the year of birth.
    # For a more precise Kua calculation, one would need to determine the
    # Chinese solar year start (around Feb 4th) for the given year.
    # For simplicity, we'll use the Gregorian year.

    reduced_year = reduce_to_single_digit(dob_year)

    if gender.lower() == 'male':
        kua = 11 - reduced_year
        if kua == 5: # 5 is replaced with 2 for males
            return 2
        return reduce_to_single_digit(kua)
    else: # female
        kua = reduced_year + 4
        if kua == 5: # 5 is replaced with 8 for females
            return 8
        return reduce_to_single_digit(kua)

def generate_lo_shu_grid(dob: str, gender: str, as_matrix: bool = False):
    """
    Generates a Lo Shu Grid based on the date of birth, gender,
    and derived numerological numbers.

    Args:
        dob (str): Date of birth in "DD-MM-YYYY" or "DD/MM/YYYY" format.
        gender (str): 'male' or 'female' for Kua number calculation.
        as_matrix (bool): If True, returns the grid as a 3x3 matrix.
                          Otherwise, returns a flat list in Lo Shu order.

    Returns:
        list or list of lists: The Lo Shu Grid.
    """
    # Input Validation for DOB format
    dob_match = re.match(r'^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$', dob)
    if not dob_match:
        raise ValueError("DOB must be in 'DD-MM-YYYY' or 'DD/MM/YYYY' format.")

    day, month, year = int(dob_match.group(1)), int(dob_match.group(2)), int(dob_match.group(3))

    try:
        # Validate if the date is a real date
        datetime(year, month, day)
    except ValueError:
        raise ValueError("Invalid date provided in DOB.")

    # 1. Extract digits from DOB (excluding zeros as per common Lo Shu practice)
    # The digits in the DOB itself are usually used to populate the grid.
    dob_digits = [int(d) for d in str(day) + str(month) + str(year) if d.isdigit() and d != '0']

    # 2. Calculate Driver, Connector, and Kua numbers
    driver = calculate_driver_number(day)
    connector = calculate_connector_number(day, month, year)
    kua = calculate_kua_number(year, gender)

    # 3. Combine all relevant numbers
    # This list will hold all numbers that populate the Lo Shu grid.
    all_numbers_for_grid = dob_digits + [driver, connector, kua]

    # 4. Count frequency for digits 1-9
    # Each digit's presence is often represented by repeating the digit in its cell.
    lo_shu_counts = {i: '' for i in range(1, 10)}
    for num in all_numbers_for_grid:
        if 1 <= num <= 9:
            lo_shu_counts[num] += str(num) # Append the digit itself for visual representation

    # 5. Lo Shu spatial order (standard grid mapping)
    # The Lo Shu square has a fixed arrangement of numbers:
    # 4 9 2
    # 3 5 7
    # 8 1 6
    grid_order = [4, 9, 2, 3, 5, 7, 8, 1, 6]

    if as_matrix:
        grid_matrix = [
            [lo_shu_counts[4], lo_shu_counts[9], lo_shu_counts[2]],
            [lo_shu_counts[3], lo_shu_counts[5], lo_shu_counts[7]],
            [lo_shu_counts[8], lo_shu_counts[1], lo_shu_counts[6]]
        ]
        return grid_matrix
    else:
        grid_flat = [lo_shu_counts[i] for i in grid_order]
        return grid_flat

# --- Example Usage ---
if __name__ == "__main__":
    # Example 1: Basic usage
    dob1 = "14-07-2004"
    gender1 = "male"
    print(f"DOB: {dob1}, Gender: {gender1}")

    try:
        driver_num1 = calculate_driver_number(int(dob1.split('-')[0]))
        print(f"Driver Number: {driver_num1}")

        connector_num1 = calculate_connector_number(15, 3, 1985)
        print(f"Connector Number: {connector_num1}")

        kua_num1 = calculate_kua_number(1985, gender1)
        print(f"Kua Number: {kua_num1}")

        lo_shu_flat1 = generate_lo_shu_grid(dob1, gender1)
        print("Lo Shu Grid (flat):", lo_shu_flat1)

        lo_shu_matrix1 = generate_lo_shu_grid(dob1, gender1, as_matrix=True)
        print("Lo Shu Grid (matrix):")
        for row in lo_shu_matrix1:
            print(row)
        print("-" * 30)

    except ValueError as e:
        print(f"Error: {e}")

    # Example 2: Another DOB
    dob2 = "01/01/2000"
    gender2 = "female"
    print(f"DOB: {dob2}, Gender: {gender2}")
    try:
        driver_num2 = calculate_driver_number(int(dob2.split('/')[0]))
        print(f"Driver Number: {driver_num2}")

        connector_num2 = calculate_connector_number(1, 1, 2000)
        print(f"Connector Number: {connector_num2}")

        kua_num2 = calculate_kua_number(2000, gender2)
        print(f"Kua Number: {kua_num2}")

        lo_shu_matrix2 = generate_lo_shu_grid(dob2, gender2, as_matrix=True)
        print("Lo Shu Grid (matrix):")
        for row in lo_shu_matrix2:
            print(row)
        print("-" * 30)

    except ValueError as e:
        print(f"Error: {e}")

    # Example 3: Invalid DOB format
    dob_invalid = "15-Mar-1985"
    gender_invalid = "male"
    print(f"DOB: {dob_invalid}, Gender: {gender_invalid}")
    try:
        generate_lo_shu_grid(dob_invalid, gender_invalid)
    except ValueError as e:
        print(f"Error for invalid DOB: {e}")

    # Example 4: Invalid Date
    dob_invalid_date = "14-07-2004" # February does not have 31 days
    gender_invalid_date = "male"
    print(f"DOB: {dob_invalid_date}, Gender: {gender_invalid_date}")
    try:
        generate_lo_shu_grid(dob_invalid_date, gender_invalid_date)
    except ValueError as e:
        print(f"Error for invalid date: {e}")