import { roomItems } from '../../game/story';
import type { RoomItem } from '../../game/types';

type RoomChecklistProps = { packed: RoomItem[] };

const items = Object.keys(roomItems) as RoomItem[];
const locations: Record<RoomItem, string> = {
  cassette: 'у открытой коробки',
  photo: 'возле батареи',
  diary: 'у собранных коробок',
};

export function RoomChecklist({ packed }: RoomChecklistProps) {
  return (
    <aside className="room-checklist" aria-label="Что положить в коробку">
      <strong>Сложи в открытую коробку</strong>
      <small>Подойди к вещи и нажми E / Enter</small>
      {items.map((item) => (
        <span className={packed.includes(item) ? 'is-done' : ''} key={item}>
          <i aria-hidden="true">{packed.includes(item) ? '✓' : '○'}</i><b>{roomItems[item].label}</b><em>{locations[item]}</em>
        </span>
      ))}
    </aside>
  );
}
