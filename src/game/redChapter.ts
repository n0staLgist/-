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
  { text: 'Жёлтая страница липнет к пальцам. Под ней — школа, в которой звонок уже прозвенел.' },
  { speaker: 'Штрих', text: 'Последняя парта на месте. Я сохранил её для тебя.' },
  { speaker: 'Ты', text: 'Почему у одноклассников нет лиц?' },
  { speaker: 'Штрих', text: 'Ты никогда их не рисовал. Я знаю их только по твоим рассказам.' },
  { speaker: 'Ты', text: 'Значит, я просто забыл, как они выглядели.' },
  { speaker: 'Штрих', text: 'Наверное. Тогда ты чаще смотрел в тетрадь, чем на них.' },
];

export const redReturnDialogue: DialogueLine[] = [
  { text: 'За дверью — та же школа. Одноклассники исчезли, и в коридоре слышны только твои шаги.' },
  { speaker: 'Ты', text: 'Стрелку к выходу стёрли. А красная линия в тетради осталась.' },
  { speaker: 'Штрих', text: 'Нам всё равно пора к следующей странице.' },
];

export const redEndingDialogue: DialogueLine[] = [
  { speaker: 'Ты', text: 'Ты стёр стрелку, чтобы я не нашёл выход?' },
  { text: 'Штрих подтягивает шарф к улыбке, которую нельзя спрятать.' },
  { speaker: 'Штрих', text: 'Дальше синяя страница.' },
  { speaker: 'Ты', text: 'Это опять не ответ.' },
  { speaker: 'Штрих', text: 'Если отвечу сейчас, ты можешь уйти.' },
];

export const redEventDialogue: Partial<Record<RedEvent, DialogueLine[]>> = {
  'artroom-entry': [
    { text: 'Второй класс. После ИЗО рукава до вечера пахли краской.' },
    { speaker: 'Ты', text: 'До крана я тогда доставал только на носках.' },
  ],
  notice: [
    { text: 'На стенде остались светлые прямоугольники от фотографий и табличек с именами.' },
    { speaker: 'Штрих', text: 'На переменах ты их не читал. Ты рисовал под партой.' },
  ],
  lockers: [{ text: 'Серый отпечаток ладони. Вокруг — крошки ластика, будто руку пытались убрать со стены.' }],
  'erased-exit': [
    { text: 'На полу сохранилась белая борозда. Здесь была стрелка к выходу.' },
    { speaker: 'Ты', text: 'Странно забыть именно дорогу наружу.' },
  ],
  sharpener: [
    { text: 'Большой палец сам находит скол на красной точилке.' },
    { speaker: 'Ты', text: 'На переменах я прятался здесь и рисовал.' },
    { speaker: 'Штрих', text: 'А я думал, ты приходил туда ко мне.' },
  ],
  window: [{ text: 'На белой раковине красная кайма. Запах гуаши приходит раньше воспоминания.' }],
  board: [{ text: 'Красная борозда на доске заканчивается точно над последней партой.' }],
  desks: [{ text: 'Стулья отодвинуты, будто звонок прозвенел секунду назад.' }],
  companion: [
    { speaker: 'Ты', text: 'Ты всё время ходил здесь один?' },
    { speaker: 'Штрих', text: 'Когда ты рисовал школу, я был здесь. Когда рисовал двор — во дворе. Больше мне некуда было идти.' },
  ],
  'classmate-1': [
    { speaker: 'Одноклассница', portrait: 'classmate-1', text: 'Опять с этой тетрадью?' },
    { speaker: 'Ты', text: 'Она просто лежит в рюкзаке.' },
    { speaker: 'Одноклассница', portrait: 'classmate-1', text: 'Ага. Поэтому ты её сразу закрыл.' },
  ],
  'classmate-2': [{ speaker: 'Одноклассник', portrait: 'classmate-2', text: 'Из ИЗО опять тянет гуашью. У тебя даже рукава красные.' }],
  'classmate-3': [
    { text: 'Карандаш перестаёт стучать по рукаву, когда ты подходишь.' },
    { speaker: 'Одноклассник', portrait: 'classmate-3', text: 'Я не смотрел. Ты сам так быстро закрыл.' },
  ],
};

const commonHotspots: RedHotspot[] = [
  { event: 'notice', label: 'Осмотреть стенд', position: { x: 65, y: 66 }, priority: 10, reach: 7 },
  { event: 'lockers', label: 'Осмотреть шкафчики', position: { x: 31, y: 68 }, priority: 10, reach: 7 },
  { event: 'erased-exit', label: 'Осмотреть стёртую стрелку', position: { x: 91, y: 70 }, priority: 20, reach: 7.5 },
  { event: 'window', label: 'Осмотреть раковину', position: { x: 5, y: 63 }, priority: 10, reach: 8 },
  { event: 'board', label: 'Осмотреть доску', position: { x: 77, y: 16 }, priority: 10, reach: 8.5 },
  { event: 'desks', label: 'Осмотреть парты', position: { x: 76, y: 39 }, priority: 10, reach: 7 },
  { event: 'last-desk', label: 'Открыть тетрадь', position: { x: 91, y: 52 }, priority: 30, reach: 8 },
  { event: 'companion', label: 'Поговорить со Штрихом', position: { x: 72, y: 73 }, priority: 22, reach: 7 },
  { event: 'classmate-1', label: 'Заговорить', position: { x: 42, y: 86 }, priority: 20, reach: 8 },
  { event: 'classmate-2', label: 'Заговорить', position: { x: 61, y: 85 }, priority: 20, reach: 8 },
  { event: 'classmate-3', label: 'Прислушаться', position: { x: 84, y: 84 }, priority: 20, reach: 8 },
];

const sharpenerHotspot: RedHotspot = {
  event: 'sharpener', label: 'Взять красную точилку', position: { x: 11.5, y: 69 }, priority: 35, reach: 8,
};
const returningHotspots: RedHotspot[] = commonHotspots
  .filter(({ event }) => event !== 'companion' && !event.startsWith('classmate'))
  .concat({ event: 'shtrikh', label: 'Поговорить со Штрихом', position: { x: 54, y: 76 }, priority: 30, reach: 8 });

export const getRedHotspots = (returning: boolean, foundSharpener: boolean) => returning
  ? returningHotspots
  : foundSharpener ? commonHotspots : [...commonHotspots, sharpenerHotspot];
