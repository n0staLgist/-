import { useEffect } from 'react';
import { useAdvanceKeys } from '../../game/useAdvanceKeys';
import '../../styles/colorReveal.css';

type ColorRevealProps = {
  color: 'yellow' | 'red';
  title: string;
  text: string;
  nextChapter: string;
  autoAdvanceMs?: number;
  onContinue: () => void;
};

export function ColorReveal({ color, title, text, nextChapter, autoAdvanceMs, onContinue }: ColorRevealProps) {
  useAdvanceKeys(onContinue);
  useEffect(() => {
    if (!autoAdvanceMs) return;
    const timer = window.setTimeout(onContinue, autoAdvanceMs);
    return () => window.clearTimeout(timer);
  }, [autoAdvanceMs, onContinue]);

  return (
    <section className={`color-reveal color-reveal--${color}`}>
      <div className="color-reveal__wash" aria-hidden="true"><i /><i /><i /></div>
      <div className="color-reveal__copy">
        <span className="eyebrow">глава завершена</span>
        <h1>{title}</h1>
        <p>{text}</p>
        <small>{nextChapter}</small>
        <small className="color-reveal__saved">✓ Прогресс сохранён</small>
        {autoAdvanceMs ? <span className="color-reveal__progress" style={{ '--reveal-time': `${autoAdvanceMs}ms` } as React.CSSProperties} /> : <button className="pencil-button" onClick={onContinue}>Перевернуть страницу →</button>}
      </div>
    </section>
  );
}
