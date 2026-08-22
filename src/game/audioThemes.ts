export type AmbienceMood = 'room' | 'notebook' | 'yard' | 'memory' |
  'red' | 'red-empty' | 'blue' | 'finale';

export type AudioTheme = {
  melody: number[];
  bass: number[];
  interval: number;
  duration: number;
  filter: number;
  volume: number;
  wave: OscillatorType;
};

export const audioThemes: Record<AmbienceMood, AudioTheme> = {
  room: {
    melody: [164.81, 220, 246.94, 220, 0, 196, 164.81, 196],
    bass: [82.41, 73.42], interval: 780, duration: 1.75, filter: 780, volume: .084, wave: 'triangle',
  },
  notebook: {
    melody: [146.83, 196, 233.08, 0, 220, 196, 174.61, 0],
    bass: [73.42, 65.41], interval: 850, duration: 1.9, filter: 690, volume: .08, wave: 'triangle',
  },
  yard: {
    melody: [185, 246.94, 293.66, 277.18, 246.94, 220, 246.94, 0],
    bass: [92.5, 110], interval: 680, duration: 1.45, filter: 980, volume: .088, wave: 'triangle',
  },
  memory: {
    melody: [130.81, 174.61, 196, 174.61, 0, 146.83, 164.81, 0],
    bass: [65.41, 73.42], interval: 940, duration: 2.1, filter: 620, volume: .077, wave: 'sine',
  },
  red: {
    melody: [146.83, 138.59, 164.81, 0, 146.83, 174.61, 138.59, 0],
    bass: [69.3, 65.41], interval: 900, duration: 1.8, filter: 560, volume: .079, wave: 'triangle',
  },
  'red-empty': {
    melody: [110, 0, 103.83, 0, 0, 116.54, 0, 0],
    bass: [55, 51.91], interval: 1380, duration: 2.8, filter: 390, volume: .066, wave: 'sine',
  },
  blue: {
    melody: [130.81, 0, 146.83, 130.81, 116.54, 0, 130.81, 0],
    bass: [65.41, 58.27], interval: 1030, duration: 2.35, filter: 520, volume: .075, wave: 'triangle',
  },
  finale: {
    melody: [196, 246.94, 293.66, 246.94, 220, 293.66, 329.63, 0],
    bass: [98, 110], interval: 720, duration: 1.75, filter: 900, volume: .087, wave: 'triangle',
  },
};
