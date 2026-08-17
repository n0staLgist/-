import '../../styles/notebookReveal.css';
import notebookCover from '../../assets/game/notebook-cover-v1.webp';
import notebookPresent from '../../assets/game/notebook-present-v4.webp';
import { playPageTurn } from '../../game/audio';

type NotebookSceneProps = {
  onEnter: () => void;
  revealTitle?: boolean;
};

export function NotebookScene({ onEnter, revealTitle = false }: NotebookSceneProps) {
  const enter = () => {
    playPageTurn();
    onEnter();
  };
  return (
    <section className="notebook-scene">
      {revealTitle && <div className="game-title-reveal"><small>интерактивная история</small><h1>До завтра</h1></div>}
      {!revealTitle && <div className="time-transition">Сегодня</div>}
      <div className={`notebook-page ${revealTitle ? 'is-cover' : 'is-present'}`}>
        <img className="notebook-art" src={revealTitle ? notebookCover : notebookPresent} alt={revealTitle ? 'Герой берёт старую синюю тетрадь со стола' : 'Открытая тетрадь: Штрих с двумя незакрашенными слезами и недорисованной рукой'} />
        {revealTitle && <button className="pencil-button" onClick={enter}>Открыть тетрадь</button>}
      </div>
    </section>
  );
}
