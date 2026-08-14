import { useState } from 'react';
import { taskCopy } from '../../game/story';
import type { YardTask } from '../../game/types';
import { HopscotchTask } from './yardTasks/HopscotchTask';
import { SwingTask } from './yardTasks/SwingTask';
import { WindowTask } from './yardTasks/WindowTask';

type TaskCardProps = { task: YardTask; onComplete: () => void };

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const [ready, setReady] = useState(false);
  const copy = taskCopy[task];

  return (
    <section className={`task-overlay task-overlay--${task}`}>
      <div className="task-card">
        <span className="eyebrow">маленькое действие</span><h2>{copy.title}</h2><p>{copy.hint}</p>
        {task === 'swing' && <SwingTask onReady={() => setReady(true)} />}
        {task === 'hopscotch' && <HopscotchTask onReady={() => setReady(true)} />}
        {task === 'window' && <WindowTask onReady={() => setReady(true)} />}
        {ready && <button className="pencil-button" onClick={onComplete}>Остаться в воспоминании</button>}
      </div>
    </section>
  );
}
