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
import { RoomScene } from '../components/game/RoomScene';
import { RoomMemory } from '../components/game/RoomMemory';
import { StartScreen } from '../components/game/StartScreen';
import { TaskCard } from '../components/game/TaskCard';
import { YardScene } from '../components/game/YardScene';
import { blueRoomScenes, redClassScenes } from '../game/chapters';
import { setAmbienceEnabled, startAmbience, stopAmbience } from '../game/audio';
import { endingLines, introLines, notebookLines, taskCopy } from '../game/story';
import type { DialogueLine, RoomItem, YardTask } from '../game/types';
import '../styles/prologue.css';
import '../styles/roomMemory.css';

type Stage = 'start' | 'prologue' | 'prologueExit' | 'room' | 'notebook' | 'childhood' | 'meeting' | 'yard' |
  'yellowReveal' | 'red' | 'redReveal' | 'blue' | 'finale';

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

  useEffect(() => () => stopAmbience(), []);
  useEffect(() => {
    if (stage !== 'prologueExit') return;
    const handoff = window.setTimeout(() => setStage('room'), 3200);
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

  const start = () => {
    if (soundOn) startAmbience();
    setStage('prologue');
    showDialogue(introLines, 'prologueExit');
  };

  const packItem = (item: RoomItem) => {
    setPacked((items) => items.includes(item) ? items : [...items, item]);
    setActiveMemory(item);
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
    : stage === 'blue' || stage === 'finale'
      ? 'Глава III · Синяя комната'
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
      {stage === 'prologueExit' && <PrologueScene lineIndex={5} />}
      {stage === 'room' && <RoomScene packed={packed} isInteractive={!activeMemory} onPack={packItem} onNotebook={() => setStage('notebook')} />}
      {stage === 'notebook' && <NotebookScene revealTitle onEnter={() => setStage('childhood')} />}
      {stage === 'childhood' && <ChildhoodMemory onFinish={() => { setStage('meeting'); showDialogue(notebookLines, 'yard'); }} />}
      {stage === 'meeting' && <NotebookScene onEnter={() => undefined} />}
      {stage === 'yard' && <YardScene completed={completed} onTask={setActiveTask} onFinish={() => showDialogue(endingLines, 'yellowReveal')} />}
      {stage === 'yellowReveal' && <ColorReveal color="yellow" title="Жёлтый" text="Цвет окон, мела и того вечера, когда тебя позвали домой." nextChapter="Открыть красный класс" onContinue={() => setStage('red')} />}
      {stage === 'red' && <RedClassScene scenes={redClassScenes} sceneIndex={storyIndex} onNext={() => advanceStory(redClassScenes.length, 'redReveal')} />}
      {stage === 'redReveal' && <ColorReveal color="red" title="Красный" text="Не цвет стыда и исправлений. Цвет смелости оставить важное видимым." nextChapter="Войти в синюю комнату" onContinue={() => setStage('blue')} />}
      {stage === 'blue' && <BlueRoomScene scenes={blueRoomScenes} sceneIndex={storyIndex} onNext={() => advanceStory(blueRoomScenes.length, 'finale')} />}
      {stage === 'finale' && <FinaleScene onRestart={restart} />}
      {activeTask && <TaskCard task={activeTask} onComplete={finishTask} />}
      {activeMemory && <RoomMemory item={activeMemory} onClose={() => setActiveMemory(null)} />}
      {dialogue.length > 0 && lineIndex < dialogue.length - 1 && <DialogueBox line={dialogue[lineIndex]} current={lineIndex} total={dialogue.length - 1} onNext={nextLine} />}
    </main>
  );
}
