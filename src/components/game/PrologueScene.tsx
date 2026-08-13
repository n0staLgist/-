import ayaSprite from '../../assets/game/aya-back-simple-v2.png';
import seatedHeroSprite from '../../assets/game/hero-seated-simple-v2.png';

type PrologueSceneProps = { lineIndex: number };

export function PrologueScene({ lineIndex }: PrologueSceneProps) {
  const isFirstPerson = lineIndex === 0;
  const isLeaving = lineIndex >= 5;

  return (
    <section className={`prologue-scene ${isFirstPerson ? 'is-first-person' : 'is-side-view'} ${isLeaving ? 'is-leaving' : ''}`} aria-label="Комната перед переездом">
      <div className="prologue-map">
        <div className="prologue-camera prologue-camera--first-person" />
        <div className="prologue-camera prologue-camera--side" />
        <div className="prologue-camera prologue-camera--top" />
        <div className="prologue-evening" />
        {isFirstPerson ? (
          <p className="prologue-time">Сегодняшний вечер</p>
        ) : (
          <>
            <img className="seated-hero" src={seatedHeroSprite} alt="Герой сидит у коробки и перебирает вещи" />
            <img className="aya-back" src={ayaSprite} alt={isLeaving ? 'Ая возвращается к двери' : 'Ая идёт от правой двери к герою с рисунком'} />
          </>
        )}
        {isLeaving && <p className="prologue-handoff">Теперь можно разобрать коробку</p>}
      </div>
      <div className="cinema-bar cinema-bar--top" />
      <div className="cinema-bar cinema-bar--bottom" />
    </section>
  );
}
