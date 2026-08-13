type MovementControlsProps = {
  onMoveStart: (dx: number, dy: number) => void;
  onMoveEnd: () => void;
  onInteract: () => void;
};

const directions = [
  { className: 'move-up', label: 'Идти вверх', symbol: '↑', x: 0, y: -1 },
  { className: 'move-left', label: 'Идти влево', symbol: '←', x: -1, y: 0 },
  { className: 'move-down', label: 'Идти вниз', symbol: '↓', x: 0, y: 1 },
  { className: 'move-right', label: 'Идти вправо', symbol: '→', x: 1, y: 0 },
];

export function MovementControls({ onMoveStart, onMoveEnd, onInteract }: MovementControlsProps) {
  return (
    <div className="movement-controls" aria-label="Управление персонажем">
      {directions.map(({ className, label, symbol, x, y }) => (
        <button
          className={className}
          key={className}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            onMoveStart(x, y);
          }}
          onPointerUp={onMoveEnd}
          onPointerCancel={onMoveEnd}
          onLostPointerCapture={onMoveEnd}
          aria-label={label}
        >{symbol}</button>
      ))}
      <button className="move-action" onClick={onInteract} aria-label="Взаимодействовать">E</button>
    </div>
  );
}
