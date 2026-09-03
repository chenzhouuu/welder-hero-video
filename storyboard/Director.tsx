import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Player, type PlayerRef} from '@remotion/player';
import {SCENES, sceneByN} from '@/scenes/registry';
import {SceneHost} from '@/lib/SceneHost';
import {FPS, HEIGHT, WIDTH, framesOf} from '@/lib/scene';

const readParams = (): {n: number; p: number} => {
  const q = new URLSearchParams(window.location.search);
  const n = Number(q.get('scene') ?? '1');
  const scene = sceneByN(Number.isFinite(n) ? n : 1);
  const tSec = q.get('t');
  const p = tSec !== null ? Number(tSec) / scene.durationSec : Number(q.get('p') ?? '0');
  return {n: scene.n, p: Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : 0};
};

const writeParams = (n: number, p: number): void => {
  const q = new URLSearchParams(window.location.search);
  q.set('director', '1');
  q.set('scene', String(n));
  q.set('p', p.toFixed(3));
  window.history.replaceState(null, '', `?${q.toString()}`);
};

/**
 * Director Mode: pick a scene, play / pause, scrub, step, jump to keyframes.
 * Deliberately not an editor — it only shows the shared scene components.
 */
export const Director: React.FC = () => {
  const init = useMemo(readParams, []);
  const [n, setN] = useState(init.n);
  const [frame, setFrame] = useState(() => Math.round(init.p * (framesOf(sceneByN(init.n)) - 1)));
  const [playing, setPlaying] = useState(false);
  const [guides, setGuides] = useState(false);
  const [notes, setNotes] = useState(() => new URLSearchParams(window.location.search).get('notes') !== '0');
  const [loop, setLoop] = useState(true);
  const ref = useRef<PlayerRef>(null);
  const scene = sceneByN(n);
  const frames = framesOf(scene);
  const progress = frames > 1 ? frame / (frames - 1) : 1;
  const initialFrame = useRef(Math.round(init.p * (frames - 1)));

  useEffect(() => {
    const pl = ref.current;
    if (!pl) return;
    const onFrame = (e: {detail: {frame: number}}): void => setFrame(e.detail.frame);
    const onPlay = (): void => setPlaying(true);
    const onPause = (): void => setPlaying(false);
    pl.addEventListener('frameupdate', onFrame);
    pl.addEventListener('play', onPlay);
    pl.addEventListener('pause', onPause);
    pl.addEventListener('ended', onPause);
    return () => {
      pl.removeEventListener('frameupdate', onFrame);
      pl.removeEventListener('play', onPlay);
      pl.removeEventListener('pause', onPause);
      pl.removeEventListener('ended', onPause);
    };
  }, [n]);

  useEffect(() => {
    writeParams(n, progress);
  }, [n, progress]);

  const seekP = useCallback(
    (p: number) => {
      const f = Math.round(Math.min(1, Math.max(0, p)) * (frames - 1));
      ref.current?.seekTo(f);
      setFrame(f);
    },
    [frames],
  );
  const step = useCallback(
    (d: number) => {
      const f = Math.min(frames - 1, Math.max(0, (ref.current?.getCurrentFrame() ?? frame) + d));
      ref.current?.pause();
      ref.current?.seekTo(f);
      setFrame(f);
    },
    [frame, frames],
  );
  const goScene = useCallback((next: number, p = 0) => {
    const nn = Math.min(SCENES.length, Math.max(1, next));
    initialFrame.current = Math.round(p * (framesOf(sceneByN(nn)) - 1));
    setFrame(initialFrame.current);
    setPlaying(false);
    setN(nn);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === ' ') {
        e.preventDefault();
        ref.current?.toggle();
      } else if (e.key === 'ArrowLeft') step(e.shiftKey ? -10 : -1);
      else if (e.key === 'ArrowRight') step(e.shiftKey ? 10 : 1);
      else if (e.key === '[' || e.key === ']') {
        const ch = scene.chapters ?? [];
        if (ch.length) {
          const cur = ref.current?.getCurrentFrame() ?? frame;
          const tt = cur / FPS;
          const idx = ch.findIndex((c, i) => tt >= c.at - 1e-6 && tt < (ch[i + 1]?.at ?? scene.durationSec));
          const to = ch[Math.min(ch.length - 1, Math.max(0, idx + (e.key === ']' ? 1 : -1)))];
          seekP(to.at / scene.durationSec);
        } else goScene(n + (e.key === ']' ? 1 : -1));
      }
      else if (e.key === 'g') setGuides((v) => !v);
      else if (e.key === 'n') setNotes((v) => !v);
      else if (e.key === 'Home') seekP(0);
      else if (e.key === 'End') seekP(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [n, step, goScene, seekP, scene, frame]);

  const t = frame / FPS;
  const chapter = (scene.chapters ?? []).filter((c) => c.at <= t + 1e-6).pop();
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="bar top">
        <strong style={{marginRight: 8}}>WELDER storyboard</strong>
        {SCENES.length > 1
          ? SCENES.map((s) => (
              <button key={s.id} className={s.n === n ? 'active' : ''} onClick={() => goScene(s.n)} title={s.message}>
                {s.n} {s.title}
              </button>
            ))
          : null}
        {(scene.chapters ?? []).map((c, i, all) => {
          const next = all[i + 1]?.at ?? scene.durationSec;
          const active = t >= c.at && t < next;
          return (
            <button key={c.n} className={active ? 'active' : ''} onClick={() => seekP(c.at / scene.durationSec)} title={c.message}>
              {c.n} {c.title}
            </button>
          );
        })}
        <span style={{flex: 1}} />
        <button aria-pressed={guides} onClick={() => setGuides((v) => !v)}>guides</button>
        <button aria-pressed={notes} onClick={() => setNotes((v) => !v)}>notes</button>
        <button aria-pressed={loop} onClick={() => setLoop((v) => !v)}>loop</button>
      </div>

      <div className="stage">
        <div className="frame" style={{width: 'min(100%, calc((100vh - 150px) * 16 / 9))', aspectRatio: '16 / 9'}}>
          <Player
            key={scene.id}
            ref={ref}
            component={SceneHost}
            inputProps={{sceneId: scene.id, durationInFrames: frames}}
            durationInFrames={frames}
            fps={FPS}
            compositionWidth={WIDTH}
            compositionHeight={HEIGHT}
            controls={false}
            loop={loop}
            initialFrame={initialFrame.current}
            clickToPlay={false}
            style={{width: '100%', height: '100%'}}
          />
          {guides ? (
            <div className="guides">
              <div style={{inset: '5%'}} title="action safe" />
              <div style={{inset: '10%'}} title="title safe" />
              <div style={{left: '50%', top: 0, bottom: 0, width: 0}} />
              <div style={{top: '50%', left: 0, right: 0, height: 0}} />
            </div>
          ) : null}
        </div>
        {notes ? (
          <div className="notes">
            <h3>
              {scene.title}
              {chapter ? ` · ${chapter.n} ${chapter.title}` : ''}
            </h3>
            <p>
              <em>{chapter ? chapter.message : scene.message}</em>
            </p>
            {scene.notes.length ? (
              <ul>
                {scene.notes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            ) : null}
            <p className="help" style={{marginTop: 10}}>
              <kbd>space</kbd> play · <kbd>←</kbd>
              <kbd>→</kbd> frame · <kbd>shift</kbd>+arrows ×10 · <kbd>[</kbd>
              <kbd>]</kbd> scene · <kbd>g</kbd> guides · <kbd>n</kbd> notes
            </p>
          </div>
        ) : null}
      </div>

      <div className="bar bottom">
        <div className="ticks">
          {scene.keyframes.map((k) => (
            <button key={k.label} style={{left: `${k.at * 100}%`}} onClick={() => seekP(k.at)} title={`p = ${k.at}`}>
              {k.label}
            </button>
          ))}
        </div>
        <input type="range" min={0} max={frames - 1} step={1} value={frame} onChange={(e) => seekP(Number(e.target.value) / (frames - 1))} />
        <div className="bar" style={{padding: 0}}>
          <button onClick={() => goScene(n - 1)} disabled={n <= 1}>
            ‹ prev
          </button>
          <button onClick={() => ref.current?.toggle()} style={{minWidth: 76}}>
            {playing ? 'pause' : 'play'}
          </button>
          <button onClick={() => goScene(n + 1)} disabled={n >= SCENES.length}>
            next ›
          </button>
          <button onClick={() => step(-1)}>−1f</button>
          <button onClick={() => step(1)}>+1f</button>
          <span className="readout" style={{marginLeft: 8}}>
            t = {t.toFixed(2)} s / {scene.durationSec} s · p = {progress.toFixed(3)} · frame {frame} / {frames - 1}
          </span>
          <span style={{flex: 1}} />
          <span className="help">?director=1&t={t.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};
