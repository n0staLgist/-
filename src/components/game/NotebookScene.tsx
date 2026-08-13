import '../../styles/notebookReveal.css';

type NotebookSceneProps = {
  onEnter: () => void;
  revealTitle?: boolean;
};

export function NotebookScene({ onEnter, revealTitle = false }: NotebookSceneProps) {
  return (
    <section className="notebook-scene">
      {revealTitle && <div className="game-title-reveal"><small>интерактивная история</small><h1>До завтра</h1></div>}
      <div className="notebook-page">
        <div className="streak" aria-label="Штрих — нарисованный человечек">
          <span className="streak__head"><i /><i /><b /></span>
          <span className="streak__body" />
          <span className="streak__scarf" />
          <span className="streak__arm streak__arm--left" />
          <span className="streak__arm streak__arm--missing" />
          <span className="streak__leg streak__leg--left" />
          <span className="streak__leg streak__leg--right" />
        </div>
        <p className="notebook-title">ШТРИХ И ЕГО МИР</p>
        <button className="pencil-button" onClick={onEnter}>Коснуться страницы</button>
      </div>
    </section>
  );
}
