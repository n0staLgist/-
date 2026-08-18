import { useCallback, useState } from 'react';
import { redClassScenes } from '../../game/chapters';
import {
  redChapterIntro, redEndingDialogue, redEventDialogue, redReturnDialogue,
  type RedEvent,
} from '../../game/redChapter';
import type { DialogueLine } from '../../game/types';
import { DialogueBox } from './DialogueBox';
import { RedClassScene } from './RedClassScene';
import { RedSchoolWorld } from './RedSchoolWorld';
import '../../styles/redChapter.css';

type RedChapterSceneProps = {
  playerName: string;
  showTouchControls: boolean;
  onComplete: () => void;
};

type RedPhase = 'explore' | 'memory' | 'returning';

export function RedChapterScene({ playerName, showTouchControls, onComplete }: RedChapterSceneProps) {
  const [phase, setPhase] = useState<RedPhase>('explore');
  const [foundSharpener, setFoundSharpener] = useState(false);
  const [memoryIndex, setMemoryIndex] = useState(0);
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
      setMemoryIndex(0);
      return;
    }
    if (event === 'shtrikh') return openDialogue(redEndingDialogue, true);
    const lines = redEventDialogue[event];
    if (lines) openDialogue(lines);
  }, [foundSharpener, openDialogue]);

  const advanceMemory = () => {
    if (memoryIndex < redClassScenes.length - 1) return setMemoryIndex((index) => index + 1);
    setPhase('returning');
    setMemoryIndex(0);
    openDialogue(redReturnDialogue);
  };

  if (phase === 'memory') return <RedClassScene scenes={redClassScenes} sceneIndex={memoryIndex} playerName={playerName} onNext={advanceMemory} />;

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
