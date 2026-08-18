import { useCallback } from 'react';
import classroomBackground from '../../assets/game/red-school-classroom-v1.webp';
import corridorBackground from '../../assets/game/red-school-corridor-v1.webp';
import stairsBackground from '../../assets/game/red-school-stairs-v1.webp';
import shtrikhImage from '../../assets/game/shtrikh-yard-present-v1.webp';
import { getRedHotspots, type RedEvent, type RedLocation } from '../../game/redChapter';
import { isRedSchoolPositionWalkable, redLocationStart } from '../../game/redSchoolGeometry';
import { useRoomMovement, type RoomPosition } from '../../game/useRoomMovement';
import { InteractionPrompt } from './InteractionPrompt';
import { MovementControls } from './MovementControls';
import { PlayerAvatar } from './PlayerAvatar';

type RedLocationSceneProps = {
  isInteractive: boolean;
  foundSharpener: boolean;
  location: RedLocation;
  returning: boolean;
  showTouchControls: boolean;
  onEvent: (event: RedEvent) => void;
};

const backgrounds: Record<RedLocation, string> = {
  corridor: corridorBackground,
  stairs: stairsBackground,
  classroom: classroomBackground,
};
const names: Record<RedLocation, string> = {
  corridor: 'Школьный коридор', stairs: 'Лестничная площадка', classroom: 'Красный класс',
};
const distance = (a: RoomPosition, b: RoomPosition) => Math.hypot(a.x - b.x, a.y - b.y);

export function RedLocationScene({ isInteractive, foundSharpener, location, returning, showTouchControls, onEvent }: RedLocationSceneProps) {
  const hotspots = getRedHotspots(location, returning, foundSharpener);
  const interact = useCallback((position: RoomPosition) => {
    const target = hotspots.find((hotspot) => distance(position, hotspot.position) < 7);
    if (target) onEvent(target.event);
  }, [hotspots, onEvent]);
  const isWalkable = useCallback((position: RoomPosition) =>
    isRedSchoolPositionWalkable(location, position), [location]);
  const movement = useRoomMovement(isInteractive, interact, {
    start: redLocationStart[location], speed: 14, isWalkable,
  });
  const nearby = hotspots.find((hotspot) => distance(movement.position, hotspot.position) < 7);

  return (
    <section className={`red-location red-location--${location} ${returning ? 'is-returning' : ''}`} aria-label={names[location]}>
      <img className="red-location__background" src={backgrounds[location]} alt="" />
      <div className="red-location__shade" />
      <span className="red-location__name">Глава II · {names[location]}</span>
      {location === 'corridor' && returning &&
        <div className="erased-students" aria-hidden="true"><i /><i /><i /></div>
      }
      <img className="red-location__shtrikh" src={shtrikhImage} alt="Штрих идёт по школе рядом с героем" />
      <PlayerAvatar position={movement.position} facing={movement.facing} isMoving={movement.isMoving} />
      <InteractionPrompt position={movement.position} text={nearby?.label ?? ''} />
      {showTouchControls && <MovementControls onMoveStart={movement.startMoving} onMoveEnd={movement.stopMoving} onInteract={() => interact(movement.position)} />}
    </section>
  );
}
