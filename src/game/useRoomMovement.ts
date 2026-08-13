import { useCallback, useEffect, useRef, useState } from 'react';
import { isRoomPositionWalkable } from './roomGeometry';

export type RoomPosition = { x: number; y: number };
export type MoveDirection = readonly [number, number];
export type FacingDirection = 'down' | 'up' | 'left' | 'right';

type MovementOptions = {
  start?: RoomPosition;
  speed?: number;
  isWalkable?: (position: RoomPosition) => boolean;
};
const DIRECTIONS: Record<string, MoveDirection> = {
  ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1],
  ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
};

export function useRoomMovement(enabled: boolean, onInteract: (position: RoomPosition) => void, options: MovementOptions = {}) {
  const { start = { x: 86, y: 56 }, speed = 15, isWalkable = isRoomPositionWalkable } = options;
  const [position, setPosition] = useState(start);
  const [isMoving, setIsMoving] = useState(false);
  const [facing, setFacing] = useState<FacingDirection>('down');
  const positionRef = useRef(position);
  const pressedKeys = useRef(new Set<string>());
  const touchDirection = useRef<MoveDirection | null>(null);

  const startMoving = useCallback((dx: number, dy: number) => {
    touchDirection.current = [dx, dy];
  }, []);
  const stopMoving = useCallback(() => {
    touchDirection.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (DIRECTIONS[event.code]) {
        event.preventDefault();
        pressedKeys.current.add(event.code);
      }
      if ((event.code === 'KeyE' || event.code === 'Enter') && !event.repeat) {
        event.preventDefault();
        onInteract(positionRef.current);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => pressedKeys.current.delete(event.code);
    const clearKeys = () => pressedKeys.current.clear();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearKeys);
      clearKeys();
    };
  }, [enabled, onInteract]);

  useEffect(() => {
    if (!enabled) {
      touchDirection.current = null;
      setIsMoving(false);
      return;
    }
    let frame = 0;
    let previousTime = performance.now();
    const animate = (time: number) => {
      const keyboard = [...pressedKeys.current]
        .map((key) => DIRECTIONS[key])
        .filter((direction): direction is MoveDirection => Boolean(direction));
      const dx = keyboard.reduce((sum, direction) => sum + direction[0], 0) + (touchDirection.current?.[0] ?? 0);
      const dy = keyboard.reduce((sum, direction) => sum + direction[1], 0) + (touchDirection.current?.[1] ?? 0);
      const length = Math.hypot(dx, dy);
      const moving = length > 0;
      setIsMoving((current) => current === moving ? current : moving);
      const nextFacing: FacingDirection | null = Math.abs(dx) > Math.abs(dy)
        ? (dx < 0 ? 'left' : 'right')
        : dy !== 0 ? (dy < 0 ? 'up' : 'down') : null;
      if (nextFacing) setFacing((current) => current === nextFacing ? current : nextFacing);
      if (moving) {
        const distance = speed * Math.min(time - previousTime, 32) / 1000;
        setPosition((current) => {
          let next = current;
          const horizontal = { x: current.x + (dx / length) * distance, y: current.y };
          if (isWalkable(horizontal)) next = horizontal;
          const vertical = { x: next.x, y: current.y + (dy / length) * distance };
          if (isWalkable(vertical)) next = vertical;
          positionRef.current = next;
          return next;
        });
      }
      previousTime = time;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [enabled, isWalkable, speed]);

  return { position, isMoving, facing, startMoving, stopMoving };
}
