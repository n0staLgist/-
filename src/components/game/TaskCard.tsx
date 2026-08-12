import { useState } from 'react';
import { taskCopy } from '../../game/story';
import type { YardTask } from '../../game/types';

type TaskCardProps = { task: YardTask; onComplete: () => void };

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const [progress, setProgress] = useState(0);
  const copy = taskCopy[task];
  const needed = task === 'hopscotch' ? 4 : 3;
  const advance = () => setProgress((value) => Math.min(value + 1, needed));

  return (
    <section className={`task-overlay task-overlay--${task}`}>
      <div className="task-card">
        <span className="eyebrow">маленькое воспоминание</span>
        <h2>{copy.title}</h2>
        <p>{copy.hint}</p>
        <button className="drawing-action" onClick={advance} aria-label={copy.hint}>
          {task === 'swing' && <span className="draw-swing" style={{ '--draw': progress } as React.CSSProperties} />}
          {task === 'hopscotch' && <span className={`draw-hopscotch step-${progress}`} />}
          {task === 'window' && <span className={`draw-window light-${progress}`} />}
        </button>
        <div className="task-dots">
          {Array.from({ length: needed }).map((_, index) => <i className={index < progress ? 'filled' : ''} key={index} />)}
        </div>
        {progress >= needed && <button className="pencil-button" onClick={onComplete}>Вспомнить</button>}
      </div>
    </section>
  );
}

