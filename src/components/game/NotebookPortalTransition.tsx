import '../../styles/notebookPortal.css';

export function NotebookPortalTransition() {
  return (
    <section className="notebook-portal" aria-label="Переход из тетради в нарисованный двор">
      <div className="notebook-portal__page">
        <span className="notebook-portal__line" />
        <div className="notebook-portal__figures" aria-hidden="true"><i /><b /></div>
        <p>Штрих берёт тебя за руку и проводит пальцем по краю страницы.</p>
        <strong>Бумага под ногами становится шершавым асфальтом.</strong>
      </div>
    </section>
  );
}
