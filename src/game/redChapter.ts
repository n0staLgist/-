import type { DialogueLine } from './types';
import type { RoomPosition } from './useRoomMovement';

export type RedLocation = 'corridor' | 'stairs' | 'classroom';
export type RedEvent = 'stairs' | 'corridor' | 'classroom' | 'notice' | 'lockers' |
  'erased-exit' | 'sharpener' | 'window' | 'chalk' | 'board' | 'desks' | 'last-desk' | 'companion' | 'shtrikh';

export type RedHotspot = {
  event: RedEvent;
  label: string;
  position: RoomPosition;
};

export const redChapterIntro: DialogueLine[] = [
  { text: 'Жёлтая страница переворачивается сама. Под ней — школьный коридор после звонка.' },
  { speaker: 'Штрих', text: 'Последняя парта всё ещё там. Я ничего не трогал.' },
  { speaker: 'Ты', text: 'В этом коридоре даже выхода нет.' },
  { speaker: 'Штрих', text: 'Зато класс на месте.' },
];

export const redReturnDialogue: DialogueLine[] = [
  { text: 'Коридор встречает тебя той же тишиной. Теперь затёртые места видны отчётливее.' },
  { speaker: 'Ты', text: 'Эти следы были здесь до того, как я перечеркнул рисунок.' },
  { speaker: 'Штрих', text: 'Ты уже вспомнил главное. Зачем снова смотреть на двери?' },
];

export const redEndingDialogue: DialogueLine[] = [
  { speaker: 'Ты', text: 'Потому что кто-то очень старательно их стирал.' },
  { text: 'Штрих поправляет шарф. Его ровная улыбка впервые кажется не доброй, а выученной.' },
  { speaker: 'Штрих', text: 'Синяя комната всё объяснит.' },
  { speaker: 'Ты', text: 'Ты всё время говоришь это про следующую страницу.' },
  { speaker: 'Штрих', text: 'А ты всё-таки идёшь.' },
];

export const redEventDialogue: Partial<Record<RedEvent, DialogueLine[]>> = {
  notice: [
    { text: 'Под кнопками и объявлениями остались прямоугольники более светлой бумаги. Ни одного имени.' },
    { speaker: 'Ты', text: 'Ты и стенд решил обезличить?' },
    { speaker: 'Штрих', text: 'Это просто фон. Ты никогда его не читал.' },
  ],
  lockers: [
    { text: 'Один шкафчик приоткрыт. Внутри — только серый отпечаток ладони и крошки от ластика.' },
    { speaker: 'Штрих', text: 'Там ничего важного.' },
  ],
  'erased-exit': [
    { text: 'На полу сохранилась белая борозда. Здесь была стрелка, направленная к выходу.' },
    { speaker: 'Ты', text: 'Странно забыть именно дорогу наружу.' },
  ],
  sharpener: [
    { text: 'На подоконнике лежит красная точилка. Ты узнаёшь скол на углу раньше, чем вспоминаешь класс.' },
    { speaker: 'Ты', text: 'Я прятался здесь на переменах и рисовал, пока все были внизу.' },
    { speaker: 'Штрих', text: 'Ты не прятался. Мы просто рисовали вдвоём.' },
  ],
  window: [{ text: 'За стеклом нет двора. Только клетчатая бумага, продавленная с другой стороны.' }],
  chalk: [{ text: 'Дом, дерево и двое рядом. Вторую фигуру кто-то почти стёр рукавом.' }],
  board: [{ text: 'Доска чистая, кроме красной борозды. Она заканчивается точно над последней партой.' }],
  desks: [{ text: 'Стулья отодвинуты, будто класс только что вышел. На сиденьях нет ни пыли, ни имён.' }],
  companion: [
    { speaker: 'Ты', text: 'Ты всё время ходил здесь один?' },
    { speaker: 'Штрих', text: 'Нет. Я ходил там, где ты меня оставлял.' },
  ],
};

const corridorHotspots: RedHotspot[] = [
  { event: 'stairs', label: 'Выйти на лестницу', position: { x: 14, y: 34 } },
  { event: 'classroom', label: 'Войти в класс', position: { x: 79, y: 34 } },
  { event: 'notice', label: 'Осмотреть стенд', position: { x: 59, y: 34 } },
  { event: 'lockers', label: 'Осмотреть шкафчики', position: { x: 90, y: 39 } },
  { event: 'erased-exit', label: 'Коснуться стёртого места', position: { x: 48, y: 52 } },
  { event: 'companion', label: 'Поговорить со Штрихом', position: { x: 72, y: 42 } },
];

const stairsHotspots: RedHotspot[] = [
  { event: 'corridor', label: 'Вернуться в коридор', position: { x: 90, y: 70 } },
  { event: 'sharpener', label: 'Взять точилку', position: { x: 59, y: 34 } },
  { event: 'window', label: 'Посмотреть в окно', position: { x: 52, y: 38 } },
  { event: 'chalk', label: 'Осмотреть рисунок', position: { x: 84, y: 45 } },
  { event: 'companion', label: 'Поговорить со Штрихом', position: { x: 72, y: 46 } },
];

const classroomHotspots: RedHotspot[] = [
  { event: 'corridor', label: 'Вернуться в коридор', position: { x: 10, y: 42 } },
  { event: 'board', label: 'Осмотреть доску', position: { x: 52, y: 28 } },
  { event: 'desks', label: 'Осмотреть пустые парты', position: { x: 58, y: 58 } },
  { event: 'last-desk', label: 'Открыть тетрадь', position: { x: 80, y: 76 } },
  { event: 'companion', label: 'Поговорить со Штрихом', position: { x: 20, y: 44 } },
];

const revisitedStairsHotspots = stairsHotspots.filter(({ event }) => event !== 'sharpener');

const returningCorridorHotspots: RedHotspot[] = [
  { event: 'stairs', label: 'Выйти на лестницу', position: { x: 14, y: 34 } },
  { event: 'notice', label: 'Осмотреть стенд', position: { x: 59, y: 34 } },
  { event: 'lockers', label: 'Осмотреть шкафчики', position: { x: 90, y: 39 } },
  { event: 'erased-exit', label: 'Коснуться стёртого места', position: { x: 38, y: 52 } },
  { event: 'shtrikh', label: 'Поговорить со Штрихом', position: { x: 52, y: 48 } },
];

export const getRedHotspots = (location: RedLocation, returning: boolean, foundSharpener: boolean) => {
  if (location === 'stairs') return foundSharpener ? revisitedStairsHotspots : stairsHotspots;
  if (location === 'classroom') return classroomHotspots;
  if (returning) return returningCorridorHotspots;
  return corridorHotspots;
};
