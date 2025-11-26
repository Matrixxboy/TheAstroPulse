
import cv2
import numpy as np
import math
from ultralytics import YOLO
from pdf2image import convert_from_bytes
import base64

POPPLER = r"C:\poppler\Library\bin"
model = YOLO("ai-models/CompassModel/train/weights/best.pt")

def process_compass_image(file_bytes, file_type):
    # PDF support
    if file_type == "application/pdf":
        pages = convert_from_bytes(file_bytes, poppler_path=POPPLER)
        img = cv2.cvtColor(np.array(pages[0]), cv2.COLOR_RGB2BGR)
    else:
        img = cv2.imdecode(np.frombuffer(file_bytes, np.uint8), cv2.IMREAD_COLOR)

    H, W = img.shape[:2]

    results = model(img)[0]

    head = tail = compass_box = None

    # DETECTIONS
    for box in results.boxes:
        cls = int(box.cls[0])
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
        name = results.names[cls]

        if name == "compass": compass_box = (x1, y1, x2, y2)
        if name == "head": head = ((x1 + x2) // 2, (y1 + y2) // 2)
        if name == "tail": tail = ((x1 + x2) // 2, (y1 + y2) // 2)

    AUTO = head is not None and tail is not None
    auto_angle = None

    if AUTO:
        dx = head[0] - tail[0]
        dy = head[1] - tail[1]
        angle_math = math.degrees(math.atan2(dy, dx))
        auto_angle = (450 - angle_math) % 360
    
    _, buf = cv2.imencode(".png", img)
    img_bytes = buf.tobytes()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')

    return {
        "image": img_base64,
        "width": W,
        "height": H,
        "auto_angle": auto_angle,
        "compass_box": compass_box
    }
