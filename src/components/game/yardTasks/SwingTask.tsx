import { useEffect, useRef, useState, type CSSProperties } from 'react';

type SwingTaskProps = { onReady: () => void };
type SwingStyle = CSSProperties & { '--swing-position': number };

export function SwingTask({ onReady }: SwingTaskProps) {
  const [position, setPosition] = useState(-100);
  const [pushes, setPushes] = useState(0);
  const [feedback, setFeedback] = useState('Дождись жёлтой отметки и толкни.');
  const direction = useRef(1);
  const positionRef = useRef(-100);

  useEffect(() => {
    const timer = window.setInterval(() => {
      let next = positionRef.current + direction.current * 4;
      if (next >= 100 || next <= -100) {
        direction.current *= -1;
        next = Math.max(-100, Math.min(100, next));
      }
      positionRef.current = next;
      setPosition(next);
    }, 32);
    return () => window.clearInterval(timer);
  }, []);

  const push = () => {
    const target = pushes % 2 === 0 ? 62 : -62;
    if (Math.abs(positionRef.current - target) > 24) {
      setFeedback('Не в ритм. Смотри, куда качеля возвращается.');
      return;
    }
    const next = pushes + 1;
    setPushes(next);
    setFeedback(next >= 4 ? 'Ритм вернулся.' : 'Точно. Теперь с другой стороны.');
    if (next >= 4) onReady();
  };

  return (
    <>
      <p className="task-guidance">{feedback}</p>
      <div className="swing-timing" style={{ '--swing-position': position } as SwingStyle}>
        <span className="swing-timing__target swing-timing__target--left" />
        <span className="swing-timing__target swing-timing__target--right" />
        <span className="swing-timing__seat" />
      </div>
      <button className="timing-button" onClick={push} disabled={pushes >= 4}>Толкнуть качелю</button>
      <div className="task-dots">{[0, 1, 2, 3].map((step) => <i className={step < pushes ? 'filled' : ''} key={step} />)}</div>
    </>
  );
}
