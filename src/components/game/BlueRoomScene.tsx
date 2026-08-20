import { useCallback, useState } from 'react';
import {
  blueClues, blueIntro, blueSecondClue, blueThirdClue, blueTruth, type BlueClue,
} from '../../game/blueChapter';
import type { DialogueLine } from '../../game/types';
import { BlueRepairScene } from './BlueRepairScene';
import { BlueRoomWorld } from './BlueRoomWorld';
import { DialogueBox } from './DialogueBox';
import '../../styles/blueChapter.css';
import '../../styles/blueRepair.css';

type BlueRoomSceneProps = {
  playerName: string;
  showTouchControls: boolean;
  onComplete: () => void;
};

export function BlueRoomScene({ playerName, showTouchControls, onComplete }: BlueRoomSceneProps) {
  const [found, setFound] = useState<BlueClue[]>([]);
  const [dialogue, setDialogue] = useState<DialogueLine[]>(blueIntro);
  const [lineIndex, setLineIndex] = useState(0);
  const [repairAfterDialogue, setRepairAfterDialogue] = useState(false);
  const [repairing, setRepairing] = useState(false);

  const openDialogue = useCallback((lines: DialogueLine[], repairAfter = false) => {
    setDialogue(lines);
    setLineIndex(0);
    setRepairAfterDialogue(repairAfter);
  }, []);
  const handleClue = useCallback((clue: BlueClue) => {
    if (found.includes(clue)) return;
    const nextFound = [...found, clue];
    setFound(nextFound);
    const lines = [...blueClues[clue].dialogue];
    if (nextFound.length === 2) lines.push(...blueSecondClue);
    if (nextFound.length === 3) lines.push(...blueThirdClue);
    if (nextFound.length === 4) lines.push(...blueTruth);
    openDialogue(lines, nextFound.length === 4);
  }, [found, openDialogue]);
  const nextDialogueLine = () => {
    if (lineIndex < dialogue.length - 1) return setLineIndex((index) => index + 1);
    setDialogue([]);
    setLineIndex(0);
    if (repairAfterDialogue) setRepairing(true);
  };

  if (repairing) return <BlueRepairScene playerName={playerName} onComplete={onComplete} />;

  return <div className="blue-chapter">
    <BlueRoomWorld found={found} isInteractive={dialogue.length === 0}
      showTouchControls={showTouchControls} onClue={handleClue} />
    <aside className="blue-chapter__objective"><small>То, что осталось</small>
      <strong>{found.length < 4 ? `Осмотри комнату · ${found.length}/4` : 'Посмотри на Штриха'}</strong></aside>
    {dialogue.length > 0 && <DialogueBox line={dialogue[lineIndex]} current={lineIndex}
      total={dialogue.length} playerName={playerName} onNext={nextDialogueLine} />}
  </div>;
}
