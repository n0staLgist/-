import { useRef, useState } from 'react';

type SwingTaskProps = { onReady: () => void };

export function SwingTask({ onReady }: SwingTaskProps) {
  const [ropes, setRopes] = useState([0, 0]);
  const activeRope = useRef<number | null>(null);

  const start = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const rope = ropes[0] < 100 && x < .5 ? 0 : ropes[1] < 100 && x >= .5 ? 1 : null;
    if (rope === null) return;
    activeRope.current = rope;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const draw = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (activeRope.current === null) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const targetX = activeRope.current === 0 ? .4 : .6;
    if (Math.abs(x - targetX) > .13 || y < .18) return;
    const progress = Math.min(100, Math.max(0, (y - .18) * 145));
    setRopes((current) => {
      const next = [...current];
      next[activeRope.current ?? 0] = Math.max(next[activeRope.current ?? 0], progress);
      if (next[0] >= 98 && next[1] >= 98) onReady();
      return next;
    });
  };

  return (
    <>
      <p className="task-guidance">Проведи обе верёвки сверху вниз, не выходя за пунктир.</p>
      <button className="drawing-action" onPointerDown={start} onPointerMove={draw} onPointerUp={() => { activeRope.current = null; }} onPointerCancel={() => { activeRope.current = null; }}>
        <span className="draw-swing" style={{ '--rope-left': ropes[0] / 100, '--rope-right': ropes[1] / 100 } as React.CSSProperties} />
      </button>
      <div className="task-progress"><i style={{ width: `${(ropes[0] + ropes[1]) / 2}%` }} /></div>
    </>
  );
}
