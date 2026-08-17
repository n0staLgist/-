import { useState } from 'react';
import { loadGameSave, type ChapterNumber } from '../../game/gameSave';
import type { ControlsMode, GameSetup } from '../../game/types';

type StartScreenProps = { onStart: (setup: GameSetup, chapter: ChapterNumber) => void };

const chapterLabels: Record<ChapterNumber, string> = { 1: 'I · Жёлтый двор', 2: 'II · Красный класс', 3: 'III · Синяя комната' };

export function StartScreen({ onStart }: StartScreenProps) {
  const [save] = useState(loadGameSave);
  const [showControls, setShowControls] = useState(false);
  const [playerName, setPlayerName] = useState(save.playerName);
  const [controlsMode, setControlsMode] = useState<ControlsMode>('desktop');
  const [chapter, setChapter] = useState<ChapterNumber>(1);
  const start = (selectedChapter = chapter) => onStart({
    controlsMode,
    playerName: playerName.trim().slice(0, 18) || 'Ты',
  }, selectedChapter);

  return (
    <section className="opening-screen">
      <span className="opening-screen__margin" aria-hidden="true" />
      <div className="opening-screen__notes" aria-hidden="true">
        <span>одна старая тетрадь · одно обещание</span>
        <span>«Сегодня уже завтра?»</span>
        <span>Некоторые обещания помнят дольше, чем люди.</span>
      </div>
      <span className="opening-screen__pencil-mark opening-screen__pencil-mark--top" aria-hidden="true" />
      <span className="opening-screen__pencil-mark opening-screen__pencil-mark--bottom" aria-hidden="true" />
      <div className="opening-screen__sketch" aria-hidden="true"><i /><i /><i /></div>
      <div className="opening-screen__copy">
        <small className="opening-screen__eyebrow">сюжетная 2D-история</small>
        <h1>До завтра</h1>
        <p className="opening-screen__lead">Перед переездом ты находишь тетрадь, в которой одно обещание всё ещё ждёт продолжения.</p>
        <div className="opening-screen__meta" aria-label="Информация об игре"><span>15–25 минут</span><span>3 главы</span><span>лучше со звуком</span></div>
        <div className="opening-screen__setup-card">
        <div className="opening-setup">
          <label>Как тебя называть?<input value={playerName} onChange={(event) => setPlayerName(event.target.value)} maxLength={18} placeholder="Ты" /></label>
          <fieldset><legend>На чём играешь?</legend>
            <button className={controlsMode === 'desktop' ? 'is-selected' : ''} onClick={() => setControlsMode('desktop')} type="button">ПК</button>
            <button className="is-unavailable" disabled type="button">Телефон</button>
            <small className="mobile-unavailable">На телефоне пока нельзя</small>
          </fieldset>
          <fieldset className="chapter-select"><legend>Выбрать главу</legend>
            {([1, 2, 3] as ChapterNumber[]).map((number) => <button className={chapter === number ? 'is-selected' : ''} disabled={number > save.unlockedChapter} key={number} onClick={() => setChapter(number)} type="button">{chapterLabels[number]}{number > save.unlockedChapter ? ' · закрыто' : ''}</button>)}
          </fieldset>
        </div>
        <div className="opening-screen__actions">
          {save.unlockedChapter > 1 && <button className="opening-screen__start" onClick={() => start(save.unlockedChapter)}>Продолжить: глава {save.unlockedChapter} <span aria-hidden="true">→</span></button>}
          <button className={save.unlockedChapter === 1 ? 'opening-screen__start' : ''} onClick={() => start()}>{chapter === 1 ? 'Начать новую игру' : 'Начать выбранную главу'} <span aria-hidden="true">→</span></button>
          <button onClick={() => setShowControls(true)}>Управление</button>
        </div>
        </div>
      </div>
      <small className="opening-screen__credit">by nOstaLgist aka ErKeK aka FeArtNeasLy</small>
      {showControls && <div className="controls-modal" role="dialog" aria-modal="true" aria-label="Полное управление">
        <div className="controls-sheet"><h2>Управление</h2><dl><dt>WASD / стрелки</dt><dd>Идти</dd><dt>E / Enter</dt><dd>Осмотреть или взаимодействовать</dd><dt>Enter / Пробел</dt><dd>Допечатать и продолжить диалог</dd><dt>Телефон</dt><dd>Пока недоступно</dd></dl><button onClick={() => setShowControls(false)}>Закрыть</button></div>
      </div>}
    </section>
  );
}
