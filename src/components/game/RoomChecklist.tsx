import { roomItems } from '../../game/story';
import type { RoomItem } from '../../game/types';

type RoomChecklistProps = { packed: RoomItem[] };

const items = Object.keys(roomItems) as RoomItem[];

export function RoomChecklist({ packed }: RoomChecklistProps) {
  return (
    <aside className="room-checklist" aria-label="Что положить в коробку">
      <strong>Последняя коробка</strong>
      {items.map((item) => (
        <span className={packed.includes(item) ? 'is-done' : ''} key={item}>
          <i aria-hidden="true">{packed.includes(item) ? '✓' : '○'}</i>{roomItems[item].label}
        </span>
      ))}
    </aside>
  );
}
