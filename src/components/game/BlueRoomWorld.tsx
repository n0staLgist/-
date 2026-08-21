import { useCallback, useEffect, useMemo, type CSSProperties } from 'react';
import blueRoomMap from '../../assets/game/blue-room-world-v1.webp';
import shtrikhImage from '../../assets/game/shtrikh-yard-present-v2.webp';
import { blueClueOrder, blueClues, type BlueClue } from '../../game/blueChapter';
import {
  blueDoorGuardTarget, blueRoomStart, getBlueShtrikhPosition, isBlueRoomPositionWalkable,
} from '../../game/blueRoomGeometry';
import { selectInteractionTarget } from '../../game/interactionTarget';
import { useRoomMovement, type FacingDirection, type RoomPosition } from '../../game/useRoomMovement';
import { HintButton } from './HintButton';
import { InteractionPrompt } from './InteractionPrompt';
import { MovementControls } from './MovementControls';
import { PlayerAvatar } from './PlayerAvatar';

type BlueRoomWorldProps = {
  found: BlueClue[];
  shtrikhStep: number;
  focusShtrikh: boolean;
  guardsDoor: boolean;
  doorArrival: boolean;
  isInteractive: boolean;
  showTouchControls: boolean;
  onClue: (clue: BlueClue) => void;
  onDoorApproach: () => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const guideDirection = (from: RoomPosition, to: RoomPosition) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
};

export function BlueRoomWorld({
  found, shtrikhStep, focusShtrikh, guardsDoor, doorArrival,
  isInteractive, showTouchControls, onClue, onDoorApproach,
}: BlueRoomWorldProps) {
  const candidates = useMemo(() => blueClueOrder.filter((clue) => !found.includes(clue)).map((clue) => ({
    id: clue, value: clue, label: `Осмотреть: ${blueClues[clue].label.toLowerCase()}`,
    position: clue === 'door' && guardsDoor ? blueDoorGuardTarget : blueClues[clue].position,
    priority: 30, reach: clue === 'door' && guardsDoor ? 9 : 8,
  })), [found, guardsDoor]);
  const interact = useCallback((position: RoomPosition, facing: FacingDirection) => {
    const target = selectInteractionTarget(candidates, position, facing);
    if (target) onClue(target.value);
  }, [candidates, onClue]);
  const isWalkable = useCallback((position: RoomPosition) =>
    isBlueRoomPositionWalkable(position, shtrikhStep, guardsDoor), [guardsDoor, shtrikhStep]);
  const movement = useRoomMovement(isInteractive, interact, {
    start: blueRoomStart, speed: 8.5, isWalkable,
    horizontalSpeedScale: showTouchControls ? 2 / 3 : 1,
  });
  useEffect(() => {
    if (!isInteractive || guardsDoor || found.includes('door') || found.length >= 3) return;
    const door = blueClues.door.position;
    if (Math.hypot(door.x - movement.position.x, door.y - movement.position.y) <= 12) onDoorApproach();
  }, [found, guardsDoor, isInteractive, movement.position, onDoorApproach]);
  const target = isInteractive
    ? selectInteractionTarget(candidates, movement.position, movement.facing) : null;
  const closest = [...candidates].sort((a, b) =>
    Math.hypot(a.position.x - movement.position.x, a.position.y - movement.position.y) -
    Math.hypot(b.position.x - movement.position.x, b.position.y - movement.position.y))[0];
  const shtrikh = getBlueShtrikhPosition(shtrikhStep, guardsDoor);
  const cameraTarget = focusShtrikh ? shtrikh : movement.position;
  const cameraX = clamp(cameraTarget.x, showTouchControls ? 29 : 25, showTouchControls ? 71 : 74);
  const cameraY = clamp(cameraTarget.y, showTouchControls ? 20 : 28, showTouchControls ? 80 : 72);
  const mapStyle: CSSProperties = { transform: `translate(-${cameraX}%, -${cameraY}%)` };

  return (
    <section className={`blue-room-world blue-room-world--${found.length} ${focusShtrikh ? 'is-watching-shtrikh' : ''} ${doorArrival ? 'is-door-arrival' : ''}`}>
      <div className="blue-room-map" style={mapStyle}>
        <img className="blue-room-map__art" src={blueRoomMap} alt="Искажённая синяя копия комнаты" />
        {candidates.map((candidate) => <i className={`blue-clue-mark ${target?.value === candidate.value ? 'is-near' : ''}`}
          key={candidate.id} style={{ left: `${candidate.position.x}%`, top: `${candidate.position.y}%` }} />)}
        <img className="blue-room-shtrikh" src={shtrikhImage} alt="Штрих молча перемещается ближе к двери"
          style={{ left: `${shtrikh.x}%`, top: `${shtrikh.y}%` }} />
        <PlayerAvatar position={movement.position} facing={movement.facing} isMoving={movement.isMoving} />
        <InteractionPrompt position={target?.position ?? movement.position} text={target?.label ?? ''} />
      </div>
      <span className="blue-room-area">Глава III · Синяя комната</span>
      {isInteractive && closest && <HintButton
        hint={`Осталось следов: ${candidates.length}. Ближайший — ${blueClues[closest.value].label.toLowerCase()}.`}
        direction={guideDirection(movement.position, closest.position)} />}
      {showTouchControls && <MovementControls onMoveStart={movement.startMoving}
        onMoveEnd={movement.stopMoving} onInteract={() => interact(movement.position, movement.facing)} />}
    </section>
  );
}
