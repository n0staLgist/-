import type { DialogueLine } from './types';
import { audioThemes, type AmbienceMood, type AudioTheme } from './audioThemes';

export type { AmbienceMood } from './audioThemes';
export type FootstepSurface = 'room' | 'yard' | 'school' | 'blue';

let context: AudioContext | null = null;
let master: GainNode | null = null;
let effectsMaster: GainNode | null = null;
let melodyTimer: number | null = null;
let effectsEnabled = true;
let ambienceSilenced = false;
let musicVolume = .9;
let effectsVolume = .9;
let currentMood: AmbienceMood = 'room';
let noteIndex = 0;
let footstepIndex = 0;

const MUSIC_GAIN = .88;
const getMusicGain = () => musicVolume === 0
  ? .0001
  : MUSIC_GAIN * Math.pow(musicVolume, .55);

const getAudioContext = () => {
  if (!context || context.state === 'closed') context = new AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
};

const getEffectsOutput = () => {
  const audioContext = getAudioContext();
  if (!effectsMaster) {
    effectsMaster = audioContext.createGain();
    effectsMaster.gain.value = effectsVolume;
    effectsMaster.connect(audioContext.destination);
  }
  return effectsMaster;
};

export function setMusicVolume(volume: number) {
  musicVolume = Math.max(0, Math.min(1, volume));
  if (context && master) master.gain.setTargetAtTime(effectsEnabled && !ambienceSilenced ? getMusicGain() : .0001, context.currentTime, .05);
}

export function setEffectsVolume(volume: number) {
  effectsVolume = Math.max(0, Math.min(1, volume));
  if (context && effectsMaster) effectsMaster.gain.setTargetAtTime(effectsEnabled ? effectsVolume : .0001, context.currentTime, .05);
}

const playThemeVoice = (theme: AudioTheme, frequency: number, volume: number,
  duration: number, startDelay = 0, wave = theme.wave) => {
  if (!context || !master) return;
  const now = context.currentTime + startDelay;
  const tone = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  tone.type = wave;
  tone.frequency.setValueAtTime(frequency, now);
  tone.frequency.exponentialRampToValueAtTime(frequency * .997, now + duration * .82);
  filter.type = 'lowpass';
  filter.frequency.value = theme.filter;
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + .055);
  gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
  tone.connect(filter).connect(gain).connect(master);
  tone.start(now);
  tone.stop(now + duration + .05);
};

const playMusicNote = () => {
  if (!effectsEnabled || !context || !master) return;
  const theme = audioThemes[currentMood];
  const step = noteIndex;
  const frequency = theme.melody[step % theme.melody.length];
  noteIndex += 1;
  if (step % 4 === 0) {
    const bass = theme.bass[Math.floor(step / 4) % theme.bass.length];
    playThemeVoice(theme, bass, theme.volume * .52, theme.duration * 2.4, 0, 'sine');
    playThemeVoice(theme, bass * 2, theme.volume * .16, theme.duration * 2.7, 0, 'sine');
    playThemeVoice(theme, bass * theme.chordThirdRatio, theme.volume * .12, theme.duration * 2.7, .04, 'sine');
    playThemeVoice(theme, bass * 3, theme.volume * .09, theme.duration * 2.55, .08, 'sine');
  }
  if (!frequency) return;
  const emphasis = step % 8 === 0 ? 1.12 : 1;
  playThemeVoice(theme, frequency, theme.volume * emphasis, theme.duration);
  playThemeVoice(theme, frequency, theme.volume * .22, theme.duration * .9, .2, 'sine');
  playThemeVoice(theme, frequency * 2, theme.volume * .14, theme.duration * .72, .045, 'sine');
};

const rebuildMusic = () => {
  if (!context || !master) return;
  if (melodyTimer !== null) window.clearInterval(melodyTimer);
  noteIndex = 0;
  melodyTimer = window.setInterval(playMusicNote, audioThemes[currentMood].interval);
  window.setTimeout(playMusicNote, 180);
};

export function startAmbience(mood: AmbienceMood = currentMood) {
  currentMood = mood;
  const audioContext = getAudioContext();
  if (master) return;
  master = audioContext.createGain();
  master.gain.setValueAtTime(.0001, audioContext.currentTime);
  master.gain.exponentialRampToValueAtTime(ambienceSilenced ? .0001 : getMusicGain(), audioContext.currentTime + 1.2);
  master.connect(audioContext.destination);
  rebuildMusic();
}

export function setAmbienceMood(mood: AmbienceMood) {
  if (mood === currentMood) return;
  currentMood = mood;
  rebuildMusic();
}

export function setAmbienceEnabled(enabled: boolean) {
  effectsEnabled = enabled;
  if (!context || !master) {
    if (enabled) startAmbience();
    return;
  }
  const now = context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(Math.max(master.gain.value, .0001), now);
  master.gain.exponentialRampToValueAtTime(enabled && !ambienceSilenced ? getMusicGain() : .0001, now + .45);
  if (effectsMaster) effectsMaster.gain.setTargetAtTime(enabled ? effectsVolume : .0001, now, .05);
}

export function silenceAmbience(duration = .7) {
  ambienceSilenced = true;
  if (!context || !master) return;
  const now = context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(Math.max(master.gain.value, .0001), now);
  master.gain.exponentialRampToValueAtTime(.0001, now + duration);
}

export function restoreAmbience(duration = 1.2) {
  ambienceSilenced = false;
  if (!effectsEnabled || !context || !master) return;
  const now = context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(Math.max(master.gain.value, .0001), now);
  master.gain.exponentialRampToValueAtTime(getMusicGain(), now + duration);
}

export function stopAmbience() {
  if (melodyTimer !== null) window.clearInterval(melodyTimer);
  melodyTimer = null;
  void context?.close();
  context = null;
  master = null;
  effectsMaster = null;
}

const voiceFrequency = (speaker?: string) => {
  if (!speaker) return 245;
  if (speaker.includes('Ая')) return 515;
  if (speaker.includes('Штрих')) return 285;
  if (speaker.includes('Мама') || speaker.includes('Голос')) return 330;
  if (speaker.includes('Ты')) return 405;
  return 360;
};

export function playWritingTick(speaker?: string, kind?: DialogueLine['kind']) {
  if (!effectsEnabled) return;
  const audioContext = getAudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const now = audioContext.currentTime;
  const isClassmate = speaker?.includes('Однокласс') ?? false;
  const isThought = kind === 'thought';
  oscillator.type = isClassmate ? 'square' : speaker?.includes('Штрих') ? 'triangle' : 'sine';
  const baseFrequency = isThought ? 190 : voiceFrequency(speaker);
  oscillator.frequency.setValueAtTime(baseFrequency + Math.random() * (isClassmate ? 34 : 18), now);
  oscillator.frequency.exponentialRampToValueAtTime(baseFrequency * (isThought ? .72 : .92), now + .055);
  filter.type = 'lowpass';
  filter.frequency.value = isClassmate ? 720 : isThought ? 480 : 1150;
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(isClassmate ? .045 : isThought ? .027 : .07, now + .008);
  gain.gain.exponentialRampToValueAtTime(.0001, now + .065);
  oscillator.connect(filter).connect(gain).connect(getEffectsOutput());
  oscillator.start();
  oscillator.stop(now + .07);
}

const footstepSound: Record<FootstepSurface, { frequency: number; volume: number }> = {
  room: { frequency: 260, volume: .105 },
  yard: { frequency: 720, volume: .12 },
  school: { frequency: 930, volume: .115 },
  blue: { frequency: 180, volume: .09 },
};

export function playFootstep(surface: FootstepSurface) {
  if (!effectsEnabled) return;
  const audioContext = getAudioContext();
  const settings = footstepSound[surface];
  const duration = surface === 'school' ? .095 : .075;
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  footstepIndex += 1;
  for (let index = 0; index < samples.length; index += 1) {
    const decay = Math.pow(1 - index / samples.length, 2.8);
    samples[index] = (Math.random() * 2 - 1) * decay;
  }
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  filter.type = 'bandpass';
  filter.frequency.value = settings.frequency * (footstepIndex % 2 === 0 ? .92 : 1.06);
  filter.Q.value = surface === 'school' ? 1.4 : .8;
  gain.gain.value = settings.volume;
  source.buffer = buffer;
  source.connect(filter).connect(gain).connect(getEffectsOutput());
  source.start();
}

export function playPageTurn() {
  if (!effectsEnabled) return;
  const audioContext = getAudioContext();
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * .18, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) samples[index] = (Math.random() * 2 - 1) * (1 - index / samples.length);
  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  gain.gain.value = .11;
  source.buffer = buffer;
  source.connect(gain).connect(getEffectsOutput());
  source.start();
}

export function playPaperCrack() {
  if (!effectsEnabled) return;
  const audioContext = getAudioContext();
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * .42, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    const decay = Math.pow(1 - index / samples.length, 2.4);
    const snap = index < audioContext.sampleRate * .035 ? 1 : .38;
    samples[index] = (Math.random() * 2 - 1) * decay * snap;
  }
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  filter.type = 'bandpass';
  filter.frequency.value = 920;
  filter.Q.value = .7;
  gain.gain.value = .28;
  source.buffer = buffer;
  source.connect(filter).connect(gain).connect(getEffectsOutput());
  source.start();
}

const playPaperNoise = (duration: number, frequency: number, volume: number) => {
  if (!effectsEnabled) return;
  const audioContext = getAudioContext();
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    const envelope = Math.sin(Math.PI * index / samples.length);
    samples[index] = (Math.random() * 2 - 1) * envelope;
  }
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  filter.type = 'bandpass';
  filter.frequency.value = frequency;
  filter.Q.value = 1.1;
  gain.gain.value = volume;
  source.buffer = buffer;
  source.connect(filter).connect(gain).connect(getEffectsOutput());
  source.start();
};

export function playPaperTool(kind: 'erase' | 'draw') {
  playPaperNoise(kind === 'erase' ? .16 : .09, kind === 'erase' ? 540 : 1450, kind === 'erase' ? .15 : .095);
}

export function playInkShift() {
  playPaperNoise(.48, 330, .13);
}

export function playPencilHandoff() {
  playPaperNoise(.12, 1200, .11);
  if (!effectsEnabled) return;
  const audioContext = getAudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(420, now);
  oscillator.frequency.exponentialRampToValueAtTime(260, now + .18);
  gain.gain.setValueAtTime(.05, now);
  gain.gain.exponentialRampToValueAtTime(.0001, now + .2);
  oscillator.connect(gain).connect(getEffectsOutput());
  oscillator.start(now);
  oscillator.stop(now + .21);
}

export function playColorConvergence() {
  if (!effectsEnabled) return;
  const audioContext = getAudioContext();
  [196, 246.94, 293.66].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime + index * .18;
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.052, now + .12);
    gain.gain.exponentialRampToValueAtTime(.0001, now + 1.4);
    oscillator.connect(gain).connect(getEffectsOutput());
    oscillator.start(now);
    oscillator.stop(now + 1.45);
  });
}
