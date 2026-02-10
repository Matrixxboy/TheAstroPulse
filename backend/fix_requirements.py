
import os

REQ_FILE = "requirements.txt"

def fix_encoding():
    content = ""
    try:
        # Try reading as utf-16
        with open(REQ_FILE, "r", encoding="utf-16") as f:
            content = f.read()
    except UnicodeError:
        try:
            # Try reading as utf-8
            with open(REQ_FILE, "r", encoding="utf-8") as f:
                content = f.read()
        except UnicodeError:
            print("Could not read requirements.txt with utf-16 or utf-8")
            return

    # Clean up content (remove BOM if any, handle null bytes if any weirdness)
    content = content.replace('\x00', '')
    
    lines = [line.strip() for line in content.splitlines() if line.strip()]
    
    if "pyswisseph" not in lines:
        lines.append("pyswisseph")
    
    # specific fix for numpy if needed, but lets just write it back as utf-8
    
    with open(REQ_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
        f.write("\n")
    
    print("Fixed requirements.txt encoding and ensured pyswisseph is present.")

if __name__ == "__main__":
    fix_encoding()
