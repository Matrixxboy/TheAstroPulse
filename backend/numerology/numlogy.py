# Pythagorean numerology chart
expression_number = {
    'A':1,'J':1,'S':1,
    'B':2,'K':2,'T':2,
    'C':3,'L':3,'U':3,
    'D':4,'M':4,'V':4,
    'E':5,'N':5,'W':5,
    'F':6,'O':6,'X':6,
    'G':7,'P':7,'Y':7,
    'H':8,'Q':8,'Z':8,
    'I':9,'R':9  
}


# Soul Number  (From Vowels only in full name)
# Best careers
soul_number_meanings = {
    1: {
        'description': 'Independent, pioneering, leadership qualities',
        'traits': ['Leadership', 'Individualism', 'Confidence'],
        'career': ["Entrepreneur", "Leader", "Army Officer", "Engineer"]
    },
    2: {
        'description': 'Diplomatic, sensitive, cooperative',
        'traits': ['Sensitivity', 'Cooperation', 'Intuition'],
        'career': ["Counselor", "Diplomat", "Psychologist", "Teacher", "Mediator", "HR", "Nurse"]
    },
    3: {
        'description': 'Creative, expressive, sociable',
        'traits': ['Creativity', 'Expression', 'Joyfulness'],
        'career': ["Artist", "Writer", "Actor", "Musician", "Public Speaker"]
    },
    4: {
        'description': 'Practical, disciplined, hardworking',
        'traits': ['Discipline', 'Stability', 'Practicality'],
        'career': ["Accountant", "Engineer", "Scientist", "Architect", "Project Manager"]
    },
    5: {
        'description': 'Adventurous, freedom-loving, adaptable',
        'traits': ['Adventure', 'Freedom', 'Adaptability'],
        'career': ["Travel Blogger", "Pilot", "Salesperson", "Consultant", "Entrepreneur"]
    },
    6: {
        'description': 'Nurturing, responsible, family-oriented',
        'traits': ['Nurturing', 'Responsibility', 'Family'],
        'career': ["Teacher", "Nurse", "Social Worker", "Counselor", "Family Therapist"]
    },
    7: {
        'description': 'Intellectual, introspective, spiritual',
        'traits': ['Introspection', 'Spirituality', 'Wisdom'],
        'career': ["Philosopher", "Scientist", "Researcher", "Psychologist", "Spiritual Leader"]
    },
    8: {
        'description': 'Ambitious, business-minded, organized',
        'traits': ['Ambition', 'Organization', 'Goal-oriented'],
        'career': ["Business Executive", "Manager", "Entrepreneur", "Financial Analyst", "Lawyer"]
    },
    9: {
        'description': 'Compassionate, humanitarian, idealistic',
        'traits': ['Compassion', 'Humanitarianism', 'Idealism'],
        'career': ["Nonprofit Worker", "Activist", "Social Worker", "Counselor", "Philanthropist"]
    },
    11: {
        'description': 'Master number, spiritual insight, intuition',
        'traits': ['Spirituality', 'Intuition', 'Insight'],
        'career': ["Spiritual Leader", "Psychic", "Counselor", "Healer", "Teacher"]
    },
    22: {
        'description': 'Master builder, practical, visionary',
        'traits': ['Practicality', 'Vision', 'Leadership'],
        'career': ["Architect", "Engineer", "Project Manager", "Urban Planner", "Entrepreneur"]
    },
    33: {
        'description': 'Master teacher, selflessness, compassion',
        'traits': ['Selflessness', 'Compassion', 'Teaching'],
        'career': ["Teacher", "Counselor", "Social Worker", "Healer", "Spiritual Leader"]
    },
    44: {
        'description': 'Master architect, discipline, hard work',
        'traits': ['Discipline', 'Hard Work', 'Structure'],
        'career': ["Engineer", "Architect", "Project Manager", "Scientist", "Financial Analyst"]
    },

    # Uncomment the following lines if you want to include master numbers (will use in future)
    # 55: {
    #     'description': 'Master of change, adaptability, freedom',
    #     'traits': ['Change', 'Adaptability', 'Freedom'],
    #     'career': ["Entrepreneur", "Consultant", "Travel Blogger", "Salesperson", "Adventurer"]
    # },
    # 66: {
    #     'description': 'Master of love, nurturing, responsibility',
    #     'traits': ['Love', 'Nurturing', 'Responsibility'],
    #     'career': ["Teacher", "Nurse", "Social Worker", "Counselor", "Family Therapist"]
    # },
    # 77: {
    #     'description': 'Master of wisdom, introspection, spirituality',
    #     'traits': ['Wisdom', 'Introspection', 'Spirituality'],
    #     'career': ["Philosopher", "Scientist", "Researcher", "Psychologist", "Spiritual Leader"]
    # },
    # 88: {
    #     'description': 'Master of power, ambition, organization',
    #     'traits': ['Power', 'Ambition', 'Organization'],
    #     'career': ["Business Executive", "Manager", "Entrepreneur", "Financial Analyst", "Lawyer"]
    # },
    # 99: {
    #     'description': 'Master of compassion, humanitarianism, idealism',
    #     'traits': ['Compassion', 'Humanitarianism', 'Idealism'],
    #     'career': ["Nonprofit Worker", "Activist", "Social Worker", "Counselor", "Philanthropist"]
    # },
    # 111: {
    #     'description': 'Master of spiritual insight, intuition, leadership',
    #     'traits': ['Spirituality', 'Intuition', 'Leadership'],
    #     'career': ["Spiritual Leader", "Psychic", "Counselor", "Healer", "Teacher"]
    # },
    # 222: {
    #     'description': 'Master of practical vision, organization, leadership',
    #     'traits': ['Practicality', 'Vision', 'Leadership'],
    #     'career': ["Architect", "Engineer", "Project Manager", "Urban Planner", "Entrepreneur"]
    # },
    # 333: {
    #     'description': 'Master of selflessness, compassion, teaching',
    #     'traits': ['Selflessness', 'Compassion', 'Teaching'],
    #     'career': ["Teacher", "Counselor", "Social Worker", "Healer", "Spiritual Leader"]
    # },
    # 444: {
    #     'description': 'Master of discipline, hard work, structure',
    #     'traits': ['Discipline', 'Hard Work', 'Structure'],
    #     'career': ["Engineer", "Architect", "Project Manager", "Scientist", "Financial Analyst"]
    # },
    # 555: {
    #     'description': 'Master of change, adaptability, freedom',
    #     'traits': ['Change', 'Adaptability', 'Freedom'],
    #     'career': ["Entrepreneur", "Consultant", "Travel Blogger", "Salesperson", "Adventurer"]
    # },
    # 666: {
    #     'description': 'Master of love, nurturing, responsibility',
    #     'traits': ['Love', 'Nurturing', 'Responsibility'],
    #     'career': ["Teacher", "Nurse", "Social Worker", "Counselor", "Family Therapist"]
    # },
    # 777: {
    #     'description': 'Master of wisdom, introspection, spirituality',
    #     'traits': ['Wisdom', 'Introspection', 'Spirituality'],
    #     'career': ["Philosopher", "Scientist", "Researcher", "Psychologist", "Spiritual Leader"]
    # },
    # 888: {
    #     'description': 'Master of power, ambition, organization',
    #     'traits': ['Power', 'Ambition', 'Organization'],
    #     'career': ["Business Executive", "Manager", "Entrepreneur", "Financial Analyst", "Lawyer"]
    # },
    # 999: {
    #     'description': 'Master of compassion, humanitarianism, idealism',
    #     'traits': ['Compassion', 'Humanitarianism', 'Idealism'],
    #     'career': ["Nonprofit Worker", "Activist", "Social Worker", "Counselor", "Philanthropist"]
    # },
    # 1111: {
    #     'description': 'Master of spiritual insight, intuition, leadership',
    #     'traits': ['Spirituality', 'Intuition', 'Leadership'],
    #     'career': ["Spiritual Leader", "Psychic", "Counselor", "Healer", "Teacher"]
    # },
    # 2222: {
    #     'description': 'Master of practical vision, organization, leadership',
    #     'traits': ['Practicality', 'Vision', 'Leadership'],
    #     'career': ["Architect", "Engineer", "Project Manager", "Urban Planner", "Entrepreneur"]
    # },
}




# Lucky Days 
lucky_list = {
    1: {
        'day': 'Sunday',
        'planet': 'Sun',
        'description': 'A day for new beginnings and setting intentions.',
        'lucky_numbers': [1, 4, 7],
        'lucky_colors': ['Red', 'White'],
        'lucky_stones': ['Ruby', 'Pearl']
    },
    2: {
        'day': 'Monday',
        'planet': 'Moon',
        'description': 'A day for emotions, intuition, and nurturing.',
        'lucky_numbers': [2, 5, 8],
        'lucky_colors': ['Silver', 'White'],
        'lucky_stones': ['Moonstone', 'Pearl']
    },
    3: {
        'day': 'Thursday',
        'planet': 'Jupiter',
        'description': 'A day for growth, expansion, and abundance.',
        'lucky_numbers': [3, 6, 9], 
        'lucky_colors': ['Yellow', 'Purple'],
        'lucky_stones': ['Yellow Sapphire', 'Amethyst']
    },
    4: {
        'day': 'saturday',
        'planet': 'Rahu/Uranus',
        'description': 'A day for discipline, hard work, and overcoming obstacles.',
        'lucky_numbers': [4, 8, 1], 
        'lucky_colors': ['Black', 'Blue'],
        'lucky_stones': ['Blue Sapphire', 'Black Tourmaline']
    },
    5: {
        'day': 'Wednesday',
        'planet': 'Mercury',
        'description': 'A day for communication, intellect, and adaptability.',
        'lucky_numbers': [5, 7, 2],
        'lucky_colors': ['Green', 'Yellow'],
        'lucky_stones': ['Emerald', 'Peridot']
    },
    6:{
        'day': 'Friday',
        'planet': 'Venus',
        'description': 'A day for love, beauty, and harmony.',
        'lucky_numbers': [6, 3, 9],
        'lucky_colors': ['Pink', 'White'],
        'lucky_stones': ['Diamond', 'Rose Quartz']
    },
    7 : {
        'day': 'Monday & Saturday',
        'planet' : 'Ketu/Neptune',
        'description': 'A day for discipline, hard work, and overcoming obstacles.',
        'lucky_numbers': [7, 4, 1],
        'lucky_colors': ['Black', 'Blue'],
        'lucky_stones': ['Blue Sapphire', 'Black Tourmaline']
    },
    8 : {
        'day': 'Thursday',  
        'planet': '	Saturn',
        'description': 'A day for growth, expansion, and abundance.',
        'lucky_numbers': [8, 3, 6],
        'lucky_colors': ['Yellow', 'Purple'],
        'lucky_stones': ['Yellow Sapphire', 'Amethyst']
    },
    9 : {
        'day' : 'Tuseday',
        'planet': 'Mars',
        'description': 'A day for action, courage, and assertiveness.',
        'lucky_numbers': [9, 1, 5],
        'lucky_colors': ['Red', 'Orange'],
        'lucky_stones': ['Red Coral', 'Carnelian']
    },
    11 : {
        'day': 'Monday & Thursday',
        'planet': 'Moon + Neptune',
        'description': 'A day for intuition, creativity, and spiritual growth.',
        'lucky_numbers': [11, 2, 6],
        'lucky_colors': ['Silver', 'Blue'],
        'lucky_stones': ['Moonstone', 'Lapis Lazuli']
    },
    22 :{
        'day': 'Saturday & Sunday',
        'planet': 'Uranus + Moon',
        'description': 'A day for innovation, intuition, and spiritual insight.',
        'lucky_numbers': [22, 4, 8],
        'lucky_colors': ['Black', 'Purple'],
        'lucky_stones': ['Black Tourmaline', 'Amethyst']
    },
    33 : {
        'day': 'Friday & Sunday',
        'planet': 'Venus + Sun',
        'description': 'A day for love, creativity, and spiritual growth.',
        'lucky_numbers': [33, 6, 9],
        'lucky_colors': ['Pink', 'Gold'],
        'lucky_stones': ['Rose Quartz', 'Citrine']
    },
}


# Avoids 
avoids = {
    1: {
        'day': 'Sunday',
        'description': 'Avoid starting new ventures or making major decisions.',
        'lucky_numbers': [1, 4, 7],
        'lucky_colors': ['Red', 'White'],
        'lucky_stones': ['Ruby', 'Pearl']
    },
    2: {
        'day': 'Monday',
        'description': 'Avoid emotional conflicts and focus on self-care.',
        'lucky_numbers': [2, 5, 8],
        'lucky_colors': ['Silver', 'White'],
        'lucky_stones': ['Moonstone', 'Pearl']
    },
    3: {
        'day': 'Thursday',
        'description': 'Avoid overindulgence and focus on practical matters.',
        'lucky_numbers': [3, 6, 9], 
        'lucky_colors': ['Yellow', 'Purple'],
        'lucky_stones': ['Yellow Sapphire', 'Amethyst']
    },
    4: {
        'day': 'saturday',
        'description': 'Avoid procrastination and focus on completing tasks.',
        'lucky_numbers': [4, 8, 1], 
        'lucky_colors': ['Black', 'Blue'],
        'lucky_stones': ['Blue Sapphire', 'Black Tourmaline']
    },
    5: {
        'day': 'Wednesday',
        'description': 'Avoid misunderstandings and focus on clear communication.',
        'lucky_numbers': [5, 7, 2],
        'lucky_colors': ['Green', 'Yellow'],
        'lucky_stones': ['Emerald', 'Peridot']
    },
    6: {
        'day': 'Friday',
        'description': 'Avoid conflicts in relationships and focus on harmony.',
        'lucky_numbers': [6, 3, 9],
        'lucky_colors': ['Pink', 'White'],
        'lucky_stones': ['Diamond', 'Rose Quartz']
    },
    7: {
        'day': 'Monday & Saturday',
        'description': 'Avoid impulsive decisions and focus on discipline.',
        'lucky_numbers': [7, 4, 1],
        'lucky_colors': ['Black', 'Blue'],
        'lucky_stones': ['Blue Sapphire', 'Black Tourmaline']
    },
    8: {
        'day': 'Thursday',  
        'description': 'Avoid overconfidence and focus on practical matters.',
        'lucky_numbers': [8, 3, 6],
        'lucky_colors': ['Yellow', 'Purple'],
        'lucky_stones': ['Yellow Sapphire', 'Amethyst']
    },
    9: {
        'day': 'Tuseday',
        'description': 'Avoid rash actions and focus on patience.',
        'lucky_numbers': [9, 1, 5],
        'lucky_colors': ['Red', 'Orange'],
        'lucky_stones': ['Red Coral', 'Carnelian']
    },
    11: {
        'day': 'Monday & Thursday',
        'description': 'Avoid distractions and focus on intuition.',
        'lucky_numbers': [11, 2, 6],
        'lucky_colors': ['Silver', 'Blue'],
        'lucky_stones': ['Moonstone', 'Lapis Lazuli']
    },
    22: {
        'day': 'Saturday & Sunday',
        'description': 'Avoid rigidity and focus on innovation.',
        'lucky_numbers': [22, 4, 8],
        'lucky_colors': ['Black', 'Purple'],
        'lucky_stones': ['Black Tourmaline', 'Amethyst']
    },
    33: {
        'day': 'Friday & Sunday',
        'description': 'Avoid superficiality and focus on deeper connections.',
        'lucky_numbers': [33, 6, 9],
        'lucky_colors': ['Pink', 'Gold'],
        'lucky_stones': ['Rose Quartz', 'Citrine']
    } 
}




#perosnality_traits on Consonants  (From Consonants only in full name)
personality_traits = {
    1: {
        'nikename' : 'The Leader',
        'traits' :  ['Leadership', 'Individualism', 'Confidence'],
        'how_people_see_you': 'You are seen as a natural leader, confident and independent. People admire your pioneering spirit and ability to take charge.',
        'vibe' : 'You exude a strong, independent vibe, inspiring others with your confidence and leadership qualities.',
        'challenges': 'You may struggle with being overly independent or stubborn, sometimes finding it hard to collaborate with others.',
    },
    2: {
        'nikename': 'The Peacemaker',
        'traits': ['Sensitivity', 'Cooperation', 'Intuition'],
        'how_people_see_you': 'You are seen as a sensitive and intuitive person, often acting as a peacemaker in social situations.',
        'vibe': 'You radiate a calm and nurturing energy, making others feel comfortable and understood in your presence.',
        'challenges': 'You may struggle with indecisiveness or being overly sensitive to criticism, which can affect your self-esteem.'
    },
    3: {
        'nikename': 'The Communicator',
        'traits': ['Creativity', 'Expression', 'Joyfulness'],
        'how_people_see_you': 'You are seen as a creative and expressive individual, bringing joy and positivity to those around you.',
        'vibe': 'You have a vibrant and joyful energy, inspiring others with your creativity and enthusiasm for life.',
        'challenges': 'You may struggle with staying focused or following through on projects, as your creative mind often jumps from one idea to another.'
    },
    4: {
        'nikename': 'The Builder',
        'traits': ['Discipline', 'Stability', 'Practicality'],
        'how_people_see_you': 'You are seen as a disciplined and practical person, known for your reliability and strong work ethic.',
        'vibe': 'You exude a grounded and stable energy, providing a sense of security to those around you.',
        'challenges': 'You may struggle with rigidity or being overly critical of yourself and others, which can lead to stress.'
    },
    5: {
        'nikename': 'The Free Spirit',
        'traits': ['Adventure', 'Freedom', 'Adaptability'],
        'how_people_see_you': 'You are seen as an adventurous and adaptable person, always seeking new experiences and opportunities.',
        'vibe': 'You radiate a free-spirited and adventurous energy, inspiring others to embrace change and explore new horizons.',
        'challenges': 'You may struggle with commitment or restlessness, finding it hard to settle down or stick to one path for too long.'
    },
    6: {
        'nikename': 'The Nurturer',
        'traits': ['Nurturing', 'Responsibility', 'Family'],
        'how_people_see_you': 'You are seen as a caring and responsible individual, often taking on the role of caregiver in your relationships.',
        'vibe': 'You exude a warm and nurturing energy, making others feel loved and supported in your presence.',
        'challenges': 'You may struggle with putting others’ needs before your own, leading to feelings of burnout or neglecting your own self-care.'
    },
    7: {
        'nikename': 'The Philosopher',
        'traits': ['Introspection', 'Spirituality', 'Wisdom'],
        'how_people_see_you': 'You are seen as a wise and introspective person, often seeking deeper meaning in life.',
        'vibe': 'You radiate a calm and contemplative energy, inspiring others to reflect on their own lives and seek spiritual growth.',
        'challenges': 'You may struggle with isolation or overthinking, finding it hard to connect with others on a deeper level.'
    },
    8: {
        'nikename': 'The Executive',
        'traits': ['Ambition', 'Organization', 'Goal-oriented'],
        'how_people_see_you': 'You are seen as an ambitious and organized individual, often taking charge in professional settings.',
        'vibe': 'You exude a powerful and goal-oriented energy, inspiring others with your drive and determination.',
        'challenges': 'You may struggle with work-life balance or being overly focused on success, sometimes neglecting personal relationships.'
    },
    9: {
        'nikename': 'The Humanitarian',
        'traits': ['Compassion', 'Humanitarianism', 'Idealism'],
        'how_people_see_you': 'You are seen as a compassionate and idealistic person, often advocating for social causes and helping others.',
        'vibe': 'You radiate a warm and caring energy, inspiring others to be more compassionate and socially conscious.',
        'challenges': 'You may struggle with feeling overwhelmed by the world’s problems or being too idealistic, leading to disappointment.'
    },
    11: {
        'nikename': 'The Visionary',
        'traits': ['Spirituality', 'Intuition', 'Insight'],
        'how_people_see_you': 'You are seen as a visionary and intuitive person, often providing deep insights and spiritual guidance.',
        'vibe': 'You exude a mystical and insightful energy, inspiring others to explore their own spirituality and intuition.',
        'challenges': 'You may struggle with feeling misunderstood or isolated due to your unique perspective on life.'
    },
    22: {
        'nikename': 'The Master Builder',
        'traits': ['Practicality', 'Vision', 'Leadership'],
        'how_people_see_you': 'You are seen as a practical and visionary leader, often taking on significant projects and responsibilities.',
        'vibe': 'You radiate a powerful and organized energy, inspiring others with your ability to turn visions into reality.',
        'challenges': 'You may struggle with perfectionism or being overly critical of yourself and others, leading to stress.'
    },
    33: {
        'nikename': 'The Master Teacher',
        'traits': ['Selflessness', 'Compassion', 'Teaching'],
        'how_people_see_you': 'You are seen as a compassionate and selfless teacher, often guiding others with your wisdom and understanding.',
        'vibe': 'You exude a nurturing and wise energy, inspiring others to learn and grow through your teachings.',
        'challenges': 'You may struggle with self-doubt or feeling unappreciated for your efforts, leading to frustration.'
    }
}
# your natural path
