import { useHoldProgress } from '../../game/useHoldProgress';

type PaintSinkSceneProps = { onComplete: () => void };

export function PaintSinkScene({ onComplete }: PaintSinkSceneProps) {
  const { progress, isHolding, start, stop } = useHoldProgress(true, 3600);
  const finished = progress >= 100;
  const instruction = progress < 25
    ? 'Красный след почти засох.'
    : progress < 65 ? 'Краска уходит в воду.' : 'Вода становится только краснее.';

  return (
    <section className={`paint-sink ${isHolding ? 'is-scrubbing' : ''} ${finished ? 'is-finished' : ''}`}>
      <div className="paint-sink__paper" aria-hidden="true" />
      <div className="paint-sink__closeup">
        <span className="paint-sink__tap"><i /></span>
        <div className="paint-sink__basin">
          <i className="paint-sink__water" style={{ opacity: .18 + progress / 135 }} />
          <i className="paint-sink__stain" style={{ opacity: 1 - progress / 150 }} />
          <i className="paint-sink__hand" />
        </div>
      </div>
      <article className="paint-sink__copy">
        <span>Глава II · Кабинет ИЗО</span>
        <h1>Попробовать отмыть</h1>
        <p aria-live="polite">{instruction}</p>
        {!finished ? <button className="hold-action" onPointerDown={start} onPointerUp={stop}
          onPointerCancel={stop} onPointerLeave={stop}>
          <b>Удерживай</b><kbd>E</kbd><small>или кнопку</small>
        </button> : <button className="pencil-button" onClick={onComplete}>Отойти от раковины</button>}
        <div className="hold-progress"><i style={{ width: `${progress}%` }} /></div>
      </article>
    </section>
  );
}
