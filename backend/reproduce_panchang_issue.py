
import sys
import os
from datetime import datetime

# Add the backend directory to sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

try:
    from astrology.panchang import get_panchang
    import swisseph as swe
except ImportError as e:
    print(f"ImportError: {e}")
    # Try importing from local if running in backend dir
    try:
        sys.path.append(".")
        from astrology.panchang import get_panchang
    except ImportError as e2:
        print(f"Final ImportError: {e2}")
        sys.exit(1)

def test_get_panchang():
    print("Testing get_panchang...")
    # Test with a date where sunrise might be tricky or just today
    date_str = "2026-02-10"
    lat = 25.3176
    lon = 82.9739
    timezone = "Asia/Kolkata"
    
    print(f"Requesting Panchang for {date_str} at Lat: {lat}, Lon: {lon}")
    
    try:
        # Check swisseph path
        # print(f"Swisseph path: {swe.get_ephe_path()}")
        
        result = get_panchang(date_str, lat, lon, timezone)
        print("\nSuccessfully fetched panchang:")
        print(f"Date Requested: {result['date']}")
        print(f"Sunrise: {result['sunrise']}")
        print(f"Sunset: {result['sunset']}")
        
        # Check if sunrise containsAM/PM and check if it seems reasonable
        print(f"\nFull Result Keys: {list(result.keys())}")
        
        if result['day_choghadiya']:
             print("\nDay Choghadiya (First 3):")
             for item in result['day_choghadiya'][:3]:
                 print(item)
        
    except Exception as e:
        print(f"Error fetching panchang: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_get_panchang()
