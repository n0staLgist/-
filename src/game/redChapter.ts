import type { DialogueLine } from './types';
import type { RoomPosition } from './useRoomMovement';

export type RedEvent = 'notice' | 'lockers' | 'erased-exit' | 'sharpener' | 'window' |
  'board' | 'desks' | 'last-desk' | 'companion' | 'shtrikh' |
  'classmate-1' | 'classmate-2' | 'classmate-3' | 'classmate-4';

export type RedHotspot = { event: RedEvent; label: string; position: RoomPosition };

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
  window: [{ text: 'За стеклом нет двора. Только клетчатая бумага с другой стороны.' }],
  board: [{ text: 'Красная борозда на доске заканчивается точно над последней партой.' }],
  desks: [{ text: 'Стулья отодвинуты, будто звонок прозвенел секунду назад.' }],
  companion: [
    { speaker: 'Ты', text: 'Ты всё время ходил здесь один?' },
    { speaker: 'Штрих', text: 'Нет. Я ходил там, где ты меня оставлял.' },
  ],
  'classmate-1': [{ speaker: 'Одноклассница', text: 'Ты опять носишь эту тетрадь с собой?' }],
  'classmate-2': [{ speaker: 'Одноклассник', text: 'На лестнице сегодня холодно. Не сиди там весь перерыв.' }],
  'classmate-3': [{ speaker: 'Одноклассница', text: 'Если не хочешь показывать рисунок — я не буду смотреть.' }],
  'classmate-4': [{ text: 'Карандаш стучит по рукаву. Лицо не возвращается, а звук — да.' }],
};

const commonHotspots: RedHotspot[] = [
  { event: 'notice', label: 'Осмотреть стенд', position: { x: 65, y: 66 } },
  { event: 'lockers', label: 'Осмотреть шкафчики', position: { x: 31, y: 68 } },
  { event: 'erased-exit', label: 'Осмотреть стёртую стрелку', position: { x: 91, y: 70 } },
  { event: 'window', label: 'Посмотреть в окно', position: { x: 8, y: 47 } },
  { event: 'board', label: 'Осмотреть доску', position: { x: 77, y: 15 } },
  { event: 'desks', label: 'Осмотреть парты', position: { x: 76, y: 39 } },
  { event: 'last-desk', label: 'Открыть тетрадь', position: { x: 87, y: 52 } },
  { event: 'companion', label: 'Поговорить со Штрихом', position: { x: 72, y: 73 } },
  { event: 'classmate-1', label: 'Заговорить', position: { x: 40, y: 75 } },
  { event: 'classmate-2', label: 'Заговорить', position: { x: 48, y: 88 } },
  { event: 'classmate-3', label: 'Заговорить', position: { x: 61, y: 74 } },
  { event: 'classmate-4', label: 'Прислушаться', position: { x: 79, y: 85 } },
];

const sharpenerHotspot: RedHotspot = {
  event: 'sharpener', label: 'Взять красную точилку', position: { x: 5.5, y: 47 },
};
const returningHotspots: RedHotspot[] = commonHotspots
  .filter(({ event }) => event !== 'companion')
  .concat({ event: 'shtrikh', label: 'Поговорить со Штрихом', position: { x: 54, y: 76 } });

export const getRedHotspots = (returning: boolean, foundSharpener: boolean) => returning
  ? returningHotspots
  : foundSharpener ? commonHotspots : [...commonHotspots, sharpenerHotspot];
