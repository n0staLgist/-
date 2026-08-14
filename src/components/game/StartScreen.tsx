import { useState } from 'react';
import type { ControlsMode, GameSetup } from '../../game/types';

type StartScreenProps = { onStart: (setup: GameSetup) => void };

export function StartScreen({ onStart }: StartScreenProps) {
  const [showControls, setShowControls] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [controlsMode, setControlsMode] = useState<ControlsMode>('desktop');
  const start = () => onStart({
    controlsMode,
    playerName: playerName.trim().slice(0, 18) || 'Ты',
  });

  return (
    <section className="opening-screen">
      <span className="opening-screen__margin" aria-hidden="true" />
      <span className="opening-screen__pencil-mark opening-screen__pencil-mark--top" aria-hidden="true" />
      <span className="opening-screen__pencil-mark opening-screen__pencil-mark--bottom" aria-hidden="true" />
      <div className="opening-screen__sketch" aria-hidden="true"><i /><i /><i /></div>
      <div className="opening-screen__copy">
        <small>одна старая тетрадь · одно обещание</small><h1>До завтра</h1>
        <p>Некоторые обещания помнят дольше, чем люди.</p>
        <blockquote>«Сегодня уже завтра?»</blockquote>
        <div className="opening-setup">
          <label>Как тебя называть?<input value={playerName} onChange={(event) => setPlayerName(event.target.value)} maxLength={18} placeholder="Ты" /></label>
          <fieldset><legend>На чём играешь?</legend>
            <button className={controlsMode === 'desktop' ? 'is-selected' : ''} onClick={() => setControlsMode('desktop')} type="button">ПК</button>
            <button className={controlsMode === 'touch' ? 'is-selected' : ''} onClick={() => setControlsMode('touch')} type="button">Телефон</button>
          </fieldset>
        </div>
        <div className="opening-screen__actions"><button className="opening-screen__start" onClick={start}>Открыть тетрадь <span aria-hidden="true">→</span></button><button onClick={() => setShowControls(true)}>Управление</button></div>
      </div>
      <small className="opening-screen__credit">by nOstaLgist aka ErKeK aka FeArtNeasLy</small>
      {showControls && <div className="controls-modal" role="dialog" aria-modal="true" aria-label="Полное управление">
        <div className="controls-sheet"><h2>Управление</h2><dl><dt>WASD / стрелки</dt><dd>Идти</dd><dt>E / Enter</dt><dd>Осмотреть или взаимодействовать</dd><dt>Enter / Пробел</dt><dd>Допечатать и продолжить диалог</dd><dt>Телефон</dt><dd>Крестовина и жёлтая кнопка действия</dd></dl><button onClick={() => setShowControls(false)}>Закрыть</button></div>
      </div>}
    </section>
  );
}
