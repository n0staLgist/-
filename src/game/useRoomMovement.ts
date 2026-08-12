import { useCallback, useEffect, useState } from 'react';

export type RoomPosition = { x: number; y: number };

const STEP = 3;
const START_POSITION: RoomPosition = { x: 50, y: 86 };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function useRoomMovement(enabled: boolean, onInteract: (position: RoomPosition) => void) {
  const [position, setPosition] = useState(START_POSITION);

  const move = useCallback((dx: number, dy: number) => {
    if (!enabled) return;
    setPosition((current) => ({
      x: clamp(current.x + dx * STEP, 8, 92),
      y: clamp(current.y + dy * STEP, 58, 90),
    }));
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const handleKey = (event: KeyboardEvent) => {
      const directions: Record<string, [number, number]> = {
        ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1],
        ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
      };
      const direction = directions[event.code];
      if (direction) {
        event.preventDefault();
        move(...direction);
      }
      if ((event.code === 'KeyE' || event.code === 'Enter') && !event.repeat) {
        event.preventDefault();
        onInteract(position);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [enabled, move, onInteract, position]);

  return { position, move };
}
