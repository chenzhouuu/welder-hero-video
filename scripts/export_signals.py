"""Export one weld's six-channel process log to src/data/<part>-signals.json.

usage: python3 scripts/export_signals.py <session>/<part_no>
Time base: sample index × median sampling interval (as for the hero weld). Arc-on = current > 5 A.
"""
import csv, json, sys
from pathlib import Path
from datetime import datetime

DATA = Path('/home/chen/data2/weld_moe/data/raid/intel_robotic_welding_dataset')
sub = sys.argv[1]
part = sub.split('/')[-1]
rows = list(csv.DictReader(open(DATA / sub / f'{part}.csv')))
def col(name):
    return [float(r[name]) for r in rows]
ts = []
for r in rows:
    try:
        ts.append(datetime.strptime(r['Date'] + ' ' + r['Time'], '%m/%d/%Y %H:%M:%S.%f').timestamp())
    except ValueError:
        ts.append(None)
dts = sorted(b - a for a, b in zip(ts, ts[1:]) if a is not None and b is not None and b > a)
dt = dts[len(dts) // 2] if dts else 0.116
I = col('Primary Weld Current')
on = [i for i, v in enumerate(I) if v > 5]
out = {
    'part_no': part, 'sampling_s': round(dt, 3), 'n_rows': len(rows), 'arc_on_rows': [on[0], on[-1]],
    't': [round(i * dt, 3) for i in range(len(rows))],
    'current_A': I, 'voltage_V': col('Secondary Weld Voltage'), 'feed_mm_min': col('Feed'),
    'gas_L_min': col('CO2 Weld Flow'), 'pressure_bar': col('Pressure'), 'wire_mm': col('Wire Consumed'),
}
dst = Path(__file__).resolve().parent.parent / 'src' / 'data' / f'{part}-signals.json'
dst.write_text(json.dumps(out))
print(dst, 'rows', len(rows), 'dt', out['sampling_s'], 'arc rows', out['arc_on_rows'], 'arc s', round(on[0]*dt,1), round(on[-1]*dt,1))
