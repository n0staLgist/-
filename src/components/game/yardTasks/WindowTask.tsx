import { useEffect, useState } from 'react';

type WindowTaskProps = { onReady: () => void };

export function WindowTask({ onReady }: WindowTaskProps) {
  const [tuning, setTuning] = useState(18);
  const distance = Math.abs(tuning - 72);
  const litCount = distance <= 4 ? 4 : distance <= 12 ? 3 : distance <= 25 ? 2 : distance <= 40 ? 1 : 0;
  const isTuned = litCount === 4;

  useEffect(() => {
    if (!isTuned) return;
    const timer = window.setTimeout(onReady, 850);
    return () => window.clearTimeout(timer);
  }, [isTuned, onReady]);

  return (
    <>
      <p className="task-guidance">{isTuned ? 'Шум исчез. За стеклом снова тепло.' : litCount > 1 ? 'Слышна музыка. Медленнее — сигнал совсем рядом.' : 'Пока только шум. Проведи ручку по шкале.'}</p>
      <div className={`window-panes ${isTuned ? 'is-tuned' : ''}`} aria-label={`Зажжено стёкол: ${litCount} из 4`}>
        {[0, 1, 2, 3].map((pane) => (
          <i className={pane < litCount ? 'is-lit' : ''} key={pane} />
        ))}
      </div>
      <label className="radio-tuning">
        <span>Настройка радио</span>
        <input type="range" min="0" max="100" value={tuning}
          onChange={(event) => setTuning(Number(event.currentTarget.value))} aria-label="Частота старого радио" />
      </label>
      <div className="task-progress"><i style={{ width: `${litCount * 25}%` }} /></div>
    </>
  );
}
