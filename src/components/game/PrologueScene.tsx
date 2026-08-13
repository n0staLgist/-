import ayaSprite from '../../assets/game/aya-back.png';
import seatedHeroSprite from '../../assets/game/hero-seated.png';

type PrologueSceneProps = { lineIndex: number };

export function PrologueScene({ lineIndex }: PrologueSceneProps) {
  const isFirstPerson = lineIndex === 0;
  const isLeaving = lineIndex >= 5;

  return (
    <section className={`prologue-scene ${isFirstPerson ? 'is-first-person' : 'is-over-shoulder'} ${isLeaving ? 'is-leaving' : ''}`} aria-label="Комната перед переездом">
      <div className="prologue-map">
        <div className="prologue-camera" />
        <div className="prologue-evening" />
        {isFirstPerson ? (
          <p className="prologue-time">Сегодняшний вечер</p>
        ) : (
          <>
            <img className="seated-hero" src={seatedHeroSprite} alt="Герой сидит у коробки, отвернув лицо" />
            <img className="aya-back" src={ayaSprite} alt="Ая входит через дверь с рисунком" />
          </>
        )}
      </div>
      <div className="cinema-bar cinema-bar--top" />
      <div className="cinema-bar cinema-bar--bottom" />
    </section>
  );
}
