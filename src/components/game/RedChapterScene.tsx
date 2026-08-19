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
  const [sinkQueued, setSinkQueued] = useState(false);
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
    if (sinkQueued) {
      setSinkQueued(false);
      setShowSink(true);
    }
    if (finishAfterDialogue) onComplete();
  };

  const handleEvent = useCallback((event: RedEvent) => {
    if (event === 'window' && !sinkSeen) {
      setSinkQueued(true);
      return openDialogue([
        { text: 'На краю раковины засохла красная краска.' },
        { speaker: 'Ты', text: 'Такая же осталась у меня на пальцах перед тем уроком.' },
        { speaker: 'Ты', text: 'Я тогда тёр её до звонка. Проверим, смоется ли сейчас.' },
      ]);
    }
    if (event === 'last-desk' && !sinkSeen) {
      return openDialogue([
        { text: 'Красная черта расплывается, стоит попытаться вспомнить её.' },
        { speaker: 'Ты', text: 'Сначала запах краски. Кабинет ИЗО.' },
      ]);
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

  if (phase === 'memory') return <RedLineMemory playerName={playerName} onComplete={finishMemory} />;

  const objective = phase === 'returning'
    ? 'Вернись к Штриху в коридоре'
    : !sinkSeen ? 'Найди раковину в кабинете ИЗО'
      : foundSharpener ? 'Найди последнюю парту в классе' : 'Найди красную точилку в кабинете ИЗО';

  return (
    <div className="red-chapter">
      <RedSchoolWorld key={phase} returning={phase === 'returning'} foundSharpener={foundSharpener}
        sinkSeen={sinkSeen} isInteractive={dialogue.length === 0 && !showSink}
        showTouchControls={showTouchControls} onEvent={handleEvent} />
      <aside className="red-chapter__objective"><small>Сейчас</small><strong>{objective}</strong></aside>
      {dialogue.length > 0 && <DialogueBox line={dialogue[lineIndex]} current={lineIndex} total={dialogue.length}
        playerName={playerName} onNext={nextDialogueLine} />}
      {showSink && <PaintSinkScene onComplete={finishSink} />}
    </div>
  );
}
