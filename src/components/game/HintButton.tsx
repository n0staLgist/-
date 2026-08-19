import { useState } from 'react';
import '../../styles/hintButton.css';

type HintButtonProps = { hint: string; direction?: 'up' | 'down' | 'left' | 'right' };
const arrows = { up: '↑', down: '↓', left: '←', right: '→' };

export function HintButton({ hint, direction }: HintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={`hint-button ${isOpen ? 'is-open' : ''}`}>
      <button onClick={() => setIsOpen((value) => !value)} aria-label={isOpen ? 'Закрыть подсказку' : 'Показать подсказку'} aria-expanded={isOpen}>💡</button>
      {isOpen && <div className="hint-button__message">
        {direction && <span className={`hint-button__arrow hint-button__arrow--${direction}`} aria-hidden="true">{arrows[direction]}</span>}
        <p>{hint}</p>
      </div>}
    </aside>
  );
}
