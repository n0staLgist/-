type MovementControlsProps = {
  onMove: (dx: number, dy: number) => void;
  onInteract: () => void;
};

export function MovementControls({ onMove, onInteract }: MovementControlsProps) {
  return (
    <div className="movement-controls" aria-label="Управление персонажем">
      <button className="move-up" onClick={() => onMove(0, -1)} aria-label="Идти вверх">↑</button>
      <button className="move-left" onClick={() => onMove(-1, 0)} aria-label="Идти влево">←</button>
      <button className="move-down" onClick={() => onMove(0, 1)} aria-label="Идти вниз">↓</button>
      <button className="move-right" onClick={() => onMove(1, 0)} aria-label="Идти вправо">→</button>
      <button className="move-action" onClick={onInteract} aria-label="Взаимодействовать">E</button>
    </div>
  );
}
