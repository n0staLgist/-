import { useState } from 'react';
import { setAmbienceEnabled, setEffectsVolume, setMusicVolume } from './audio';

export function useAudioControls() {
  const [soundOn, setSoundOn] = useState(true);
  const [musicLevel, setMusicLevel] = useState(.9);
  const [effectsLevel, setEffectsLevel] = useState(.82);

  const toggleSound = () => {
    const nextValue = !soundOn;
    setSoundOn(nextValue);
    setAmbienceEnabled(nextValue);
  };
  const changeMusicLevel = (volume: number) => {
    setMusicLevel(volume);
    setMusicVolume(volume);
  };
  const changeEffectsLevel = (volume: number) => {
    setEffectsLevel(volume);
    setEffectsVolume(volume);
  };

  return { soundOn, musicLevel, effectsLevel, toggleSound, changeMusicLevel, changeEffectsLevel };
}
