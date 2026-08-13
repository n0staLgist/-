import ayaSideWalkSprite from '../../assets/game/aya-side-walk-v1.png';

type PrologueSceneProps = { lineIndex: number };

export function PrologueScene({ lineIndex }: PrologueSceneProps) {
  const isEmptyRoom = lineIndex === 0;
  const isEnteringSideView = lineIndex === 1;
  const isLeaving = lineIndex >= 5;

  return (
    <section className={`prologue-scene is-side-view ${isEmptyRoom ? 'is-empty-room' : ''} ${isEnteringSideView ? 'is-side-entering' : ''} ${isLeaving ? 'is-leaving' : ''}`} aria-label="Комната перед переездом">
      <div className="prologue-map">
        <div className="prologue-camera prologue-camera--side" />
        <div className="prologue-camera prologue-camera--seated" />
        <div className="prologue-camera prologue-camera--top" />
        <div className="prologue-evening" />
        {!isEmptyRoom && (
          <>
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
