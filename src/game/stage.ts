export type GameStage = 'start' | 'prologue' | 'prologueExit' | 'room' | 'notebook' | 'childhood' | 'meeting' |
  'yardTransition' | 'yardIntro' | 'yard' | 'yellowReveal' | 'red' | 'redReveal' | 'blue' | 'return' | 'finale';

export const shouldShowGameHeader = (stage: GameStage) => ![
  'start', 'prologue', 'prologueExit', 'childhood', 'yardTransition', 'yellowReveal', 'redReveal',
].includes(stage);

export const getChapterTitle = (stage: GameStage) => {
  if (stage === 'red' || stage === 'redReveal') return 'Глава II · Красный класс';
  if (stage === 'blue') return 'Глава III · Синяя комната';
  if (stage === 'return' || stage === 'finale') return 'Возвращение · сегодняшний вечер';
  if (stage === 'yardIntro' || stage === 'yard' || stage === 'yellowReveal') return 'Глава I · Жёлтый двор';
  if (stage === 'notebook' || stage === 'meeting') return 'Найденная тетрадь';
  return 'Комната · сегодняшний вечер';
};
