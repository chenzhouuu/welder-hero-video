"""Run SAM 3.1 (Meta reference stack) on label-removed weld photos and save the top bead mask.

usage (isolated SAM env, from the repository root):
  research/sam3_meta/.venv/bin/python video/scripts/sam_bead_mask.py \
      video/public/hero/plate_front_full.jpg video/public/hero/good_front_full.jpg

For each image writes <stem>_sam31_mask.png (binary, image size) and <stem>_sam31.json
(prompt, top box, score, presence, mask area). Prompt and scoring follow research/d18_run_meta_sam.py.
"""
import json
import sys
from pathlib import Path

import numpy as np
import torch
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'research'))
from d18_run_meta_sam import build, infer  # noqa: E402

CONCEPT = 'a weld bead'


def main() -> None:
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    processor, model = build('sam3.1', device)
    if device == 'cuda':  # the reference stack runs under bf16 autocast; fp32 raises a dtype mismatch
        torch.autocast('cuda', dtype=torch.bfloat16).__enter__()
    for arg in sys.argv[1:]:
        path = Path(arg)
        im = Image.open(path).convert('RGB')
        with torch.inference_mode():
            res = infer(processor, model, im, CONCEPT, device)
        scores = [float(s) for s in res['scores']]
        if not scores:
            print(path, 'no candidates')
            continue
        i = int(np.argmax(scores))
        mask = res['masks'][i].cpu().numpy().astype(np.uint8) * 255
        box = [round(float(v), 1) for v in res['boxes'][i].tolist()]
        out_png = path.with_name(path.stem + '_sam31_mask.png')
        Image.fromarray(mask).save(out_png)
        meta = {'image': path.name, 'model': 'sam31', 'prompt': CONCEPT, 'box': box, 'score': round(scores[i], 4),
                'presence': round(res['presence'], 5), 'mask_area_px': int((mask > 0).sum()), 'n_candidates': len(scores)}
        path.with_name(path.stem + '_sam31.json').write_text(json.dumps(meta, indent=1))
        print(path.name, meta)


if __name__ == '__main__':
    main()
