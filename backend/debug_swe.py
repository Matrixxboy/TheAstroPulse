import swisseph as swe
try:
    jd = swe.julday(2026, 2, 10, 12.0)
    print(f"JD: {jd}")
except Exception as e:
    print(f"JD Error: {e}")

# Case 1: 10 arguments, string starname
try:
    print("Trying 10 args, string starname...")
    res = swe.rise_trans(jd, swe.SUN, "", swe.FLG_SWIEPH, swe.CALC_RISE, 82.97, 25.31, 0.0, 0.0, 0.0)
    print(f"Success 1: {res}")
except Exception as e:
    print(f"Error 1: {e}")

# Case 2: 10 arguments, bytes starname
try:
    print("Trying 10 args, bytes starname...")
    res = swe.rise_trans(jd, swe.SUN, b"", swe.FLG_SWIEPH, swe.CALC_RISE, 82.97, 25.31, 0.0, 0.0, 0.0)
    print(f"Success 2: {res}")
except Exception as e:
    print(f"Error 2: {e}")

# Case 3: 8 arguments, tuple geopos
try:
    print("Trying 8 args, tuple geopos...")
    res = swe.rise_trans(jd, swe.SUN, "", swe.FLG_SWIEPH, swe.CALC_RISE, (82.97, 25.31, 0.0), 0.0, 0.0)
    print(f"Success 3: {res}")
except Exception as e:
    print(f"Error 3: {e}")

# Case 4: 10 arguments but ints for floats
try:
    print("Trying 10 args, ints for floats...")
    res = swe.rise_trans(jd, swe.SUN, "", swe.FLG_SWIEPH, swe.CALC_RISE, 82.97, 25.31, 0, 0, 0)
    print(f"Success 4: {res}")
except Exception as e:
    print(f"Error 4: {e}")
