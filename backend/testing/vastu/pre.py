import os

path = "./Data/"

for i, filename in enumerate(sorted(os.listdir(path))):
    if filename.lower().endswith((".png", ".jpg", ".jpeg")):
        new_name = f"img_{i:04d}.png"
        os.rename(
            os.path.join(path, filename),
            os.path.join(path, new_name)
        )
