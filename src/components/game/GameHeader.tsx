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
        <button className="game-header__text-button" aria-label="Вернуться в главное меню" onClick={onRestart}><span aria-hidden="true">←</span> Меню</button>
        <button aria-label={soundOn ? 'Выключить звук' : 'Включить звук'} onClick={onSoundToggle}>
          <span aria-hidden="true">{soundOn ? '♪' : '×'}</span><span className="sr-only">{soundOn ? 'Звук включён' : 'Звук выключен'}</span>
        </button>
      </div>
    </header>
  );
}
