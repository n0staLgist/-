import { useCallback } from 'react';
import { roomItems } from '../../game/story';
import type { RoomItem } from '../../game/types';
import { useRoomMovement, type RoomPosition } from '../../game/useRoomMovement';
import { MovementControls } from './MovementControls';
import { PlayerAvatar } from './PlayerAvatar';

type RoomSceneProps = {
  packed: RoomItem[];
  isInteractive?: boolean;
  onPack: (item: RoomItem) => void;
  onNotebook: () => void;
};

const itemPositions: Record<RoomItem, RoomPosition> = {
  cassette: { x: 42, y: 80 }, photo: { x: 47, y: 82 }, diary: { x: 53, y: 80 },
};
const notebookPosition: RoomPosition = { x: 49, y: 68 };
const distance = (first: RoomPosition, second: RoomPosition) => Math.hypot(first.x - second.x, first.y - second.y);
const ITEM_REACH = 8;
const NOTEBOOK_REACH = 11;

export function RoomScene({ packed, isInteractive = true, onPack, onNotebook }: RoomSceneProps) {
  const allPacked = packed.length === 3;
  const interact = useCallback((position: RoomPosition) => {
    if (allPacked && distance(position, notebookPosition) < NOTEBOOK_REACH) return onNotebook();
    const nearest = (Object.keys(itemPositions) as RoomItem[])
      .filter((item) => !packed.includes(item))
      .sort((a, b) => distance(position, itemPositions[a]) - distance(position, itemPositions[b]))[0];
    if (nearest && distance(position, itemPositions[nearest]) < ITEM_REACH) onPack(nearest);
  }, [allPacked, onNotebook, onPack, packed]);
  const { position, isMoving, facing, startMoving, stopMoving } = useRoomMovement(isInteractive, interact);

  const nearbyItem = (Object.keys(itemPositions) as RoomItem[])
    .find((item) => !packed.includes(item) && distance(position, itemPositions[item]) < ITEM_REACH);
  const nearNotebook = allPacked && distance(position, notebookPosition) < NOTEBOOK_REACH;

  return (
    <section className="scene room-scene" aria-label="Комната перед переездом">
      <div className="room-map">
        <div className="scene__shade" />
        <div className="scene-instruction">
          <span>Комната · сегодняшний вечер</span>
          <strong>{allPacked ? 'На дне коробки что-то осталось…' : 'Собери три вещи в коробку'}</strong>
        </div>
        {(Object.keys(roomItems) as RoomItem[]).map((item) => (
          <button className={`hotspot hotspot--${item} ${packed.includes(item) ? 'is-done' : ''} ${nearbyItem === item ? 'is-near' : ''}`} key={item} onClick={() => onPack(item)} disabled={packed.includes(item) || !isInteractive || nearbyItem !== item}>
            <span>{roomItems[item].label}</span>
          </button>
        ))}
        <button className={`notebook-hotspot ${allPacked ? 'is-visible' : ''} ${nearNotebook ? 'is-near' : ''}`} onClick={onNotebook} disabled={!nearNotebook}>Открыть тетрадь</button>
        {isInteractive && <>
          <PlayerAvatar position={position} facing={facing} isMoving={isMoving} />
          <p className={`interaction-hint ${(nearbyItem || nearNotebook) ? 'is-ready' : ''}`}>{nearbyItem ? `E · Взять: ${roomItems[nearbyItem].label}` : nearNotebook ? 'E · Открыть тетрадь' : 'WASD / стрелки · идти'}</p>
          <MovementControls onMoveStart={startMoving} onMoveEnd={stopMoving} onInteract={() => interact(position)} />
        </>}
      </div>
    </section>
  );
}
