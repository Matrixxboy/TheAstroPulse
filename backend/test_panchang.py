import urllib.request
import urllib.parse
import json
import datetime

def test_panchang():
    url = "http://localhost:5000/api/panchang"
    params = {
        "date": datetime.date.today().isoformat(),
        "latitude": 25.3176,
        "longitude": 82.9739,
        "timezone": "Asia/Kolkata"
    }
    
    query_string = urllib.parse.urlencode(params)
    full_url = f"{url}?{query_string}"
    
    print(f"Testing URL: {full_url}")
    
    try:
        with urllib.request.urlopen(full_url) as response:
            status_code = response.getcode()
            print(f"Status Code: {status_code}")
            
            if status_code == 200:
                data = json.loads(response.read().decode('utf-8'))
                print("Response Data:")
                print(json.dumps(data, indent=2))
                
                # Basic validation
                required_keys = ["tithi", "nakshatra", "yoga", "karana", "sunrise", "sunset", "rahu_kalam", "abhijit_muhurat"]
                missing = [k for k in required_keys if k not in data]
                if missing:
                    print(f"FAILED: Missing keys: {missing}")
                else:
                    print("SUCCESS: All keys present.")
            else:
                print(f"FAILED: Status code {status_code}")
                
    except urllib.error.HTTPError as e:
        print(f"FAILED: HTTP Error {e.code}: {e.reason}")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"FAILED: Exception: {e}")

if __name__ == "__main__":
    test_panchang()
