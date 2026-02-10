import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.live_darshan import check_live_status

print(f"Checking Selectable Live Status...")

temples_to_test = ["somnath", "dakor", "ambaji", "ganesha", "random"]

try:
    for temple in temples_to_test:
        print(f"\n--- Checking {temple} ---")
        result = check_live_status(temple)
        print(result)

except Exception as e:
    print(f"ERROR: {e}")
