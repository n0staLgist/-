import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { roomItems } from '../../game/story';
import type { RoomItem } from '../../game/types';
import { selectInteractionTarget, type InteractionCandidate } from '../../game/interactionTarget';
import { useRoomMovement, type FacingDirection, type RoomPosition } from '../../game/useRoomMovement';
import { useIdleItemHint } from '../../game/useIdleItemHint';
import roomItemsSprite from '../../assets/game/room-items-v1.webp';
import { MovementControls } from './MovementControls';
import { PlayerAvatar } from './PlayerAvatar';
import { ExamineText } from './ExamineText';
import { HintButton } from './HintButton';
import { InteractionPrompt } from './InteractionPrompt';
import { RoomChecklist } from './RoomChecklist';
import '../../styles/roomHud.css';

type RoomSceneProps = {
  packed: RoomItem[];
  isInteractive?: boolean;
  showTouchControls: boolean;
  onInspectItem: (item: RoomItem) => void;
  onNotebook: () => void;
};

const itemPositions: Record<RoomItem, RoomPosition> = {
  cassette: { x: 26, y: 80 }, photo: { x: 14, y: 40 }, diary: { x: 72, y: 53 },
};
const itemSpritePositions: Record<RoomItem, string> = {
  cassette: '0%', photo: '50%', diary: '100%',
};
type ItemStyle = CSSProperties & {
  '--item-sprite': string;
  '--item-sprite-position': string;
};
const notebookPosition: RoomPosition = { x: 47, y: 42 };
const roomDetails = [
  { position: { x: 13, y: 52 }, text: 'Одна раскрытая коробка. Пока почти пустая.' },
  { position: { x: 75, y: 40 }, text: 'Три коробки с вещами. Будто половина комнаты уже уехала без тебя.' },
  { position: { x: 14, y: 40 }, text: 'Батарея ещё тёплая. В новой квартире такой не будет.' },
  { position: { x: 35, y: 51 }, text: 'Старый стол. Следы карандаша не отмылись даже перед переездом.' },
  { position: { x: 5, y: 40 }, text: 'За окном темно. В стекле комната выглядит уже чужой.' },
  { position: { x: 27, y: 51 }, text: 'Лампа светит только на край стола. Остальная комната понемногу исчезает.' },
  { position: { x: 43, y: 51 }, text: 'Стакан с карандашами. Самый короткий всё ещё лежит остриём вверх.' },
  { position: { x: 75, y: 72 }, text: 'На полу остался светлый прямоугольник от кровати.' },
  { position: { x: 93, y: 57 }, text: 'Дверь в коридор. Ая ушла, не хлопнув ею.' },
];
const ITEM_REACH = 5;
const NOTEBOOK_REACH = 10;
const DETAIL_REACH = 5.5;
type RoomAction = { kind: 'item'; item: RoomItem } | { kind: 'notebook' } |
  { kind: 'detail'; text: string };
const roomHints: Record<RoomItem, string> = {
  photo: 'Фотография лежит у батареи, в левой части комнаты.',
  cassette: 'Кассета осталась на полу возле раскрытой коробки.',
  diary: 'Дневник лежит справа, рядом со сложенными коробками.',
};

export function RoomScene({ packed, isInteractive = true, showTouchControls, onInspectItem, onNotebook }: RoomSceneProps) {
  const [examination, setExamination] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showFirstStep, setShowFirstStep] = useState(true);
  const allPacked = packed.length === 3;
  useEffect(() => {
    if (!allPacked) return;
    setShowCompletion(true);
    const timer = window.setTimeout(() => setShowCompletion(false), 2800);
    return () => window.clearTimeout(timer);
  }, [allPacked]);
  const candidates = useMemo<InteractionCandidate<RoomAction>[]>(() => [
    ...(Object.keys(itemPositions) as RoomItem[])
      .filter((item) => !packed.includes(item))
      .map((item) => ({ id: `item-${item}`, value: { kind: 'item' as const, item },
        label: `Взять: ${roomItems[item].label}`, position: itemPositions[item], priority: 30, reach: ITEM_REACH })),
    { id: 'notebook', value: { kind: 'notebook' }, label: allPacked ? 'Взять тетрадь' : 'Осмотреть тетрадь',
      position: notebookPosition, priority: 24, reach: NOTEBOOK_REACH },
    ...roomDetails.map((detail, index) => ({ id: `detail-${index}`, value: { kind: 'detail' as const, text: detail.text },
      label: 'Осмотреть', position: detail.position, priority: 10, reach: DETAIL_REACH })),
  ], [allPacked, packed]);
  const interact = useCallback((position: RoomPosition, facing: FacingDirection) => {
    const target = selectInteractionTarget(candidates, position, facing);
    if (!target) return;
    if (target.value.kind === 'item') return onInspectItem(target.value.item);
    if (target.value.kind === 'notebook') return allPacked
      ? onNotebook()
      : setExamination('Старая тетрадь лежит на столе. Сначала стоит закончить с коробкой.');
    setExamination(target.value.text);
  }, [allPacked, candidates, onInspectItem, onNotebook]);
  const canMove = isInteractive && !examination;
  const { position, isMoving, facing, startMoving, stopMoving } = useRoomMovement(canMove, interact, {
    start: { x: 88, y: 58 },
  });
  useEffect(() => {
    if (isMoving) setShowFirstStep(false);
  }, [isMoving]);

  const target = selectInteractionTarget(candidates, position, facing);
  const nearbyItem = target?.value.kind === 'item' ? target.value.item : undefined;
  const remainingItems = (Object.keys(itemPositions) as RoomItem[]).filter((item) => !packed.includes(item));
  const hintedItem = useIdleItemHint(remainingItems, isMoving);
  const nearNotebook = target?.value.kind === 'notebook';
  const nextItem = (Object.keys(roomItems) as RoomItem[]).find((item) => !packed.includes(item));

  return (
    <section className="scene room-scene" aria-label="Комната перед переездом">
      <RoomChecklist packed={packed} />
      <HintButton hint={nextItem ? roomHints[nextItem] : 'Все вещи собраны. Теперь подойди к тетради на столе.'} />
      {showFirstStep && isInteractive && <div className="room-first-step"><strong>Осмотрись в комнате</strong><span>Иди на WASD или стрелках. Три нужные вещи слегка обведены карандашом.</span></div>}
      <div className="room-map">
        <div className="scene__shade" />
        {(Object.keys(roomItems) as RoomItem[]).map((item) => (
          <button className={`hotspot hotspot--${item} ${packed.includes(item) ? 'is-done' : ''} ${nearbyItem === item ? 'is-near' : ''} ${hintedItem === item ? 'is-hinted' : ''}`} key={item} style={{ left: `${itemPositions[item].x}%`, top: `${itemPositions[item].y}%`, '--item-sprite': `url(${roomItemsSprite})`, '--item-sprite-position': itemSpritePositions[item] } as ItemStyle} onClick={() => onInspectItem(item)} disabled={packed.includes(item) || !isInteractive || nearbyItem !== item}>
            <i aria-hidden="true" />
            <span>{roomItems[item].label}</span>
          </button>
        ))}
        <div className="packed-box-items" aria-label={`В коробке предметов: ${packed.length}`}>
          {packed.map((item, index) => <i className={`packed-box-item packed-box-item--${index}`} key={item} style={{ '--item-sprite': `url(${roomItemsSprite})`, '--item-sprite-position': itemSpritePositions[item] } as ItemStyle} />)}
        </div>
        <button className={`notebook-hotspot ${nearNotebook ? 'is-near' : ''}`} onClick={onNotebook} disabled={!allPacked || !nearNotebook}>Открыть тетрадь</button>
        {isInteractive && <>
          <PlayerAvatar position={position} facing={facing} isMoving={isMoving} />
          <InteractionPrompt position={target?.position ?? position} text={target?.label ?? ''} />
          {showTouchControls && <MovementControls onMoveStart={startMoving} onMoveEnd={stopMoving} onInteract={() => interact(position, facing)} />}
        </>}
        {examination && <ExamineText text={examination} onClose={() => setExamination(null)} />}
      </div>
      {showCompletion && <div className="quest-complete"><small>Задание выполнено</small><strong>Последняя коробка собрана</strong><span>Теперь можно открыть тетрадь на столе.</span></div>}
    </section>
  );
}
