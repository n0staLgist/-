import type { DialogueLine } from './types';
import type { RoomPosition } from './useRoomMovement';

export type BlueClue = 'window' | 'marks' | 'boxes' | 'door';

export const blueIntro: DialogueLine[] = [
  { text: 'Синяя страница раскрывается не вперёд, а вглубь. Под ногами — твоя комната. Только стены забыли, где им заканчиваться.' },
  { speaker: 'Ты', text: 'Это моя комната.' },
  { speaker: 'Штрих', text: 'Нет. У твоей была дверь.' },
  { speaker: 'Штрих', text: 'Осмотримся? Здесь осталось всё важное.' },
];

export const blueClues: Record<BlueClue, {
  label: string;
  position: RoomPosition;
  dialogue: DialogueLine[];
}> = {
  window: {
    label: 'Пустое окно',
    position: { x: 20, y: 29 },
    dialogue: [
      { text: 'За рамой нет ни двора, ни неба. Только обратная сторона листа.' },
      { speaker: 'Ты', text: 'За ним ничего.' },
      { speaker: 'Штрих', text: 'Так было тише ждать.' },
      { speaker: 'Ты', kind: 'thought', text: 'Он говорит это как удобство. Не как наказание.' },
    ],
  },
  marks: {
    label: 'Зарубки на стене',
    position: { x: 73, y: 39 },
    dialogue: [
      { speaker: 'Ты', text: 'Ты считал дни?' },
      { speaker: 'Штрих', text: 'Сначала — дни. Потом слово.' },
      { speaker: 'Ты', text: 'Какое?' },
      { speaker: 'Штрих', text: 'Ты и так его знаешь.' },
    ],
  },
  boxes: {
    label: 'Открытые коробки',
    position: { x: 35, y: 74 },
    dialogue: [
      { text: 'Коробки пусты. На дне каждой — детский рисунок, стёртый до мягкой серой пыли.' },
      { speaker: 'Ты', text: 'Ты складывал их сюда?' },
      { speaker: 'Штрих', text: 'Я освобождал место. Ты ведь всё собирался вернуться.' },
    ],
  },
  door: {
    label: 'Зачёркнутая дверь',
    position: { x: 81, y: 75 },
    dialogue: [
      { speaker: 'Ты', text: 'Ты зачеркнул выход.' },
      { speaker: 'Штрих', text: 'Он всё время уводил тебя.' },
      { speaker: 'Ты', text: 'Это не ответ.' },
      { speaker: 'Штрих', text: 'Тогда не спрашивай так, будто уже простил.' },
    ],
  },
};

export const blueSecondClue: DialogueLine[] = [
  { text: 'Когда ты оборачиваешься, Штрих стоит уже не там. Теперь он между тобой и дверью.' },
];

export const blueThirdClue: DialogueLine[] = [
  { speaker: 'Ты', text: 'Здесь нет следов чудовища.' },
  { speaker: 'Штрих', text: 'Я старался, чтобы следов не осталось.' },
];

export const blueTruth: DialogueLine[] = [
  { speaker: 'Штрих', text: 'Ладно. Никто не крал цвета. Я придумал его.' },
  { speaker: 'Ты', text: 'А люди на страницах?' },
  { speaker: 'Штрих', text: 'Они звали тебя. Я сделал их тише.' },
  { speaker: 'Ты', text: 'Ты их стёр.' },
  { speaker: 'Штрих', text: 'Я оставил только те места, где ты оставался.' },
  { speaker: 'Ты', text: 'Штрих… две слезы.' },
  { speaker: 'Штрих', text: 'Первая — когда ты не вернулся.' },
  { speaker: 'Штрих', text: 'Вторая — сегодня. Когда ты отдал Ае моё «завтра».' },
  { speaker: 'Ты', text: 'Я не хотел снова так делать.' },
  { speaker: 'Штрих', text: 'Я знаю. От этого ждать не стало короче.' },
  { speaker: 'Штрих', text: 'Останься. Я нарисую нам столько завтра, сколько захочешь.' },
  { speaker: 'Ты', text: 'Завтра без двери — это не завтра.' },
];

export const blueRepairDialogue: DialogueLine[] = [
  { speaker: 'Ты', text: 'Я не могу остаться. Но могу закончить то, что обещал.' },
  { speaker: 'Штрих', text: 'А если завтра снова станет легче, чем сейчас?' },
  { speaker: 'Ты', text: 'Тогда Ая услышит «нет». А ты — «я ухожу». Не «завтра».' },
  { text: 'Штрих берёт карандаш новой рукой. Потом долго смотрит на свою безупречную улыбку.' },
  { speaker: 'Штрих', text: 'Эту улыбку я нарисовал сам.' },
];

export const blueClueOrder = Object.keys(blueClues) as BlueClue[];
