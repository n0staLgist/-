import { Link } from 'wouter';

export function NotFoundPage() {
  return (
    <main className="start-screen">
      <section className="start-screen__paper">
        <h1>Страница потерялась</h1>
        <p><Link href="/">Вернуться в игру</Link></p>
      </section>
    </main>
  );
}
