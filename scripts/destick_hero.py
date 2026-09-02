"""Repaint the part-number label out of the hero weld's photos (project destick pipeline).

Calls research/destick_photos.process() for the five photos of one weld, writing
label-only and label+card variants under video/public/hero/destick/.
"""
import sys, logging
from pathlib import Path
sys.path.insert(0, 'research')
import torch
from transformers import AutoModelForZeroShotObjectDetection, AutoProcessor
from destick_photos import process
from destick_crops import DATA, DINO_ID
from simple_lama_inpainting import SimpleLama

logging.basicConfig(level=logging.INFO)
sub = sys.argv[1] if len(sys.argv) > 1 else 'undercut_4_03-15-23_Fe410/03-15-23-0080-05'
wd = DATA / sub
out_root = Path('video/public/hero/destick')
proc = AutoProcessor.from_pretrained(DINO_ID)
model = AutoModelForZeroShotObjectDetection.from_pretrained(DINO_ID).to('cuda').eval()
lama = SimpleLama(device=torch.device('cuda'))
for jpg in sorted((wd / 'images').glob('*.jpg')):
    rel = jpg.relative_to(DATA)
    for remove_card, tag in [(False, 'label'), (True, 'all')]:
        st = process(jpg, rel, model, proc, 'cuda', lama, out_root / tag, None, remove_card)
        print(tag, jpg.name, st)
