import { useCallback, useState } from 'react';
import { taskCopy } from '../../game/story';
import type { YardTask } from '../../game/types';
import { isYardPositionWalkable } from '../../game/yardGeometry';
import { useRoomMovement, type RoomPosition } from '../../game/useRoomMovement';
import { ExamineText } from './ExamineText';
import { MovementControls } from './MovementControls';
import { PlayerAvatar } from './PlayerAvatar';

type YardSceneProps = { completed: YardTask[]; isInteractive: boolean; onTask: (task: YardTask) => void; onFinish: () => void };

const taskPositions: Record<YardTask, RoomPosition> = {
  swing: { x: 30, y: 62 }, hopscotch: { x: 59, y: 66 }, window: { x: 50, y: 28 },
};
const details = [
  { position: { x: 70, y: 30 }, text: 'Подъездная дверь. В детстве она казалась тяжелее.' },
  { position: { x: 81, y: 50 }, text: 'Скамейка. Здесь взрослые звали детей домой по именам.' },
  { position: { x: 49, y: 87 }, text: 'Низкий забор. Мяч всегда перелетал его с первого удара.' },
  { position: { x: 13, y: 45 }, text: 'Тополь шуршит так же, как страница, которую не решаешься перевернуть.' },
  { position: { x: 86, y: 63 }, text: 'Ворота без сетки. Гол засчитывался, только если никто не спорил.' },
  { position: { x: 40, y: 48 }, text: 'Мел почти стёрся. Осталась линия, которую никто не закончил.' },
];
const distance = (a: RoomPosition, b: RoomPosition) => Math.hypot(a.x - b.x, a.y - b.y);

export function YardScene({ completed, isInteractive, onTask, onFinish }: YardSceneProps) {
  const [examination, setExamination] = useState<string | null>(null);
  const allDone = completed.length === 3;
  const interact = useCallback((position: RoomPosition) => {
    if (allDone && distance(position, { x: 69, y: 34 }) < 10) return onFinish();
    const task = (Object.keys(taskPositions) as YardTask[])
      .find((item) => !completed.includes(item) && distance(position, taskPositions[item]) < 10);
    if (task) return onTask(task);
    const detail = details.find((entry) => distance(position, entry.position) < 9);
    if (detail) setExamination(detail.text);
  }, [allDone, completed, onFinish, onTask]);
  const canMove = isInteractive && !examination;
  const movement = useRoomMovement(canMove, interact, {
    start: { x: 65, y: 82 }, speed: 15, isWalkable: isYardPositionWalkable,
  });
  const nearbyTask = (Object.keys(taskPositions) as YardTask[])
    .find((task) => !completed.includes(task) && distance(movement.position, taskPositions[task]) < 10);
  const nearEnding = allDone && distance(movement.position, { x: 69, y: 34 }) < 10;
  const nearDetail = details.some((entry) => distance(movement.position, entry.position) < 9);

  return (
    <section className={`scene yard-scene progress-${completed.length}`} aria-label="Жёлтый двор">
      <div className="scene__shade" />
      <div className="scene-instruction"><strong>{allDone ? 'Вернись к Штриху у подъезда' : 'Найди три потерянные детали'}</strong></div>
      {allDone && <div className="yard-streak" aria-label="Штрих ждёт у подъезда"><i /><b /><span /></div>}
      <PlayerAvatar position={movement.position} facing={movement.facing} isMoving={movement.isMoving} />
      <p className={`interaction-hint ${(nearbyTask || nearEnding || nearDetail) ? 'is-ready' : ''}`}>
        {nearbyTask ? `E · ${taskCopy[nearbyTask].title}` : nearEnding ? 'E · Подойти к Штриху' : nearDetail ? 'E · Осмотреть' : ''}
      </p>
      <MovementControls onMoveStart={movement.startMoving} onMoveEnd={movement.stopMoving} onInteract={() => interact(movement.position)} />
      <div className="color-progress" aria-label={`Возвращено цветов: ${completed.length} из 3`}>
        {[0, 1, 2].map((part) => <i className={part < completed.length ? 'filled' : ''} key={part} />)}
      </div>
      {examination && <ExamineText text={examination} onClose={() => setExamination(null)} />}
    </section>
  );
}
