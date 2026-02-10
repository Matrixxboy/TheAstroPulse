import re
import requests
import random
from datetime import datetime, timedelta

TEMPLE_CHANNELS = {
    "random": {"name": "Random / Featured", "url": None, "type": "random"},
    "somnath": {"name": "Somnath Temple (Jyotirlinga)", "url": "https://www.youtube.com/@SomnathTempleOfficialChannel/live", "type": "temple"},
    "dakor": {"name": "Ranchhodraiji Dakor", "url": "https://www.youtube.com/c/RanchhodraijiLiveDarshanDakor/live", "type": "temple"},
    "ambaji": {"name": "Ambaji Temple (Shakti Peeth)", "url": "https://www.youtube.com/@AmbajiTempleOfficial/live", "type": "temple"},
    "ganesha": {"name": "Siddhivinayak / Ganesha Live", "url": "https://www.youtube.com/@LiveDarshan/live", "type": "temple"},
    "saibaba": {"name": "Shirdi Saibaba", "url": "https://www.youtube.com/@SaiBabaLiveDarshan/live", "type": "temple"},
    "Khodal": {"name": "Khodal Temple", "url": "https://www.youtube.com/@shreekhodaldhamtrust2957/live", "type": "temple"}
}

RANDOM_CHANNEL_IDS = ["UC1OSbPhj52oW6VM6Odq4uzA", "UC2D6eRvCeMtcF5OGZh1CumQ", "UCSyg9cb3Izs_Y9c-2-h2C-g"]

def get_live_video_data(channel_url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        }
        response = requests.get(channel_url, headers=headers, timeout=10, allow_redirects=True)
        html = response.text

        # 1. Verify if the content is actually "Live" now
        # YouTube uses "isLive":true in its player response JSON
        is_currently_live = '"isLive":true' in html
        
        # 2. Extract Video ID
        video_id_match = re.search(r'"videoId":"(.*?)"', html)
        if not video_id_match:
            return None

        video_id = video_id_match.group(1)

        # 3. Time Validation (Check if more than 24 hours old)
        # We look for the "startDate" or "publishedTimeText" in the metadata
        # Live streams usually have a "startDate" in ISO format: "2023-10-27T10:00:00+00:00"
        date_match = re.search(r'"startDate":"(.*?)"', html)
        
        if date_match:
            start_date_str = date_match.group(1)
            # Standardize format for parsing (removing the 'Z' or offset if needed)
            start_date = datetime.fromisoformat(start_date_str.replace("Z", "+00:00"))
            now = datetime.now(start_date.tzinfo)

            if now - start_date > timedelta(hours=24):
                print(f"Stream {video_id} is older than 24 hours.")
                return None
        
        # If no startDate is found but it says isLive:true, we assume it's valid
        # Otherwise, if it's not live and has no date, we reject it.
        if is_currently_live:
            return video_id

    except Exception as e:
        print(f"Error: {e}")
    return None

def check_live_status(channel_id=None):
    temple_key = channel_id 
    selected_temple = TEMPLE_CHANNELS.get(temple_key)
    
    if not selected_temple or temple_key == "random":
        keys = [k for k in TEMPLE_CHANNELS.keys() if k != "random"]
        random_key = random.choice(keys)
        selected_temple = TEMPLE_CHANNELS[random_key]

    video_id = get_live_video_data(selected_temple["url"])
    
    if video_id:
        return {
            "is_live": True,
            "video_id": video_id,
            "title": f"Live Darshan: {selected_temple['name']}",
            "temple_name": selected_temple['name'],
            "thumbnail": f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"
        }
    else:
        return {
            "is_live": False,
            "message": "No live video available (Stream offline or ended).",
            "temple_name": selected_temple['name']
        }