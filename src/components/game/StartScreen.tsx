type StartScreenProps = { onStart: () => void };

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section className="start-screen">
      <div className="start-screen__paper">
        <span className="eyebrow">интерактивная история</span>
        <h1>До завтра</h1>
        <p>Иногда старые обещания ждут нас дольше, чем мы думаем.</p>
        <button className="pencil-button" onClick={onStart}>Открыть коробку</button>
        <small>Лучше играть со звуком · 8–12 минут</small>
      </div>
    </section>
  );
}

