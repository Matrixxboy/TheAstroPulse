
import os
import urllib.request
import sys

# Correct URL for ephemeris files (ftp site via http)
EPHE_URL = "https://www.astro.com/ftp/swisseph/ephe/"
FILES_TO_DOWNLOAD = [
    "seas_18.se1", # Main asteroids 1800-2400
    "semo_18.se1", # Moon 1800-2400
    "sepl_18.se1", # Main planets 1800-2400
]

DEST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ephe")

def download_file(filename):
    url = EPHE_URL + filename
    dest_path = os.path.join(DEST_DIR, filename)
    
    print(f"Checking {dest_path}...")
    if os.path.exists(dest_path):
        size = os.path.getsize(dest_path)
        if size > 0:
            print(f"File {filename} already exists ({size} bytes). Skipping.")
            return
        else:
            print(f"File {filename} exists but is empty. Re-downloading.")

    print(f"Downloading {filename} from {url}...")
    try:
        # Use a user agent just in case
        opener = urllib.request.build_opener()
        opener.addheaders = [('User-agent', 'Mozilla/5.0')]
        urllib.request.install_opener(opener)
        
        urllib.request.urlretrieve(url, dest_path)
        
        if os.path.exists(dest_path):
            size = os.path.getsize(dest_path)
            print(f"Successfully downloaded {filename} ({size} bytes)")
        else:
            print(f"Failed to save {filename}")
            
    except Exception as e:
        print(f"Failed to download {filename}: {e}")

def main():
    if not os.path.exists(DEST_DIR):
        print(f"Creating directory {DEST_DIR}")
        os.makedirs(DEST_DIR)
    
    print(f"Downloading ephemeris files to {DEST_DIR}")
    for filename in FILES_TO_DOWNLOAD:
        download_file(filename)
    print("Download script finished.")

if __name__ == "__main__":
    main()
