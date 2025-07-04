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

# Life Path Number (From Full Name)
life_path_meanings = {
    1: {
        "title": "The Leader",
        "traits": "Independent, assertive, ambitious, pioneering, confident",
        "strengths": "Strong leadership, original thinker, self-reliant, motivated",
        "challenges": "Can be stubborn, egotistical, overly competitive, struggles with teamwork",
        "life_purpose": "To develop independence and leadership skills while inspiring others through action.",
        "career": "Entrepreneur, Innovator, Military Leader, Coach"
    },
    2: {
        "title": "The Peacemaker",
        "traits": "Diplomatic, sensitive, cooperative, supportive, emotional",
        "strengths": "Great listener, mediator, intuitive, values harmony",
        "challenges": "Overly sensitive, indecisive, avoids conflict, may suppress needs",
        "life_purpose": "To bring balance and peace through diplomacy and emotional intelligence.",
        "career": "Counselor, Mediator, Therapist, Nurse, HR"
    },
    3: {
        "title": "The Communicator",
        "traits": "Creative, expressive, optimistic, social, artistic",
        "strengths": "Great with words, humorous, charismatic, imaginative",
        "challenges": "Scattered energy, superficial, avoids deep issues, prone to mood swings",
        "life_purpose": "To inspire and uplift others through artistic or verbal expression.",
        "career": "Writer, Actor, Singer, Graphic Designer, Public Speaker"
    },
    4: {
        "title": "The Builder",
        "traits": "Practical, disciplined, reliable, hard-working, loyal",
        "strengths": "Highly organized, methodical, detail-oriented, persistent",
        "challenges": "Rigid, overly cautious, resistant to change, workaholic tendencies",
        "life_purpose": "To create strong foundations through discipline and effort.",
        "career": "Architect, Civil Engineer, Technician, System Administrator"
    },
    5: {
        "title": "The Adventurer",
        "traits": "Freedom-loving, curious, adaptable, dynamic, sensual",
        "strengths": "Versatile, energetic, embraces change, persuasive communicator",
        "challenges": "Impulsive, inconsistent, struggles with routine, easily bored",
        "life_purpose": "To embrace change and promote freedom through exploration and experience.",
        "career": "Journalist, Travel Guide, Pilot, Marketing Specialist"
    },
    6: {
        "title": "The Nurturer",
        "traits": "Loving, responsible, harmonious, family-oriented, service-minded",
        "strengths": "Caring, protective, generous, community-focused",
        "challenges": "Overbearing, controlling, martyr-like tendencies, neglects self",
        "life_purpose": "To serve others with love and compassion while maintaining personal balance.",
        "career": "Teacher, Doctor, Social Worker, Daycare Provider"
    },
    7: {
        "title": "The Seeker",
        "traits": "Introspective, analytical, spiritual, mysterious, intuitive",
        "strengths": "Wise, thoughtful, deep thinker, loves knowledge and solitude",
        "challenges": "Withdrawn, skeptical, overly critical, emotionally detached",
        "life_purpose": "To seek truth through spiritual and intellectual exploration.",
        "career": "Researcher , Spiritual Guide , Software developer , Scholar "
    },
    8: {
        "title": "The Powerhouse",
        "traits": "Ambitious, authoritative, materialistic, disciplined, goal-oriented",
        "strengths": "Natural leader, great in business, strategic, determined",
        "challenges": "Workaholic, can be domineering, material obsession, emotional control issues",
        "life_purpose": "To master the material world and use power responsibly.",
        "career": "Business Leader, Investor, Real Estate Agent, Lawyer"
    },
    9: {
        "title": "The Humanitarian",
        "traits": "Compassionate, generous, idealistic, artistic, tolerant",
        "strengths": "Empathic, globally conscious, wise, charitable",
        "challenges": "Overwhelmed by others' suffering, boundary issues, can be self-sacrificing",
        "life_purpose": "To serve humanity and promote love, tolerance, and healing.",
        "career": "Nonprofit Director, Artist, Healer"
    },
    11: {
        "title": "The Inspired Healer (Master Number)",
        "traits": "Visionary, intuitive, spiritually gifted, idealistic, empathetic",
        "strengths": "Highly intuitive, artistic, powerful teacher, inner wisdom",
        "challenges": "Emotional sensitivity, anxiety, inner conflict, self-doubt",
        "life_purpose": "To uplift and enlighten others through spiritual insights and emotional healing.",
        "career": "Spiritual Mentor, Visionary Coach, Artist, Lightworker, Healer"
    },
    22: {
        "title": "The Master Builder (Master Number)",
        "traits": "Pragmatic visionary, powerful, practical, inspirational, determined",
        "strengths": "Turns big dreams into reality, leader of transformation, grounded",
        "challenges": "Perfectionism, overwhelmed by pressure, avoids emotions",
        "life_purpose": "To build structures (literal or symbolic) that benefit humanity long-term.",
        "career": "Social Entrepreneur, Architect, World Project Leader, NGO Founder"
    },
    33: {
        "title": "The Master Teacher (Master Number)",
        "traits": "Loving, nurturing, spiritual, creative, compassionate",
        "strengths": "Profound healer, spiritually wise, devoted, selfless",
        "challenges": "Tendency to overgive, burnout, high expectations, emotional burden",
        "life_purpose": "To selflessly teach, heal, and nurture others through universal love and service.",
        "career": "Healer, Master Teacher, Counselor, Humanitarian, Energy Worker"
    }
}

# Soul Number  (From Vowels only in full name)
# dream or expected careers
soul_number_meanings = {
    1: {
        "description": "A strong inner desire to be independent, self-reliant, and to lead with originality.",
        "traits": ["Leadership", "Individuality", "Courage"],
        "career": ["Entrepreneur", "Innovator", "Military Leader", "Coach"]
    },
    2: {
        "description": "A deep emotional need for harmony, partnership, and emotional connection.",
        "traits": ["Sensitivity", "Cooperation", "Empathy"],
        "career": ["Counselor", "Mediator", "Therapist", "Nurse", "HR"]
    },
    3: {
        "description": "A heartfelt urge to express creativity and bring joy to others through artistic or verbal expression.",
        "traits": ["Creativity", "Optimism", "Expressiveness"],
        "career": ["Writer", "Actor", "Singer", "Graphic Designer", "Public Speaker"]
    },
    4: {
        "description": "An inner need for order, stability, and to build solid foundations in life and relationships.",
        "traits": ["Loyalty", "Security", "Hard Work"],
        "career": ["Architect", "Civil Engineer", "Technician", "System Administrator"]
    },
    5: {
        "description": "A soul longing for freedom, excitement, and variety in life experiences.",
        "traits": ["Adventurous", "Adaptable", "Dynamic"],
        "career": ["Journalist", "Travel Guide", "Pilot", "Marketing Specialist"]
    },
    6: {
        "description": "A deep emotional drive to nurture, protect, and care for loved ones and community.",
        "traits": ["Responsibility", "Love", "Healing"],
        "career": ["Teacher", "Doctor", "Social Worker", "Daycare Provider"]
    },
    7: {
        "description": "A desire for inner peace, knowledge, and spiritual or philosophical truth.",
        "traits": ["Solitude", "Insight", "Wisdom"],
        "career": ["Scholar", "Scientist", "Mystic", "Psychologist"]
    },
    8: {
        "description": "An inner drive for success, respect, and material security with power to influence.",
        "traits": ["Ambition", "Leadership", "Material Strength"],
        "career": ["Business Leader", "Investor", "Real Estate Agent", "Lawyer"]
    },
    9: {
        "description": "A soul that yearns to serve humanity and express deep compassion and global awareness.",
        "traits": ["Compassion", "Idealism", "Humanitarianism"],
        "career": ["Nonprofit Director", "Artist", "Healer"]
    },
    11: {
        "description": "A deep soul urge to uplift, inspire, and heal others using intuition and spiritual insight.",
        "traits": ["Spiritual Awareness", "Sensitivity", "Enlightenment"],
        "career": ["Spiritual Mentor", "Visionary Coach", "Artist", "Lightworker", "Healer"]
    },
    22: {
        "description": "A strong desire to create lasting systems or structures that help the world on a large scale.",
        "traits": ["Global Vision", "Master Builder Energy", "Service"],
        "career": ["Social Entrepreneur", "Architect", "World Project Leader", "NGO Founder"]
    },
    33: {
        "description": "A soul destined to serve selflessly and guide others with unconditional love and deep spiritual teaching.",
        "traits": ["Compassion", "Healing", "Divine Nurturing"],
        "career": ["Healer", "Master Teacher", "Counselor", "Humanitarian", "Energy Worker"]
    }
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
        'unlucky_numbers': [1, 4, 7],
        'unlucky_colors': ['Red', 'White'],
        'unlucky_stones': ['Ruby', 'Pearl']
    },
    2: {
        'day': 'Monday',
        'description': 'Avoid emotional decisions or confrontations.',
        'unlucky_numbers': [2, 5, 8],
        'unlucky_colors': ['Silver', 'White'],
        'unlucky_stones': ['Moonstone', 'Pearl']
    },
    3: {
        'day': 'Thursday',
        'description': 'Avoid overindulgence or taking unnecessary risks.',
        'unlucky_numbers': [3, 6, 9],   
        'unlucky_colors': ['Yellow', 'Purple'],
        'unlucky_stones': ['Yellow Sapphire', 'Amethyst']   
    },
    4: {    
        'day': 'Saturday',
        'description': 'Avoid procrastination and laziness.',
        'unlucky_numbers': [4, 8, 1],
        'unlucky_colors': ['Black', 'Blue'],
        'unlucky_stones': ['Blue Sapphire', 'Black Tourmaline']
    },
    5: {
        'day': 'Wednesday',
        'description': 'Avoid miscommunication and misunderstandings.',
        'unlucky_numbers': [5, 7, 2],
        'unlucky_colors': ['Green', 'Yellow'],
        'unlucky_stones': ['Emerald', 'Peridot']
    },
    6: {
        'day': 'Friday',
        'description': 'Avoid conflicts in relationships and financial matters.',
        'unlucky_numbers': [6, 3, 9],
        'unlucky_colors': ['Pink', 'White'],
        'unlucky_stones': ['Diamond', 'Rose Quartz']
    },
    7: {
        'day': 'Monday & Saturday',
        'description': 'Avoid impulsive decisions and rash actions.',
        'unlucky_numbers': [7, 4, 1],
        'unlucky_colors': ['Black', 'Blue'],
        'unlucky_stones': ['Blue Sapphire', 'Black Tourmaline']
    },
    8: {
        'day': 'Thursday',
        'description': 'Avoid overconfidence and arrogance.',
        'unlucky_numbers': [8, 3, 6],
        'unlucky_colors': ['Yellow', 'Purple'],
        'unlucky_stones': ['Yellow Sapphire', 'Amethyst']
    },
    9: {
        'day': 'Tuesday',
        'description': 'Avoid aggression and impulsive actions.',
        'unlucky_numbers': [9, 1, 5],
        'unlucky_colors': ['Red', 'Orange'],
        'unlucky_stones': ['Red Coral', 'Carnelian']
    },
    11: {
        'day': 'Monday & Thursday',
        'description': 'Avoid confusion and lack of clarity.',
        'unlucky_numbers': [11, 2, 6],
        'unlucky_colors': ['Silver', 'Blue'],
        'unlucky_stones': ['Moonstone', 'Lapis Lazuli']
    },
    22: {
        'day': 'Saturday & Sunday',
        'description': 'Avoid rigidity and stubbornness.',
        'unlucky_numbers': [22, 4, 8],
        'unlucky_colors': ['Black', 'Purple'],
        'unlucky_stones': ['Black Tourmaline', 'Amethyst']
    },
    33: {
        'day': 'Friday & Sunday',
        'description': 'Avoid superficiality and lack of depth.',
        'unlucky_numbers': [33, 6, 9],
        'unlucky_colors': ['Pink', 'Gold'],
        'unlucky_stones': ['Rose Quartz', 'Citrine']
    },
}




#perosnality_traits on Consonants  (From Consonants only in full name)
personality_traits = {
    1: {
        'nickname' : 'The Leader',
        'traits' :  ['Leadership', 'Individualism', 'Confidence'],
        'how_people_see_you': 'You are seen as a natural leader, confident and independent. People admire your pioneering spirit and ability to take charge.',
        'vibe' : 'You exude a strong, independent vibe, inspiring others with your confidence and leadership qualities.',
        'challenges': 'You may struggle with being overly independent or stubborn, sometimes finding it hard to collaborate with others.',
    },
    2: {
        'nickname': 'The Peacemaker',
        'traits': ['Sensitivity', 'Cooperation', 'Intuition'],
        'how_people_see_you': 'You are seen as a sensitive and intuitive person, often acting as a peacemaker in social situations.',
        'vibe': 'You radiate a calm and nurturing energy, making others feel comfortable and understood in your presence.',
        'challenges': 'You may struggle with indecisiveness or being overly sensitive to criticism, which can affect your self-esteem.'
    },
    3: {
        'nickname': 'The Communicator',
        'traits': ['Creativity', 'Expression', 'Joyfulness'],
        'how_people_see_you': 'You are seen as a creative and expressive individual, bringing joy and positivity to those around you.',
        'vibe': 'You have a vibrant and joyful energy, inspiring others with your creativity and enthusiasm for life.',
        'challenges': 'You may struggle with staying focused or following through on projects, as your creative mind often jumps from one idea to another.'
    },
    4: {
        'nickname': 'The Builder',
        'traits': ['Discipline', 'Stability', 'Practicality'],
        'how_people_see_you': 'You are seen as a disciplined and practical person, known for your reliability and strong work ethic.',
        'vibe': 'You exude a grounded and stable energy, providing a sense of security to those around you.',
        'challenges': 'You may struggle with rigidity or being overly critical of yourself and others, which can lead to stress.'
    },
    5: {
        'nickname': 'The Free Spirit',
        'traits': ['Adventure', 'Freedom', 'Adaptability'],
        'how_people_see_you': 'You are seen as an adventurous and adaptable person, always seeking new experiences and opportunities.',
        'vibe': 'You radiate a free-spirited and adventurous energy, inspiring others to embrace change and explore new horizons.',
        'challenges': 'You may struggle with commitment or restlessness, finding it hard to settle down or stick to one path for too long.'
    },
    6: {
        'nickname': 'The Nurturer',
        'traits': ['Nurturing', 'Responsibility', 'Family'],
        'how_people_see_you': 'You are seen as a caring and responsible individual, often taking on the role of caregiver in your relationships.',
        'vibe': 'You exude a warm and nurturing energy, making others feel loved and supported in your presence.',
        'challenges': 'You may struggle with putting others’ needs before your own, leading to feelings of burnout or neglecting your own self-care.'
    },
    7: {
        'nickname': 'The Philosopher',
        'traits': ['Introspection', 'Spirituality', 'Wisdom'],
        'how_people_see_you': 'You are seen as a wise and introspective person, often seeking deeper meaning in life.',
        'vibe': 'You radiate a calm and contemplative energy, inspiring others to reflect on their own lives and seek spiritual growth.',
        'challenges': 'You may struggle with isolation or overthinking, finding it hard to connect with others on a deeper level.'
    },
    8: {
        'nickname': 'The Executive',
        'traits': ['Ambition', 'Organization', 'Goal-oriented'],
        'how_people_see_you': 'You are seen as an ambitious and organized individual, often taking charge in professional settings.',
        'vibe': 'You exude a powerful and goal-oriented energy, inspiring others with your drive and determination.',
        'challenges': 'You may struggle with work-life balance or being overly focused on success, sometimes neglecting personal relationships.'
    },
    9: {
        'nickname': 'The Humanitarian',
        'traits': ['Compassion', 'Humanitarianism', 'Idealism'],
        'how_people_see_you': 'You are seen as a compassionate and idealistic person, often advocating for social causes and helping others.',
        'vibe': 'You radiate a warm and caring energy, inspiring others to be more compassionate and socially conscious.',
        'challenges': 'You may struggle with feeling overwhelmed by the world’s problems or being too idealistic, leading to disappointment.'
    },
    11: {
        'nickname': 'The Visionary',
        'traits': ['Spirituality', 'Intuition', 'Insight'],
        'how_people_see_you': 'You are seen as a visionary and intuitive person, often providing deep insights and spiritual guidance.',
        'vibe': 'You exude a mystical and insightful energy, inspiring others to explore their own spirituality and intuition.',
        'challenges': 'You may struggle with feeling misunderstood or isolated due to your unique perspective on life.'
    },
    22: {
        'nickname': 'The Master Builder',
        'traits': ['Practicality', 'Vision', 'Leadership'],
        'how_people_see_you': 'You are seen as a practical and visionary leader, often taking on significant projects and responsibilities.',
        'vibe': 'You radiate a powerful and organized energy, inspiring others with your ability to turn visions into reality.',
        'challenges': 'You may struggle with perfectionism or being overly critical of yourself and others, leading to stress.'
    },
    33: {
        'nickname': 'The Master Teacher',
        'traits': ['Selflessness', 'Compassion', 'Teaching'],
        'how_people_see_you': 'You are seen as a compassionate and selfless teacher, often guiding others with your wisdom and understanding.',
        'vibe': 'You exude a nurturing and wise energy, inspiring others to learn and grow through your teachings.',
        'challenges': 'You may struggle with self-doubt or feeling unappreciated for your efforts, leading to frustration.'
    }
}
# your natural path
