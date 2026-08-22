import { useCallback, useMemo, useState } from 'react';
import shtrikhYard from '../../assets/game/shtrikh-yard-present-v2.webp';
import { selectInteractionTarget, type InteractionCandidate } from '../../game/interactionTarget';
import { taskCopy } from '../../game/story';
import type { YardTask } from '../../game/types';
import { isYardPositionWalkable } from '../../game/yardGeometry';
import { useRoomMovement, type FacingDirection, type RoomPosition } from '../../game/useRoomMovement';
import { ExamineText } from './ExamineText';
import { HintButton } from './HintButton';
import { InteractionPrompt } from './InteractionPrompt';
import { MovementControls } from './MovementControls';
import { ObjectivePanel } from './ObjectivePanel';
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
const TASK_REACH = 10;
const DETAIL_REACH = 7;
const ENDING_REACH = 9;
const SHTRIKH_POSITION = { x: 69, y: 34 };
type YardAction = { kind: 'task'; task: YardTask } | { kind: 'shtrikh' } |
  { kind: 'detail'; text: string };
const shtrikhObservations = [
  'Штрих смотрит на пустой двор так, будто ждёт, что ты узнаешь его первым.',
  '— Помнишь? — спрашивает Штрих быстрее, чем ты успеваешь ответить.',
  'Штрих поправляет шарф целой рукой. Недорисованная остаётся неподвижной.',
];
const yardHints: Record<YardTask, string> = {
  swing: 'Слева осталась недорисованная качеля. Толкни её три раза у жёлтой линии.',
  hopscotch: 'Классики находятся в центре. Проведи по клеткам от первой до последней.',
  window: 'Тёмное окно наверху. Настрой старое радио, чтобы вернуть в него свет.',
};

export function YardScene({ completed, isInteractive, showTouchControls, onTask, onFinish }: YardSceneProps) {
  const [examination, setExamination] = useState<string | null>(null);
  const allDone = completed.length === 3;
  const candidates = useMemo<InteractionCandidate<YardAction>[]>(() => [
    ...(Object.keys(taskPositions) as YardTask[])
      .filter((task) => !completed.includes(task))
      .map((task) => ({ id: `task-${task}`, value: { kind: 'task' as const, task },
        label: taskCopy[task].title, position: taskPositions[task], priority: 30, reach: TASK_REACH })),
    { id: 'shtrikh', value: { kind: 'shtrikh' }, label: allDone ? 'Подойти к Штриху' : 'Поговорить со Штрихом',
      position: SHTRIKH_POSITION, priority: 24, reach: ENDING_REACH },
    ...details.map((detail, index) => ({ id: `detail-${index}`, value: { kind: 'detail' as const, text: detail.text },
      label: 'Осмотреть', position: detail.position, priority: 10, reach: DETAIL_REACH })),
  ], [allDone, completed]);
  const interact = useCallback((position: RoomPosition, facing: FacingDirection) => {
    const target = selectInteractionTarget(candidates, position, facing);
    if (!target) return;
    if (target.value.kind === 'task') return onTask(target.value.task);
    if (target.value.kind === 'shtrikh') return allDone
      ? onFinish() : setExamination(shtrikhObservations[completed.length]);
    setExamination(target.value.text);
  }, [allDone, candidates, completed.length, onFinish, onTask]);
  const canMove = isInteractive && !examination;
  const movement = useRoomMovement(canMove, interact, {
    start: { x: 65, y: 82 }, speed: 15, isWalkable: isYardPositionWalkable,
    horizontalSpeedScale: showTouchControls ? 9 / 16 : 1, footstepSurface: 'yard',
  });
  const target = selectInteractionTarget(candidates, movement.position, movement.facing);
  const nextTask = (Object.keys(taskPositions) as YardTask[]).find((task) => !completed.includes(task));

  return (
    <section className={`scene yard-scene progress-${completed.length}`} aria-label="Жёлтый двор">
      <div className="scene__shade" />
      <HintButton hint={nextTask ? yardHints[nextTask] : 'Все детали возвращены. Штрих ждёт у подъезда.'} />
      <ObjectivePanel className="scene-instruction" label="Текущее задание">
        <strong>{allDone ? 'Вернись к Штриху у подъезда' : 'Найди три потерянные детали'}</strong>
      </ObjectivePanel>
      {(Object.keys(taskPositions) as YardTask[]).filter((task) => !completed.includes(task)).map((task) => (
        <i className={`yard-interaction-mark yard-interaction-mark--${task} ${target?.value.kind === 'task' && target.value.task === task ? 'is-near' : ''}`}
          key={task} style={{ left: `${taskPositions[task].x}%`, top: `${taskPositions[task].y}%` }} aria-hidden="true" />
      ))}
      <img className="yard-shtrikh" src={shtrikhYard} alt="Штрих ждёт у подъезда: две слезы, длинный шарф и недорисованная рука" />
      {completed.includes('swing') && <div className="yard-restored-swing" aria-label="Качеля восстановлена"><i /><b /></div>}
      {completed.includes('hopscotch') && <div className="yard-restored-hopscotch" aria-label="Классики снова видны">{[0, 1, 2, 3, 4, 5].map((cell) => <i key={cell} />)}</div>}
      {completed.includes('window') && <div className="yard-restored-window" aria-label="В окне горит тёплый свет" />}
      <YardMemoryEchoes completed={completed} />
      <PlayerAvatar position={movement.position} facing={movement.facing} isMoving={movement.isMoving} />
      <InteractionPrompt position={target?.position ?? movement.position} text={target?.label ?? ''} />
      {showTouchControls && <MovementControls onMoveStart={movement.startMoving} onMoveEnd={movement.stopMoving} onInteract={() => interact(movement.position, movement.facing)} />}
      <YardProgress completed={completed} />
      {examination && <ExamineText text={examination} onClose={() => setExamination(null)} />}
    </section>
  );
}
