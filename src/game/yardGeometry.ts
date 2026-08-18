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
const PLAYER_RADIUS = { x: 1.3, y: 1.7 };

const inside = ({ x, y }: RoomPosition, zone: Zone) => x > zone.left - PLAYER_RADIUS.x &&
  x < zone.right + PLAYER_RADIUS.x && y > zone.top - PLAYER_RADIUS.y &&
  y < zone.bottom + PLAYER_RADIUS.y;

export function isYardPositionWalkable(position: RoomPosition) {
  const { x, y } = position;
  if (x < 8.3 || x > 91.7 || y < 25.7 || y > 89.3) return false;
  return !OBSTACLES.some((zone) => inside(position, zone));
}
