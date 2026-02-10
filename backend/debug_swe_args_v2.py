import swisseph as swe
import sys

print(f"Swisseph version: {swe.version}")

jd = 2460000.5
geopos = (82.0, 25.0, 0)
flags = swe.FLG_SWIEPH

print("\n--- Trying 6 args (no press, no temp) ---")
try:
    res = swe.rise_trans(jd, swe.SUN, b"", flags, swe.CALC_RISE, geopos)
    print(f"Success with 6 args: {res}")
except Exception as e:
    print(f"Failed 6 args: {e}")

print("\n--- Trying 7 args (press, no temp) ---")
try:
    res = swe.rise_trans(jd, swe.SUN, b"", flags, swe.CALC_RISE, geopos, 1013.25)
    print(f"Success with 7 args: {res}")
except Exception as e:
    print(f"Failed 7 args: {e}")

print("\n--- Trying 8 args (press, temp) ---")
try:
    res = swe.rise_trans(jd, swe.SUN, b"", flags, swe.CALC_RISE, geopos, 1013.25, 10.0)
    print(f"Success with 8 args: {res}")
except Exception as e:
    print(f"Failed 8 args: {e}")
