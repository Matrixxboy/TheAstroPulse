
from backend.festivals.festivals import get_yearly_festivals
import json

def check_festivals_2026():
    print("Calculating festivals for 2026...")
    festivals = get_yearly_festivals(2026)
    
    target_festivals = [
        "Maha Shivratri",
        "Rama Navami",
        "Ganga Dussehra",
        "Pitru Paksha (Start)"
    ]
    
    found = {name: [] for name in target_festivals}
    
    for f in festivals:
        if f["name"] in target_festivals:
            found[f["name"]].append(f)
            
    for name, occurrences in found.items():
        print(f"\n--- {name} ---")
        if not occurrences:
            print("Not found!")
        for occ in occurrences:
            print(f"Date: {occ['date']}, Details: {occ}")

if __name__ == "__main__":
    check_festivals_2026()
