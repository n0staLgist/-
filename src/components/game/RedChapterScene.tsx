import { useCallback, useState } from 'react';
import {
  redChapterIntro, redEndingDialogue, redEventDialogue, redReturnDialogue,
  type RedEvent,
} from '../../game/redChapter';
import type { DialogueLine } from '../../game/types';
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
    if (event === 'last-desk' && !foundSharpener) {
      return openDialogue([
        { speaker: 'Ты', text: 'Парта знакомая. Но я не помню, почему именно эта.' },
        { speaker: 'Штрих', text: 'В кабинете ИЗО кое-что осталось. Маленькое и красное.' },
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
      { text: 'Красный след расплылся по раковине. Чище не стало.' },
      { speaker: 'Штрих', text: 'Это просто краска.' },
      { speaker: 'Ты', text: 'Я не спрашивал.' },
    ]);
  };

  if (showSink) return <PaintSinkScene onComplete={finishSink} />;
  if (phase === 'memory') return <RedLineMemory playerName={playerName} onComplete={finishMemory} />;

  const objective = phase === 'returning'
    ? 'Вернись к Штриху в коридоре'
    : foundSharpener ? 'Найди последнюю парту в классе' : 'Осмотри старый кабинет ИЗО';

  return (
    <div className="red-chapter">
      <RedSchoolWorld key={phase} returning={phase === 'returning'} foundSharpener={foundSharpener}
        isInteractive={dialogue.length === 0}
        showTouchControls={showTouchControls} onEvent={handleEvent} />
      <p className="red-chapter__objective">{objective}</p>
      {dialogue.length > 0 && <DialogueBox line={dialogue[lineIndex]} current={lineIndex} total={dialogue.length}
        playerName={playerName} onNext={nextDialogueLine} />}
    </div>
  );
}
