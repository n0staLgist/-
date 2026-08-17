import type { RoomPosition } from './useRoomMovement';

type Zone = { left: number; right: number; top: number; bottom: number };

const OBSTACLES: Zone[] = [
  { left: 4, right: 22, top: 0, bottom: 40 },
  { left: 17, right: 39, top: 35, bottom: 61 },
  { left: 74, right: 88, top: 32, bottom: 47 },
  { left: 87, right: 97, top: 42, bottom: 78 },
  { left: 8, right: 27, top: 58, bottom: 82 },
  { left: 0, right: 10, top: 66, bottom: 96 },
];

export function isYardPositionWalkable({ x, y }: RoomPosition) {
  if (x < 7 || x > 93 || y < 24 || y > 91) return false;
  return !OBSTACLES.some((zone) => x > zone.left && x < zone.right && y > zone.top && y < zone.bottom);
}
