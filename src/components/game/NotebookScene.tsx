import '../../styles/notebookReveal.css';
import shtrikhPresent from '../../assets/game/shtrikh-present-v3.png';
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
      <div className={`notebook-page ${revealTitle ? 'is-cover' : 'is-present'}`}>
        {!revealTitle && <><span className="present-day-label">Сегодня</span><img className="shtrikh-present" src={shtrikhPresent} alt="Штрих с двумя каплями-слезами, ровной улыбкой и наполовину отсутствующей рукой" /></>}
        <p className="notebook-title">ШТРИХ И ЕГО МИР</p>
        {revealTitle && <button className="pencil-button" onClick={enter}>Открыть тетрадь</button>}
      </div>
    </section>
  );
}
