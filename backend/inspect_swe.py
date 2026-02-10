import swisseph as swe
import sys

with open("swe_help.txt", "w") as f:
    try:
        # Redirect stdout to capture help
        sys.stdout = f
        help(swe.rise_trans)
        sys.stdout = sys.__stdout__
    except Exception as e:
        f.write(f"Error getting help: {e}\n")

    f.write(f"\nVersion: {swe.version}\n")
