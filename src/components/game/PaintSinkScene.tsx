import { useHoldProgress } from '../../game/useHoldProgress';
import sinkHands from '../../assets/game/paint-sink-hands-v1.webp';

type PaintSinkSceneProps = { onComplete: () => void };

export function PaintSinkScene({ onComplete }: PaintSinkSceneProps) {
  const { progress, isHolding, start, stop } = useHoldProgress(true, 3600);
  const finished = progress >= 100;
  const instruction = progress < 25
    ? 'Красное забилось в линии ладоней.'
    : progress < 65 ? 'Вода уносит цвет, но не след.' : 'Кожа уже болит. Красное всё ещё здесь.';

  return (
    <section className={`paint-sink ${isHolding ? 'is-scrubbing' : ''} ${finished ? 'is-finished' : ''}`}>
      <div className="paint-sink__paper" aria-hidden="true" />
      <div className="paint-sink__closeup">
        <img src={sinkHands} alt="Детские руки оттирают красную гуашь под краном в кабинете ИЗО" />
        <i className="paint-sink__red-wash" style={{ opacity: .06 + progress / 520 }} aria-hidden="true" />
      </div>
      <article className="paint-sink__copy">
        <span>Глава II · Кабинет ИЗО</span>
        <h1>Под водой</h1>
        <p aria-live="polite">{instruction}</p>
        {!finished ? <button className="hold-action" onPointerDown={start} onPointerUp={stop}
          onPointerCancel={stop} onPointerLeave={stop}>
          <b>Удерживай</b><kbd>E</kbd><small>или кнопку</small>
        </button> : <button className="pencil-button" onClick={onComplete}>Вернуться в кабинет</button>}
        <div className="hold-progress"><i style={{ width: `${progress}%` }} /></div>
      </article>
    </section>
  );
}
