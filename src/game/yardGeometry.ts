import type { RoomPosition } from './useRoomMovement';

type Zone = { left: number; right: number; top: number; bottom: number };

const OBSTACLES: Zone[] = [
  { left: 26.4, right: 29.5, top: 30, bottom: 51.5 }, // левая опора качелей
  { left: 41.2, right: 44.6, top: 25.5, bottom: 50 }, // правая опора качелей
  { left: 71.5, right: 77.5, top: 27.5, bottom: 34.5 }, // скамейка
  { left: 79.2, right: 84.8, top: 43.5, bottom: 66.5 }, // футбольные ворота
  { left: 10, right: 25.2, top: 58, bottom: 77.5 }, // песочница
  { left: 0, right: 9.4, top: 67, bottom: 90 }, // угол дома
  { left: 68.2, right: 69.8, top: 32.5, bottom: 35 }, // ноги Штриха
];
const PLAYER_RADIUS = { x: .85, y: .7 };

const inside = ({ x, y }: RoomPosition, zone: Zone) => x > zone.left - PLAYER_RADIUS.x &&
  x < zone.right + PLAYER_RADIUS.x && y > zone.top - PLAYER_RADIUS.y &&
  y < zone.bottom + PLAYER_RADIUS.y;

export function isYardPositionWalkable(position: RoomPosition) {
  const { x, y } = position;
  if (x < 8.3 || x > 91.7 || y < 25.7 || y > 89.3) return false;
  return !OBSTACLES.some((zone) => inside(position, zone));
}
