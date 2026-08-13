type PrologueSceneProps = {
  lineIndex: number;
};

export function PrologueScene({ lineIndex }: PrologueSceneProps) {
  const ayaIsPresent = lineIndex > 0 && lineIndex < 4;
  const ayaIsLeaving = lineIndex >= 4;

  return (
    <section className="prologue-scene" aria-label="Комната перед переездом">
      <div className="prologue-scene__room" />
      <div className="prologue-scene__evening" />
      <div className="prologue-scene__hero" aria-label="Силуэт героя"><i /><b /></div>
      <div
        className={`prologue-scene__aya ${ayaIsPresent ? 'is-present' : ''} ${ayaIsLeaving ? 'is-leaving' : ''}`}
        aria-label="Ая держит рисунок"
      >
        <i /><b /><span />
      </div>
      {lineIndex === 0 && <p className="prologue-scene__time">Сегодняшний вечер</p>}
      <div className="cinema-bar cinema-bar--top" />
      <div className="cinema-bar cinema-bar--bottom" />
    </section>
  );
}
