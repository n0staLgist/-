import { useState } from 'react';

type WindowTaskProps = { onReady: () => void };

export function WindowTask({ onReady }: WindowTaskProps) {
  const [litPanes, setLitPanes] = useState<number[]>([]);

  const lightPane = (pane: number) => {
    if (litPanes.includes(pane)) return;
    const next = [...litPanes, pane];
    setLitPanes(next);
    if (next.length === 4) onReady();
  };

  return (
    <>
      <p className="task-guidance">{litPanes.length === 4 ? 'За стеклом снова тепло.' : 'Нажми на тёмные стёкла и верни свет в окно.'}</p>
      <div className="window-panes" aria-label={`Зажжено стёкол: ${litPanes.length} из 4`}>
        {[0, 1, 2, 3].map((pane) => (
          <button className={litPanes.includes(pane) ? 'is-lit' : ''} key={pane} onClick={() => lightPane(pane)} aria-label={`Зажечь стекло ${pane + 1}`} />
        ))}
      </div>
      <div className="task-progress"><i style={{ width: `${litPanes.length * 25}%` }} /></div>
    </>
  );
}
