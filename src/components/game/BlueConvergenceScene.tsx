import { useEffect, useState } from 'react';
import { playColorConvergence, playPageTurn } from '../../game/audio';
import '../../styles/blueConvergence.css';

type BlueConvergenceSceneProps = { onComplete: () => void };

export function BlueConvergenceScene({ onComplete }: BlueConvergenceSceneProps) {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    playColorConvergence();
    const timer = window.setTimeout(() => setCanClose(true), 1900);
    return () => window.clearTimeout(timer);
  }, []);

  const closeNotebook = () => {
    playPageTurn();
    onComplete();
  };

  return <section className="blue-convergence" aria-label="Три цвета соединяются">
    <div className="blue-convergence__page" aria-hidden="true">
      <i className="blue-convergence__stroke blue-convergence__stroke--yellow" />
      <i className="blue-convergence__stroke blue-convergence__stroke--red" />
      <i className="blue-convergence__stroke blue-convergence__stroke--blue" />
      <i className="blue-convergence__join" />
    </div>
    <article className="blue-convergence__copy">
      <span>глава завершена</span>
      <h1>Жёлтый. Красный. Синий.</h1>
      <p>Ни один не пришлось стирать.</p>
      {canClose ? <button className="pencil-button" onClick={closeNotebook}>Закрыть тетрадь</button> : null}
    </article>
  </section>;
}
