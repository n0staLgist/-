import type { RoomPosition } from './useRoomMovement';

type Zone = { left: number; right: number; top: number; bottom: number };

const PLAYER_RADIUS = { x: 1.15, y: 1.45 };
const SCENERY: Zone[] = [
  { left: 2.5, right: 8.6, top: 52, bottom: 67.5 }, // раковина и длинный стол ИЗО
  { left: 7.6, right: 13.9, top: 38, bottom: 54 }, // сушилка для рисунков
  { left: 15.1, right: 22.3, top: 36.5, bottom: 53.5 }, // шкаф с материалами
  { left: 10.6, right: 18.5, top: 60, bottom: 77 }, // рабочий стол
  { left: 25.3, right: 39.1, top: 58, bottom: 66.5 }, // шкафчики
  { left: 40.1, right: 47, top: 62, bottom: 67.5 }, // скамейка
  { left: 75.2, right: 81.2, top: 21, bottom: 27.2 }, // учительский стол
  { left: 64.6, right: 69.2, top: 28.4, bottom: 35.7 },
  { left: 72.9, right: 77.4, top: 28.4, bottom: 35.7 },
  { left: 81.2, right: 85.8, top: 28.4, bottom: 35.7 },
  { left: 89.5, right: 94.1, top: 28.4, bottom: 35.7 },
  { left: 64.6, right: 69.2, top: 37.5, bottom: 45 },
  { left: 72.9, right: 77.4, top: 37.5, bottom: 45 },
  { left: 81.2, right: 85.8, top: 37.5, bottom: 45 },
  { left: 89.5, right: 94.1, top: 37.5, bottom: 45 },
  { left: 89.5, right: 94.2, top: 47.4, bottom: 55.2 }, // последняя парта
];
const CLASSMATES: Zone[] = [
  { left: 40.7, right: 43.3, top: 72, bottom: 80 },
  { left: 59.7, right: 62.3, top: 74, bottom: 82 },
  { left: 82.7, right: 85.3, top: 67, bottom: 75 },
];
const INITIAL_SHTRIKH: Zone = { left: 70.8, right: 73.2, top: 69, bottom: 75 };
const RETURNING_SHTRIKH: Zone = { left: 52.8, right: 55.2, top: 72, bottom: 78 };

const inside = (position: RoomPosition, zone: Zone) => position.x > zone.left - PLAYER_RADIUS.x &&
  position.x < zone.right + PLAYER_RADIUS.x && position.y > zone.top - PLAYER_RADIUS.y &&
  position.y < zone.bottom + PLAYER_RADIUS.y;

const insideArea = ({ x, y }: RoomPosition, area: Zone) =>
  x >= area.left && x <= area.right && y >= area.top && y <= area.bottom;

export function isRedSchoolPositionWalkable(position: RoomPosition, returning = false) {
  const corridor = insideArea(position, { left: 22, right: 98, top: 66, bottom: 94 });
  const artRoom = insideArea(position, { left: 1.5, right: 23, top: 34, bottom: 94 });
  const artRoomDoor = insideArea(position, { left: 20, right: 28, top: 56, bottom: 72 });
  const classroom = insideArea(position, { left: 59, right: 98, top: 18, bottom: 55 });
  const classroomDoor = insideArea(position, { left: 73, right: 82, top: 52, bottom: 70 });
  const onFloor = corridor || artRoom || artRoomDoor || classroom || classroomDoor;
  const actors = returning ? [RETURNING_SHTRIKH] : [...CLASSMATES, INITIAL_SHTRIKH];
  return onFloor && ![...SCENERY, ...actors].some((zone) => inside(position, zone));
}

export const getRedWorldStart = (returning: boolean): RoomPosition => returning
  ? { x: 78, y: 70 }
  : { x: 54, y: 78 };
