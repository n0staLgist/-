type PrologueSceneProps = {
  lineIndex: number;
};

export function PrologueScene({ lineIndex }: PrologueSceneProps) {
  const isFirstPerson = lineIndex === 0;
  const isLeaving = lineIndex >= 5;

  return (
    <section className={`prologue-scene ${isFirstPerson ? 'is-first-person' : 'is-over-shoulder'} ${isLeaving ? 'is-leaving' : ''}`} aria-label="Комната перед переездом">
      <div className="prologue-camera" />
      <div className="prologue-evening" />

      {isFirstPerson ? (
        <>
          <div className="first-person-hand first-person-hand--left" />
          <div className="first-person-hand first-person-hand--right" />
          <p className="prologue-time">Сегодняшний вечер</p>
        </>
      ) : (
        <>
          <div className="seated-hero" aria-label="Герой сидит у коробки и смотрит в сторону">
            <i className="seated-hero__head" /><i className="seated-hero__body" />
            <i className="seated-hero__arm" /><i className="seated-hero__legs" />
          </div>
          <div className="aya-back" aria-label="Ая со спины держит рисунок">
            <i className="aya-back__head" /><i className="aya-back__hair" />
            <i className="aya-back__body" /><i className="aya-back__arm" />
            <i className="aya-back__drawing" /><i className="aya-back__legs" />
          </div>
        </>
      )}

      <div className="cinema-bar cinema-bar--top" />
      <div className="cinema-bar cinema-bar--bottom" />
    </section>
  );
}
