import { roomItems } from '../../game/story';
import type { RoomItem } from '../../game/types';

type RoomChecklistProps = { packed: RoomItem[] };

const items = Object.keys(roomItems) as RoomItem[];
export function RoomChecklist({ packed }: RoomChecklistProps) {
  const isComplete = packed.length === items.length;
  return (
    <aside className="room-checklist" aria-label="Что положить в коробку">
      <strong>{isComplete ? 'Задание выполнено' : 'Сложи в открытую коробку'}</strong>
      <small>{isComplete ? 'Тетрадь ждёт на столе' : `${packed.length} из ${items.length}`}</small>
      {items.map((item) => (
        <span className={packed.includes(item) ? 'is-done' : ''} key={item}>
          <i aria-hidden="true">{packed.includes(item) ? '✓' : '○'}</i><b>{roomItems[item].label}</b>
        </span>
      ))}
    </aside>
  );
}
