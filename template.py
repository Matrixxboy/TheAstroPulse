import os
from pathlib import Path
import logging


# Configure logging before creating the Flask app
logging.basicConfig(level=logging.INFO,format='[%(asctime)s] : [%(message)s]')  # Or DEBUG, WARNING, ERROR, CRITICAL

list_of_file = [
    "Backend/astrology/zodiac.py",
    "Backend/astrology/vedic_calc.py",
    "Backend/palmistry/model.py",
    "Backend/palmistry/preprocess.py",
    "Backend/api/routes.py",
    "Backend/auth/login.py",
    "Backend/main.py"
    
]

for filePath in list_of_file:
    filePath = Path(filePath)
    fileDir ,filename = os.path.split(filePath)
    
    if fileDir != "":
        os.makedirs(fileDir, exist_ok=True)
        logging.info(f"Creating Directory ; {fileDir} for the file  : {filename}")
        
    if (not os.path.exists(filePath)) or (os.path.getsize(filePath)==0):
        with open(filePath,"w") as f:
            pass
        logging.info(f"Creating empty file  {filename}: {filePath}")
        
    else :
        logging.info(f"{filename} is already exist")