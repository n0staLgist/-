import { useCallback, useEffect, useRef, useState } from 'react';
import { playFootstep, type FootstepSurface } from './audio';
import { isRoomPositionWalkable } from './roomGeometry';

export type RoomPosition = { x: number; y: number };
export type MoveDirection = readonly [number, number];
export type FacingDirection = 'down' | 'up' | 'left' | 'right';

type MovementOptions = {
  start?: RoomPosition;
  speed?: number;
  isWalkable?: (position: RoomPosition) => boolean;
  horizontalSpeedScale?: number;
  footstepSurface?: FootstepSurface;
};
const DIRECTIONS: Record<string, MoveDirection> = {
  ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1],
  ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
};

export function useRoomMovement(enabled: boolean, onInteract: (
  position: RoomPosition,
  facing: FacingDirection,
) => void, options: MovementOptions = {}) {
  const {
    start = { x: 86, y: 56 }, speed = 15,
    isWalkable = isRoomPositionWalkable, horizontalSpeedScale = 1, footstepSurface = 'room',
  } = options;
  const [position, setPosition] = useState(start);
  const [isMoving, setIsMoving] = useState(false);
  const [facing, setFacing] = useState<FacingDirection>('down');
  const positionRef = useRef(position);
  const facingRef = useRef(facing);
  const velocityRef = useRef<RoomPosition>({ x: 0, y: 0 });
  const pressedKeys = useRef(new Set<string>());
  const touchDirections = useRef(new Map<string, MoveDirection>());

  const startMoving = useCallback((dx: number, dy: number) => {
    touchDirections.current.set(`${dx}:${dy}`, [dx, dy]);
  }, []);
  const stopMoving = useCallback((dx: number, dy: number) => {
    touchDirections.current.delete(`${dx}:${dy}`);
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
        onInteract(positionRef.current, facingRef.current);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => pressedKeys.current.delete(event.code);
    const clearInput = () => {
      pressedKeys.current.clear();
      touchDirections.current.clear();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearInput);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearInput);
      clearInput();
    };
  }, [enabled, onInteract]);

  useEffect(() => {
    if (!enabled || !isMoving) return;
    playFootstep(footstepSurface);
    const timer = window.setInterval(() => playFootstep(footstepSurface), 420);
    return () => window.clearInterval(timer);
  }, [enabled, footstepSurface, isMoving]);

  useEffect(() => {
    if (!enabled) {
      touchDirections.current.clear();
      velocityRef.current = { x: 0, y: 0 };
      setIsMoving(false);
      return;
    }
    let frame = 0;
    let previousTime = performance.now();
    const animate = (time: number) => {
      const keyboard = [...pressedKeys.current]
        .map((key) => DIRECTIONS[key])
        .filter((direction): direction is MoveDirection => Boolean(direction));
      const touch = [...touchDirections.current.values()];
      const dx = keyboard.reduce((sum, direction) => sum + direction[0], 0) +
        touch.reduce((sum, direction) => sum + direction[0], 0);
      const dy = keyboard.reduce((sum, direction) => sum + direction[1], 0) +
        touch.reduce((sum, direction) => sum + direction[1], 0);
      const length = Math.hypot(dx, dy);
      const targetX = length > 0 ? (dx / length) * speed * horizontalSpeedScale : 0;
      const targetY = length > 0 ? (dy / length) * speed : 0;
      const deltaSeconds = Math.min(time - previousTime, 32) / 1000;
      const easing = 1 - Math.exp(-(length > 0 ? 30 : 16) * deltaSeconds);
      velocityRef.current = {
        x: velocityRef.current.x + (targetX - velocityRef.current.x) * easing,
        y: velocityRef.current.y + (targetY - velocityRef.current.y) * easing,
      };
      const moving = Math.hypot(velocityRef.current.x, velocityRef.current.y) > 0.18;
      setIsMoving((current) => current === moving ? current : moving);
      const nextFacing: FacingDirection | null = Math.abs(dx) > Math.abs(dy)
        ? (dx < 0 ? 'left' : 'right')
        : dy !== 0 ? (dy < 0 ? 'up' : 'down') : null;
      if (nextFacing) {
        facingRef.current = nextFacing;
        setFacing((current) => current === nextFacing ? current : nextFacing);
      }
      if (moving) {
        setPosition((current) => {
          let next = current;
          const horizontal = { x: current.x + velocityRef.current.x * deltaSeconds, y: current.y };
          if (isWalkable(horizontal)) next = horizontal;
          else velocityRef.current.x *= 0.25;
          const vertical = { x: next.x, y: current.y + velocityRef.current.y * deltaSeconds };
          if (isWalkable(vertical)) next = vertical;
          else velocityRef.current.y *= 0.25;
          positionRef.current = next;
          return next;
        });
      }
      previousTime = time;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [enabled, horizontalSpeedScale, isWalkable, speed]);

  return { position, isMoving, facing, startMoving, stopMoving };
}
