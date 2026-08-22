import type { AudioTheme, MusicInstrument } from './audioThemes';

const connectEnvelope = (
  context: AudioContext,
  output: AudioNode,
  volume: number,
  start: number,
  duration: number,
) => {
  const gain = context.createGain();
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + .018);
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  gain.connect(output);
  return gain;
};

const playOscillator = (
  context: AudioContext,
  output: AudioNode,
  frequency: number,
  volume: number,
  duration: number,
  delay: number,
  wave: OscillatorType,
  filterFrequency: number,
) => {
  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * .997, start + duration);
  filter.type = 'lowpass';
  filter.frequency.value = filterFrequency;
  oscillator.connect(filter).connect(connectEnvelope(context, output, volume, start, duration));
  oscillator.start(start);
  oscillator.stop(start + duration + .03);
};

const playPluckedString = (
  context: AudioContext,
  output: AudioNode,
  frequency: number,
  volume: number,
  duration: number,
  delay: number,
  instrument: MusicInstrument,
) => {
  const start = context.currentTime + delay;
  const period = Math.max(2, Math.round(context.sampleRate / frequency));
  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
  const samples = buffer.getChannelData(0);
  const damping = instrument === 'domra' ? .994 : instrument === 'pencil' ? .988 : .996;
  for (let index = 0; index < period; index += 1) samples[index] = Math.random() * 2 - 1;
  for (let index = period; index < samples.length; index += 1) {
    samples[index] = (samples[index - period] + samples[index - period + 1]) * .5 * damping;
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const brightness = instrument === 'domra' ? 3600 : instrument === 'pencil' ? 1100 : 2200;
  filter.type = 'lowpass';
  filter.frequency.value = brightness;
  source.buffer = buffer;
  source.connect(filter).connect(connectEnvelope(context, output, volume, start, duration));
  source.start(start);
};

export const playMelodyVoice = (
  context: AudioContext,
  output: AudioNode,
  theme: AudioTheme,
  frequency: number,
  volume: number,
  delay = 0,
) => {
  if (theme.instrument === 'music-box') {
    playOscillator(context, output, frequency, volume, theme.duration, delay, 'sine', 2600);
    playOscillator(context, output, frequency * 2.01, volume * .28, theme.duration * .58, delay, 'sine', 3400);
    return;
  }
  if (theme.instrument === 'hollow') {
    playOscillator(context, output, frequency, volume, theme.duration, delay, 'triangle', theme.filter);
    playOscillator(context, output, frequency / 2, volume * .25, theme.duration * 1.2, delay, 'sine', 520);
    return;
  }
  playPluckedString(context, output, frequency, volume, theme.duration, delay, theme.instrument);
};

export const playChordPad = (
  context: AudioContext,
  output: AudioNode,
  theme: AudioTheme,
  chord: [number, number, number],
  duration: number,
) => chord.forEach((frequency, index) => playOscillator(
  context, output, frequency, theme.volume * (index === 0 ? .2 : .15), duration, index * .035, 'sine', theme.filter,
));

export const playBassVoice = (
  context: AudioContext,
  output: AudioNode,
  theme: AudioTheme,
  frequency: number,
  duration: number,
) => playOscillator(context, output, frequency, theme.volume * .55, duration, 0, 'triangle', Math.min(theme.filter, 620));
