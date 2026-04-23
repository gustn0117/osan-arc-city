#!/usr/bin/env python3
"""Save slices of page-26 at various y-ranges so we can see what's where."""
from PIL import Image
import os

SRC = os.path.join(os.path.dirname(__file__), "..", "public", "pdf-images")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "debug")
os.makedirs(OUT, exist_ok=True)

img = Image.open(os.path.join(SRC, "page-26.png"))
# Save specific y slices
for y0, y1, name in [(270, 500, "p26-a"), (500, 750, "p26-b"), (750, 1000, "p26-c")]:
    slice = img.crop((0, y0, img.size[0], y1))
    slice.save(os.path.join(OUT, f"{name}.png"))
    print(f"{name}: y={y0}-{y1}")
