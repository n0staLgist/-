import { useEffect, useState, type CSSProperties } from 'react';
import shtrikhImage from '../../assets/game/shtrikh-yard-present-v2.webp';
import { playPaperTool, playPencilHandoff, restoreAmbience, silenceAmbience } from '../../game/audio';
import { blueRepairDialogue } from '../../game/blueChapter';
import { useHoldProgress } from '../../game/useHoldProgress';
import { DialogueBox } from './DialogueBox';
import { BlueConvergenceScene } from './BlueConvergenceScene';
import { HoldActionButton } from './HoldActionButton';

type BlueRepairSceneProps = { playerName: string; onComplete: () => void };
type RepairStep = 'erase' | 'draw' | 'give' | 'dialogue' | 'reveal';

function RepairFigure({ cage = 0, arm = 0, changedSmile = false }: {
  cage?: number;
  arm?: number;
  changedSmile?: boolean;
}) {
  return <div className={`blue-repair__figure ${changedSmile ? 'has-changed-smile' : ''}`}>
    <img src={shtrikhImage} alt="Штрих с двумя бумажными слезами и недорисованной рукой" />
    <i className="blue-repair__arm" style={{ '--arm-progress': arm } as CSSProperties} />
    <span className="blue-repair__cage" style={{ opacity: cage }} aria-hidden="true"><i /><i /><i /><i /><i /></span>
    <b className="blue-repair__smile" aria-hidden="true" />
  </div>;
}

function HoldStep({ kind, onDone }: { kind: 'erase' | 'draw'; onDone: () => void }) {
  const duration = kind === 'erase' ? 3800 : 3000;
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
      <span>{erasing ? 'Ластик' : 'Карандаш'}</span>
      <h1>{erasing ? 'Не его' : 'Одна линия'}</h1>
      <p>{erasing
        ? 'Чёрные линии проходят вокруг Штриха. Бумага под ним остаётся целой.'
        : 'Недорисованная рука заканчивается там же, где закончился детский карандаш.'}</p>
      {!finished ? <HoldActionButton onStart={start} onStop={stop}><b>{erasing ? 'Стирать вокруг' : 'Дорисовать руку'}</b><kbd>E</kbd><small>удерживать</small></HoldActionButton>
        : <button className="pencil-button" onClick={onDone}>{erasing ? 'Отложить ластик' : 'Закончить линию'}</button>}
      <div className="hold-progress"><i style={{ width: `${progress}%` }} /></div>
    </article>
  </section>;
}

export function BlueRepairScene({ playerName, onComplete }: BlueRepairSceneProps) {
  const [step, setStep] = useState<RepairStep>('erase');
  const [lineIndex, setLineIndex] = useState(0);
  useEffect(() => {
    silenceAmbience(1.1);
    return () => restoreAmbience();
  }, []);

  if (step === 'reveal') return <BlueConvergenceScene onComplete={onComplete} />;
  if (step === 'erase') return <HoldStep kind="erase" onDone={() => setStep('draw')} />;
  if (step === 'draw') return <HoldStep kind="draw" onDone={() => setStep('give')} />;
  if (step === 'give') return <section className="blue-repair">
    <div className="blue-repair__paper" />
    <RepairFigure arm={1} />
    <button className="blue-repair__give" onClick={() => { playPencilHandoff(); setStep('dialogue'); }}>Отдать Штриху карандаш</button>
  </section>;

  const nextLine = () => {
    if (lineIndex < blueRepairDialogue.length - 1) setLineIndex((index) => index + 1);
    else setStep('reveal');
  };
  return <section className="blue-repair">
    <div className="blue-repair__paper" />
    <RepairFigure arm={1} changedSmile={lineIndex === blueRepairDialogue.length - 1} />
    <DialogueBox line={blueRepairDialogue[lineIndex]} current={lineIndex}
      total={blueRepairDialogue.length} playerName={playerName} onNext={nextLine} />
  </section>;
}
