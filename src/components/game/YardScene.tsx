import { taskCopy } from '../../game/story';
import type { YardTask } from '../../game/types';

type YardSceneProps = {
  completed: YardTask[];
  onTask: (task: YardTask) => void;
  onFinish: () => void;
};

export function YardScene({ completed, onTask, onFinish }: YardSceneProps) {
  const allDone = completed.length === 3;
  return (
    <section className={`scene yard-scene progress-${completed.length}`} aria-label="Жёлтый двор">
      <div className="scene__shade" />
      <div className="scene-instruction">
        <span>Глава I · Жёлтый двор</span>
        <strong>{allDone ? 'Цвет вернулся во двор' : 'Верни три потерянные детали'}</strong>
      </div>
      {(Object.keys(taskCopy) as YardTask[]).map((task) => (
        <button
          className={`yard-task yard-task--${task} ${completed.includes(task) ? 'is-done' : ''}`}
          key={task}
          onClick={() => onTask(task)}
          disabled={completed.includes(task)}
        >
          <span className="yard-task__mark">{completed.includes(task) ? '✓' : '+'}</span>
          <span>{completed.includes(task) ? 'Готово' : taskCopy[task].title}</span>
        </button>
      ))}
      {allDone && <button className="finish-button" onClick={onFinish}>Подойти к Штриху</button>}
      <div className="color-progress" aria-label={`Возвращено цветов: ${completed.length} из 3`}>
        {[0, 1, 2].map((part) => <i className={part < completed.length ? 'filled' : ''} key={part} />)}
      </div>
    </section>
  );
}

