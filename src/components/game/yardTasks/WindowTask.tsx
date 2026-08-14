import { useEffect, useRef, useState } from 'react';

type WindowTaskProps = { onReady: () => void };

export function WindowTask({ onReady }: WindowTaskProps) {
  const [light, setLight] = useState(0);
  const [warmth, setWarmth] = useState(0);
  const completed = useRef(false);
  const isBalanced = light >= 54 && light <= 72;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWarmth((current) => {
        const next = Math.max(0, Math.min(100, current + (isBalanced ? 5 : -4)));
        if (next === 100 && !completed.current) {
          completed.current = true;
          onReady();
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [isBalanced, onReady]);

  return (
    <>
      <p className="task-guidance">{warmth >= 100 ? 'Свет удержался.' : isBalanced ? 'Не двигай. Дай комнате согреться.' : 'Найди тёплую середину и удержи её.'}</p>
      <label className="window-slider">
        <span className={`draw-window ${warmth >= 66 ? 'light-3' : warmth >= 33 ? 'light-2' : 'light-1'}`} />
        <input aria-label="Удержать тёплый свет" type="range" min="0" max="100" value={light} onChange={(event) => setLight(Number(event.target.value))} />
        <small>слишком тускло <i /> слишком ярко</small>
      </label>
      <div className="task-progress"><i style={{ width: `${warmth}%` }} /></div>
    </>
  );
}
