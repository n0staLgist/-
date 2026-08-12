type ChapterEndProps = { onRestart: () => void };

export function ChapterEnd({ onRestart }: ChapterEndProps) {
  return (
    <section className="chapter-end">
      <div className="chapter-end__sun" />
      <div className="chapter-end__copy">
        <span className="eyebrow">найден первый цвет</span>
        <h1>Жёлтый</h1>
        <p>Цвет окон, мела и того вечера, когда тебя позвали домой.</p>
        <div className="next-chapter">
          <span>Дальше</span>
          <strong>Глава II · Красный класс</strong>
          <small>скоро появится</small>
        </div>
        <button className="ghost-paper" onClick={onRestart}>Пройти главу ещё раз</button>
      </div>
    </section>
  );
}

