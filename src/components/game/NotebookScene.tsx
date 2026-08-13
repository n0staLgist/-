import '../../styles/notebookReveal.css';
import shtrikhPresent from '../../assets/game/shtrikh-present-v3.png';

type NotebookSceneProps = {
  onEnter: () => void;
  revealTitle?: boolean;
};

export function NotebookScene({ onEnter, revealTitle = false }: NotebookSceneProps) {
  return (
    <section className="notebook-scene">
      {revealTitle && <div className="game-title-reveal"><small>интерактивная история</small><h1>До завтра</h1></div>}
      <div className={`notebook-page ${revealTitle ? 'is-cover' : 'is-present'}`}>
        {!revealTitle && <img className="shtrikh-present" src={shtrikhPresent} alt="Штрих с двумя каплями-слезами, ровной улыбкой и наполовину отсутствующей рукой" />}
        <p className="notebook-title">ШТРИХ И ЕГО МИР</p>
        {revealTitle && <button className="pencil-button" onClick={onEnter}>Открыть тетрадь</button>}
      </div>
    </section>
  );
}
