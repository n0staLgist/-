import { useCallback, useMemo, type CSSProperties } from 'react';
import classmatesSprite from '../../assets/game/faceless-classmates-v1.webp';
import schoolMap from '../../assets/game/red-school-world-v1.webp';
import shtrikhImage from '../../assets/game/shtrikh-yard-present-v1.webp';
import { getRedHotspots, type RedEvent } from '../../game/redChapter';
import { getRedWorldStart, isRedSchoolPositionWalkable } from '../../game/redSchoolGeometry';
import { useRoomMovement, type RoomPosition } from '../../game/useRoomMovement';
import { InteractionPrompt } from './InteractionPrompt';
import { MovementControls } from './MovementControls';
import { PlayerAvatar } from './PlayerAvatar';

type RedSchoolWorldProps = {
  foundSharpener: boolean;
  isInteractive: boolean;
  returning: boolean;
  showTouchControls: boolean;
  onEvent: (event: RedEvent) => void;
};

const classmates = [
  { x: 40, y: 75, frame: 0 }, { x: 48, y: 88, frame: 1 },
  { x: 61, y: 74, frame: 2 }, { x: 79, y: 85, frame: 3 },
];
const distance = (a: RoomPosition, b: RoomPosition) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function RedSchoolWorld({ foundSharpener, isInteractive, returning, showTouchControls, onEvent }: RedSchoolWorldProps) {
  const hotspots = useMemo(() => getRedHotspots(returning, foundSharpener), [foundSharpener, returning]);
  const interact = useCallback((position: RoomPosition) => {
    const target = [...hotspots]
      .sort((a, b) => distance(position, a.position) - distance(position, b.position))[0];
    if (target && distance(position, target.position) < 4.4) onEvent(target.event);
  }, [hotspots, onEvent]);
  const isWalkable = useCallback((position: RoomPosition) =>
    isRedSchoolPositionWalkable(position, returning), [returning]);
  const movement = useRoomMovement(isInteractive, interact, {
    start: getRedWorldStart(returning), speed: 8.5, isWalkable,
  });
  const nearby = [...hotspots]
    .sort((a, b) => distance(movement.position, a.position) - distance(movement.position, b.position))[0];
  const prompt = isInteractive && nearby && distance(movement.position, nearby.position) < 4.4 ? nearby.label : '';
  const cameraX = clamp(movement.position.x, 22, 78);
  const cameraY = clamp(movement.position.y, 26, 74);
  const mapStyle: CSSProperties = { transform: `translate(-${cameraX}%, -${cameraY}%)` };
  const area = movement.position.x < 27 && movement.position.y < 66
    ? 'Лестничная площадка' : movement.position.y < 59 ? 'Красный класс' : 'Школьный коридор';
  const areaClass = area === 'Лестничная площадка' ? 'stairs' : area === 'Красный класс' ? 'classroom' : 'corridor';
  const shtrikh = returning ? { x: 54, y: 76 } : { x: 72, y: 73 };

  return (
    <section className={`red-school-world ${returning ? 'is-returning' : ''}`} aria-label={area}>
      <div className={`red-school-map red-school-map--${areaClass}`} style={mapStyle}>
        <img className="red-school-map__art" src={schoolMap} alt="" />
        {!returning && classmates.map((npc) => <i className={`faceless-classmate faceless-classmate--${npc.frame}`}
          key={npc.frame} style={{ left: `${npc.x}%`, top: `${npc.y}%`, backgroundImage: `url(${classmatesSprite})` }} />)}
        {!foundSharpener && !returning && <i className="red-sharpener" aria-label="Красная точилка" />}
        <img className="red-school-shtrikh" src={shtrikhImage} alt="Штрих идёт рядом"
          style={{ left: `${shtrikh.x}%`, top: `${shtrikh.y}%` }} />
        {returning && <div className="red-erasure" aria-hidden="true"><i /><i /><i /></div>}
        <PlayerAvatar position={movement.position} facing={movement.facing} isMoving={movement.isMoving} />
        <InteractionPrompt position={movement.position} text={prompt} />
      </div>
      <span className="red-school-area">Глава II · {area}</span>
      {showTouchControls && <MovementControls onMoveStart={movement.startMoving}
        onMoveEnd={movement.stopMoving} onInteract={() => interact(movement.position)} />}
    </section>
  );
}
