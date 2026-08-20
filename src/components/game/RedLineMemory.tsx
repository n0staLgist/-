import { useEffect, useState } from 'react';
import classmatesSprite from '../../assets/game/faceless-classmates-v2.webp';
import notebookChildhood from '../../assets/game/notebook-childhood-v4.webp';
import { playPaperCrack, restoreAmbience, silenceAmbience } from '../../game/audio';
import { useHoldProgress } from '../../game/useHoldProgress';
import { useTypewriter } from '../../game/useTypewriter';
import type { DialogueLine } from '../../game/types';
import { DialogueBox } from './DialogueBox';
import { SpeakerPortrait } from './SpeakerPortrait';
import { HoldActionButton } from './HoldActionButton';

type RedLineMemoryProps = {
  playerName: string;
  onComplete: () => void;
};

const afterErasing: DialogueLine[] = [
  { speaker: 'Штрих', text: 'Если тебе было стыдно за меня, зачем ты вернулся?' },
  { speaker: 'Ты', text: 'Мне было не стыдно за тебя. Мне было страшно, что они увидят: ты мне нужен.' },
  { speaker: 'Штрих', text: 'Поэтому первым засмеялся ты.' },
  { speaker: 'Ты', text: 'Да. Так их смех звучал тише.' },
];

const memoryBeats: DialogueLine[] = [
  { speaker: 'Одноклассник', portrait: 'classmate-2', text: 'Ты всё ещё рисуешь эту детскую ерунду?' },
  { speaker: 'Ты, тогда', kind: 'thought', text: 'Только бы они не поняли, что мне не всё равно.' },
  { speaker: 'Ты, тогда', kind: 'speech', text: 'Да брось. Это просто каракули.' },
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
  const { visibleText: echoText, isComplete: isEchoComplete, complete: completeEcho } =
    useTypewriter(echo.text, echo.speaker, echo.kind);

  useEffect(() => {
    if (isReading) stop();
  }, [isReading, stop]);

  useEffect(() => {
    if (!exitBreaking) return;
    const timer = window.setTimeout(() => setExitRevealed(true), 950);
    return () => window.clearTimeout(timer);
  }, [exitBreaking]);

  useEffect(() => () => restoreAmbience(), []);

  const nextLine = () => {
    if (lineIndex < afterErasing.length - 1) setLineIndex((current) => current + 1);
    else setDialogueDone(true);
  };
  const handleExit = () => {
    if (!exitRevealed) {
      silenceAmbience();
      playPaperCrack();
      return setExitBreaking(true);
    }
    onComplete();
  };
  const continueErasing = () => {
    if (!isEchoComplete) return completeEcho();
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
      {!erased && isReading && <article className={`red-memory__echo ${echo.portrait ? 'is-classmate' : 'is-hero'} ${echo.kind === 'thought' ? 'is-thought' : 'is-speech'} is-paused`} aria-live="polite">
        <SpeakerPortrait speaker={echo.speaker} portrait={echo.portrait} />
        <b>{echo.kind === 'thought' ? 'Мысль' : echo.speaker}</b><p>{echoText}</p>
      </article>}
      {!erased && isReading && <button className="red-memory__continue" onClick={continueErasing}>
        {!isEchoComplete ? 'Дочитать' : started ? 'Продолжить стирать' : 'Начать стирать'}
      </button>}
      {!erased && !isReading && <div className="red-memory__action">
        <p>Не отпускай линию на полпути.</p>
        <HoldActionButton onStart={start} onStop={stop}><b>Стирать</b><kbd>E</kbd><small>удерживать</small></HoldActionButton>
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
