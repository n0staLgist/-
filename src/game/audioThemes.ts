export type AmbienceMood = 'room' | 'notebook' | 'yard' | 'memory' |
  'red' | 'red-empty' | 'blue' | 'finale';

export type AudioTheme = {
  melody: number[];
  bass: number[];
  chordThirdRatio: number;
  interval: number;
  duration: number;
  filter: number;
  volume: number;
  wave: OscillatorType;
};

export const audioThemes: Record<AmbienceMood, AudioTheme> = {
  room: {
    melody: [220, 261.63, 293.66, 261.63, 246.94, 220, 196, 220],
    bass: [110, 98], chordThirdRatio: 2.378, interval: 780, duration: 1.75, filter: 920, volume: .105, wave: 'triangle',
  },
  notebook: {
    melody: [196, 233.08, 293.66, 261.63, 233.08, 196, 174.61, 196],
    bass: [98, 87.31], chordThirdRatio: 2.378, interval: 850, duration: 1.9, filter: 820, volume: .1, wave: 'triangle',
  },
  yard: {
    melody: [246.94, 293.66, 369.99, 329.63, 293.66, 246.94, 220, 246.94],
    bass: [123.47, 110], chordThirdRatio: 2.52, interval: 680, duration: 1.45, filter: 1180, volume: .11, wave: 'triangle',
  },
  memory: {
    melody: [174.61, 207.65, 261.63, 233.08, 207.65, 174.61, 155.56, 174.61],
    bass: [87.31, 77.78], chordThirdRatio: 2.378, interval: 940, duration: 2.1, filter: 720, volume: .096, wave: 'sine',
  },
  red: {
    melody: [196, 233.08, 293.66, 261.63, 0, 196, 174.61, 196],
    bass: [98, 87.31], chordThirdRatio: 2.378, interval: 900, duration: 1.8, filter: 720, volume: .1, wave: 'triangle',
  },
  'red-empty': {
    melody: [146.83, 174.61, 220, 196, 0, 146.83, 130.81, 0],
    bass: [73.42, 65.41], chordThirdRatio: 2.378, interval: 1220, duration: 2.6, filter: 560, volume: .088, wave: 'sine',
  },
  blue: {
    melody: [164.81, 196, 246.94, 220, 196, 164.81, 146.83, 164.81],
    bass: [82.41, 73.42], chordThirdRatio: 2.378, interval: 1030, duration: 2.35, filter: 650, volume: .096, wave: 'triangle',
  },
  finale: {
    melody: [220, 261.63, 329.63, 293.66, 261.63, 220, 196, 220],
    bass: [110, 98], chordThirdRatio: 2.52, interval: 720, duration: 1.75, filter: 1100, volume: .112, wave: 'triangle',
  },
};
