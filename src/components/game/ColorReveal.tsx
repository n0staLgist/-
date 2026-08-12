type ColorRevealProps = {
  color: 'yellow' | 'red';
  title: string;
  text: string;
  nextChapter: string;
  onContinue: () => void;
};

export function ColorReveal({ color, title, text, nextChapter, onContinue }: ColorRevealProps) {
  return (
    <section className={`color-reveal color-reveal--${color}`}>
      <div className="color-reveal__circle" />
      <div className="color-reveal__copy">
        <span className="eyebrow">найден цвет</span>
        <h1>{title}</h1>
        <p>{text}</p>
        <button className="pencil-button" onClick={onContinue}>{nextChapter} →</button>
      </div>
    </section>
  );
}
