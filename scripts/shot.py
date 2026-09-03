"""Screenshot storyboard keyframes with Playwright.

usage: true  OUT_DIR scene:p [scene:p ...] [--ui] [--url http://localhost:8094]
  scene:p  e.g. 3:0.6  → Director Mode scene 3 at progress 0.6; the 1920×1080 frame is saved
  --ui     capture the whole Director page instead of the bare frame
"""
import sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright

args = [a for a in sys.argv[1:] if not a.startswith('--')]
ui = '--ui' in sys.argv
url = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--url=')), 'http://localhost:8094')
out = Path(args[0]); out.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_page(viewport={'width': 1920 + 40, 'height': 1080 + 190}, device_scale_factor=1)
    logs = []
    pg.on('console', lambda m: logs.append(f'{m.type}: {m.text}'))
    for spec in args[1:]:
        n, pr = spec.split(':')
        pg.goto(f'{url}/?director=1&scene={n}&p={pr}&notes={1 if ui else 0}')
        pg.wait_for_load_state('networkidle')
        pg.wait_for_timeout(600)
        # wait until every <video> has data for the sought frame (Player seeks on mount)
        pg.wait_for_function("[...document.querySelectorAll('video')].every(v => v.readyState >= 2)", timeout=8000)
        pg.wait_for_timeout(400)
        name = out / f's{int(n):02d}_p{float(pr):.2f}{"_ui" if ui else ""}.png'
        if ui:
            pg.screenshot(path=str(name))
        else:
            pg.locator('.frame').screenshot(path=str(name))
        print(name)
    errs = [l for l in logs if l.startswith('error') or 'Error' in l]
    if errs:
        print('console errors:'); print('\n'.join(errs[:10]))
    b.close()
