import '../../styles/notebookPortal.css';

export function NotebookPortalTransition() {
  return (
    <section className="notebook-portal" aria-label="Переход из тетради в нарисованный двор">
      <div className="notebook-portal__page">
        <span className="notebook-portal__margin" />
        <span className="notebook-portal__line" />
        <div className="notebook-portal__figures" aria-hidden="true"><i /><b /></div>
        <span className="notebook-portal__asphalt" />
      </div>
    </section>
  );
}
