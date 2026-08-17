import { useState } from 'react';
import { useAdvanceKeys } from '../../game/useAdvanceKeys';
import { useTypewriter } from '../../game/useTypewriter';
import type { DialogueLine } from '../../game/types';
import { displaySpeaker } from '../../game/playerName';
import notebookChildhood from '../../assets/game/notebook-childhood-v4.webp';
import { SpeakerPortrait } from './SpeakerPortrait';
import '../../styles/childhoodMemory.css';

type ChildhoodMemoryProps = {
  onFinish: () => void;
  playerName: string;
};

const promiseLines: DialogueLine[] = [
  { speaker: 'Штрих', text: 'А руку?' },
  { speaker: 'Ты, в детстве', text: 'Не успел. Завтра дорисую.' },
  { speaker: 'Штрих', text: 'А мир?' },
  { speaker: 'Ты, в детстве', text: 'И мир тоже. Огромный.' },
  { speaker: 'Мама, из кухни', text: 'Ужинать!' },
  { speaker: 'Ты, в детстве', text: 'До завтра, Штрих.' },
  { speaker: 'Штрих', text: 'Я буду здесь.' },
];

export function ChildhoodMemory({ onFinish, playerName }: ChildhoodMemoryProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const isClosing = lineIndex === promiseLines.length - 1;
  const line = promiseLines[lineIndex];
  const { visibleText, isComplete, complete } = useTypewriter(line.text, line.speaker);
  const advance = () => {
    if (!isComplete) return complete();
    if (isClosing) onFinish();
    else setLineIndex((current) => current + 1);
  };
  useAdvanceKeys(advance);

  return (
    <section className={`childhood-memory ${isClosing ? 'is-closing' : ''}`}>
      <div className="time-transition">Несколько лет назад</div>
      <div className="childhood-memory__desk">
        <img className="childhood-memory__art" src={notebookChildhood} alt="Детские руки рисуют нового Штриха без слёз" />
      </div>
      <article className="childhood-memory__dialogue">
        <SpeakerPortrait speaker={line.speaker} childhood />
        <small>{displaySpeaker(line.speaker, playerName)}</small>
        <p>{visibleText}<i className={isComplete ? '' : 'typewriter-caret'} aria-hidden="true" /></p>
        {isComplete && <button onClick={advance}>{isClosing ? 'Закрыть тетрадь' : 'Дальше'} <span>→</span></button>}
      </article>
    </section>
  );
}
