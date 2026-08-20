type MovementControlsProps = {
  onMoveStart: (dx: number, dy: number) => void;
  onMoveEnd: (dx: number, dy: number) => void;
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
            event.preventDefault();
            onMoveStart(x, y);
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              // Some mobile browsers move correctly without pointer capture.
            }
          }}
          onPointerUp={() => onMoveEnd(x, y)}
          onPointerCancel={() => onMoveEnd(x, y)}
          onLostPointerCapture={() => onMoveEnd(x, y)}
          onContextMenu={(event) => event.preventDefault()}
          aria-label={label}
          type="button"
        >{symbol}</button>
      ))}
      <button className="move-action" onClick={onInteract} aria-label="Взаимодействовать" type="button">●</button>
    </div>
  );
}
