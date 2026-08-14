import { useEffect, useState } from 'react';
import { ColorReveal } from '../components/game/ColorReveal';
import { BlueRoomScene } from '../components/game/BlueRoomScene';
import { ChildhoodMemory } from '../components/game/ChildhoodMemory';
import { DialogueBox } from '../components/game/DialogueBox';
import { FinaleScene } from '../components/game/FinaleScene';
import { GameHeader } from '../components/game/GameHeader';
import { NotebookScene } from '../components/game/NotebookScene';
import { PrologueScene } from '../components/game/PrologueScene';
import { RedClassScene } from '../components/game/RedClassScene';
import { ReturnToRoomScene } from '../components/game/ReturnToRoomScene';
import { RoomScene } from '../components/game/RoomScene';
import { RoomMemory } from '../components/game/RoomMemory';
import { StartScreen } from '../components/game/StartScreen';
import { TaskCard } from '../components/game/TaskCard';
import { YardScene } from '../components/game/YardScene';
import { blueRoomScenes, redClassScenes } from '../game/chapters';
import { setAmbienceEnabled, startAmbience, stopAmbience } from '../game/audio';
import { endingLines, introLines, notebookLines, taskCopy } from '../game/story';
import type { ControlsMode, DialogueLine, GameSetup, RoomItem, YardTask } from '../game/types';
import '../styles/prologue.css';
import '../styles/roomMemory.css';

type Stage = 'start' | 'prologue' | 'prologueExit' | 'room' | 'notebook' | 'childhood' | 'meeting' | 'yard' |
  'yellowReveal' | 'red' | 'redReveal' | 'blue' | 'return' | 'finale';

const PROLOGUE_EXIT_DURATION_MS = 5200;

export function GamePage() {
  const [stage, setStage] = useState<Stage>('start');
  const [dialogue, setDialogue] = useState<DialogueLine[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [packed, setPacked] = useState<RoomItem[]>([]);
  const [completed, setCompleted] = useState<YardTask[]>([]);
  const [activeTask, setActiveTask] = useState<YardTask | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [activeMemory, setActiveMemory] = useState<RoomItem | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [playerName, setPlayerName] = useState('Ты');
  const [controlsMode, setControlsMode] = useState<ControlsMode>('desktop');

  useEffect(() => () => stopAmbience(), []);
  useEffect(() => {
    if (stage !== 'prologueExit') return;
    const handoff = window.setTimeout(() => setStage('room'), PROLOGUE_EXIT_DURATION_MS);
    return () => window.clearTimeout(handoff);
  }, [stage]);

  const showDialogue = (lines: DialogueLine[], nextStage: Stage) => {
    setDialogue([...lines, { speaker: '__next__', text: nextStage }]);
    setLineIndex(0);
  };

  const nextLine = () => {
    const marker = dialogue[dialogue.length - 1];
    if (lineIndex >= dialogue.length - 2 && marker) {
      setStage(marker.text as Stage);
      setDialogue([]);
    } else setLineIndex((value) => value + 1);
  };

  const start = (setup: GameSetup) => {
    if (soundOn) startAmbience();
    setPlayerName(setup.playerName);
    setControlsMode(setup.controlsMode);
    setStage('prologue');
    showDialogue(introLines, 'prologueExit');
  };

  const inspectItem = (item: RoomItem) => setActiveMemory(item);

  const collectItem = () => {
    if (!activeMemory) return;
    const item = activeMemory;
    setPacked((items) => items.includes(item) ? items : [...items, item]);
    setActiveMemory(null);
  };

  const finishTask = () => {
    if (!activeTask) return;
    const task = activeTask;
    setCompleted((tasks) => [...tasks, task]);
    setActiveTask(null);
    setActiveMemory(null);
    showDialogue(taskCopy[task].memory, 'yard');
  };

  const advanceStory = (scenesLength: number, nextStage: Stage) => {
    if (storyIndex < scenesLength - 1) setStoryIndex((value) => value + 1);
    else {
      setStoryIndex(0);
      setStage(nextStage);
    }
  };

  const restart = () => {
    stopAmbience();
    setStage('start');
    setPacked([]);
    setCompleted([]);
    setActiveTask(null);
    setActiveMemory(null);
    setDialogue([]);
    setLineIndex(0);
    setStoryIndex(0);
  };

  const toggleSound = () => {
    const nextValue = !soundOn;
    setSoundOn(nextValue);
    setAmbienceEnabled(nextValue);
  };

  const chapter = stage === 'red' || stage === 'redReveal'
    ? 'Глава II · Красный класс'
    : stage === 'blue'
      ? 'Глава III · Синяя комната'
      : stage === 'return' || stage === 'finale'
        ? 'Возвращение · сегодняшний вечер'
      : stage === 'yard' || stage === 'yellowReveal'
        ? 'Глава I · Жёлтый двор'
        : stage === 'notebook' || stage === 'meeting'
          ? 'Найденная тетрадь'
          : 'Комната · сегодняшний вечер';

  return (
    <main className="game-shell">
      {stage !== 'start' && stage !== 'prologue' && stage !== 'prologueExit' && stage !== 'childhood' && <GameHeader chapter={chapter} soundOn={soundOn} onSoundToggle={toggleSound} onRestart={restart} />}
      {stage === 'start' && <StartScreen onStart={start} />}
      {stage === 'prologue' && <PrologueScene lineIndex={lineIndex} />}
      {stage === 'prologueExit' && <PrologueScene lineIndex={introLines.length} leaving />}
      {stage === 'room' && <RoomScene packed={packed} isInteractive={!activeMemory} showTouchControls={controlsMode === 'touch'} onInspectItem={inspectItem} onNotebook={() => setStage('notebook')} />}
      {stage === 'notebook' && <NotebookScene revealTitle onEnter={() => setStage('childhood')} />}
      {stage === 'childhood' && <ChildhoodMemory playerName={playerName} onFinish={() => { setStage('meeting'); showDialogue(notebookLines, 'yard'); }} />}
      {stage === 'meeting' && <NotebookScene onEnter={() => undefined} />}
      {stage === 'yard' && <YardScene completed={completed} isInteractive={!activeTask && dialogue.length === 0} showTouchControls={controlsMode === 'touch'} onTask={setActiveTask} onFinish={() => showDialogue(endingLines, 'yellowReveal')} />}
      {stage === 'yellowReveal' && <ColorReveal color="yellow" title="Жёлтый" text="Цвет окон, мела и того вечера, когда тебя позвали домой." nextChapter="Открыть красный класс" onContinue={() => setStage('red')} />}
      {stage === 'red' && <RedClassScene scenes={redClassScenes} sceneIndex={storyIndex} playerName={playerName} onNext={() => advanceStory(redClassScenes.length, 'redReveal')} />}
      {stage === 'redReveal' && <ColorReveal color="red" title="Красный" text="Не цвет стыда и исправлений. Цвет смелости оставить важное видимым." nextChapter="Войти в синюю комнату" onContinue={() => setStage('blue')} />}
      {stage === 'blue' && <BlueRoomScene scenes={blueRoomScenes} sceneIndex={storyIndex} playerName={playerName} onNext={() => advanceStory(blueRoomScenes.length, 'return')} />}
      {stage === 'return' && <ReturnToRoomScene onContinue={() => setStage('finale')} />}
      {stage === 'finale' && <FinaleScene playerName={playerName} onRestart={restart} />}
      {activeTask && <TaskCard task={activeTask} onComplete={finishTask} />}
      {activeMemory && <RoomMemory item={activeMemory} onCollect={collectItem} />}
      {dialogue.length > 0 && lineIndex < dialogue.length - 1 && <DialogueBox line={dialogue[lineIndex]} current={lineIndex} total={dialogue.length - 1} playerName={playerName} onNext={nextLine} />}
    </main>
  );
}
