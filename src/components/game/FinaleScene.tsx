type FinaleSceneProps = { playerName: string; onRestart: () => void };

export function FinaleScene({ playerName, onRestart }: FinaleSceneProps) {
  return (
    <section className="finale-scene">
      <article className="finale-paper">
        <span className="eyebrow">эпилог · сегодня</span>
        <h1>Не завтра</h1>
        <p>Ты открываешь дверь. Ая всё ещё сидит в коридоре, прижимая рисунок к коленям.</p>
        <div className="finale-dialogue"><b>{playerName}</b> Ая? Я закончил. Можно посмотреть сейчас?</div>
        <div className="finale-dialogue"><b>Ая</b> Правда?</div>
        <p>Ая молча подвигается, освобождая рядом место. На её листе — одинокий маленький персонаж. Вы вместе дорисовываете ему друга и вкладываете рисунок в старую тетрадь.</p>
        <div className="finale-dialogue"><b>Штрих</b> Добро пожаловать.</div>
        <p className="finale-last">Гитара затихает. Впервые к ней присоединяется домбра.</p>
        <button className="pencil-button" onClick={onRestart}>Начать историю заново</button>
      </article>
    </section>
  );
}
