import { useEffect } from 'react';
import { setAmbienceMood, stopAmbience, type AmbienceMood } from './audio';
import type { GameStage } from './stage';

const stageMoods: Partial<Record<GameStage, AmbienceMood>> = {
  prologue: 'room',
  prologueExit: 'room',
  room: 'room',
  notebook: 'notebook',
  childhood: 'memory',
  meeting: 'notebook',
  yardTransition: 'notebook',
  yardIntro: 'yard',
  yard: 'yard',
  yellowReveal: 'yard',
};

export function useStageMusic(stage: GameStage) {
  useEffect(() => () => stopAmbience(), []);
  useEffect(() => {
    const mood = stageMoods[stage];
    if (mood) setAmbienceMood(mood);
  }, [stage]);
}
