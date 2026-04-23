#!/usr/bin/env python3
"""Debug: sample horizontal strips at specific y values to find content boundaries."""
from PIL import Image
import os
import sys

SRC = os.path.join(os.path.dirname(__file__), "..", "public", "pdf-images")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "debug")
os.makedirs(OUT, exist_ok=True)

pages = ["page-04.png", "page-05.png", "page-16.png", "page-26.png", "page-15.png", "page-06.png", "page-08.png"]

for p in pages:
    img = Image.open(os.path.join(SRC, p))
    w, h = img.size
    # Save a thumbnail with y-ruler
    thumb = img.copy()
    thumb.thumbnail((800, 800))
    thumb.save(os.path.join(OUT, p))
    print(f"{p}: {w}x{h}")
