import { useState } from 'react';

type StartScreenProps = { onStart: () => void };

export function StartScreen({ onStart }: StartScreenProps) {
  const [showControls, setShowControls] = useState(false);
  return (
    <section className="opening-screen">
      <span className="opening-screen__margin" aria-hidden="true" />
      <span className="opening-screen__pencil-mark opening-screen__pencil-mark--top" aria-hidden="true" />
      <span className="opening-screen__pencil-mark opening-screen__pencil-mark--bottom" aria-hidden="true" />
      <div className="opening-screen__copy">
        <small>интерактивная история</small><h1>До завтра</h1><p>Одна старая тетрадь. Одно обещание.</p>
        <div className="opening-screen__actions"><button onClick={onStart}>Начать <span aria-hidden="true">→</span></button><button onClick={() => setShowControls(true)}>Управление</button></div>
      </div>
      <small className="opening-screen__credit">by nOstaLgist aka ErKeK aka FeArtNeasLy</small>
      {showControls && <div className="controls-modal" role="dialog" aria-modal="true" aria-label="Полное управление">
        <div className="controls-sheet"><h2>Управление</h2><dl><dt>WASD / стрелки</dt><dd>Идти</dd><dt>E / Enter</dt><dd>Осмотреть или взаимодействовать</dd><dt>Enter / Пробел</dt><dd>Допечатать и продолжить диалог</dd><dt>Телефон</dt><dd>Крестовина и жёлтая кнопка действия</dd></dl><button onClick={() => setShowControls(false)}>Закрыть</button></div>
      </div>}
    </section>
  );
}
