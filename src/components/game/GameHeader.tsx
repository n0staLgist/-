import { useState } from 'react';

type GameHeaderProps = {
  chapter: string;
  effectsVolume: number;
  musicVolume: number;
  soundOn: boolean;
  onEffectsVolumeChange: (volume: number) => void;
  onMusicVolumeChange: (volume: number) => void;
  onSoundToggle: () => void;
  onRestart: () => void;
};

export function GameHeader({ chapter, effectsVolume, musicVolume, soundOn, onEffectsVolumeChange, onMusicVolumeChange, onSoundToggle, onRestart }: GameHeaderProps) {
  const [showSound, setShowSound] = useState(false);
  return (
    <header className="game-header">
      <span>{chapter}</span>
      <div className="game-header__actions">
        <button className="game-header__text-button" aria-label="Вернуться в главное меню" onClick={onRestart}><span aria-hidden="true">←</span> Меню</button>
        <button aria-label="Настройки звука" aria-expanded={showSound} onClick={() => setShowSound((value) => !value)}>
          <span aria-hidden="true">{soundOn ? '♪' : '×'}</span><span className="sr-only">{soundOn ? 'Звук включён' : 'Звук выключен'}</span>
        </button>
        {showSound && <div className="sound-panel">
          <div className="sound-panel__top"><strong>Звук</strong><button onClick={onSoundToggle}>{soundOn ? 'Выключить' : 'Включить'}</button></div>
          <label>Музыка<input type="range" min="0" max="100" value={Math.round(musicVolume * 100)} onChange={(event) => onMusicVolumeChange(Number(event.target.value) / 100)} /></label>
          <label>Эффекты и реплики<input type="range" min="0" max="100" value={Math.round(effectsVolume * 100)} onChange={(event) => onEffectsVolumeChange(Number(event.target.value) / 100)} /></label>
        </div>}
      </div>
    </header>
  );
}
