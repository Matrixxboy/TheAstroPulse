try:
    import swisseph as swe
    print(f"Help for rise_trans: {help(swe.rise_trans)}")
except Exception as e:
    print(f"Error getting help: {e}")

try:
    jd = 2460000.5
    geopos = (82.0, 25.0, 0)
    # Try 8 args
    try:
        print("Trying 8 args...")
        swe.rise_trans(jd, swe.SUN, b"", swe.FLG_SWIEPH, swe.CALC_RISE, geopos, 0.0, 0.0)
        print("Success with 8 args")
    except TypeError as e:
        print(f"Failed 8 args: {e}")
    except Exception as e:
        print(f"Error 8 args: {e}")

    # Try 7 args (remove attemp)
    try:
        print("Trying 7 args...")
        swe.rise_trans(jd, swe.SUN, b"", swe.FLG_SWIEPH, swe.CALC_RISE, geopos, 0.0)
        print("Success with 7 args")
    except TypeError as e:
        print(f"Failed 7 args: {e}")

    # Try 6 args (remove press, temp)
    try:
        print("Trying 6 args...")
        swe.rise_trans(jd, swe.SUN, b"", swe.FLG_SWIEPH, swe.CALC_RISE, geopos)
        print("Success with 6 args")
    except TypeError as e:
        print(f"Failed 6 args: {e}")

except ImportError:
    print("pyswisseph not installed")
