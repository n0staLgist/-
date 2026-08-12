type GameHeaderProps = {
  chapter: string;
  soundOn: boolean;
  onSoundToggle: () => void;
  onRestart: () => void;
};

export function GameHeader({ chapter, soundOn, onSoundToggle, onRestart }: GameHeaderProps) {
  return (
    <header className="game-header">
      <span>{chapter}</span>
      <div className="game-header__actions">
        <button aria-label="Начать главу заново" onClick={onRestart}>↻</button>
        <button aria-label={soundOn ? 'Выключить звук' : 'Включить звук'} onClick={onSoundToggle}>
          {soundOn ? '♪' : '×'}
        </button>
      </div>
    </header>
  );
}

