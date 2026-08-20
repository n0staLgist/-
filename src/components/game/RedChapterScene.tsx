import { useCallback, useEffect, useState } from 'react';
import {
  redChapterIntro, redEndingDialogue, redEventDialogue, redReturnDialogue,
  type RedEvent,
} from '../../game/redChapter';
import type { DialogueLine } from '../../game/types';
import { setAmbienceMood } from '../../game/audio';
import { DialogueBox } from './DialogueBox';
import { PaintSinkScene } from './PaintSinkScene';
import { RedLineMemory } from './RedLineMemory';
import { RedSchoolWorld } from './RedSchoolWorld';
import '../../styles/redChapter.css';
import '../../styles/redInteractions.css';

type RedChapterSceneProps = {
  playerName: string;
  showTouchControls: boolean;
  onComplete: () => void;
};

type RedPhase = 'explore' | 'memory' | 'returning';

export function RedChapterScene({ playerName, showTouchControls, onComplete }: RedChapterSceneProps) {
  const [phase, setPhase] = useState<RedPhase>('explore');
  const [foundSharpener, setFoundSharpener] = useState(false);
  const [showSink, setShowSink] = useState(false);
  const [sinkSeen, setSinkSeen] = useState(false);
  const [dialogue, setDialogue] = useState<DialogueLine[]>(redChapterIntro);
  const [lineIndex, setLineIndex] = useState(0);
  const [finishAfterDialogue, setFinishAfterDialogue] = useState(false);

  useEffect(() => {
    setAmbienceMood(phase === 'returning' ? 'red-empty' : 'red');
  }, [phase]);

  const openDialogue = useCallback((lines: DialogueLine[], finish = false) => {
    setDialogue(lines);
    setLineIndex(0);
    setFinishAfterDialogue(finish);
  }, []);

  const nextDialogueLine = () => {
    if (lineIndex < dialogue.length - 1) return setLineIndex((index) => index + 1);
    setDialogue([]);
    setLineIndex(0);
    if (finishAfterDialogue) onComplete();
  };

  const handleEvent = useCallback((event: RedEvent) => {
    if (event === 'window' && !sinkSeen) {
      setShowSink(true);
      return;
    }
    if (event === 'last-desk' && !sinkSeen) {
      return openDialogue([
        { text: 'Красная черта дрожит под пальцем. Воспоминание обрывается на запахе гуаши.' },
        { speaker: 'Ты', text: 'Сначала были руки под краном.' },
      ]);
    }
    if (event === 'last-desk' && !foundSharpener) {
      return openDialogue([
        { speaker: 'Ты', text: 'Я помню эту парту. Не помню, зачем вернулся к ней.' },
        { speaker: 'Штрих', text: 'Красный всегда оставался в точилке дольше, чем на бумаге.' },
      ]);
    }
    if (event === 'sharpener') {
      setFoundSharpener(true);
      return openDialogue(redEventDialogue.sharpener ?? []);
    }
    if (event === 'last-desk') {
      setPhase('memory');
      return;
    }
    if (event === 'shtrikh') return openDialogue(redEndingDialogue, true);
    const lines = redEventDialogue[event];
    if (lines) openDialogue(lines);
  }, [foundSharpener, openDialogue, sinkSeen]);

  const finishMemory = () => {
    setPhase('returning');
    openDialogue(redReturnDialogue);
  };
  const finishSink = () => {
    setShowSink(false);
    setSinkSeen(true);
    openDialogue([
      { text: 'Красная вода на секунду задерживается у слива.' },
      { speaker: 'Штрих', text: 'Это просто краска.' },
      { speaker: 'Ты', text: 'Я не спрашивал.' },
    ]);
  };

  if (phase === 'memory') return <RedLineMemory playerName={playerName} onComplete={finishMemory} />;

  const objective = phase === 'returning'
    ? 'Вернись к Штриху в коридоре'
    : !sinkSeen ? 'Осмотри красный след у раковины в ИЗО'
      : foundSharpener ? 'Вернись к тетради на последней парте' : 'Найди красную точилку в кабинете ИЗО';

  return (
    <div className="red-chapter">
      <RedSchoolWorld key={phase} returning={phase === 'returning'} foundSharpener={foundSharpener}
        sinkSeen={sinkSeen} isInteractive={dialogue.length === 0 && !showSink}
        showTouchControls={showTouchControls} onEvent={handleEvent} />
      <aside className="red-chapter__objective"><small>След в памяти</small><strong>{objective}</strong></aside>
      {dialogue.length > 0 && <DialogueBox line={dialogue[lineIndex]} current={lineIndex} total={dialogue.length}
        playerName={playerName} onNext={nextDialogueLine} />}
      {showSink && <PaintSinkScene onComplete={finishSink} />}
    </div>
  );
}
