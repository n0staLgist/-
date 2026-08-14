import { useState } from 'react';

type HopscotchTaskProps = { onReady: () => void };

const path = [1, 3, 2, 4, 6, 5];

export function HopscotchTask({ onReady }: HopscotchTaskProps) {
  const [isPreview, setIsPreview] = useState(true);
  const [step, setStep] = useState(0);
  const [mistake, setMistake] = useState(false);

  const choose = (cell: number) => {
    if (isPreview) return;
    if (cell !== path[step]) {
      setStep(0);
      setMistake(true);
      return;
    }
    setMistake(false);
    const next = step + 1;
    setStep(next);
    if (next === path.length) onReady();
  };

  return (
    <>
      <p className="task-guidance">{isPreview ? 'Запомни порядок клеток.' : mistake ? 'Не тот шаг. Начни путь заново.' : 'Повтори путь по памяти.'}</p>
      <div className={`hopscotch-board ${isPreview ? 'is-preview' : ''}`}>
        {[1, 2, 3, 4, 5, 6].map((cell) => (
          <button key={cell} className={step > path.indexOf(cell) ? 'is-filled' : ''} onClick={() => choose(cell)}>
            {isPreview ? path.indexOf(cell) + 1 : cell}
          </button>
        ))}
      </div>
      {isPreview && <button className="ghost-paper" onClick={() => setIsPreview(false)}>Запомнил. Убрать подсказку</button>}
      <div className="task-progress"><i style={{ width: `${step / path.length * 100}%` }} /></div>
    </>
  );
}
