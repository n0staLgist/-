import { useCallback, useState } from 'react';
import { roomItems } from '../../game/story';
import type { RoomItem } from '../../game/types';
import { useRoomMovement, type RoomPosition } from '../../game/useRoomMovement';
import { MovementControls } from './MovementControls';
import { PlayerAvatar } from './PlayerAvatar';
import { ExamineText } from './ExamineText';

type RoomSceneProps = {
  packed: RoomItem[];
  isInteractive?: boolean;
  onPack: (item: RoomItem) => void;
  onNotebook: () => void;
};

const itemPositions: Record<RoomItem, RoomPosition> = {
  cassette: { x: 12, y: 86 }, photo: { x: 20, y: 85 }, diary: { x: 29, y: 84 },
};
const notebookPosition: RoomPosition = { x: 47, y: 42 };
const roomDetails = [
  { position: { x: 13, y: 78 }, text: 'Одна раскрытая коробка. Пока почти пустая.' },
  { position: { x: 75, y: 40 }, text: 'Три коробки с вещами. Будто половина комнаты уже уехала без тебя.' },
  { position: { x: 14, y: 40 }, text: 'Батарея ещё тёплая. В новой квартире такой не будет.' },
  { position: { x: 35, y: 51 }, text: 'Старый стол. Следы карандаша не отмылись даже перед переездом.' },
  { position: { x: 5, y: 40 }, text: 'За окном темно. В стекле комната выглядит уже чужой.' },
  { position: { x: 27, y: 51 }, text: 'Лампа светит только на край стола. Остальная комната понемногу исчезает.' },
  { position: { x: 43, y: 51 }, text: 'Стакан с карандашами. Самый короткий всё ещё лежит остриём вверх.' },
  { position: { x: 75, y: 72 }, text: 'На полу остался светлый прямоугольник от кровати.' },
  { position: { x: 93, y: 57 }, text: 'Дверь в коридор. Ая ушла, не хлопнув ею.' },
];
const distance = (first: RoomPosition, second: RoomPosition) => Math.hypot(first.x - second.x, first.y - second.y);
const ITEM_REACH = 5;
const NOTEBOOK_REACH = 7;
const DETAIL_REACH = 5.5;

export function RoomScene({ packed, isInteractive = true, onPack, onNotebook }: RoomSceneProps) {
  const [examination, setExamination] = useState<string | null>(null);
  const allPacked = packed.length === 3;
  const interact = useCallback((position: RoomPosition) => {
    if (allPacked && distance(position, notebookPosition) < NOTEBOOK_REACH) return onNotebook();
    const nearest = (Object.keys(itemPositions) as RoomItem[])
      .filter((item) => !packed.includes(item))
      .sort((a, b) => distance(position, itemPositions[a]) - distance(position, itemPositions[b]))[0];
    if (nearest && distance(position, itemPositions[nearest]) < ITEM_REACH) return onPack(nearest);
    if (!allPacked && distance(position, notebookPosition) < NOTEBOOK_REACH) {
      return setExamination('Старая тетрадь лежит на столе. Сначала стоит закончить с коробкой.');
    }
    const detail = [...roomDetails]
      .sort((first, second) => distance(position, first.position) - distance(position, second.position))
      .find((entry) => distance(position, entry.position) < DETAIL_REACH);
    if (detail) setExamination(detail.text);
  }, [allPacked, onNotebook, onPack, packed]);
  const canMove = isInteractive && !examination;
  const { position, isMoving, facing, startMoving, stopMoving } = useRoomMovement(canMove, interact, {
    start: { x: 91, y: 58 },
  });

  const nearbyItem = (Object.keys(itemPositions) as RoomItem[])
    .find((item) => !packed.includes(item) && distance(position, itemPositions[item]) < ITEM_REACH);
  const nearNotebook = distance(position, notebookPosition) < NOTEBOOK_REACH;
  const nearDetail = roomDetails.some((entry) => distance(position, entry.position) < DETAIL_REACH);

  return (
    <section className="scene room-scene" aria-label="Комната перед переездом">
      <div className="room-map">
        <div className="scene__shade" />
        <div className="scene-instruction">
          <strong>{allPacked ? 'Закончи с коробкой и осмотри стол' : 'Собери три вещи в коробку'}</strong>
        </div>
        {(Object.keys(roomItems) as RoomItem[]).map((item) => (
          <button className={`hotspot hotspot--${item} ${packed.includes(item) ? 'is-done' : ''} ${nearbyItem === item ? 'is-near' : ''}`} key={item} style={{ left: `${itemPositions[item].x}%`, top: `${itemPositions[item].y}%` }} onClick={() => onPack(item)} disabled={packed.includes(item) || !isInteractive || nearbyItem !== item}>
            <span>{roomItems[item].label}</span>
          </button>
        ))}
        <button className={`notebook-hotspot ${nearNotebook ? 'is-near' : ''}`} onClick={onNotebook} disabled={!allPacked || !nearNotebook}>Открыть тетрадь</button>
        {isInteractive && <>
          <PlayerAvatar position={position} facing={facing} isMoving={isMoving} />
          <p className={`interaction-hint ${(nearbyItem || nearNotebook || nearDetail) ? 'is-ready' : ''}`}>{nearbyItem ? `E · Взять: ${roomItems[nearbyItem].label}` : nearNotebook ? (allPacked ? 'E · Взять тетрадь' : 'E · Осмотреть тетрадь') : nearDetail ? 'E · Осмотреть' : ''}</p>
          <MovementControls onMoveStart={startMoving} onMoveEnd={stopMoving} onInteract={() => interact(position)} />
        </>}
        {examination && <ExamineText text={examination} onClose={() => setExamination(null)} />}
      </div>
    </section>
  );
}
