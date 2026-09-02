"""Measure arc-on process statistics for fillet welds (Good vs Undercut).

Reads the raw Intel sensor CSVs and reports, per weld: arc-on duration,
mean/std/CV of current & voltage, mean feed, mean CO2 flow. Arc-on = rows
with Primary Weld Current > 5 A (same rule as the demo BFF).
"""
import sys
from pathlib import Path
import pandas as pd
import numpy as np

ROOT = Path('/home/chen/data2/weld_moe/data/raid/intel_robotic_welding_dataset')
man = pd.read_csv(ROOT / 'manifest.csv')
cats = sys.argv[1].split(',') if len(sys.argv) > 1 else ['Good', 'Undercut']
sel = man[(man.CATEGORY.isin(cats))].copy()
rows = []
for _, r in sel.iterrows():
    sub = ROOT / r.SUBDIRS
    part = sub.name
    csv = sub / f'{part}.csv'
    if not csv.exists():
        continue
    df = pd.read_csv(csv)
    df.columns = [c.strip() for c in df.columns]
    on = df[df['Primary Weld Current'] > 5]
    if len(on) < 5:
        continue
    I = on['Primary Weld Current']; V = on['Secondary Weld Voltage']
    rows.append(dict(cat=r.CATEGORY, joint=r.WELD_TYPE, steel=r.STEEL_TYPE, split=r.SPLIT,
        part=part, top=r.DIRECTORY, nomI=r.CURRENT_A, nomV=r.VOLTAGE_V, nomSpeed=r.ROBOT_SPEED_CPM,
        n_on=len(on), dur_s=len(on)*0.11,
        I_mean=I.mean(), I_std=I.std(), I_cv=I.std()/I.mean(),
        V_mean=V.mean(), V_std=V.std(), V_cv=V.std()/V.mean(),
        feed_mean=on['Feed'].mean(), gas_mean=on['CO2 Weld Flow'].mean(),
        press_mean=on['Pressure'].mean(), wire=df['Wire Consumed'].iloc[-1],
        n_img=len(list((sub/'images').glob('*.jpg')))))
out = pd.DataFrame(rows)
out.to_csv('/home/chen/weld-vlm-demo/video/docs/process_stats.csv', index=False)
pd.set_option('display.width', 250); pd.set_option('display.max_columns', 40)
num = ['nomI','nomV','nomSpeed','dur_s','I_mean','I_std','I_cv','V_mean','V_std','V_cv','feed_mean','gas_mean','wire']
print(out.groupby(['cat','joint','steel'])[num].median().round(3))
print()
print(out.groupby(['cat','joint','steel']).size())
