"""Run the merged Intel weld VLM on named welds (real model output for the video).

Usage: uv run python video/scripts/run_vlm_hero.py TOP/PART [TOP/PART ...]
Writes video/docs/vlm_<part>_{sampled,greedy}.md with the verbatim report.
"""
import sys, logging
from pathlib import Path
import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForImageTextToText
sys.path.insert(0, 'deploy')
from telemetry import SYSTEM_PROMPT, compute_telemetry, format_user_prompt

logging.basicConfig(level=logging.INFO)
ROOT = Path('/home/chen/data2/weld_moe/data/raid/intel_robotic_welding_dataset')
OUT = Path('video/docs')
model = AutoModelForImageTextToText.from_pretrained('models/merged', dtype=torch.bfloat16, trust_remote_code=True, device_map='cuda:0')
proc = AutoProcessor.from_pretrained('models/merged', trust_remote_code=True)
for sub in sys.argv[1:]:
    wd = ROOT / sub; part = wd.name
    images = sorted((wd / 'images').glob('*.jpg'))
    img = images[len(images) // 2]
    tel = compute_telemetry(wd / f'{part}.csv')
    prompt = format_user_prompt(tel)
    msgs = [{'role': 'system', 'content': [{'type': 'text', 'text': SYSTEM_PROMPT}]},
            {'role': 'user', 'content': [{'type': 'image', 'image': Image.open(img)}, {'type': 'text', 'text': prompt}]}]
    inputs = proc.apply_chat_template(msgs, add_generation_prompt=True, tokenize=True, return_dict=True, return_tensors='pt').to(model.device)
    for mode in ['sampled', 'greedy']:
        torch.manual_seed(0)
        kw = dict(do_sample=True, temperature=1.5, min_p=0.1) if mode == 'sampled' else dict(do_sample=False)
        with torch.inference_mode():
            out = model.generate(**inputs, max_new_tokens=1024, **kw)
        rep = proc.batch_decode(out[:, inputs['input_ids'].shape[1]:], skip_special_tokens=True)[0]
        hdr = f"# VLM report ({mode})\n\n- weld: `{sub}`\n- image: `{img}`\n- telemetry: `{tel}`\n- params: `{kw}` seed 0\n\n---\n\n"
        (OUT / f'vlm_{part}_{mode}.md').write_text(hdr + rep + '\n', encoding='utf-8')
        print('=' * 30, part, mode); print(rep[:1500])
