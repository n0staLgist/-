import type { RoomPosition } from './useRoomMovement';

type CollisionZone = { left: number; right: number; top: number; bottom: number };

const PLAYER_PADDING = { x: 1.5, y: 1.7 };
const FURNITURE: CollisionZone[] = [
  { left: 11, right: 20, top: 27, bottom: 45 }, // свёрнутый ковёр
  { left: 19, right: 34, top: 26, bottom: 36 }, // батарея
  { left: 39, right: 55, top: 25, bottom: 35 }, // стол и стул
  { left: 58, right: 81, top: 25, bottom: 34 }, // коробки у стены
  { left: 41, right: 57, top: 52, bottom: 74 }, // открытая коробка
];

const isInside = (position: RoomPosition, zone: CollisionZone) => (
  position.x > zone.left - PLAYER_PADDING.x
  && position.x < zone.right + PLAYER_PADDING.x
  && position.y > zone.top - PLAYER_PADDING.y
  && position.y < zone.bottom + PLAYER_PADDING.y
);

const isInsideFloor = ({ x, y }: RoomPosition) => {
  if (y < 28 || y > 93) return false;
  const progress = (y - 28) / 65;
  const leftEdge = 13 - progress * 7;
  const rightEdge = 87 + progress * 7;
  return x >= leftEdge && x <= rightEdge;
};

export function isRoomPositionWalkable(position: RoomPosition) {
  return isInsideFloor(position) && !FURNITURE.some((zone) => isInside(position, zone));
}
