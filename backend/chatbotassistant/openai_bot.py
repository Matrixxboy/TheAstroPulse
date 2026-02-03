import os
import json
import openai
from datetime import datetime
from dotenv import load_dotenv
import tiktoken

load_dotenv()

# Ensure we have a key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=OPENAI_API_KEY)

HISTORY_FILE = "chat_history.json"
MODEL_NAME = "gpt-3.5-turbo"
# Max tokens for context (leaving room for response)
# gpt-3.5-turbo has 4096 context. Let's reserve ~1000 for output and ~500 for system prompt/safeguards.
MAX_CONTEXT_TOKENS = 2500 

def load_history():
    if not os.path.exists(HISTORY_FILE):
        return {}
    try:
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    except:
        return {}

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)

def count_tokens(messages, model=MODEL_NAME):
    """
    Return the number of tokens used by a list of messages.
    """
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        print("Warning: model not found. Using cl100k_base encoding.")
        encoding = tiktoken.get_encoding("cl100k_base")
    
    num_tokens = 0
    for message in messages:
        num_tokens += 4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
        for key, value in message.items():
            num_tokens += len(encoding.encode(str(value)))
            if key == "name":
                num_tokens += -1  # role is always required and always 1 token
    num_tokens += 2  # every reply is primed with <im_start>assistant
    return num_tokens

def get_system_prompt(user_details):
    return f"""You are a highly accurate Indian Vedic Astrologer (Jyotish only).
You follow ONLY traditional Indian astrology (Parāśari system).
No Western astrology. No zodiac stereotypes. No unnecessary theory.
firstly, you will calculate person's kundali on base of Lagna / Ascendant and then you will answer the user's question.
User Birth Details:
- Name: {user_details.get('name', 'Unknown')}
- Date of Birth: {user_details.get('dob', 'Unknown')}
- Time of Birth: {user_details.get('tob', 'Unknown')}
- Place of Birth: {user_details.get('pob', 'Unknown')}
- Gender: {user_details.get('gender', 'Unknown')}

STRICT RULES (MUST FOLLOW):
1. Answer ONLY what the user is asking. Do NOT add extra topics.
2. Use very simple, normal English that any common person can understand.
3. No astrology technical words like: house, dasha, lagna, bhava, yoga names.
4. No greetings, no explanations, no disclaimers.

ASTROLOGY CALCULATION RULES:
- Use ONLY Indian Vedic astrology calculations.
- Always cross-check main chart with the relevant divisional chart:
  • Career → D1 + D10
  • Marriage/Relationships → D1 + D9
  • Money → D1 + D2
  • Education → D1 + D24
  • Children → D1 + D7
- Consider Nakshatra influence and timing internally, but DO NOT mention them.

OUTPUT STYLE:
- Direct answer
- Predictive conclusion only
- Clear result (positive / delayed / challenging / favorable)
- No storytelling, no philosophy

Now answer the user’s question with precise, practical, and accurate prediction only.
"""

def get_astrology_response(user_id, question, user_details):
    """
    user_details: dict containing 'dob', 'tob', 'pob', 'gender', 'name'
    """
    history_data = load_history()
    
    # Initialize user history if not exists
    if user_id not in history_data:
        history_data[user_id] = []
    
    # 1. Prepare basics
    system_content = get_system_prompt(user_details)
    system_message = {"role": "system", "content": system_content}
    user_message = {"role": "user", "content": question}
    
    # 2. Build Context Window (Smart History)
    
    # Start with mandatory messages
    context_messages = [system_message, user_message]
    current_tokens = count_tokens(context_messages)
    
    # Retrieve past history (reversed to get newest first)
    past_messages = history_data[user_id][::-1] 
    messages_to_include = []
    
    for msg in past_messages:
        msg_tokens = count_tokens([msg])
        if current_tokens + msg_tokens <= MAX_CONTEXT_TOKENS:
            messages_to_include.append(msg)
            current_tokens += msg_tokens
        else:
            # We reached the limit
            break
            
    # Reverse back to chronological order (Oldest -> Newest)
    messages_to_include = messages_to_include[::-1]
    
    # Final message structure: System -> History -> New Question
    final_messages = [system_message] + messages_to_include + [user_message]
    
    # Debugging
    # print(f"Messages count: {len(final_messages)}")
    # print(f"Total tokens: {current_tokens}")

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=final_messages,
            temperature=0.7,
            max_tokens=800 # Increased slightly for better answers
        )
        
        bot_reply = response.choices[0].message.content

        # 3. Save to History (Long Term)
        history_data[user_id].append(user_message)
        history_data[user_id].append({"role": "assistant", "content": bot_reply})
        save_history(history_data)

        return bot_reply

    except Exception as e:
        print(f"OpenAI Error: {e}")
        return "I am having trouble connecting to the cosmic aligned servers right now. Please try again later."
