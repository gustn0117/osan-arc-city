#!/usr/bin/env python3
"""Scan page-16 brightness at narrow x ranges to find plan's true bottom boundary."""
from PIL import Image
import numpy as np
import os

SRC = os.path.join(os.path.dirname(__file__), "..", "public", "pdf-images")
img = Image.open(os.path.join(SRC, "page-16.png")).convert("RGB")
arr = np.array(img)

# Plan center column — should drop when plan drawing ends
for y in range(100, 900, 10):
    strip = arr[y:y+10, 400:900, :]
    b = strip.mean()
    bar = "#" * int(b / 5)
    print(f"y={y:4d} {b:6.1f} {bar}")
