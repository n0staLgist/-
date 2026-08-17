import { useEffect, useState } from 'react';
import { taskCopy } from '../../game/story';
import type { YardTask } from '../../game/types';
import { HopscotchTask } from './yardTasks/HopscotchTask';
import { SwingTask } from './yardTasks/SwingTask';
import { WindowTask } from './yardTasks/WindowTask';

type TaskCardProps = { task: YardTask; onCancel: () => void; onComplete: () => void };

export function TaskCard({ task, onCancel, onComplete }: TaskCardProps) {
  const [ready, setReady] = useState(false);
  const copy = taskCopy[task];
  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(onComplete, 900);
    return () => window.clearTimeout(timer);
  }, [onComplete, ready]);

  return (
    <section className={`task-overlay task-overlay--${task}`} role="dialog" aria-modal="true" aria-label={copy.title}>
      <div className="task-card">
        <button className="task-card__close" onClick={onCancel} aria-label="Вернуться во двор">×</button>
        <span className="eyebrow">маленькое действие</span><h2>{copy.title}</h2><p>{copy.hint}</p>
        {task === 'swing' && <SwingTask onReady={() => setReady(true)} />}
        {task === 'hopscotch' && <HopscotchTask onReady={() => setReady(true)} />}
        {task === 'window' && <WindowTask onReady={() => setReady(true)} />}
        {ready && <div className="task-success"><small>Готово</small><span>Возвращаемся во двор…</span></div>}
      </div>
    </section>
  );
}
