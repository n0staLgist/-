let context: AudioContext | null = null;
let ambience: OscillatorNode[] = [];
let master: GainNode | null = null;
let effectsEnabled = true;

const getAudioContext = () => {
  if (!context || context.state === 'closed') context = new AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
};

export function startAmbience() {
  const audioContext = getAudioContext();
  if (ambience.length > 0) return;
  master = audioContext.createGain();
  master.gain.setValueAtTime(0.0001, audioContext.currentTime);
  master.gain.exponentialRampToValueAtTime(0.065, audioContext.currentTime + 1.2);
  master.connect(audioContext.destination);

  [146.83, 220, 293.66].forEach((frequency, index) => {
    const tone = audioContext.createOscillator();
    const volume = audioContext.createGain();
    tone.type = index === 0 ? 'sine' : 'triangle';
    tone.frequency.value = frequency;
    tone.detune.value = index * -4;
    volume.gain.value = index === 0 ? 0.5 : 0.13;
    tone.connect(volume).connect(master!);
    tone.start();
    ambience.push(tone);
  });
}

export function setAmbienceEnabled(enabled: boolean) {
  effectsEnabled = enabled;
  if (!context || !master) {
    if (enabled) startAmbience();
    return;
  }
  if (enabled && context.state === 'suspended') void context.resume();
  const now = context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
  master.gain.exponentialRampToValueAtTime(enabled ? 0.065 : 0.0001, now + 0.5);
}

export function stopAmbience() {
  ambience.forEach((tone) => tone.stop());
  ambience = [];
  context?.close();
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
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.026, now + .008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + .065);
  oscillator.connect(filter).connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(now + .07);
}

export function playPageTurn() {
  if (!effectsEnabled) return;
  const audioContext = getAudioContext();
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.18, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = (Math.random() * 2 - 1) * (1 - index / samples.length);
  }
  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  gain.gain.value = 0.075;
  source.buffer = buffer;
  source.connect(gain).connect(audioContext.destination);
  source.start();
}
