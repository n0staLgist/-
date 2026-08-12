let context: AudioContext | null = null;
let ambience: OscillatorNode[] = [];
let master: GainNode | null = null;

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

