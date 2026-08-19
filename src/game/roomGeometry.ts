import type { RoomPosition } from './useRoomMovement';

type CollisionZone = { left: number; right: number; top: number; bottom: number };

const PLAYER_PADDING = { x: .85, y: .75 };
const FURNITURE: CollisionZone[] = [
  { left: 23.2, right: 52.8, top: 29, bottom: 43.5 }, // письменный стол
  { left: 26.5, right: 38.2, top: 32, bottom: 47 }, // стул
  { left: 54.5, right: 65.8, top: 27, bottom: 42 }, // коробки у стены
  { left: 66.2, right: 76.9, top: 27, bottom: 42 },
  { left: 77.4, right: 87.8, top: 27, bottom: 42 },
  { left: 2.2, right: 22, top: 56, bottom: 83.5 }, // открытая коробка со створками
];

const isInside = (position: RoomPosition, zone: CollisionZone) => (
  position.x > zone.left - PLAYER_PADDING.x
  && position.x < zone.right + PLAYER_PADDING.x
  && position.y > zone.top - PLAYER_PADDING.y
  && position.y < zone.bottom + PLAYER_PADDING.y
);

const isInsideFloor = ({ x, y }: RoomPosition) => {
  const top = 39;
  const bottom = 94;
  if (y < top || y > bottom) return false;

  const depth = (y - top) / (bottom - top);
  const leftWall = 4 - depth * 1.5;
  const rightWallAndDoor = 92.5 - depth * .5;
  return x >= leftWall && x <= rightWallAndDoor;
};

export function isRoomPositionWalkable(position: RoomPosition) {
  return isInsideFloor(position) && !FURNITURE.some((zone) => isInside(position, zone));
}
