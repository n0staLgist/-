import { useEffect, useRef, useState } from 'react';

type HopscotchTaskProps = { onReady: () => void };
const path = [1, 3, 2, 4, 6, 5];

export function HopscotchTask({ onReady }: HopscotchTaskProps) {
  const [previewStep, setPreviewStep] = useState(0);
  const [isPreview, setIsPreview] = useState(true);
  const [step, setStep] = useState(0);
  const [mistake, setMistake] = useState<number | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!isPreview) return;
    if (previewStep >= path.length) {
      const hide = window.setTimeout(() => setIsPreview(false), 450);
      return () => window.clearTimeout(hide);
    }
    const timer = window.setTimeout(() => setPreviewStep((current) => current + 1), 430);
    return () => window.clearTimeout(timer);
  }, [isPreview, previewStep]);

  const choose = (cell: number) => {
    if (isPreview) return;
    if (cell !== path[step]) {
      setMistake(cell);
      window.setTimeout(() => setMistake(null), 500);
      return;
    }
    const next = step + 1;
    setStep(next);
    if (next === path.length) onReady();
  };

  return (
    <>
      <p className="task-guidance">{isPreview ? 'Посмотри, как проходит дорожка.' : mistake ? 'Эта клетка позже. Продолжи с подсвеченной.' : 'Проведи по клеткам или нажимай их по очереди.'}</p>
      <div className="hopscotch-board" onPointerUp={() => { isDrawing.current = false; }} onPointerLeave={() => { isDrawing.current = false; }}>
        {[1, 2, 3, 4, 5, 6].map((cell) => {
          const pathIndex = path.indexOf(cell);
          const isLit = isPreview ? pathIndex === previewStep - 1 : pathIndex < step;
          return <button key={cell} className={`${isLit ? 'is-filled' : ''} ${mistake === cell ? 'is-mistake' : ''}`} onPointerDown={() => { isDrawing.current = true; choose(cell); }} onPointerEnter={() => { if (isDrawing.current) choose(cell); }} onClick={(event) => { if (event.detail === 0) choose(cell); }} disabled={isPreview}>{cell}</button>;
        })}
      </div>
      <div className="task-progress"><i style={{ width: `${step / path.length * 100}%` }} /></div>
    </>
  );
}
