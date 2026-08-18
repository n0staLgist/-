import type { RedLocation } from './redChapter';
import type { RoomPosition } from './useRoomMovement';

type Zone = { left: number; right: number; top: number; bottom: number };

const classroomObstacles: Zone[] = [
  { left: 25, right: 38, top: 34, bottom: 50 },
  { left: 43, right: 56, top: 34, bottom: 50 },
  { left: 61, right: 74, top: 34, bottom: 50 },
  { left: 23, right: 37, top: 52, bottom: 67 },
  { left: 42, right: 56, top: 52, bottom: 67 },
  { left: 62, right: 76, top: 52, bottom: 67 },
  { left: 20, right: 35, top: 70, bottom: 86 },
  { left: 40, right: 56, top: 70, bottom: 86 },
  { left: 62, right: 78, top: 70, bottom: 86 },
];

const inside = (position: RoomPosition, zone: Zone) => position.x > zone.left &&
  position.x < zone.right && position.y > zone.top && position.y < zone.bottom;

export function isRedSchoolPositionWalkable(location: RedLocation, position: RoomPosition) {
  if (position.x < 7 || position.x > 93 || position.y < 31 || position.y > 88) return false;
  if (location === 'stairs') return !inside(position, { left: 0, right: 31, top: 0, bottom: 65 });
  if (location === 'classroom') return !classroomObstacles.some((zone) => inside(position, zone));
  return position.y < 76;
}

export const redLocationStart: Record<RedLocation, RoomPosition> = {
  corridor: { x: 50, y: 68 },
  stairs: { x: 84, y: 69 },
  classroom: { x: 13, y: 45 },
};
