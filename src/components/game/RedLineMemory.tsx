import { useState } from 'react';
import { useHoldProgress } from '../../game/useHoldProgress';
import type { DialogueLine } from '../../game/types';
import { DialogueBox } from './DialogueBox';

type RedLineMemoryProps = {
  playerName: string;
  onComplete: () => void;
};

const afterErasing: DialogueLine[] = [
  { speaker: 'Штрих', text: 'Если тебе было стыдно за меня, зачем ты вернулся?' },
  { speaker: 'Ты', text: 'Мне было страшно, что они увидят, насколько это важно для меня.' },
  { speaker: 'Штрих', text: 'Поэтому ты засмеялся первым.' },
  { speaker: 'Ты', text: 'Да. И сам провёл эту линию.' },
];

export function RedLineMemory({ playerName, onComplete }: RedLineMemoryProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [dialogueDone, setDialogueDone] = useState(false);
  const [exitRevealed, setExitRevealed] = useState(false);
  const { progress, isHolding, start, stop } = useHoldProgress(true, 5200);
  const erased = progress >= 100;
  const echo = progress < 22
    ? { speaker: 'Одноклассник', text: 'Ты всё ещё рисуешь эту детскую ерунду?' }
    : progress < 48
      ? { speaker: 'Ты, тогда', text: 'Если засмеюсь первым, они решат, что мне тоже всё равно.' }
      : progress < 76
        ? { speaker: 'Ты, тогда', text: 'Да так. Просто каракули.' }
        : { speaker: 'Штрих', text: 'Красная линия сопротивляется ластику.' };

  const nextLine = () => {
    if (lineIndex < afterErasing.length - 1) setLineIndex((current) => current + 1);
    else setDialogueDone(true);
  };
  const handleExit = () => {
    if (!exitRevealed) return setExitRevealed(true);
    onComplete();
  };

  return (
    <section className={`red-memory ${isHolding ? 'is-erasing' : ''} ${erased ? 'is-erased' : ''}`}>
      <div className="red-memory__grid" />
      <div className="red-memory__faces" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="red-memory__desk">
        <div className="red-memory__notebook">
          <div className="red-memory__streak"><i /><b /></div>
          <span className="red-memory__strike" style={{ clipPath: `inset(0 0 0 ${progress}%)` }} />
          <span className="red-memory__eraser" style={{ left: `${13 + progress * .7}%` }} />
          <i className="red-memory__dust" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <article className="red-memory__echo" aria-live="polite">
        <b>{echo.speaker}</b><p>{echo.text}</p>
      </article>
      {!erased && <div className="red-memory__action">
        <p>Не отпускай линию на полпути.</p>
        <button className="hold-action" onPointerDown={start} onPointerUp={stop}
          onPointerCancel={stop} onPointerLeave={stop}><b>Стирать</b><kbd>E</kbd><small>удерживать</small></button>
        <div className="hold-progress"><i style={{ width: `${progress}%` }} /></div>
      </div>}
      {erased && !dialogueDone && <DialogueBox line={afterErasing[lineIndex]} current={lineIndex}
        total={afterErasing.length} playerName={playerName} onNext={nextLine} />}
      {erased && dialogueDone && <button className={`red-memory__exit ${exitRevealed ? 'is-revealed' : ''}`}
        onClick={handleExit}>{exitRevealed ? 'Бросить его снова' : 'Выйти'}</button>}
    </section>
  );
}
