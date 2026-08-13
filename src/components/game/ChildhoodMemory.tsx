import { useState } from 'react';
import { useAdvanceKeys } from '../../game/useAdvanceKeys';
import type { DialogueLine } from '../../game/types';
import '../../styles/childhoodMemory.css';

type ChildhoodMemoryProps = {
  onFinish: () => void;
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

export function ChildhoodMemory({ onFinish }: ChildhoodMemoryProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const isClosing = lineIndex === promiseLines.length - 1;
  const advance = () => {
    if (isClosing) onFinish();
    else setLineIndex((current) => current + 1);
  };
  useAdvanceKeys(advance);

  const line = promiseLines[lineIndex];
  return (
    <section className={`childhood-memory ${isClosing ? 'is-closing' : ''}`}>
      <div className="childhood-memory__desk">
        <div className="childhood-memory__page">
          <span className="childhood-memory__title">Штрих и его мир</span>
          <div className="childhood-streak" aria-label="Незаконченный рисунок Штриха">
            <i className="childhood-streak__head" /><i className="childhood-streak__body" />
            <i className="childhood-streak__arm" /><i className="childhood-streak__leg" /><i className="childhood-streak__leg" />
          </div>
          <div className="child-hand child-hand--left" /><div className="child-hand child-hand--right"><i /></div>
        </div>
      </div>
      <article className="childhood-memory__dialogue">
        <small>{line.speaker}</small>
        <p>{line.text}</p>
        <button onClick={advance}>{isClosing ? 'Закрыть тетрадь' : 'Дальше'} <span>→</span></button>
      </article>
    </section>
  );
}
