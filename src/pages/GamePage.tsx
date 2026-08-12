import { useEffect, useState } from 'react';
import { ColorReveal } from '../components/game/ColorReveal';
import { BlueRoomScene } from '../components/game/BlueRoomScene';
import { DialogueBox } from '../components/game/DialogueBox';
import { FinaleScene } from '../components/game/FinaleScene';
import { GameHeader } from '../components/game/GameHeader';
import { NotebookScene } from '../components/game/NotebookScene';
import { RedClassScene } from '../components/game/RedClassScene';
import { RoomScene } from '../components/game/RoomScene';
import { StartScreen } from '../components/game/StartScreen';
import { TaskCard } from '../components/game/TaskCard';
import { YardScene } from '../components/game/YardScene';
import { blueRoomScenes, redClassScenes } from '../game/chapters';
import { setAmbienceEnabled, startAmbience, stopAmbience } from '../game/audio';
import { endingLines, introLines, notebookLines, roomItems, taskCopy } from '../game/story';
import type { DialogueLine, RoomItem, YardTask } from '../game/types';

type Stage = 'start' | 'intro' | 'room' | 'notebook' | 'meeting' | 'yard' |
  'yellowReveal' | 'red' | 'redReveal' | 'blue' | 'finale';

export function GamePage() {
  const [stage, setStage] = useState<Stage>('start');
  const [dialogue, setDialogue] = useState<DialogueLine[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [packed, setPacked] = useState<RoomItem[]>([]);
  const [completed, setCompleted] = useState<YardTask[]>([]);
  const [activeTask, setActiveTask] = useState<YardTask | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [note, setNote] = useState('');
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => () => stopAmbience(), []);

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
    setStage('intro');
    showDialogue(introLines, 'room');
  };

  const packItem = (item: RoomItem) => {
    setPacked((items) => [...items, item]);
    setNote(roomItems[item].memory);
    window.setTimeout(() => setNote(''), 3400);
  };

  const finishTask = () => {
    if (!activeTask) return;
    const task = activeTask;
    setCompleted((tasks) => [...tasks, task]);
    setActiveTask(null);
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
    setDialogue([]);
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
        : 'До завтра';

  return (
    <main className="game-shell">
      {stage !== 'start' && <GameHeader chapter={chapter} soundOn={soundOn} onSoundToggle={toggleSound} onRestart={restart} />}
      {stage === 'start' && <StartScreen onStart={start} />}
      {stage === 'intro' && <RoomScene packed={[]} note="" isInteractive={false} onPack={() => undefined} onNotebook={() => undefined} />}
      {stage === 'room' && <RoomScene packed={packed} note={note} onPack={packItem} onNotebook={() => setStage('notebook')} />}
      {stage === 'notebook' && <NotebookScene onEnter={() => { setStage('meeting'); showDialogue(notebookLines, 'yard'); }} />}
      {stage === 'meeting' && <NotebookScene onEnter={() => undefined} />}
      {stage === 'yard' && <YardScene completed={completed} onTask={setActiveTask} onFinish={() => showDialogue(endingLines, 'yellowReveal')} />}
      {stage === 'yellowReveal' && <ColorReveal color="yellow" title="Жёлтый" text="Цвет окон, мела и того вечера, когда тебя позвали домой." nextChapter="Открыть красный класс" onContinue={() => setStage('red')} />}
      {stage === 'red' && <RedClassScene scenes={redClassScenes} sceneIndex={storyIndex} onNext={() => advanceStory(redClassScenes.length, 'redReveal')} />}
      {stage === 'redReveal' && <ColorReveal color="red" title="Красный" text="Не цвет стыда и исправлений. Цвет смелости оставить важное видимым." nextChapter="Войти в синюю комнату" onContinue={() => setStage('blue')} />}
      {stage === 'blue' && <BlueRoomScene scenes={blueRoomScenes} sceneIndex={storyIndex} onNext={() => advanceStory(blueRoomScenes.length, 'finale')} />}
      {stage === 'finale' && <FinaleScene onRestart={restart} />}
      {activeTask && <TaskCard task={activeTask} onComplete={finishTask} />}
      {dialogue.length > 0 && lineIndex < dialogue.length - 1 && <DialogueBox line={dialogue[lineIndex]} current={lineIndex} total={dialogue.length - 1} onNext={nextLine} />}
    </main>
  );
}
