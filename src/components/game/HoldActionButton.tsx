import type { PointerEvent, ReactNode } from 'react';

type HoldActionButtonProps = {
  children: ReactNode;
  onStart: () => void;
  onStop: () => void;
};

export function HoldActionButton({ children, onStart, onStop }: HoldActionButtonProps) {
  const startHolding = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onStart();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional on older mobile browsers.
    }
  };

  return (
    <button className="hold-action" type="button" onPointerDown={startHolding}
      onPointerUp={onStop} onPointerCancel={onStop} onLostPointerCapture={onStop}
      onContextMenu={(event) => event.preventDefault()}>
      {children}
    </button>
  );
}
