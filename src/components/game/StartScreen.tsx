type StartScreenProps = { onStart: () => void };

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section className="opening-screen">
      <div className="opening-screen__copy">
        <span aria-hidden="true" className="opening-screen__line" />
        <p>Небольшая история лучше звучит в наушниках</p>
        <button onClick={onStart}>Начать</button>
        <small>WASD / стрелки · E / Enter</small>
      </div>
    </section>
  );
}
