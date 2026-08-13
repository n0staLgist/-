import { useRef, useState } from 'react';
import { taskCopy } from '../../game/story';
import type { YardTask } from '../../game/types';

type TaskCardProps = { task: YardTask; onComplete: () => void };

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const [progress, setProgress] = useState(0);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const copy = taskCopy[task];

  const drawRope = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!drawing.current || !lastPoint.current) return;
    const travelled = Math.hypot(event.clientX - lastPoint.current.x, event.clientY - lastPoint.current.y);
    if (travelled > 5) setProgress((value) => Math.min(100, value + travelled * .42));
    lastPoint.current = { x: event.clientX, y: event.clientY };
  };
  const startRope = (event: React.PointerEvent<HTMLButtonElement>) => {
    drawing.current = true; lastPoint.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  return (
    <section className={`task-overlay task-overlay--${task}`}>
      <div className="task-card">
        <span className="eyebrow">маленькое действие</span><h2>{copy.title}</h2><p>{copy.hint}</p>
        {task === 'swing' && <button className="drawing-action" onPointerDown={startRope} onPointerMove={drawRope} onPointerUp={() => { drawing.current = false; }}><span className="draw-swing" style={{ '--draw': progress / 34 } as React.CSSProperties} /></button>}
        {task === 'hopscotch' && <div className="hopscotch-board">{[1, 2, 3, 4].map((cell) => <button key={cell} className={cell <= progress ? 'is-filled' : ''} disabled={cell !== progress + 1} onClick={() => setProgress(cell)}>{cell}</button>)}</div>}
        {task === 'window' && <label className="window-slider"><span className={`draw-window light-${Math.floor(progress / 34)}`} /><input aria-label="Вернуть свет в окно" type="range" min="0" max="100" value={progress} onChange={(event) => setProgress(Number(event.target.value))} /></label>}
        <div className="task-progress"><i style={{ width: `${task === 'hopscotch' ? progress * 25 : progress}%` }} /></div>
        {progress >= (task === 'hopscotch' ? 4 : 95) && <button className="pencil-button" onClick={onComplete}>Вспомнить</button>}
      </div>
    </section>
  );
}
