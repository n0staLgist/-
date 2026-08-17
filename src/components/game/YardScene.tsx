import { useCallback, useState } from 'react';
import shtrikhYard from '../../assets/game/shtrikh-yard-present-v1.webp';
import { taskCopy } from '../../game/story';
import type { YardTask } from '../../game/types';
import { isYardPositionWalkable } from '../../game/yardGeometry';
import { useRoomMovement, type RoomPosition } from '../../game/useRoomMovement';
import { ExamineText } from './ExamineText';
import { HintButton } from './HintButton';
import { InteractionPrompt } from './InteractionPrompt';
import { MovementControls } from './MovementControls';
import { PlayerAvatar } from './PlayerAvatar';
import { YardProgress } from './YardProgress';
import { YardMemoryEchoes } from './YardMemoryEchoes';

type YardSceneProps = { completed: YardTask[]; isInteractive: boolean; showTouchControls: boolean; onTask: (task: YardTask) => void; onFinish: () => void };

const taskPositions: Record<YardTask, RoomPosition> = {
  swing: { x: 42, y: 55 }, hopscotch: { x: 56, y: 68 }, window: { x: 50, y: 26 },
};
const details = [
  { position: { x: 67, y: 25 }, text: 'Подъездная дверь. В детстве она казалась тяжелее.' },
  { position: { x: 60, y: 25 }, text: 'Велосипед прислонён к стене. Цепь всё ещё слетает на третьей передаче.' },
  { position: { x: 71, y: 42 }, text: 'Мяч остался под лавкой. Будто хозяин отошёл всего на минуту.' },
  { position: { x: 27, y: 70 }, text: 'В песочнице стоит один жестяной стаканчик. Остальные формочки кто-то унёс.' },
  { position: { x: 40, y: 67 }, text: 'Меловой город расходится стрелками во все стороны. Ни одна не ведёт домой.' },
  { position: { x: 85, y: 52 }, text: 'В луже отражается пустое окно. Ветер не может пошевелить отражение.' },
];
const distance = (a: RoomPosition, b: RoomPosition) => Math.hypot(a.x - b.x, a.y - b.y);
const TASK_REACH = 6.5;
const DETAIL_REACH = 5.5;
const ENDING_REACH = 7;
const SHTRIKH_POSITION = { x: 69, y: 34 };
const shtrikhObservations = [
  'Штрих смотрит на пустой двор так, будто ждёт, что ты узнаешь его первым.',
  '— Помнишь? — спрашивает Штрих быстрее, чем ты успеваешь ответить.',
  'Штрих поправляет шарф целой рукой. Недорисованная остаётся неподвижной.',
];
const yardHints: Record<YardTask, string> = {
  swing: 'Слева осталась недорисованная качеля. Толкни её три раза у жёлтой линии.',
  hopscotch: 'Классики находятся в центре. Проведи по клеткам от первой до последней.',
  window: 'Тёмное окно наверху. Зажги по очереди все четыре стекла.',
};

export function YardScene({ completed, isInteractive, showTouchControls, onTask, onFinish }: YardSceneProps) {
  const [examination, setExamination] = useState<string | null>(null);
  const allDone = completed.length === 3;
  const interact = useCallback((position: RoomPosition) => {
    if (distance(position, SHTRIKH_POSITION) < ENDING_REACH) {
      if (allDone) return onFinish();
      return setExamination(shtrikhObservations[completed.length]);
    }
    const task = (Object.keys(taskPositions) as YardTask[])
      .find((item) => !completed.includes(item) && distance(position, taskPositions[item]) < TASK_REACH);
    if (task) return onTask(task);
    const detail = details.find((entry) => distance(position, entry.position) < DETAIL_REACH);
    if (detail) setExamination(detail.text);
  }, [allDone, completed, onFinish, onTask]);
  const canMove = isInteractive && !examination;
  const movement = useRoomMovement(canMove, interact, {
    start: { x: 65, y: 82 }, speed: 15, isWalkable: isYardPositionWalkable,
  });
  const nearbyTask = (Object.keys(taskPositions) as YardTask[])
    .find((task) => !completed.includes(task) && distance(movement.position, taskPositions[task]) < TASK_REACH);
  const nearShtrikh = distance(movement.position, SHTRIKH_POSITION) < ENDING_REACH;
  const nearDetail = details.some((entry) => distance(movement.position, entry.position) < DETAIL_REACH);
  const nextTask = (Object.keys(taskPositions) as YardTask[]).find((task) => !completed.includes(task));

  return (
    <section className={`scene yard-scene progress-${completed.length}`} aria-label="Жёлтый двор">
      <div className="scene__shade" />
      <HintButton hint={nextTask ? yardHints[nextTask] : 'Все детали возвращены. Штрих ждёт у подъезда.'} />
      <div className="scene-instruction"><strong>{allDone ? 'Вернись к Штриху у подъезда' : 'Найди три потерянные детали'}</strong></div>
      <img className="yard-shtrikh" src={shtrikhYard} alt="Штрих ждёт у подъезда: две слезы, длинный шарф и недорисованная рука" />
      {completed.includes('swing') && <div className="yard-restored-swing" aria-label="Качеля восстановлена"><i /><b /></div>}
      {completed.includes('hopscotch') && <div className="yard-restored-hopscotch" aria-label="Классики снова видны">{[0, 1, 2, 3, 4, 5].map((cell) => <i key={cell} />)}</div>}
      {completed.includes('window') && <div className="yard-restored-window" aria-label="В окне горит тёплый свет" />}
      <YardMemoryEchoes completed={completed} />
      <PlayerAvatar position={movement.position} facing={movement.facing} isMoving={movement.isMoving} />
      <InteractionPrompt position={movement.position} text={nearbyTask ? taskCopy[nearbyTask].title : nearShtrikh ? (allDone ? 'Подойти к Штриху' : 'Поговорить со Штрихом') : nearDetail ? 'Осмотреть' : ''} />
      {showTouchControls && <MovementControls onMoveStart={movement.startMoving} onMoveEnd={movement.stopMoving} onInteract={() => interact(movement.position)} />}
      <YardProgress completed={completed} />
      {examination && <ExamineText text={examination} onClose={() => setExamination(null)} />}
    </section>
  );
}
