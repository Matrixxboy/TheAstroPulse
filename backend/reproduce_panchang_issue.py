
import sys
import os

# Add the backend directory to sys.path so we can import modules
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

try:
    from astrology.panchang import get_panchang
    import swisseph as swe
except ImportError as e:
    print(f"ImportError: {e}")
    sys.exit(1)

def test_get_panchang():
    print("Testing get_panchang...")
    date = "2023-10-27"
    lat = 25.3176
    lon = 82.9739
    timezone = "Asia/Kolkata"
    
    try:
        # Check swisseph path
        print(f"Swisseph path: {swe.get_ephe_path()}")
        
        result = get_panchang(date, lat, lon, timezone)
        print("Successfully fetched panchang:")
        print(result)
    except Exception as e:
        print(f"Error fetching panchang: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_get_panchang()
