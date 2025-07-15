import sys 
import os
import re
from .numlogy import expression_number, life_path_meanings, soul_number_meanings, personality_traits, lucky_list, avoids
from collections import Counter

# Helper function to reduce number to single digit (except 11, 22, 33)
def reduce_number(n):
    if n in [11, 22, 33,44]:
        return n
    while n > 9:
        n = sum(int(d) for d in str(n))
    return n
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
    # Input Validation for DOB format    
    dob_match = re.match(r'^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$', dob)
    if not dob_match:
        raise ValueError("DOB must be in 'YYYY-MM-DD' or 'YYYY/MM/DD' format.")

    year, month, day = int(dob_match.group(1)), int(dob_match.group(2)), int(dob_match.group(3))

    try:
        # Validate if the date is a real date
        datetime(year, month, day)
    except ValueError:
        raise ValueError("Invalid date provided in DOB.")

    dob_digits = [int(d) for d in str(day) + str(month) + str(year) if d.isdigit() and d != '0']

    driver = calculate_driver_number(day)
    connector = calculate_connector_number(day, month, year)
    kua = calculate_kua_number(year, gender)

    all_numbers_for_grid = dob_digits + [driver, connector, kua]

    lo_shu_counts = {i: '' for i in range(1, 10)}
    for num in all_numbers_for_grid:
        if 1 <= num <= 9:
            lo_shu_counts[num] += str(num) # Append the digit itself for visual representation

    grid_order = [4, 9, 2, 3, 5, 7, 8, 1, 6]
    grid_flat = [lo_shu_counts[i] for i in grid_order]
    return grid_flat


def name_numlogy_basic_sums(full_name,dob_str,gender):
    letters = [char.upper() for char in full_name if char.isalpha()]
    vowel_stack = []
    consonant_stack = []
    all_values_stack = []
    vowels = set('AEIOU')

    
    # Process each character
    for char in letters:
        value = expression_number.get(char, 0)

        if char in vowels:
            vowel_stack.append(value)
        else:
            consonant_stack.append(value)

    #for date of birth processing
    # Input: dob_str in 'DD-MM-YYYY' format  
    try:
         year,month,day = dob_str.strip().split("-")
    except ValueError:
        raise ValueError("Date of birth must be in 'DD-MM-YYYY' format")
    

    #kua number 
    gyear = int(year)
    last_two = gyear % 100
    digit_sum = sum(map(int, str(last_two)))
    kua = 0
    if gyear >= 2000:
        if gender.lower() == 'male':
            kua = 9 - digit_sum
        else:
            kua = digit_sum + 5
    else:
        if gender.lower() == 'male':
            kua = 10 - digit_sum
        else:
            kua = digit_sum + 5

    # Reduce to 1 digit
    while kua > 9:
        kua = sum(map(int, str(kua)))
    
    # Special rule: if kua == 5
    if kua == 5:
        if gender.lower() == 'male':
            kua = 2
        else:
            kua = 8

    # Get individual digits
    all_digits = [int(ch) for ch in dob_str if ch.isdigit()]
    all_values_stack = all_digits.copy()
    day_digits = [int(ch) for ch in day]
    month_digits = [int(ch) for ch in month]
    year_digits = [int(ch) for ch in year]
    
    # Sum each
    day_sum = sum(day_digits)
    month_sum = sum(month_digits)
    year_sum = sum(year_digits)
    full_sum = sum(all_digits)
    
    # Reduced versions
    reduced_day = reduce_number(day_sum)
    reduced_month = reduce_number(month_sum)
    reduced_year = reduce_number(year_sum)
    reduced_total = reduce_number(full_sum)    

    # print(f"Day Digits: {day_digits}, Month Digits: {month_digits}, Year Digits: {year_digits} -> All Digits: {all_digits}")
    
    # Compute sums
    master_sum = reduced_total
    vowels_sum = sum(vowel_stack)
    consonants_sum = sum(consonant_stack)
    name_number_sum = vowels_sum+consonants_sum
    

    # Reduce each sum
    master_single = reduce_number(master_sum)
    vowels_single = reduce_number(vowels_sum)
    consonants_single = reduce_number(consonants_sum)
    name_number_single = reduce_number(name_number_sum)
    connector_number_single = reduce_number(full_sum)
    driver_number_single= reduce_number(day_sum)




    # Output results
    # print("All Letters Stack (Master Sum):", all_values_stack)
    # print("Vowels Stack:", vowel_stack)
    # print("Consonants Stack:", consonant_stack)

    # print(f"\nMaster Sum (All): {master_single}")
    # print(f"Vowels Sum: {vowels_single}")
    # print(f"Consonants Sum: {consonants_single}")

    life_path_result = life_path_meanings.get(master_single, "Unknown Life Path Number")
    soule_urge_result = soul_number_meanings.get(vowels_single, "Unknown Soul Urge Number")
    personality_traits_result = personality_traits.get(consonants_single, "Unknown Personality Traits")
    lucky_list_result = lucky_list.get(master_single, "No Lucky List Available")
    avoids_result = avoids.get(master_single, "No Avoids Available")   
    lo_shu_grid = generate_lo_shu_grid(dob_str,gender)

    # print(f"\nSoul Urge Number: {vowels_single} - {soule_urge_result}")
    # print(f"\nPersonality Traits: {consonants_single} - {personality_traits_result}")
    # print(f"\nLucky List: {master_single} - {lucky_list_result}")

    # Create a frequency dictionary for all values
    freq = Counter([master_single, vowels_single, consonants_single])
    
    # Prepare the output
    output = {
        "name": full_name,
        "name_number":name_number_single,
        "master_sum": master_single,
        "vowels_sum": vowels_single,
        "consonants_sum": consonants_single,
        "life_path_number": life_path_result,
        "soul_urge_number": soule_urge_result,
        "personality_traits": personality_traits_result,
        "lucky_list":lucky_list_result,
        "avoids" : avoids_result,
        "frequency": dict(freq),
        "connector_number":connector_number_single,
        "driver_number":driver_number_single,
        "kua_number" : kua,
        "lo_shu_grid" : lo_shu_grid
    }
    return output

def business_numerology_basic_sums(business_name):
    # 🔍 Clean the business name: keep only A-Z letters
    cleaned_name = ''.join(char.upper() for char in business_name if char.isalpha())

    if not cleaned_name:
        return {
            "error": "Business name must contain at least one alphabet letter (A–Z)."
        }

    vowels = set('AEIOU')
    vowel_stack = []
    consonant_stack = []

    for char in cleaned_name:
        value = expression_number.get(char, 0)
        if char in vowels:
            vowel_stack.append(value)
        else:
            consonant_stack.append(value)

    vowels_sum = sum(vowel_stack)
    consonants_sum = sum(consonant_stack)
    master_sum = vowels_sum + consonants_sum
    name_number_sum = master_sum

    full_sum = master_sum  # Connector number

    # Reduce numbers
    name_number_single = reduce_number(name_number_sum)
    vowels_single = reduce_number(vowels_sum)
    consonants_single = reduce_number(consonants_sum)
    master_single = reduce_number(master_sum)
    connector_number_single = reduce_number(full_sum)


    freq = Counter([name_number_single, vowels_single, consonants_single])

    output = {
        "business_name": business_name,
        "cleaned_name": cleaned_name,
        "name_number": name_number_single,
        "master_sum": master_single,
        "vowels_sum": vowels_single,
        "consonants_sum": consonants_single,
        "frequency": dict(freq),
        "connector_number": connector_number_single,
       
    }
    
    return output
