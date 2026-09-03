"""Screenshot storyboard keyframes with Playwright.

usage: python3 scripts/shot.py OUT_DIR spec [spec ...] [--ui] [--url=http://localhost:8094]
  spec     scene:p (e.g. 1:0.6, progress) or t=SECONDS (e.g. t=26.5, story seconds); the 1920×1080 frame is saved
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
        if spec.startswith('t='):
            n, pr = '1', None
            query = f'scene=1&t={spec[2:]}'
        else:
            n, pr = spec.split(':')
            query = f'scene={n}&p={pr}'
        pg.goto(f'{url}/?director=1&{query}&notes={1 if ui else 0}')
        pg.wait_for_load_state('networkidle')
        pg.wait_for_timeout(600)
        # wait until every <video> has data for the sought frame (Player seeks on mount)
        pg.wait_for_function("[...document.querySelectorAll('video')].every(v => v.readyState >= 2)", timeout=8000)
        pg.wait_for_timeout(400)
        name = out / (f't{float(spec[2:]):05.1f}' if pr is None else f's{int(n):02d}_p{float(pr):.2f}') 
        name = name.with_name(name.name + ('_ui' if ui else '') + '.png')
        if ui:
            pg.screenshot(path=str(name))
        else:
            pg.locator('.frame').screenshot(path=str(name))
        print(name)
    errs = [l for l in logs if l.startswith('error') or 'Error' in l]
    if errs:
        print('console errors:'); print('\n'.join(errs[:10]))
    b.close()
