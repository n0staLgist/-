import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import classmatesSprite from '../../assets/game/faceless-classmates-v2.webp';
import schoolMap from '../../assets/game/red-school-world-v2.webp';
import shtrikhImage from '../../assets/game/shtrikh-yard-present-v1.webp';
import { selectInteractionTarget } from '../../game/interactionTarget';
import { getRedHotspots, type RedEvent } from '../../game/redChapter';
import { getRedWorldStart, isRedSchoolPositionWalkable } from '../../game/redSchoolGeometry';
import { useRoomMovement, type FacingDirection, type RoomPosition } from '../../game/useRoomMovement';
import { InteractionPrompt } from './InteractionPrompt';
import { HintButton } from './HintButton';
import { MovementControls } from './MovementControls';
import { PlayerAvatar } from './PlayerAvatar';

type RedSchoolWorldProps = {
  foundSharpener: boolean;
  isInteractive: boolean;
  returning: boolean;
  sinkSeen: boolean;
  showTouchControls: boolean;
  onEvent: (event: RedEvent) => void;
};

const classmates = [
  { event: 'classmate-1' as const, x: 42, y: 76, frame: 0 },
  { event: 'classmate-2' as const, x: 61, y: 78, frame: 1 },
  { event: 'classmate-3' as const, x: 84, y: 71, frame: 2 },
];
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const guideDirection = (from: RoomPosition, to: RoomPosition) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
};

export function RedSchoolWorld({ foundSharpener, isInteractive, returning, sinkSeen, showTouchControls, onEvent }: RedSchoolWorldProps) {
  const [reacted, setReacted] = useState<RedEvent[]>([]);
  const enteredArtRoom = useRef(false);
  const hotspots = useMemo(() => getRedHotspots(returning, foundSharpener), [foundSharpener, returning]);
  const candidates = useMemo(() => hotspots.map((hotspot) => ({
    id: hotspot.event, value: hotspot.event, label: hotspot.label,
    position: hotspot.position, priority: hotspot.priority, reach: hotspot.reach,
  })), [hotspots]);
  const interact = useCallback((position: RoomPosition, facing: FacingDirection) => {
    const target = selectInteractionTarget(candidates, position, facing);
    if (!target) return;
    if (target.value.startsWith('classmate')) {
      setReacted((current) => current.includes(target.value) ? current : [...current, target.value]);
    }
    onEvent(target.value);
  }, [candidates, onEvent]);
  const isWalkable = useCallback((position: RoomPosition) =>
    isRedSchoolPositionWalkable(position, returning), [returning]);
  const movement = useRoomMovement(isInteractive, interact, {
    start: getRedWorldStart(returning), speed: 8.5, isWalkable,
  });
  const target = isInteractive
    ? selectInteractionTarget(candidates, movement.position, movement.facing) : null;
  const cameraX = clamp(movement.position.x, 22, 78);
  const cameraY = clamp(movement.position.y, 26, 74);
  const mapStyle: CSSProperties = { transform: `translate(-${cameraX}%, -${cameraY}%)` };
  const area = movement.position.x < 24
    ? 'Кабинет ИЗО' : movement.position.y < 59 ? 'Красный класс' : 'Школьный коридор';
  useEffect(() => {
    if (returning || area !== 'Кабинет ИЗО' || enteredArtRoom.current) return;
    enteredArtRoom.current = true;
    onEvent('artroom-entry');
  }, [area, onEvent, returning]);
  const areaClass = area === 'Кабинет ИЗО' ? 'artroom' : area === 'Красный класс' ? 'classroom' : 'corridor';
  const shtrikh = returning ? { x: 54, y: 76 } : { x: 72, y: 73 };
  const guide = returning
    ? { position: shtrikh, text: 'Штрих ждёт в опустевшем коридоре.' }
    : !sinkSeen
      ? { position: { x: 5, y: 63 }, text: 'Иди в кабинет ИЗО слева. Красный след остался у раковины.' }
      : !foundSharpener
        ? { position: { x: 11.5, y: 69 }, text: 'Красная точилка лежит на большом столе в кабинете ИЗО.' }
        : { position: { x: 91, y: 52 }, text: 'Последняя парта находится в нижнем ряду Красного класса.' };

  return (
    <section className={`red-school-world ${returning ? 'is-returning' : ''}`} aria-label={area}>
      <div className={`red-school-map red-school-map--${areaClass}`} style={mapStyle}>
        <img className="red-school-map__art" src={schoolMap} alt="" />
        {!returning && classmates.map((npc) => <i className={`faceless-classmate faceless-classmate--${npc.frame} ${reacted.includes(npc.event) ? 'has-reacted' : ''}`}
          key={npc.frame} style={{ left: `${npc.x}%`, top: `${npc.y}%`, backgroundImage: `url(${classmatesSprite})` }} />)}
        {!foundSharpener && !returning && <span className="red-sharpener" aria-label="Красная точилка" />}
        <img className="red-school-shtrikh" src={shtrikhImage} alt="Штрих идёт рядом"
          style={{ left: `${shtrikh.x}%`, top: `${shtrikh.y}%` }} />
        {returning && <div className="red-erasure" aria-hidden="true"><i /><i /><i /></div>}
        <PlayerAvatar position={movement.position} facing={movement.facing} isMoving={movement.isMoving} />
        <InteractionPrompt position={target?.position ?? movement.position} text={target?.label ?? ''} />
      </div>
      <span className="red-school-area">Глава II · {area}</span>
      {isInteractive && <HintButton hint={guide.text} direction={guideDirection(movement.position, guide.position)} />}
      {showTouchControls && <MovementControls onMoveStart={movement.startMoving}
        onMoveEnd={movement.stopMoving} onInteract={() => interact(movement.position, movement.facing)} />}
    </section>
  );
}
