#!/usr/bin/env python3
"""Crop useful regions from PDF page PNGs.
Source images are 1625x1125. Content area starts at ~y=280 (white separator
between title block and content), ends around y=1080 (footer ~y=1100+).
Coordinates chosen from brightness scan (see scripts/scan.py)."""
from PIL import Image
import os

SRC = os.path.join(os.path.dirname(__file__), "..", "public", "pdf-images")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "img")
os.makedirs(OUT, exist_ok=True)

CROPS = [
    # 조감도 (page-02, 건물 렌더링 좌측)
    ("page-02.png", (25, 295, 750, 430), "rendering.png"),
    # 세교2지구 원형 입지도 (page-04)
    ("page-04.png", (35, 290, 690, 780), "location-map.png"),
    # 22개 공동주택 블록 배치도 (page-05)
    ("page-05.png", (35, 290, 670, 790), "blocks-map.png"),
    # 세교3지구 개발계획 패널 (page-06 좌, panel only, no bottom quote)
    ("page-06.png", (40, 285, 760, 555), "city-plan.png"),
    # 반도체 클러스터 패널 (page-06 우, panel only, no bottom quote)
    ("page-06.png", (820, 285, 770, 555), "semicon-cluster.png"),
    # 오산역 환승주차장 배치도 (page-07 좌)
    ("page-07.png", (40, 285, 770, 790), "osan-station.png"),
    # 광역 교통망 4 Premium 카드 (page-08)
    ("page-08.png", (30, 290, 1580, 700), "transport.png"),
    # 전세가 비교 3바 차트 (page-10)
    ("page-10.png", (30, 295, 1580, 720), "price-chart.png"),
    # 더샵 주거벨트 4단지 타임라인 (page-13)
    ("page-13.png", (20, 290, 1600, 300), "dusharp-belt.png"),
    # 주차대수 비교 (page-14)
    ("page-14.png", (30, 285, 1580, 400), "parking-compare.png"),
    # 단지 배치도 좌측 (page-15)
    ("page-15.png", (20, 75, 1070, 970), "site-plan.png"),
    # 오산천 산책로 사진 스택 (page-15 우)
    ("page-15.png", (1100, 75, 510, 970), "osancheon-views.png"),
    # 84A 평면도 (page-16 중앙, 평면 드로잉만)
    ("page-16.png", (295, 100, 755, 475), "unit-84a.png"),
    # 84B 평면도 (page-19)
    ("page-19.png", (295, 100, 755, 475), "unit-84b.png"),
    # 104A 평면도 (page-22)
    ("page-22.png", (295, 100, 755, 475), "unit-104a.png"),
    # 클럽 더샵 3D 일러스트 + 시설표 (page-26, 전체 콘텐츠 영역)
    ("page-26.png", (0, 280, 1625, 775), "community.png"),
]

for src, (x, y, w, h), out in CROPS:
    src_path = os.path.join(SRC, src)
    img = Image.open(src_path)
    iw, ih = img.size
    x2 = min(iw, x + w)
    y2 = min(ih, y + h)
    cropped = img.crop((x, y, x2, y2))
    out_path = os.path.join(OUT, out)
    cropped.save(out_path, "PNG", optimize=True)
    print(f"{out}: {cropped.size}")

print("Done.")
