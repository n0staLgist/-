import type { RoomPosition } from './useRoomMovement';

type Zone = { left: number; right: number; top: number; bottom: number };

const PLAYER_RADIUS = { x: 1, y: .8 };
const FLOOR: Zone[] = [
  { left: 3, right: 96, top: 31, bottom: 93 },
  { left: 3, right: 40, top: 4, bottom: 48 },
  { left: 58, right: 95, top: 4, bottom: 50 },
  { left: 35, right: 44, top: 24, bottom: 55 },
  { left: 54, right: 64, top: 23, bottom: 55 },
];
const SCENERY: Zone[] = [
  { left: 4, right: 15, top: 14, bottom: 44 },
  { left: 26, right: 35, top: 8, bottom: 25 },
  { left: 63, right: 77, top: 18, bottom: 35 },
  { left: 4, right: 32, top: 51, bottom: 70 },
  { left: 6, right: 30, top: 69, bottom: 84 },
  { left: 77, right: 91, top: 53, bottom: 72 },
];

const shtrikhPositions: RoomPosition[] = [
  { x: 56, y: 70 }, { x: 64, y: 68 }, { x: 71, y: 68 }, { x: 76, y: 71 }, { x: 79, y: 72 },
];

const insideArea = ({ x, y }: RoomPosition, zone: Zone) =>
  x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom;
const overlaps = (position: RoomPosition, zone: Zone) =>
  position.x > zone.left - PLAYER_RADIUS.x && position.x < zone.right + PLAYER_RADIUS.x &&
  position.y > zone.top - PLAYER_RADIUS.y && position.y < zone.bottom + PLAYER_RADIUS.y;

export function getBlueShtrikhPosition(foundCount: number) {
  return shtrikhPositions[Math.min(foundCount, shtrikhPositions.length - 1)];
}

export function isBlueRoomPositionWalkable(position: RoomPosition, foundCount: number) {
  const onFloor = FLOOR.some((zone) => insideArea(position, zone));
  const shtrikh = getBlueShtrikhPosition(foundCount);
  const actor: Zone = { left: shtrikh.x - 1.5, right: shtrikh.x + 1.5, top: shtrikh.y - 6, bottom: shtrikh.y + 1 };
  return onFloor && ![...SCENERY, actor].some((zone) => overlaps(position, zone));
}

export const blueRoomStart: RoomPosition = { x: 49, y: 84 };
