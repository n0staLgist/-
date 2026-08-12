import { useCallback } from 'react';
import { roomItems } from '../../game/story';
import type { RoomItem } from '../../game/types';
import { useRoomMovement, type RoomPosition } from '../../game/useRoomMovement';
import { MovementControls } from './MovementControls';

type RoomSceneProps = {
  packed: RoomItem[];
  note: string;
  isInteractive?: boolean;
  onPack: (item: RoomItem) => void;
  onNotebook: () => void;
};

const itemPositions: Record<RoomItem, RoomPosition> = {
  cassette: { x: 40, y: 84 }, photo: { x: 55, y: 62 }, diary: { x: 49, y: 88 },
};
const notebookPosition: RoomPosition = { x: 55, y: 77 };
const distance = (first: RoomPosition, second: RoomPosition) => Math.hypot(first.x - second.x, first.y - second.y);

export function RoomScene({ packed, note, isInteractive = true, onPack, onNotebook }: RoomSceneProps) {
  const allPacked = packed.length === 3;
  const interact = useCallback((position: RoomPosition) => {
    if (allPacked && distance(position, notebookPosition) < 15) return onNotebook();
    const nearest = (Object.keys(itemPositions) as RoomItem[])
      .filter((item) => !packed.includes(item))
      .sort((a, b) => distance(position, itemPositions[a]) - distance(position, itemPositions[b]))[0];
    if (nearest && distance(position, itemPositions[nearest]) < 15) onPack(nearest);
  }, [allPacked, onNotebook, onPack, packed]);
  const { position, move } = useRoomMovement(isInteractive, interact);

  const nearbyItem = (Object.keys(itemPositions) as RoomItem[])
    .find((item) => !packed.includes(item) && distance(position, itemPositions[item]) < 15);
  const nearNotebook = allPacked && distance(position, notebookPosition) < 15;

  return (
    <section className="scene room-scene" aria-label="Комната перед переездом">
      <div className="scene__shade" />
      <div className="scene-instruction">
        <span>Комната · сегодняшний вечер</span>
        <strong>{allPacked ? 'В коробке что-то осталось…' : 'Собери три вещи в коробку'}</strong>
      </div>
      {(Object.keys(roomItems) as RoomItem[]).map((item) => (
        <button className={`hotspot hotspot--${item} ${packed.includes(item) ? 'is-done' : ''} ${nearbyItem === item ? 'is-near' : ''}`} key={item} onClick={() => onPack(item)} disabled={packed.includes(item) || !isInteractive || nearbyItem !== item}>
          <span>{roomItems[item].label}</span>
        </button>
      ))}
      <button className={`notebook-hotspot ${allPacked ? 'is-visible' : ''} ${nearNotebook ? 'is-near' : ''}`} onClick={onNotebook} disabled={!nearNotebook}>Открыть тетрадь</button>
      {isInteractive && <>
        <div className="player-mark" style={{ left: `${position.x}%`, top: `${position.y}%` }}><i /></div>
        <p className={`interaction-hint ${(nearbyItem || nearNotebook) ? 'is-ready' : ''}`}>{nearbyItem ? `E · Взять: ${roomItems[nearbyItem].label}` : nearNotebook ? 'E · Открыть тетрадь' : 'WASD / стрелки · идти'}</p>
        <MovementControls onMove={move} onInteract={() => interact(position)} />
      </>}
      {note && <p className="memory-note">{note}</p>}
    </section>
  );
}
