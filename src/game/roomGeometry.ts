import type { RoomPosition } from './useRoomMovement';

type CollisionZone = { left: number; right: number; top: number; bottom: number };

const PLAYER_PADDING = { x: 1.5, y: 1.7 };
const FURNITURE: CollisionZone[] = [
  { left: 5, right: 21, top: 29, bottom: 36 }, // опора батареи
  { left: 23, right: 54, top: 31, bottom: 46 }, // ножки стола и стул
  { left: 56, right: 89, top: 29, bottom: 40 }, // коробки у стены
  { left: 3, right: 22, top: 55, bottom: 80 }, // открытая коробка и её створки
];

const isInside = (position: RoomPosition, zone: CollisionZone) => (
  position.x > zone.left - PLAYER_PADDING.x
  && position.x < zone.right + PLAYER_PADDING.x
  && position.y > zone.top - PLAYER_PADDING.y
  && position.y < zone.bottom + PLAYER_PADDING.y
);

const isInsideFloor = ({ x, y }: RoomPosition) => {
  const top = 35;
  const bottom = 96;
  if (y < top || y > bottom) return false;

  const depth = (y - top) / (bottom - top);
  const leftWall = 4 - depth * 3;
  const rightWallAndDoor = 93 - depth;
  return x >= leftWall && x <= rightWallAndDoor;
};

export function isRoomPositionWalkable(position: RoomPosition) {
  return isInsideFloor(position) && !FURNITURE.some((zone) => isInside(position, zone));
}
