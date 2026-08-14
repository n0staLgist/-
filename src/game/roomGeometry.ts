import type { RoomPosition } from './useRoomMovement';

type CollisionZone = { left: number; right: number; top: number; bottom: number };

const PLAYER_PADDING = { x: .7, y: 1 };
const FURNITURE: CollisionZone[] = [
  { left: 1, right: 16, top: 28, bottom: 35 }, // батарея
  { left: 19, right: 51, top: 29, bottom: 46 }, // стол и стул
  { left: 53, right: 89, top: 27, bottom: 41 }, // коробки у стены
  { left: 1, right: 22, top: 56, bottom: 86 }, // открытая коробка вместе с четырьмя створками
];

const isInside = (position: RoomPosition, zone: CollisionZone) => (
  position.x > zone.left - PLAYER_PADDING.x
  && position.x < zone.right + PLAYER_PADDING.x
  && position.y > zone.top - PLAYER_PADDING.y
  && position.y < zone.bottom + PLAYER_PADDING.y
);

const isInsideFloor = ({ x, y }: RoomPosition) => {
  const top = 37;
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
