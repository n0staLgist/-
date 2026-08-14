import ayaSideWalkSprite from '../../assets/game/aya-side-walk-v2.png';

type PrologueSceneProps = { lineIndex: number; leaving?: boolean };

export function PrologueScene({ lineIndex, leaving = false }: PrologueSceneProps) {
  const isWaitingForAya = lineIndex === 0;
  const isEnteringSideView = lineIndex === 1;

  return (
    <section className={`prologue-scene is-side-view ${isEnteringSideView ? 'is-side-entering' : ''} ${leaving ? 'is-leaving' : ''}`} aria-label="Комната перед переездом">
      <div className="prologue-map">
        <div className="prologue-camera prologue-camera--side" />
        <div className="prologue-camera prologue-camera--seated" />
        <div className="prologue-camera prologue-camera--top" />
        <div className="prologue-evening" />
        {!isWaitingForAya && (
          <>
            <div className="aya-side" style={{ '--aya-walk-sprite': `url(${ayaSideWalkSprite})` } as React.CSSProperties} aria-label={leaving ? 'Ая уходит обратно в коридор' : 'Ая подходит к герою, её лицо видно сбоку'}>
              <span aria-hidden="true" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
