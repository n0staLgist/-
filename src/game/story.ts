import type { DialogueLine, RoomItem, YardTask } from './types';

export const roomItems: Record<RoomItem, { label: string; memory: string }> = {
  cassette: {
    label: 'Кассета',
    memory: 'Папа записал её с радио. Между песнями всё ещё слышен голос ведущего.',
  },
  photo: {
    label: 'Фотография',
    memory: 'Наш двор. Лето. Никто ещё не знает, что оно станет последним здесь.',
  },
  diary: {
    label: 'Дневник',
    memory: 'Тройка по алгебре, пятёрка по рисованию и высохший лист между страницами.',
  },
};

export const introLines: DialogueLine[] = [
  { speaker: 'Мама, из коридора', text: 'Разбери, пожалуйста, последний ящик. Завтра переезжаем.' },
  { speaker: 'Ая', text: 'Посмотришь, что я нарисовала?' },
  { speaker: 'Ты', text: 'Сейчас не могу. Давай потом.' },
  { speaker: 'Ая', text: 'Завтра?' },
  { speaker: 'Ты', text: 'Завтра. Обещаю.' },
];

export const notebookLines: DialogueLine[] = [
  { speaker: 'Ты', text: 'Штрих… что с тобой?' },
  { speaker: 'Штрих', text: 'Сегодня уже завтра?' },
  { speaker: 'Ты', text: 'У тебя… слёзы.' },
  { speaker: 'Штрих', text: 'Потом. Сначала пойдём во двор. Там пропал первый цвет.' },
];

export const taskCopy: Record<YardTask, { title: string; hint: string; memory: DialogueLine[] }> = {
  swing: {
    title: 'Вернуть качели',
    hint: 'Проведи карандашом по пунктирной верёвке.',
    memory: [
      { speaker: 'Штрих', text: 'Ты толкал их так сильно, будто хотел долететь до крыши.' },
      { speaker: 'Голос из окна', text: 'Уже темно! Завтра доиграешь!' },
    ],
  },
  hopscotch: {
    title: 'Раскрасить классики',
    hint: 'Нажми на выцветшие клетки по очереди.',
    memory: [
      { speaker: 'Ты', text: 'Мы рисовали мелом целые города. Дождь смывал их за одну ночь.' },
      { speaker: 'Штрих', text: 'Но утром вы всегда начинали снова.' },
    ],
  },
  window: {
    title: 'Зажечь свет',
    hint: 'Найди тёмное окно и верни ему тепло.',
    memory: [
      { speaker: 'Ты', text: 'На кухне горел свет. Мама готовила ужин, а по радио играла тихая песня.' },
      { speaker: 'Штрих', text: 'Вот почему жёлтый — первый цвет. Это цвет дома.' },
    ],
  },
};

export const endingLines: DialogueLine[] = [
  { speaker: 'Штрих', text: 'Двор снова тёплый. Но здесь есть то, что ты не дорисовал.' },
  { speaker: 'Ты', text: 'Что именно?' },
  { speaker: 'Штрих', text: 'Нас — завтра.' },
  { text: 'Первый цвет вернулся. Где-то дальше шелестит следующая страница.' },
];
