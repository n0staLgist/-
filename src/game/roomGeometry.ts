import type { RoomPosition } from './useRoomMovement';

type CollisionZone = { left: number; right: number; top: number; bottom: number };

const PLAYER_PADDING = { x: 1.5, y: 1.7 };
const FURNITURE: CollisionZone[] = [
  { left: 4, right: 21, top: 5, bottom: 32 }, // батарея
  { left: 27, right: 52, top: 5, bottom: 31 }, // стол и стул
  { left: 58, right: 84, top: 6, bottom: 28 }, // коробки у стены
  { left: 20, right: 39, top: 50, bottom: 74 }, // открытая коробка
];

const isInside = (position: RoomPosition, zone: CollisionZone) => (
  position.x > zone.left - PLAYER_PADDING.x
  && position.x < zone.right + PLAYER_PADDING.x
  && position.y > zone.top - PLAYER_PADDING.y
  && position.y < zone.bottom + PLAYER_PADDING.y
);

const isInsideFloor = ({ x, y }: RoomPosition) => {
  if (y < 28 || y > 94) return false;
  return x >= 4 && x <= 94;
};

export function isRoomPositionWalkable(position: RoomPosition) {
  return isInsideFloor(position) && !FURNITURE.some((zone) => isInside(position, zone));
}
