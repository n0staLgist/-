import type { YardTask } from '../../game/types';

type YardProgressProps = { completed: YardTask[] };

const tasks: { id: YardTask; icon: string; label: string }[] = [
  { id: 'swing', icon: '⌁', label: 'Качели' },
  { id: 'hopscotch', icon: '▦', label: 'Классики' },
  { id: 'window', icon: '▣', label: 'Окно' },
];

export function YardProgress({ completed }: YardProgressProps) {
  return (
    <div className="yard-progress" aria-label={`Возвращено деталей: ${completed.length} из 3`}>
      {tasks.map(({ id, icon, label }) => (
        <span className={completed.includes(id) ? 'is-done' : ''} key={id} title={label}>
          <i aria-hidden="true">{icon}</i><span className="sr-only">{label}</span>
        </span>
      ))}
    </div>
  );
}
