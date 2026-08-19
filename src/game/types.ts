export type RoomItem = 'cassette' | 'photo' | 'diary';

export type YardTask = 'swing' | 'hopscotch' | 'window';

export type ControlsMode = 'desktop' | 'touch';

export type GameSetup = {
  controlsMode: ControlsMode;
  playerName: string;
};

export type DialogueLine = {
  speaker?: string;
  text: string;
  portrait?: 'classmate-1' | 'classmate-2' | 'classmate-3';
};

export type StoryScene = {
  label: string;
  title: string;
  text: string;
  speaker: string;
  dialogue: string;
  action: string;
};
