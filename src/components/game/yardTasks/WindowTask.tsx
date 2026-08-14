import { useEffect, useRef, useState } from 'react';

type WindowTaskProps = { onReady: () => void };

export function WindowTask({ onReady }: WindowTaskProps) {
  const [light, setLight] = useState(25);
  const [warmth, setWarmth] = useState(0);
  const holding = useRef(false);
  const completed = useRef(false);
  const isBalanced = light >= 46 && light <= 68;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLight((current) => Math.max(0, Math.min(100, current + (holding.current ? 3.2 : -1.5))));
      setWarmth((current) => {
        const next = Math.max(0, Math.min(100, current + (isBalanced ? 3.5 : -4)));
        if (next === 100 && !completed.current) {
          completed.current = true;
          onReady();
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [isBalanced, onReady]);

  const start = () => { holding.current = true; };
  const stop = () => { holding.current = false; };

  return (
    <>
      <p className="task-guidance">{completed.current ? 'Окно запомнило тепло.' : isBalanced ? 'Удерживай свет в жёлтой середине.' : light < 46 ? 'Слишком темно — удерживай кнопку.' : 'Слишком ярко — отпусти кнопку.'}</p>
      <div className="window-balance">
        <span className="draw-window" style={{ opacity: .35 + warmth / 155 }} />
        <div className="light-meter"><i /><b style={{ left: `${light}%` }} /></div>
        <button onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onKeyDown={(event) => { if (event.code === 'Space' || event.code === 'Enter') start(); }} onKeyUp={stop}>Удерживать свет</button>
      </div>
      <div className="task-progress"><i style={{ width: `${warmth}%` }} /></div>
    </>
  );
}
