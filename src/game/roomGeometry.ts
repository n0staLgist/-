import type { RoomPosition } from './useRoomMovement';

type CollisionZone = { left: number; right: number; top: number; bottom: number };

const PLAYER_PADDING = { x: 1.5, y: 1.7 };
const FURNITURE: CollisionZone[] = [
  { left: 3, right: 21, top: 18, bottom: 36 }, // батарея
  { left: 22, right: 54, top: 14, bottom: 46 }, // стол и стул
  { left: 57, right: 90, top: 15, bottom: 40 }, // коробки у стены
  { left: 1, right: 23, top: 51, bottom: 80 }, // открытая коробка
];

const isInside = (position: RoomPosition, zone: CollisionZone) => (
  position.x > zone.left - PLAYER_PADDING.x
  && position.x < zone.right + PLAYER_PADDING.x
  && position.y > zone.top - PLAYER_PADDING.y
  && position.y < zone.bottom + PLAYER_PADDING.y
);

const isInsideFloor = ({ x, y }: RoomPosition) => {
  if (y < 29 || y > 96) return false;
  return x >= 2 && x <= 96;
};

export function isRoomPositionWalkable(position: RoomPosition) {
  return isInsideFloor(position) && !FURNITURE.some((zone) => isInside(position, zone));
}
