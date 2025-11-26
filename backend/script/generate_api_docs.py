import os
import re

PROJECT_ROOT = os.getcwd()
SRC_DIR = os.path.join(PROJECT_ROOT, "./")  # adjust if your Flask app is elsewhere
OUTPUT_FILE = os.path.join(PROJECT_ROOT, "API_Docs.md")

def scan_files(directory):
    """Recursively scan Python files in project directory"""
    files = []
    for root, _, filenames in os.walk(directory):
        for f in filenames:
            if f.endswith(".py"):
                files.append(os.path.join(root, f))
    return files

def extract_endpoints(file_content):
    """Find Flask routes in a Python file"""
    endpoints = []
    # Matches: @app.route('/path', methods=['GET', 'POST'])
    route_pattern = re.compile(
        r'@(?:\w+)\.route\(\s*[\'"]([^\'"]+)[\'"]\s*(?:,\s*methods\s*=\s*\[([^\]]+)\])?\s*\)'
    )
    for match in route_pattern.finditer(file_content):
        path = match.group(1)
        methods = match.group(2)
        if methods:
            methods = [m.strip().strip("'\"") for m in methods.split(",")]
        else:
            methods = ["GET"]  # default in Flask
        for method in methods:
            endpoints.append({"path": path, "method": method})
    return endpoints

def generate_markdown(api_list):
    """Generate API_Docs.md content"""
    md = "# API Documentation\n\n"
    for api in api_list:
        md += f"### {api['method']} {api['path']}\n"
        md += f"- **Description:** (add description here)\n\n"
    return md

def main():
    print("🔍 Scanning Flask project for API routes...")
    files = scan_files(SRC_DIR)
    all_endpoints = []

    for file in files:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
        endpoints = extract_endpoints(content)
        if endpoints:
            print(f"Found {len(endpoints)} endpoints in {file}")
            all_endpoints.extend(endpoints)

    if not all_endpoints:
        print("⚠️ No Flask endpoints found.")
        return

    md_content = generate_markdown(all_endpoints)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(md_content)

    print(f"✅ API_Docs.md updated with {len(all_endpoints)} endpoints.")

if __name__ == "__main__":
    main()
