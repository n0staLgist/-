let context: AudioContext | null = null;
let ambience: OscillatorNode[] = [];
let master: GainNode | null = null;
let effectsEnabled = true;

export function startAmbience() {
  if (ambience.length > 0) return;
  context = new AudioContext();
  master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 2);
  master.connect(context.destination);

  [110, 164.81, 220].forEach((frequency, index) => {
    const tone = context!.createOscillator();
    const volume = context!.createGain();
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
  const now = context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
  master.gain.exponentialRampToValueAtTime(enabled ? 0.035 : 0.0001, now + 0.5);
}

export function stopAmbience() {
  ambience.forEach((tone) => tone.stop());
  ambience = [];
  context?.close();
  context = null;
  master = null;
}

export function playWritingTick() {
  if (!effectsEnabled) return;
  const audioContext = context ?? new AudioContext();
  if (!context) context = audioContext;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(520 + Math.random() * 90, audioContext.currentTime);
  gain.gain.setValueAtTime(0.012, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.025);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.03);
}

export function playPageTurn() {
  if (!effectsEnabled) return;
  const audioContext = context ?? new AudioContext();
  if (!context) context = audioContext;
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.18, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = (Math.random() * 2 - 1) * (1 - index / samples.length);
  }
  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  gain.gain.value = 0.045;
  source.buffer = buffer;
  source.connect(gain).connect(audioContext.destination);
  source.start();
}
