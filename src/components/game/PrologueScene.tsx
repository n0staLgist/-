import ayaSprite from '../../assets/game/aya-back-simple-v2.png';
import ayaSideWalkSprite from '../../assets/game/aya-side-walk-v1.png';
import seatedHeroSprite from '../../assets/game/hero-seated-simple-v2.png';

type PrologueSceneProps = { lineIndex: number };

export function PrologueScene({ lineIndex }: PrologueSceneProps) {
  const isCorridor = lineIndex === 0;
  const isEnteringSideView = lineIndex === 1;
  const isLeaving = lineIndex >= 5;

  return (
    <section className={`prologue-scene ${isCorridor ? 'is-corridor' : 'is-side-view'} ${isEnteringSideView ? 'is-side-entering' : ''} ${isLeaving ? 'is-leaving' : ''}`} aria-label="Комната перед переездом">
      <div className="prologue-map">
        <div className="prologue-camera prologue-camera--corridor" />
        <div className="prologue-camera prologue-camera--side" />
        <div className="prologue-camera prologue-camera--top" />
        <div className="prologue-evening" />
        {isCorridor ? (
          <div className="corridor-frame">
            <div className="corridor-doorway" />
            <img className="aya-corridor" src={ayaSprite} alt="Ая входит из коридора в комнату, вид со спины" />
          </div>
        ) : (
          <>
            <img className="seated-hero" src={seatedHeroSprite} alt="Герой сидит у коробки и перебирает вещи" />
            <div className="aya-side" style={{ '--aya-walk-sprite': `url(${ayaSideWalkSprite})` } as React.CSSProperties} aria-label={isLeaving ? 'Ая уходит обратно в коридор' : 'Ая подходит к герою, её лицо видно сбоку'}>
              <span aria-hidden="true" />
            </div>
          </>
        )}
      </div>
      <div className="cinema-bar cinema-bar--top" />
      <div className="cinema-bar cinema-bar--bottom" />
    </section>
  );
}
