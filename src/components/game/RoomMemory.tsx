import { roomItems } from '../../game/story';
import type { RoomItem } from '../../game/types';
import { useAdvanceKeys } from '../../game/useAdvanceKeys';

type RoomMemoryProps = {
  item: RoomItem;
  onClose: () => void;
};

const memoryDetails: Record<RoomItem, string> = {
  cassette: 'Щелчок кнопки. Шорох плёнки. Потом чей-то смех, случайно оставшийся между песнями.',
  photo: 'На обороте выцветшими чернилами: «Лето, когда мы ещё никуда не спешили».',
  diary: 'На последней странице — несколько начатых карандашных фигур. Ни одна не закончена.',
};

export function RoomMemory({ item, onClose }: RoomMemoryProps) {
  useAdvanceKeys(onClose);

  return (
    <section className={`room-memory room-memory--${item}`} aria-label={`Воспоминание: ${roomItems[item].label}`}>
      <div className="room-memory__light" />
      <article className="room-memory__paper">
        <span className="room-memory__eyebrow">Воспоминание</span>
        <div className="memory-object" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
        <h2>{roomItems[item].label}</h2>
        <blockquote>{roomItems[item].memory}</blockquote>
        <p>{memoryDetails[item]}</p>
        <button onClick={onClose}>Положить в коробку <span>→</span></button>
        <small>Enter / Пробел</small>
      </article>
    </section>
  );
}
