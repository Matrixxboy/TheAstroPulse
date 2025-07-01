import sys 
import os
from .numlogy import expression_number, life_path_meanings, soul_number_meanings, personality_traits, lucky_list, avoids
from collections import Counter

# Helper function to reduce number to single digit (except 11, 22, 33)
def reduce_number(n):
    if n in [11, 22, 33,44]:
        return n
    while n > 9:
        n = sum(int(d) for d in str(n))
    return n

def numlogy_basic_sums(full_name,dob_str):
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
        day, month, year = dob_str.strip().split("-")
    except ValueError:
        raise ValueError("Date of birth must be in 'DD-MM-YYYY' format")

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

    # Reduce each sum
    master_single = reduce_number(master_sum)
    vowels_single = reduce_number(vowels_sum)
    consonants_single = reduce_number(consonants_sum)


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

    # print(f"\nSoul Urge Number: {vowels_single} - {soule_urge_result}")
    # print(f"\nPersonality Traits: {consonants_single} - {personality_traits_result}")
    # print(f"\nLucky List: {master_single} - {lucky_list_result}")

    # Create a frequency dictionary for all values
    freq = Counter([master_single, vowels_single, consonants_single])
    
    # Prepare the output
    output = {
        "name": full_name,
        "master_sum": master_single,
        "vowels_sum": vowels_single,
        "consonants_sum": consonants_single,
        "life_path_number": life_path_result,
        "soul_urge_number": soule_urge_result,
        "personality_traits": personality_traits_result,
        "lucky_list":lucky_list_result,
        "avoids" : avoids_result,
        "frequency": dict(freq),
    }
    
    return output
