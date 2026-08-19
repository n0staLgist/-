import { useEffect, useState } from 'react';
import classmatesSprite from '../../assets/game/faceless-classmates-v2.webp';
import notebookChildhood from '../../assets/game/notebook-childhood-v4.webp';
import { useHoldProgress } from '../../game/useHoldProgress';
import type { DialogueLine } from '../../game/types';
import { DialogueBox } from './DialogueBox';
import { SpeakerPortrait } from './SpeakerPortrait';

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

const memoryBeats: DialogueLine[] = [
  { speaker: 'Одноклассник', portrait: 'classmate-2', text: 'Ты всё ещё рисуешь эту детскую ерунду?' },
  { speaker: 'Ты, тогда', text: 'Если засмеюсь первым, они решат, что мне тоже всё равно.' },
  { speaker: 'Ты, тогда', text: 'Да так. Просто каракули.' },
];

export function RedLineMemory({ playerName, onComplete }: RedLineMemoryProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [dialogueDone, setDialogueDone] = useState(false);
  const [exitRevealed, setExitRevealed] = useState(false);
  const [exitBreaking, setExitBreaking] = useState(false);
  const [started, setStarted] = useState(false);
  const [acknowledgedBeat, setAcknowledgedBeat] = useState(0);
  const { progress, isHolding, start, stop } = useHoldProgress(started, 5200);
  const erased = progress >= 100;
  const currentBeat = progress >= 67 ? 2 : progress >= 34 ? 1 : 0;
  const isReading = !started || currentBeat > acknowledgedBeat;
  const echo = memoryBeats[currentBeat];

  useEffect(() => {
    if (isReading) stop();
  }, [isReading, stop]);

  useEffect(() => {
    if (!exitBreaking) return;
    const timer = window.setTimeout(() => setExitRevealed(true), 950);
    return () => window.clearTimeout(timer);
  }, [exitBreaking]);

  const nextLine = () => {
    if (lineIndex < afterErasing.length - 1) setLineIndex((current) => current + 1);
    else setDialogueDone(true);
  };
  const handleExit = () => {
    if (!exitRevealed) return setExitBreaking(true);
    onComplete();
  };
  const continueErasing = () => {
    setAcknowledgedBeat(currentBeat);
    setStarted(true);
  };

  return (
    <section className={`red-memory ${isHolding ? 'is-erasing' : ''} ${erased ? 'is-erased' : ''}`}>
      <div className="red-memory__grid" />
      <div className="red-memory__faces" aria-hidden="true">
        {[0, 1, 2].map((frame) => <i className={`red-memory__face--${frame}`} key={frame}
          style={{ backgroundImage: `url(${classmatesSprite})` }} />)}
      </div>
      <div className="red-memory__desk">
        <div className="red-memory__notebook">
          <img src={notebookChildhood} alt="Знакомая тетрадь «Штрих и его мир» с детским рисунком Штриха" />
          <span className="red-memory__strike" style={{ clipPath: `inset(0 0 0 ${progress}%)` }} />
          <span className="red-memory__eraser" style={{ left: `${49 + progress * .43}%` }} />
          <i className="red-memory__dust" style={{ width: `${progress * .44}%` }} />
        </div>
      </div>
      {!erased && isReading && <article className={`red-memory__echo ${echo.portrait ? 'is-classmate' : 'is-hero'} is-paused`} aria-live="polite">
        <SpeakerPortrait speaker={echo.speaker} portrait={echo.portrait} />
        <b>{echo.speaker}</b><p>{echo.text}</p>
      </article>}
      {!erased && isReading && <button className="red-memory__continue" onClick={continueErasing}>
        {started ? 'Продолжить стирать' : 'Начать стирать'}
      </button>}
      {!erased && !isReading && <div className="red-memory__action">
        <p>Не отпускай линию на полпути.</p>
        <button className="hold-action" onPointerDown={start} onPointerUp={stop}
          onPointerCancel={stop} onPointerLeave={stop}><b>Стирать</b><kbd>E</kbd><small>удерживать</small></button>
        <div className="hold-progress"><i style={{ width: `${progress}%` }} /></div>
      </div>}
      {erased && !dialogueDone && <DialogueBox line={afterErasing[lineIndex]} current={lineIndex}
        total={afterErasing.length} playerName={playerName} onNext={nextLine} />}
      {erased && dialogueDone && <button
        className={`red-memory__exit ${exitBreaking ? 'is-breaking' : ''} ${exitRevealed ? 'is-revealed' : ''}`}
        disabled={exitBreaking && !exitRevealed} onClick={handleExit}>
        {exitRevealed ? <span className="red-memory__exit-reveal">Бросить его снова</span> : <>
          <span className="red-memory__exit-label">Выйти</span>
          <span className="red-memory__exit-piece red-memory__exit-piece--left" aria-hidden="true">Выйти</span>
          <span className="red-memory__exit-piece red-memory__exit-piece--right" aria-hidden="true">Выйти</span>
        </>}
      </button>}
    </section>
  );
}
