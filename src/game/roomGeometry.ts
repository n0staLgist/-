import type { RoomPosition } from './useRoomMovement';

type CollisionZone = { left: number; right: number; top: number; bottom: number };

const PLAYER_PADDING = { x: 1.5, y: 1.7 };
const FURNITURE: CollisionZone[] = [
  { left: 13, right: 27, top: 27, bottom: 45 }, // батарея
  { left: 36, right: 57, top: 23, bottom: 44 }, // стол и стул
  { left: 58, right: 82, top: 25, bottom: 44 }, // коробки у стены
  { left: 32, right: 50, top: 53, bottom: 73 }, // открытая коробка
];

const isInside = (position: RoomPosition, zone: CollisionZone) => (
  position.x > zone.left - PLAYER_PADDING.x
  && position.x < zone.right + PLAYER_PADDING.x
  && position.y > zone.top - PLAYER_PADDING.y
  && position.y < zone.bottom + PLAYER_PADDING.y
);

const isInsideFloor = ({ x, y }: RoomPosition) => {
  if (y < 36 || y > 94) return false;
  return x >= 4 && x <= 94;
};

export function isRoomPositionWalkable(position: RoomPosition) {
  return isInsideFloor(position) && !FURNITURE.some((zone) => isInside(position, zone));
}
