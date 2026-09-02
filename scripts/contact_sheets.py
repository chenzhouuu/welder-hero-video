"""Tile rendered review stills into per-scene contact sheets.

Usage: python scripts/contact_sheets.py out/stills out/sheets [every_nth]
Stills are named element-<frame>.jpeg by Remotion's --sequence render.
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw

SCENES = [
    ('01-world', 252), ('02-sensing', 252), ('03-perception', 402), ('04-bridge', 222),
    ('05-inconsistency', 252), ('06-knowledge', 342), ('07-reasoning', 462), ('08-explanation', 252),
    ('09-memory', 312), ('10-feedback', 252), ('11-vision', 300),
]
OVERLAP = 12


def main() -> None:
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    dst.mkdir(parents=True, exist_ok=True)
    nth = int(sys.argv[3]) if len(sys.argv) > 3 else 30
    files = {}
    for f in src.glob('*.jpeg'):
        m = re.search(r'(\d+)\.jpeg$', f.name)
        if m:
            files[int(m.group(1)) * nth] = f
    frames = sorted(files)
    if not frames:
        raise SystemExit('no stills found')
    starts = []
    t = 0
    for _, d in SCENES:
        starts.append(t)
        t += d - OVERLAP
    cols = 3
    for i, (name, dur) in enumerate(SCENES):
        lo, hi = starts[i], starts[i] + dur
        sel = [fr for fr in frames if lo <= fr < hi]
        if not sel:
            continue
        im0 = Image.open(files[sel[0]])
        w, h = im0.size
        w, h = w // 2, h // 2
        rows = (len(sel) + cols - 1) // cols
        sheet = Image.new('RGB', (w * cols, (h + 26) * rows), 'black')
        d = ImageDraw.Draw(sheet)
        for j, fr in enumerate(sel):
            x, y = (j % cols) * w, (j // cols) * (h + 26)
            sheet.paste(Image.open(files[fr]).resize((w, h)), (x, y + 26))
            d.text((x + 8, y + 6), f'{name}  frame {fr}  t={fr / 30:.1f}s  (scene t={(fr - lo) / 30:.1f}s)', fill=(200, 200, 200))
        out = dst / f'{name}.jpg'
        sheet.save(out, quality=82)
        print(out, len(sel))


if __name__ == '__main__':
    main()
