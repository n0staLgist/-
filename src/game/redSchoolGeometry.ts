import type { RoomPosition } from './useRoomMovement';

type Zone = { left: number; right: number; top: number; bottom: number };

const PLAYER_RADIUS = { x: 1.15, y: 1.45 };
const SCENERY: Zone[] = [
  { left: 1, right: 7, top: 47, bottom: 67 }, // раковина и длинный стол ИЗО
  { left: 5, right: 10, top: 37, bottom: 54 }, // сушилка для рисунков
  { left: 11, right: 17, top: 36, bottom: 53 }, // шкаф с материалами
  { left: 8, right: 15, top: 60, bottom: 76 }, // рабочий стол
  { left: 25, right: 38, top: 58, bottom: 68 }, // шкафчики
  { left: 40, right: 47, top: 61, bottom: 69 }, // скамейка
  { left: 73, right: 82, top: 18, bottom: 27 }, // учительский стол
  { left: 63, right: 69, top: 28, bottom: 36 },
  { left: 72, right: 78, top: 28, bottom: 36 },
  { left: 81, right: 87, top: 28, bottom: 36 },
  { left: 90, right: 96, top: 28, bottom: 36 },
  { left: 63, right: 69, top: 37, bottom: 45 },
  { left: 72, right: 78, top: 37, bottom: 45 },
  { left: 81, right: 87, top: 37, bottom: 45 },
  { left: 90, right: 96, top: 37, bottom: 45 },
  { left: 89, right: 96, top: 46, bottom: 56 }, // последняя парта
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
