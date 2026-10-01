#!/usr/bin/env python3
"""Fit generated art into assets/: portraits 1024² (contact_portraits), vehicle
portraits 1024², item icons 256², then copy shared icons per tools/art-share.tsv.
Then run `node tools/gen-actors.mjs` (portraits are picked up by file) and
`npm run art -- --fix` (set-art wires item and vehicle images)."""
import os, glob
from PIL import Image

def square(src, dst, size):
    im = Image.open(src).convert("RGB"); w, h = im.size; m = min(w, h)
    im = im.crop(((w - m) // 2, (h - m) // 2, (w - m) // 2 + m, (h - m) // 2 + m)).resize((size, size), Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True); im.save(dst, quality=86, method=6)

n = 0
for f in glob.glob("_work/out/*.webp"):
    square(f, f"assets/contact_portraits/{os.path.basename(f)}", 1024); n += 1
for f in glob.glob("_work/out/icons/*/*.webp"):
    kind, name = f.split("/")[-2:]
    if kind == "vehicle": square(f, f"assets/vehicle_portraits/{name}", 1024)
    else: square(f, f"assets/item_icons/{kind}/{name}", 256)
    n += 1
for line in open("tools/art-share.tsv"):
    key, targets = line.rstrip("\n").split("\t")
    src = f"assets/item_icons/{key}.webp"
    if not os.path.exists(src): continue
    for t in targets.split():
        os.makedirs(os.path.dirname(f"assets/item_icons/{t}.webp"), exist_ok=True)
        Image.open(src).save(f"assets/item_icons/{t}.webp", quality=86, method=6); n += 1
    if key not in targets.split(): os.remove(src)   # a shared source, not an item of its own
print(f"{n} image(s) written")
