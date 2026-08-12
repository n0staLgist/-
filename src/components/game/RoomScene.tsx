import { roomItems } from '../../game/story';
import type { RoomItem } from '../../game/types';

type RoomSceneProps = {
  packed: RoomItem[];
  note: string;
  onPack: (item: RoomItem) => void;
  onNotebook: () => void;
};

export function RoomScene({ packed, note, onPack, onNotebook }: RoomSceneProps) {
  const allPacked = packed.length === 3;
  return (
    <section className="scene room-scene" aria-label="Комната перед переездом">
      <div className="scene__shade" />
      <div className="scene-instruction">
        <span>Комната · 1999 год</span>
        <strong>{allPacked ? 'В коробке что-то осталось…' : 'Собери три вещи в коробку'}</strong>
      </div>
      {(Object.keys(roomItems) as RoomItem[]).map((item) => (
        <button
          className={`hotspot hotspot--${item} ${packed.includes(item) ? 'is-done' : ''}`}
          key={item}
          onClick={() => onPack(item)}
          disabled={packed.includes(item)}
        >
          <span>{packed.includes(item) ? 'Убрано' : roomItems[item].label}</span>
        </button>
      ))}
      <button className={`notebook-hotspot ${allPacked ? 'is-visible' : ''}`} onClick={onNotebook}>
        Открыть тетрадь
      </button>
      {note && <p className="memory-note">{note}</p>}
    </section>
  );
}

