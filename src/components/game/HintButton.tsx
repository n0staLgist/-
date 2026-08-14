import { useState } from 'react';
import '../../styles/hintButton.css';

type HintButtonProps = { hint: string };

export function HintButton({ hint }: HintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={`hint-button ${isOpen ? 'is-open' : ''}`}>
      <button onClick={() => setIsOpen((value) => !value)} aria-label={isOpen ? 'Закрыть подсказку' : 'Показать подсказку'} aria-expanded={isOpen}>💡</button>
      {isOpen && <p>{hint}</p>}
    </aside>
  );
}
