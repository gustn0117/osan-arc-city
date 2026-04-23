#!/usr/bin/env python3
"""Scan pages and report mean brightness per y-row to find content boundaries."""
from PIL import Image
import numpy as np
import os

SRC = os.path.join(os.path.dirname(__file__), "..", "public", "pdf-images")

def analyze(page, x_start, x_end):
    img = Image.open(os.path.join(SRC, page)).convert("RGB")
    arr = np.array(img)
    strip = arr[:, x_start:x_end, :]
    brightness = strip.mean(axis=(1, 2))
    print(f"\n{page} (x={x_start}-{x_end}):")
    for y in range(0, img.size[1], 20):
        bar = "#" * int(brightness[y] / 5)
        print(f"  y={y:4d} bright={brightness[y]:6.1f} {bar}")

# page-04 left half where title text is
analyze("page-04.png", 60, 700)
# page-05 left half
analyze("page-05.png", 60, 700)
# page-16 center where plan sits
analyze("page-16.png", 280, 1020)
# page-26 where community illustration is
analyze("page-26.png", 60, 1600)
