import { useCallback, useEffect, useRef, useState } from 'react';
import { playInkShift } from '../../game/audio';
import {
  blueClues, blueDoorGuard, blueDoorReminder, blueIntro,
  blueSecondClue, blueThirdClue, blueTruth, type BlueClue,
} from '../../game/blueChapter';
import type { DialogueLine } from '../../game/types';
import { BlueRepairScene } from './BlueRepairScene';
import { BlueRoomWorld } from './BlueRoomWorld';
import { DialogueBox } from './DialogueBox';
import { ObjectivePanel } from './ObjectivePanel';
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
  const [shtrikhStep, setShtrikhStep] = useState(0);
  const [isShtrikhMoving, setIsShtrikhMoving] = useState(false);
  const [guardsDoor, setGuardsDoor] = useState(false);
  const [doorArrival, setDoorArrival] = useState(false);
  const shiftTimers = useRef<number[]>([]);

  useEffect(() => () => shiftTimers.current.forEach(window.clearTimeout), []);

  const openDialogue = useCallback((lines: DialogueLine[], repairAfter = false) => {
    setDialogue(lines);
    setLineIndex(0);
    setRepairAfterDialogue(repairAfter);
  }, []);
  const startDoorGuard = useCallback(() => {
    if (guardsDoor || found.filter((clue) => clue !== 'door').length >= 3) return;
    setGuardsDoor(true);
    setDoorArrival(true);
    setIsShtrikhMoving(true);
    playInkShift();
    shiftTimers.current.push(window.setTimeout(() => {
      setDoorArrival(false);
      setIsShtrikhMoving(false);
      openDialogue(blueDoorGuard);
    }, 720));
  }, [found, guardsDoor, openDialogue]);
  const handleClue = useCallback((clue: BlueClue) => {
    if (found.includes(clue)) return;
    if (clue === 'door' && found.filter((item) => item !== 'door').length < 3) {
      if (guardsDoor) openDialogue(blueDoorReminder);
      else startDoorGuard();
      return;
    }
    const nextFound = [...found, clue];
    setFound(nextFound);
    const lines = [...blueClues[clue].dialogue];
    if (nextFound.length === 2) lines.push(...blueSecondClue);
    if (nextFound.length === 3) lines.push(...blueThirdClue);
    if (nextFound.length === 4) lines.push(...blueTruth);
    openDialogue(lines, nextFound.length === 4);
  }, [found, guardsDoor, openDialogue, startDoorGuard]);
  const nextDialogueLine = () => {
    if (lineIndex < dialogue.length - 1) return setLineIndex((index) => index + 1);
    setDialogue([]);
    setLineIndex(0);
    const shouldRepair = repairAfterDialogue;
    setRepairAfterDialogue(false);
    if (guardsDoor) {
      setShtrikhStep(found.length);
      if (shouldRepair) {
        setIsShtrikhMoving(true);
        shiftTimers.current.push(window.setTimeout(() => {
          setIsShtrikhMoving(false);
          setRepairing(true);
        }, 1100));
      }
      return;
    }
    if (found.length <= shtrikhStep) {
      if (shouldRepair) setRepairing(true);
      return;
    }
    setIsShtrikhMoving(true);
    playInkShift();
    shiftTimers.current.push(window.setTimeout(() => setShtrikhStep(found.length), 180));
    shiftTimers.current.push(window.setTimeout(() => {
      setIsShtrikhMoving(false);
      if (shouldRepair) setRepairing(true);
    }, 1350));
  };

  if (repairing) return <BlueRepairScene playerName={playerName} onComplete={onComplete} />;

  return <div className="blue-chapter">
    <BlueRoomWorld found={found} shtrikhStep={shtrikhStep} focusShtrikh={isShtrikhMoving}
      guardsDoor={guardsDoor} doorArrival={doorArrival} onDoorApproach={startDoorGuard}
      isInteractive={dialogue.length === 0 && !isShtrikhMoving}
      showTouchControls={showTouchControls} onClue={handleClue} />
    <ObjectivePanel className="blue-chapter__objective" label="То, что осталось">
      <small>То, что осталось</small>
      <strong>{found.length < 4 ? `Осмотри комнату · ${found.length}/4` : 'Посмотри на Штриха'}</strong>
    </ObjectivePanel>
    {dialogue.length > 0 && <DialogueBox line={dialogue[lineIndex]} current={lineIndex}
      total={dialogue.length} playerName={playerName} onNext={nextDialogueLine} />}
  </div>;
}
