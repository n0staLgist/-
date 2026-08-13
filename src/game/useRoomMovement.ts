import { useCallback, useEffect, useRef, useState } from 'react';
import { isRoomPositionWalkable } from './roomGeometry';

export type RoomPosition = { x: number; y: number };
export type MoveDirection = readonly [number, number];
export type FacingDirection = 'left' | 'right';

const SPEED = 18;
const START_POSITION: RoomPosition = { x: 77, y: 86 };
const DIRECTIONS: Record<string, MoveDirection> = {
  ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1],
  ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
};

export function useRoomMovement(enabled: boolean, onInteract: (position: RoomPosition) => void) {
  const [position, setPosition] = useState(START_POSITION);
  const [isMoving, setIsMoving] = useState(false);
  const [facing, setFacing] = useState<FacingDirection>('left');
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
      if (dx) setFacing((current) => current === (dx < 0 ? 'left' : 'right') ? current : (dx < 0 ? 'left' : 'right'));
      if (moving) {
        const distance = SPEED * Math.min(time - previousTime, 32) / 1000;
        setPosition((current) => {
          let next = current;
          const horizontal = { x: current.x + (dx / length) * distance, y: current.y };
          if (isRoomPositionWalkable(horizontal)) next = horizontal;
          const vertical = { x: next.x, y: current.y + (dy / length) * distance };
          if (isRoomPositionWalkable(vertical)) next = vertical;
          positionRef.current = next;
          return next;
        });
      }
      previousTime = time;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  return { position, isMoving, facing, startMoving, stopMoving };
}
