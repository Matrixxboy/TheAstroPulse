import requests

url = "http://127.0.0.1:5000/process-image"
files = {'image': open(r'c:\Utsav\Biz-Projects\TheAstroPulse\backend\testing\palm\images.png', 'rb')}
try:
    response = requests.post(url, files=files)
    print("Status Code:", response.status_code)
    try:
        import json
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
except Exception as e:
    print(e)
