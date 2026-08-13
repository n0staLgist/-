import type { RoomPosition } from './useRoomMovement';

type CollisionZone = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const FLOOR_BOUNDS: CollisionZone = { left: 5, right: 95, top: 54, bottom: 94 };
const PLAYER_PADDING = { x: 1.2, y: 1.4 };

// Координаты совпадают с мебелью на moving-room.png.
const FURNITURE: CollisionZone[] = [
  { left: 20, right: 27, top: 56, bottom: 69 }, // свёрнутый ковёр
  { left: 27, right: 49, top: 56, bottom: 67 }, // письменный стол
  { left: 64, right: 82, top: 56, bottom: 70 }, // коробки у стены
  { left: 48, right: 67, top: 70, bottom: 84 }, // открытая коробка
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
