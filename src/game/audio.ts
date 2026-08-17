export type AmbienceMood = 'room' | 'notebook' | 'yard' | 'memory';

let context: AudioContext | null = null;
let master: GainNode | null = null;
let melodyTimer: number | null = null;
let effectsEnabled = true;
let currentMood: AmbienceMood = 'room';
let noteIndex = 0;

const themes: Record<AmbienceMood, { melody: number[]; interval: number }> = {
  room: { melody: [164.81, 220, 0, 246.94, 220, 0, 196, 164.81, 0], interval: 1050 },
  notebook: { melody: [146.83, 196, 0, 233.08, 0, 220, 196, 0, 0], interval: 1120 },
  yard: { melody: [185, 246.94, 293.66, 0, 277.18, 246.94, 220, 0], interval: 860 },
  memory: { melody: [130.81, 174.61, 0, 196, 174.61, 0, 146.83, 0, 0], interval: 1240 },
};

const getAudioContext = () => {
  if (!context || context.state === 'closed') context = new AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
};

const playMusicNote = () => {
  if (!effectsEnabled || !context || !master) return;
  const theme = themes[currentMood];
  const frequency = theme.melody[noteIndex % theme.melody.length];
  noteIndex += 1;
  if (!frequency) return;
  const now = context.currentTime;
  const stringNoise = context.createBuffer(1, Math.round(context.sampleRate * .035), context.sampleRate);
  const samples = stringNoise.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) samples[index] = Math.random() * 2 - 1;
  const pluck = context.createBufferSource();
  const delay = context.createDelay();
  const feedback = context.createGain();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  pluck.buffer = stringNoise;
  delay.delayTime.value = 1 / frequency;
  feedback.gain.value = .86;
  filter.type = 'lowpass';
  filter.frequency.value = currentMood === 'yard' ? 1750 : 1350;
  gain.gain.setValueAtTime(.095, now);
  gain.gain.exponentialRampToValueAtTime(.0001, now + 2.8);
  pluck.connect(filter);
  filter.connect(delay);
  delay.connect(feedback).connect(filter);
  delay.connect(gain).connect(master);
  pluck.start(now);
  pluck.stop(now + .04);
  window.setTimeout(() => { delay.disconnect(); feedback.disconnect(); filter.disconnect(); gain.disconnect(); }, 3000);
};

const rebuildMusic = () => {
  if (!context || !master) return;
  if (melodyTimer !== null) window.clearInterval(melodyTimer);
  noteIndex = 0;
  melodyTimer = window.setInterval(playMusicNote, themes[currentMood].interval);
  window.setTimeout(playMusicNote, 500);
};

export function startAmbience(mood: AmbienceMood = currentMood) {
  currentMood = mood;
  const audioContext = getAudioContext();
  if (master) return;
  master = audioContext.createGain();
  master.gain.setValueAtTime(.0001, audioContext.currentTime);
  master.gain.exponentialRampToValueAtTime(.24, audioContext.currentTime + 1.4);
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
  master.gain.exponentialRampToValueAtTime(enabled ? .24 : .0001, now + .45);
}

export function stopAmbience() {
  if (melodyTimer !== null) window.clearInterval(melodyTimer);
  melodyTimer = null;
  void context?.close();
  context = null;
  master = null;
}

const voiceFrequency = (speaker?: string) => {
  if (!speaker) return 245;
  if (speaker.includes('Ая')) return 515;
  if (speaker.includes('Штрих')) return 285;
  if (speaker.includes('Мама') || speaker.includes('Голос')) return 330;
  if (speaker.includes('Ты')) return 405;
  return 360;
};

export function playWritingTick(speaker?: string) {
  if (!effectsEnabled) return;
  const audioContext = getAudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const now = audioContext.currentTime;
  oscillator.type = speaker?.includes('Штрих') ? 'triangle' : 'sine';
  oscillator.frequency.setValueAtTime(voiceFrequency(speaker) + Math.random() * 18, now);
  oscillator.frequency.exponentialRampToValueAtTime(voiceFrequency(speaker) * .92, now + .055);
  filter.type = 'lowpass';
  filter.frequency.value = 1150;
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.026, now + .008);
  gain.gain.exponentialRampToValueAtTime(.0001, now + .065);
  oscillator.connect(filter).connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(now + .07);
}

export function playPageTurn() {
  if (!effectsEnabled) return;
  const audioContext = getAudioContext();
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * .18, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) samples[index] = (Math.random() * 2 - 1) * (1 - index / samples.length);
  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  gain.gain.value = .075;
  source.buffer = buffer;
  source.connect(gain).connect(audioContext.destination);
  source.start();
}
