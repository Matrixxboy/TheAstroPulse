import torch
import torch.nn as nn
import cv2
import numpy as np
import matplotlib.pyplot as plt

class UNet(nn.Module):
    def __init__(self):
        super().__init__()

        def CBR(in_c, out_c):
            return nn.Sequential(
                nn.Conv2d(in_c, out_c, 3, padding=1),
                nn.ReLU(inplace=True),
                nn.Conv2d(out_c, out_c, 3, padding=1),
                nn.ReLU(inplace=True)
            )

        self.d1 = CBR(1, 64)
        self.p1 = nn.MaxPool2d(2)

        self.d2 = CBR(64, 128)
        self.p2 = nn.MaxPool2d(2)

        self.d3 = CBR(128, 256)

        self.u2 = nn.ConvTranspose2d(256, 128, 2, stride=2)
        self.u2c = CBR(256, 128)

        self.u1 = nn.ConvTranspose2d(128, 64, 2, stride=2)
        self.u1c = CBR(128, 64)

        self.out = nn.Conv2d(64, 1, 1)

    def forward(self, x):
        d1 = self.d1(x)
        d2 = self.d2(self.p1(d1))
        d3 = self.d3(self.p2(d2))

        u2 = self.u2(d3)
        u2 = self.u2c(torch.cat([u2, d2], dim=1))

        u1 = self.u1(u2)
        u1 = self.u1c(torch.cat([u1, d1], dim=1))

        return torch.sigmoid(self.out(u1))


from torch.utils.data import Dataset
import os

class FloorPlanDataset(Dataset):
    def __init__(self, img_dir, mask_dir):
        self.img_dir = img_dir
        self.mask_dir = mask_dir
        self.imgs = [f for f in sorted(os.listdir(img_dir)) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        # Verify masks exist
        valid_imgs = []
        for img_name in self.imgs:
            mask_name = self._get_mask_name(img_name)
            if os.path.exists(os.path.join(mask_dir, mask_name)):
                valid_imgs.append(img_name)
        self.imgs = valid_imgs

    def _get_mask_name(self, img_name):
        base, ext = os.path.splitext(img_name)
        return f"{base}_mask{ext}"

    def __len__(self):
        return len(self.imgs)

    def __getitem__(self, idx):
        img_name = self.imgs[idx]
        mask_name = self._get_mask_name(img_name)
        
        img_path = os.path.join(self.img_dir, img_name)
        mask_path = os.path.join(self.mask_dir, mask_name)
        
        img = cv2.imread(img_path, 0)
        mask = cv2.imread(mask_path, 0)
        
        if img is None:
            raise ValueError(f"Failed to load image: {img_path}")
        if mask is None:
            raise ValueError(f"Failed to load mask: {mask_path}")

        img = cv2.resize(img, (256, 256))
        mask = cv2.resize(mask, (256, 256))

        img = img / 255.0
        mask = mask / 255.0

        return (
            torch.tensor(img).unsqueeze(0).float(),
            torch.tensor(mask).unsqueeze(0).float()
        )


from torch.utils.data import DataLoader

dataset = FloorPlanDataset("dataset/images", "dataset/masks")
loader = DataLoader(dataset, batch_size=4, shuffle=True)

model = UNet()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
loss_fn = nn.BCELoss()

for epoch in range(20):
    total_loss = 0
    for img, mask in loader:
        pred = model(img)
        loss = loss_fn(pred, mask)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1} | Loss: {total_loss:.4f}")


model.eval()

# --- SAVE CODE STARTS HERE ---
save_path = "house_segmentation_unet.pth"
torch.save(model.state_dict(), save_path)
print(f"Model weights saved to {save_path}")
# -----------------------------
img = cv2.imread("test.png", 0)
img_r = cv2.resize(img, (256, 256)) / 255.0
tensor = torch.tensor(img_r).unsqueeze(0).unsqueeze(0).float()

with torch.no_grad():
    pred = model(tensor)[0,0].numpy()

# --- Bounding Box Detection ---
# 1. Load Original Image
original_img = cv2.imread("test.png")
if original_img is None:
    raise ValueError("Could not load test.png")
h_orig, w_orig = original_img.shape[:2]

# 2. Resize Prediction back to Original Size
# pred is currently 256x256 from model output
pred_original_size = cv2.resize(pred, (w_orig, h_orig))

print(f"\nPrediction stats: min={pred_original_size.min():.4f}, max={pred_original_size.max():.4f}, mean={pred_original_size.mean():.4f}\n")

# 3. Threshold to get Binary Mask
# Lowering threshold to 0.1 to account for limited training data
binary_mask = (pred_original_size > 0.1).astype(np.uint8) * 255

# 4. Find Contours
contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

if contours:
    # 5. Get Largest Contour (House Boundary)
    largest_contour = max(contours, key=cv2.contourArea)
    
    # 6. Get Bounding Box
    x, y, w, h = cv2.boundingRect(largest_contour)
    
    # 7. Draw Bounding Box on Original Image
    # (0, 255, 0) is Green, thickness=2
    cv2.rectangle(original_img, (x, y), (x + w, y + h), (0, 255, 0), 2)
    print(f"Detected House Bounding Box: x={x}, y={y}, w={w}, h={h}")
else:
    print("No house detected.")

# 8. Save Result
cv2.imwrite("detection_result.png", original_img)
print("Saved detection result to detection_result.png")


