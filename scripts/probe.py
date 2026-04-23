#!/usr/bin/env python3
"""Extract thin horizontal and vertical strips for visual calibration."""
from PIL import Image, ImageDraw, ImageFont
import os

SRC = os.path.join(os.path.dirname(__file__), "..", "public", "pdf-images")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "debug")
os.makedirs(OUT, exist_ok=True)

# Annotate pages with a y-grid overlay so we can eyeball exact boundaries
pages = ["page-04", "page-05", "page-16", "page-26", "page-15", "page-06", "page-08", "page-10", "page-02"]
for p in pages:
    img = Image.open(os.path.join(SRC, f"{p}.png")).convert("RGB")
    w, h = img.size
    draw = ImageDraw.Draw(img)
    for y in range(0, h, 50):
        color = (255, 0, 0) if y % 100 == 0 else (255, 128, 0)
        draw.line([(0, y), (w, y)], fill=color, width=1)
        draw.text((5, y + 2), str(y), fill=(255, 0, 0))
    for x in range(0, w, 100):
        draw.line([(x, 0), (x, h)], fill=(0, 150, 255), width=1)
        draw.text((x + 2, 5), str(x), fill=(0, 100, 200))
    img.thumbnail((1400, 1400))
    img.save(os.path.join(OUT, f"{p}-grid.png"))
    print(f"{p}: {w}x{h}")
print("Grids saved to public/debug/")
