
import os

def inject_stars():
    # Read generated star content
    with open('stars_small.txt', 'r') as f:
        stars_small = f.read().strip()
    with open('stars_medium.txt', 'r') as f:
        stars_medium = f.read().strip()
    with open('stars_large.txt', 'r') as f:
        stars_large = f.read().strip()

    # Read index.css
    css_path = '../frontend/src/index.css'
    with open(css_path, 'r') as f:
        css_content = f.read()

    # Replace placeholders
    new_css = css_content.replace('[STAR_BOX_SHADOW_SMALL]', stars_small)
    new_css = new_css.replace('[STAR_BOX_SHADOW_MEDIUM]', stars_medium)
    new_css = new_css.replace('[STAR_BOX_SHADOW_LARGE]', stars_large)

    # Write back
    with open(css_path, 'w') as f:
        f.write(new_css)
    
    print("Successfully injected star CSS.")

if __name__ == "__main__":
    inject_stars()
