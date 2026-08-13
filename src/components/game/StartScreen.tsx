type StartScreenProps = { onStart: () => void };

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section className="opening-screen">
      <span className="opening-screen__margin" aria-hidden="true" />
      <span className="opening-screen__pencil-mark opening-screen__pencil-mark--top" aria-hidden="true" />
      <span className="opening-screen__pencil-mark opening-screen__pencil-mark--bottom" aria-hidden="true" />
      <div className="opening-screen__copy">
        <small>интерактивная история</small>
        <h1>До завтра</h1>
        <p>Одна старая тетрадь. Одно обещание.</p>
        <button onClick={onStart}>Открыть тетрадь <span aria-hidden="true">→</span></button>
      </div>
    </section>
  );
}
