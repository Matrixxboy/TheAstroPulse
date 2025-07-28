import json

# Load JSON
with open('../output.json', 'r') as file:
    report = json.load(file)

# Extract required Moon details
moon_info = report[1]["Moon"]
moon_nak_dms = moon_info["Degree in sign"]
moon_nak_lord = moon_info["NakLord"]
rashi_sign = next(iter(report[0]["rashi_all_details"]))

def vim_deg_to_dms(deg):
    d = int(deg)
    remainder = abs(deg - d) * 60
    m = int(remainder)
    s = round((remainder - m) * 60)

    # Correct rounding overflow (e.g., 59.999 -> 60)
    if s == 60:
        s = 0
        m += 1
    if m == 60:
        m = 0
        d += 1

    return d,m,s

d , m ,s = vim_deg_to_dms(moon_nak_dms)

print(d,m,s)