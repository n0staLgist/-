import type { DialogueLine } from './types';
import { audioThemes, type AmbienceMood } from './audioThemes';
import { playBassVoice, playChordPad, playMelodyVoice } from './musicVoices';

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

const playMusicNote = () => {
  if (!effectsEnabled || !context || !master) return;
  const theme = audioThemes[currentMood];
  const step = noteIndex % theme.melody.length;
  const frequency = theme.melody[step % theme.melody.length];
  noteIndex += 1;
  if (step % 4 === 0) {
    const chord = theme.chords[Math.floor(step / 4) % theme.chords.length];
    const chordDuration = theme.interval / 1000 * 4.5;
    playChordPad(context, master, theme, chord, chordDuration);
    playBassVoice(context, master, theme, chord[0] / 2, chordDuration * .92);
  }
  if (frequency) playMelodyVoice(context, master, theme, frequency, theme.volume * (step % 8 === 0 ? 1.18 : 1));
  const counter = theme.counterMelody[step % theme.counterMelody.length];
  if (counter) playMelodyVoice(context, master, theme, counter, theme.volume * .42, theme.interval / 2000);
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

type FootstepSound = {
  duration: number;
  noiseFrequency: number;
  noiseVolume: number;
  thumpFrequency: number;
  thumpVolume: number;
  filter: BiquadFilterType;
};

const footstepSound: Record<FootstepSurface, FootstepSound> = {
  room: { duration: .14, noiseFrequency: 420, noiseVolume: .024, thumpFrequency: 88, thumpVolume: .068, filter: 'lowpass' },
  yard: { duration: .18, noiseFrequency: 1050, noiseVolume: .046, thumpFrequency: 74, thumpVolume: .052, filter: 'bandpass' },
  school: { duration: .15, noiseFrequency: 680, noiseVolume: .032, thumpFrequency: 104, thumpVolume: .076, filter: 'lowpass' },
  blue: { duration: .19, noiseFrequency: 310, noiseVolume: .018, thumpFrequency: 62, thumpVolume: .056, filter: 'lowpass' },
};

export function playFootstep(surface: FootstepSurface) {
  if (!effectsEnabled) return;
  const audioContext = getAudioContext();
  const settings = footstepSound[surface];
  const now = audioContext.currentTime;
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * settings.duration, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  footstepIndex += 1;
  for (let index = 0; index < samples.length; index += 1) {
    const progress = index / samples.length;
    const softAttack = Math.min(1, progress / .08);
    const decay = Math.pow(1 - progress, surface === 'yard' ? 1.7 : 2.4);
    samples[index] = (Math.random() * 2 - 1) * softAttack * decay;
  }
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const noiseGain = audioContext.createGain();
  const thump = audioContext.createOscillator();
  const thumpGain = audioContext.createGain();
  const variation = footstepIndex % 2 === 0 ? .94 : 1.04;
  filter.type = settings.filter;
  filter.frequency.value = settings.noiseFrequency * variation;
  filter.Q.value = surface === 'yard' ? .7 : .45;
  noiseGain.gain.setValueAtTime(.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(settings.noiseVolume, now + .012);
  noiseGain.gain.exponentialRampToValueAtTime(.0001, now + settings.duration);
  thump.type = 'sine';
  thump.frequency.setValueAtTime(settings.thumpFrequency * variation, now);
  thump.frequency.exponentialRampToValueAtTime(settings.thumpFrequency * .62, now + settings.duration);
  thumpGain.gain.setValueAtTime(.0001, now);
  thumpGain.gain.exponentialRampToValueAtTime(settings.thumpVolume, now + .014);
  thumpGain.gain.exponentialRampToValueAtTime(.0001, now + settings.duration);
  source.buffer = buffer;
  source.connect(filter).connect(noiseGain).connect(getEffectsOutput());
  thump.connect(thumpGain).connect(getEffectsOutput());
  source.start(now);
  thump.start(now);
  thump.stop(now + settings.duration + .02);
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
