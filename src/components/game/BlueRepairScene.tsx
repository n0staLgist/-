import { useEffect, useState, type CSSProperties } from 'react';
import shtrikhImage from '../../assets/game/shtrikh-yard-present-v2.webp';
import { playPaperTool, playPencilHandoff, restoreAmbience, silenceAmbience } from '../../game/audio';
import {
  blueEraseAround, blueEraseAttempt, bluePencilFound,
  blueRepairDialogue, blueRepairIntro,
} from '../../game/blueChapter';
import type { DialogueLine } from '../../game/types';
import { useHoldProgress } from '../../game/useHoldProgress';
import { BlueConvergenceScene } from './BlueConvergenceScene';
import { DialogueBox } from './DialogueBox';
import { HoldActionButton } from './HoldActionButton';

type BlueRepairSceneProps = { playerName: string; onComplete: () => void };
type RepairStep = 'intro' | 'choice' | 'eraseAttempt' | 'eraseAround' |
  'erase' | 'pencil' | 'draw' | 'give' | 'dialogue' | 'reveal';

const stepDialogue: Partial<Record<RepairStep, DialogueLine[]>> = {
  intro: blueRepairIntro,
  eraseAttempt: blueEraseAttempt,
  eraseAround: blueEraseAround,
  pencil: bluePencilFound,
  dialogue: blueRepairDialogue,
};

function RepairFigure({ cage = 0, arm = 0, changedSmile = false }: {
  cage?: number; arm?: number; changedSmile?: boolean;
}) {
  return <div className={`blue-repair__figure ${changedSmile ? 'has-changed-smile' : ''}`}>
    <img src={shtrikhImage} alt="Штрих с двумя бумажными слезами и недорисованной рукой" />
    <i className="blue-repair__arm" style={{ '--arm-progress': arm } as CSSProperties} />
    <span className="blue-repair__cage" style={{ opacity: cage }} aria-hidden="true"><i /><i /><i /><i /><i /></span>
    <b className="blue-repair__smile" aria-hidden="true" />
  </div>;
}

function HoldStep({ kind, onDone }: { kind: 'erase' | 'draw'; onDone: () => void }) {
  const duration = kind === 'erase' ? 4200 : 3400;
  const { progress, isHolding, start, stop } = useHoldProgress(true, duration);
  const finished = progress >= 100;
  const erasing = kind === 'erase';
  useEffect(() => {
    if (!isHolding || finished) return;
    playPaperTool(kind);
    const timer = window.setInterval(() => playPaperTool(kind), erasing ? 190 : 145);
    return () => window.clearInterval(timer);
  }, [erasing, finished, isHolding, kind]);
  return <section className={`blue-repair ${isHolding ? 'is-working' : ''}`}>
    <div className="blue-repair__paper" />
    <RepairFigure cage={erasing ? 1 - progress / 100 : 0} arm={erasing ? 0 : progress / 100} />
    <article className="blue-repair__copy">
      <span>{erasing ? 'Ластик с твоим именем' : 'Тот самый карандаш'}</span>
      <h1>{erasing ? 'Не его' : 'Там, где остановился'}</h1>
      <p>{erasing
        ? 'Ты ведёшь ластик по каждой чёрной полосе, не касаясь контура Штриха.'
        : 'Линия продолжается с того места, где много лет назад дрогнула детская рука.'}</p>
      {finished ? <button className="pencil-button" onClick={onDone}>{erasing ? 'Убрать последнюю полосу' : 'Опустить карандаш'}</button>
        : <HoldActionButton onStart={start} onStop={stop}><b>{erasing ? 'Стереть линии вокруг' : 'Дорисовать руку'}</b><kbd>E</kbd><small>удерживать</small></HoldActionButton>}
      <div className="hold-progress"><i style={{ width: `${progress}%` }} /></div>
    </article>
  </section>;
}

export function BlueRepairScene({ playerName, onComplete }: BlueRepairSceneProps) {
  const [step, setStep] = useState<RepairStep>('intro');
  const [lineIndex, setLineIndex] = useState(0);
  const goTo = (nextStep: RepairStep) => { setLineIndex(0); setStep(nextStep); };
  useEffect(() => { silenceAmbience(1.1); return () => restoreAmbience(); }, []);

  if (step === 'reveal') return <BlueConvergenceScene onComplete={onComplete} />;
  if (step === 'erase') return <HoldStep kind="erase" onDone={() => goTo('pencil')} />;
  if (step === 'draw') return <HoldStep kind="draw" onDone={() => goTo('give')} />;
  if (step === 'choice') return <section className="blue-repair blue-repair--choice">
    <div className="blue-repair__paper" /><RepairFigure cage={1} />
    <article className="blue-repair__decision"><span>Ластик лежит в ладони</span><h1>Что стереть?</h1>
      <button className="is-danger" onClick={() => goTo('eraseAttempt')}>Стереть Штриха</button>
      <button onClick={() => goTo('eraseAround')}>Стереть линии вокруг него</button>
    </article>
  </section>;
  if (step === 'give') return <section className="blue-repair">
    <div className="blue-repair__paper" /><RepairFigure arm={1} />
    <article className="blue-repair__decision"><span>Новая рука держится</span><h1>Не рисовать за него</h1>
      <p>Короткий карандаш всё ещё у тебя. Теперь Штрих может взять его сам.</p>
      <button onClick={() => { playPencilHandoff(); goTo('dialogue'); }}>Протянуть Штриху карандаш</button>
    </article>
  </section>;

  const lines = stepDialogue[step] ?? blueRepairDialogue;
  const nextStep: Partial<Record<RepairStep, RepairStep>> = {
    intro: 'choice', eraseAttempt: 'erase', eraseAround: 'erase', pencil: 'draw', dialogue: 'reveal',
  };
  const nextLine = () => lineIndex < lines.length - 1
    ? setLineIndex((index) => index + 1) : goTo(nextStep[step] ?? 'reveal');
  const cage = step === 'intro' || step === 'eraseAttempt' || step === 'eraseAround' ? 1 : 0;
  return <section className="blue-repair">
    <div className="blue-repair__paper" />
    <RepairFigure cage={cage} arm={step === 'dialogue' ? 1 : 0}
      changedSmile={step === 'dialogue' && lineIndex === lines.length - 1} />
    <DialogueBox line={lines[lineIndex]} current={lineIndex}
      total={lines.length} playerName={playerName} onNext={nextLine} />
  </section>;
}
