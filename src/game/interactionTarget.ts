import type { FacingDirection, RoomPosition } from './useRoomMovement';

export type InteractionCandidate<T> = {
  id: string;
  value: T;
  label: string;
  position: RoomPosition;
  priority: number;
  reach: number;
};

const facingVector: Record<FacingDirection, RoomPosition> = {
  down: { x: 0, y: 1 }, up: { x: 0, y: -1 },
  left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
};

export function selectInteractionTarget<T>(
  candidates: InteractionCandidate<T>[],
  player: RoomPosition,
  facing: FacingDirection,
) {
  const direction = facingVector[facing];
  return candidates
    .map((candidate) => {
      const dx = candidate.position.x - player.x;
      const dy = candidate.position.y - player.y;
      const distance = Math.hypot(dx, dy);
      const alignment = distance === 0 ? 1 : (dx * direction.x + dy * direction.y) / distance;
      return { candidate, distance, alignment };
    })
    .filter(({ candidate, distance, alignment }) =>
      distance <= candidate.reach && (distance < 2.4 || alignment > -.15))
    .sort((first, second) => second.candidate.priority - first.candidate.priority ||
      second.alignment - first.alignment || first.distance - second.distance)[0]?.candidate ?? null;
}
