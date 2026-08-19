import type { DialogueLine } from './types';
import type { RoomPosition } from './useRoomMovement';

export type RedEvent = 'notice' | 'lockers' | 'erased-exit' | 'artroom-entry' | 'sharpener' | 'window' |
  'board' | 'desks' | 'last-desk' | 'companion' | 'shtrikh' |
  'classmate-1' | 'classmate-2' | 'classmate-3';

export type RedHotspot = {
  event: RedEvent;
  label: string;
  position: RoomPosition;
  priority: number;
  reach: number;
};

export const redChapterIntro: DialogueLine[] = [
  { text: 'Жёлтая страница переворачивается сама. Под ней — школа после звонка.' },
  { speaker: 'Штрих', text: 'Последняя парта всё ещё там. Я ничего не трогал.' },
  { speaker: 'Ты', text: 'Кроме лиц.' },
  { speaker: 'Штрих', text: 'Ты сам их не запомнил.' },
];

export const redReturnDialogue: DialogueLine[] = [
  { text: 'Ты выходишь из класса в ту же школу. Теперь затёртые места видны отчётливее.' },
  { speaker: 'Ты', text: 'Эти следы появились раньше красной линии.' },
  { speaker: 'Штрих', text: 'Ты уже вспомнил главное. Зачем снова смотреть на выход?' },
];

export const redEndingDialogue: DialogueLine[] = [
  { speaker: 'Ты', text: 'Потому что кто-то очень старательно его стирал.' },
  { text: 'Штрих поправляет шарф. Его ровная улыбка впервые кажется выученной.' },
  { speaker: 'Штрих', text: 'Синяя комната всё объяснит.' },
  { speaker: 'Ты', text: 'Ты всё время говоришь это про следующую страницу.' },
  { speaker: 'Штрих', text: 'А ты всё-таки идёшь.' },
];

export const redEventDialogue: Partial<Record<RedEvent, DialogueLine[]>> = {
  'artroom-entry': [
    { speaker: 'Ты', text: 'Я был здесь во втором классе.' },
    { text: 'До крана тогда получалось дотянуться только на носках.' },
    { speaker: 'Ты', text: 'А рукава всё равно были мокрыми.' },
  ],
  notice: [
    { text: 'На стенде остались светлые прямоугольники от объявлений. Ни одной фамилии.' },
    { speaker: 'Штрих', text: 'Ты никогда их не читал. Пойдём дальше?' },
  ],
  lockers: [{ text: 'В шкафчике — серый отпечаток ладони и крошки от ластика.' }],
  'erased-exit': [
    { text: 'На полу сохранилась белая борозда. Здесь была стрелка к выходу.' },
    { speaker: 'Ты', text: 'Странно забыть именно дорогу наружу.' },
  ],
  sharpener: [
    { text: 'Красная точилка со сколом. Ты узнаёшь её раньше, чем вспоминаешь кабинет.' },
    { speaker: 'Ты', text: 'Я сидел здесь на переменах и рисовал, пока все были внизу.' },
    { speaker: 'Штрих', text: 'Не прятался. Мы просто рисовали вдвоём.' },
  ],
  window: [{ text: 'В раковине засохла красная вода. Ты помнишь запах гуаши раньше, чем лица вокруг.' }],
  board: [{ text: 'Красная борозда на доске заканчивается точно над последней партой.' }],
  desks: [{ text: 'Стулья отодвинуты, будто звонок прозвенел секунду назад.' }],
  companion: [
    { speaker: 'Ты', text: 'Ты всё время ходил здесь один?' },
    { speaker: 'Штрих', text: 'Нет. Я ходил там, где ты меня оставлял.' },
  ],
  'classmate-1': [
    { speaker: 'Одноклассница', text: 'Ты опять носишь эту тетрадь с собой?' },
    { speaker: 'Ты', text: 'Она просто лежит в рюкзаке.' },
    { speaker: 'Одноклассница', text: 'Ты всегда говоришь «просто», когда не хочешь отвечать.' },
  ],
  'classmate-2': [{ speaker: 'Одноклассник', text: 'В ИЗО опять пахнет водой из-под красок. Я оставил дверь открытой.' }],
  'classmate-3': [
    { text: 'Карандаш перестаёт стучать по рукаву, когда ты подходишь.' },
    { speaker: 'Одноклассник', text: 'Если не хочешь показывать рисунок — я не буду смотреть.' },
  ],
};

const commonHotspots: RedHotspot[] = [
  { event: 'notice', label: 'Осмотреть стенд', position: { x: 65, y: 66 }, priority: 10, reach: 5 },
  { event: 'lockers', label: 'Осмотреть шкафчики', position: { x: 31, y: 68 }, priority: 10, reach: 5 },
  { event: 'erased-exit', label: 'Осмотреть стёртую стрелку', position: { x: 91, y: 70 }, priority: 20, reach: 5 },
  { event: 'window', label: 'Осмотреть раковину', position: { x: 5, y: 63 }, priority: 10, reach: 5 },
  { event: 'board', label: 'Осмотреть доску', position: { x: 77, y: 16 }, priority: 10, reach: 6.5 },
  { event: 'desks', label: 'Осмотреть парты', position: { x: 76, y: 39 }, priority: 10, reach: 5 },
  { event: 'last-desk', label: 'Открыть тетрадь', position: { x: 91, y: 52 }, priority: 30, reach: 5.5 },
  { event: 'companion', label: 'Поговорить со Штрихом', position: { x: 72, y: 73 }, priority: 22, reach: 5 },
  { event: 'classmate-1', label: 'Заговорить', position: { x: 42, y: 76 }, priority: 20, reach: 5 },
  { event: 'classmate-2', label: 'Заговорить', position: { x: 61, y: 78 }, priority: 20, reach: 5 },
  { event: 'classmate-3', label: 'Прислушаться', position: { x: 84, y: 71 }, priority: 20, reach: 5 },
];

const sharpenerHotspot: RedHotspot = {
  event: 'sharpener', label: 'Взять красную точилку', position: { x: 11.5, y: 69 }, priority: 35, reach: 5.5,
};
const returningHotspots: RedHotspot[] = commonHotspots
  .filter(({ event }) => event !== 'companion' && !event.startsWith('classmate'))
  .concat({ event: 'shtrikh', label: 'Поговорить со Штрихом', position: { x: 54, y: 76 }, priority: 30, reach: 5 });

export const getRedHotspots = (returning: boolean, foundSharpener: boolean) => returning
  ? returningHotspots
  : foundSharpener ? commonHotspots : [...commonHotspots, sharpenerHotspot];
