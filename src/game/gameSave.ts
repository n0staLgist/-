import type { ControlsMode, GameSetup } from './types';

export type ChapterNumber = 1 | 2 | 3;

type GameSave = GameSetup & { unlockedChapter: ChapterNumber };

const SAVE_KEY = 'do-zavtra-save-v1';
const DEFAULT_SAVE: GameSave = { controlsMode: 'desktop', playerName: '', unlockedChapter: 1 };

export function loadGameSave(): GameSave {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? '') as Partial<GameSave>;
    const controlsMode: ControlsMode = saved.controlsMode === 'touch' ? 'touch' : 'desktop';
    const unlockedChapter = saved.unlockedChapter === 3 ? 3 : saved.unlockedChapter === 2 ? 2 : 1;
    return { controlsMode, unlockedChapter, playerName: typeof saved.playerName === 'string' ? saved.playerName.slice(0, 18) : '' };
  } catch {
    return DEFAULT_SAVE;
  }
}

export function saveGameSetup(setup: GameSetup) {
  const current = loadGameSave();
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...setup, unlockedChapter: current.unlockedChapter }));
}

export function unlockChapter(chapter: ChapterNumber) {
  const current = loadGameSave();
  const unlockedChapter = Math.max(current.unlockedChapter, chapter) as ChapterNumber;
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...current, unlockedChapter }));
}
