#!/usr/bin/env python3
"""Scan page-26 right half to find edu zone illustration boundaries."""
from PIL import Image
import numpy as np
import os

SRC = os.path.join(os.path.dirname(__file__), "..", "public", "pdf-images")
img = Image.open(os.path.join(SRC, "page-26.png")).convert("RGB")
arr = np.array(img)

print("=== x=1000-1600 (right portion where edu zone lives) ===")
for y in range(280, 1000, 10):
    strip = arr[y:y+10, 1000:1600, :]
    b = strip.mean()
    bar = "#" * int(b / 5)
    print(f"y={y:4d} {b:6.1f} {bar}")

print("\n=== table y region x=100-1500 ===")
for y in range(720, 1080, 10):
    strip = arr[y:y+10, 100:1500, :]
    b = strip.mean()
    bar = "#" * int(b / 5)
    print(f"y={y:4d} {b:6.1f} {bar}")
