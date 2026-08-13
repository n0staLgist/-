import type { RoomPosition } from './useRoomMovement';

type CollisionZone = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const FLOOR_BOUNDS: CollisionZone = { left: 7, right: 93, top: 58, bottom: 91 };
const PLAYER_PADDING = { x: 1.4, y: 1.8 };

// Координаты совпадают с мебелью на moving-room.png.
const FURNITURE: CollisionZone[] = [
  { left: 19, right: 29, top: 58, bottom: 70 }, // свёрнутый ковёр
  { left: 26, right: 50, top: 58, bottom: 69 }, // письменный стол
  { left: 62, right: 84, top: 58, bottom: 73 }, // коробки у стены
  { left: 45, right: 70, top: 69, bottom: 87 }, // открытая коробка
];

const isInside = (position: RoomPosition, zone: CollisionZone) => (
  position.x > zone.left - PLAYER_PADDING.x
  && position.x < zone.right + PLAYER_PADDING.x
  && position.y > zone.top - PLAYER_PADDING.y
  && position.y < zone.bottom + PLAYER_PADDING.y
);

export function isRoomPositionWalkable(position: RoomPosition) {
  const insideFloor = position.x >= FLOOR_BOUNDS.left
    && position.x <= FLOOR_BOUNDS.right
    && position.y >= FLOOR_BOUNDS.top
    && position.y <= FLOOR_BOUNDS.bottom;

  return insideFloor && !FURNITURE.some((zone) => isInside(position, zone));
}
