import { Link } from 'wouter';

export function NotFoundPage() {
  return (
    <main className="not-found">
      <section className="not-found__paper">
        <h1>Страница потерялась</h1>
        <p><Link href="/">Вернуться в игру</Link></p>
      </section>
    </main>
  );
}
