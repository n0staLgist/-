export type AmbienceMood = 'room' | 'notebook' | 'yard' | 'memory' | 'red' | 'blue' | 'finale';

let context: AudioContext | null = null;
let master: GainNode | null = null;
let effectsMaster: GainNode | null = null;
let melodyTimer: number | null = null;
let effectsEnabled = true;
let musicVolume = .7;
let effectsVolume = .7;
let currentMood: AmbienceMood = 'room';
let noteIndex = 0;

const themes: Record<AmbienceMood, { melody: number[]; interval: number }> = {
  room: { melody: [164.81, 220, 246.94, 220, 0, 196, 164.81, 196], interval: 820 },
  notebook: { melody: [146.83, 196, 233.08, 0, 220, 196, 174.61, 0], interval: 880 },
  yard: { melody: [185, 246.94, 293.66, 277.18, 246.94, 220, 246.94, 0], interval: 720 },
  memory: { melody: [130.81, 174.61, 196, 174.61, 0, 146.83, 164.81, 0], interval: 980 },
  red: { melody: [146.83, 138.59, 164.81, 0, 146.83, 174.61, 138.59, 0], interval: 930 },
  blue: { melody: [130.81, 0, 146.83, 130.81, 116.54, 0, 130.81, 0], interval: 1080 },
  finale: { melody: [196, 246.94, 293.66, 246.94, 220, 293.66, 329.63, 0], interval: 760 },
};

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
  if (context && master) master.gain.setTargetAtTime(effectsEnabled ? .24 * musicVolume : .0001, context.currentTime, .05);
}

export function setEffectsVolume(volume: number) {
  effectsVolume = Math.max(0, Math.min(1, volume));
  if (context && effectsMaster) effectsMaster.gain.setTargetAtTime(effectsEnabled ? effectsVolume : .0001, context.currentTime, .05);
}

const playMusicNote = () => {
  if (!effectsEnabled || !context || !master) return;
  const theme = themes[currentMood];
  const frequency = theme.melody[noteIndex % theme.melody.length];
  noteIndex += 1;
  if (!frequency) return;
  const now = context.currentTime;
  const tone = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  tone.type = 'triangle';
  tone.frequency.setValueAtTime(frequency, now);
  tone.frequency.exponentialRampToValueAtTime(frequency * .996, now + 1.3);
  filter.type = 'lowpass';
  filter.frequency.value = 620;
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.042, now + .025);
  gain.gain.exponentialRampToValueAtTime(.0001, now + 1.55);
  tone.connect(filter).connect(gain).connect(master);
  tone.start(now);
  tone.stop(now + 1.6);
};

const rebuildMusic = () => {
  if (!context || !master) return;
  if (melodyTimer !== null) window.clearInterval(melodyTimer);
  noteIndex = 0;
  melodyTimer = window.setInterval(playMusicNote, themes[currentMood].interval);
  window.setTimeout(playMusicNote, 180);
};

export function startAmbience(mood: AmbienceMood = currentMood) {
  currentMood = mood;
  const audioContext = getAudioContext();
  if (master) return;
  master = audioContext.createGain();
  master.gain.setValueAtTime(.0001, audioContext.currentTime);
  master.gain.exponentialRampToValueAtTime(.24 * musicVolume, audioContext.currentTime + 1.2);
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
  master.gain.exponentialRampToValueAtTime(enabled ? .24 * musicVolume : .0001, now + .45);
  if (effectsMaster) effectsMaster.gain.setTargetAtTime(enabled ? effectsVolume : .0001, now, .05);
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
  oscillator.connect(filter).connect(gain).connect(getEffectsOutput());
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
  source.connect(gain).connect(getEffectsOutput());
  source.start();
}
