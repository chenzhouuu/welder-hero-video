"""Build the WELDER hero-video demo page.

Usage:
  python scripts/build_demo.py --out demo/index.html --video welder-hero.mp4 --poster poster.jpg
  python scripts/build_demo.py --out <artifact.html> --video demo/welder-hero-1080p-web.mp4 --poster demo/poster-720.jpg --embed

--embed inlines the video and poster as data URIs so the page is self-contained (Artifact).
Chapter times come from the scene table in src/Root.tsx (12-frame overlaps, 30 fps).
"""
import argparse
import base64
import json
import mimetypes
from pathlib import Path

SCENES = [
    ('01', 'Manufacturing world', 252, 'A weld is a physical event that leaves evidence in several channels.'),
    ('02', 'Multimodal sensing', 252, 'Image, current, voltage, wire feed, gas, context — the real 309-row log of weld 03-15-23-0080-05.'),
    ('03', 'Fast neural perception', 402, 'Two neural sentinels turn pixels and signals into typed observations: UNDERCUT at the toe; arc stable, 279 A.'),
    ('04', 'Neural-symbolic interface', 222, 'The raw data recedes. What remains is an inspectable intermediate representation.'),
    ('05', 'Evidence inconsistency', 252, 'Product abnormal, process stable. The simplest hypothesis fails, so perception hands over to reasoning.'),
    ('06', 'Symbolic knowledge', 342, 'The causes of undercut are not in the pixels. They are in WELDER-KB (kb-v1): typed entities and weighted edges.'),
    ('07', 'Mechanism reasoning', 462, 'Four hypotheses from the knowledge graph are tested against the observations and a WPS rule; one is supported.'),
    ('08', 'Prediction to explanation', 252, 'Detection tells us WHAT. Neural-symbolic reasoning investigates WHY — a hypothesis with its evidence.'),
    ('09', 'Traceability and memory', 312, 'One weld is an observation. 140 undercut welds, all above the current window, become a pattern.'),
    ('10', 'Human-centred feedback', 252, 'Process improvement, operator support, inspection. No worker rankings.'),
    ('11', 'The broader vision', 300, 'Welding is one instance: perceive with neural models, reason with manufacturing knowledge.'),
]
OVERLAP = 12
FPS = 30


def chapters() -> list:
    out = []
    t = 0
    for code, title, dur, teach in SCENES:
        out.append({'code': code, 'title': title, 'start': round(t / FPS, 2), 'teach': teach})
        t += dur - OVERLAP
    return out


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(str(path))[0] or 'application/octet-stream'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode('ascii')


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', required=True)
    ap.add_argument('--video', required=True)
    ap.add_argument('--poster', required=True)
    ap.add_argument('--embed', action='store_true')
    args = ap.parse_args()
    tpl = (Path(__file__).parent / 'demo_template.html').read_text(encoding='utf-8')
    video_src = data_uri(Path(args.video)) if args.embed else args.video
    poster_src = data_uri(Path(args.poster)) if args.embed else args.poster
    html = (tpl.replace('__VIDEO_SRC__', video_src)
               .replace('__POSTER_SRC__', poster_src)
               .replace('__CHAPTERS_JSON__', json.dumps(chapters())))
    Path(args.out).write_text(html, encoding='utf-8')
    print(args.out, f'{len(html) / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
