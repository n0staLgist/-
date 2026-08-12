type NotebookSceneProps = { onEnter: () => void };

export function NotebookScene({ onEnter }: NotebookSceneProps) {
  return (
    <section className="notebook-scene">
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

