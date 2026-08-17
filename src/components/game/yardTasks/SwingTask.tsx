import { useEffect, useRef, useState, type CSSProperties } from 'react';

type SwingTaskProps = { onReady: () => void };
type SwingStyle = CSSProperties & { '--swing-position': number };

export function SwingTask({ onReady }: SwingTaskProps) {
  const [position, setPosition] = useState(-100);
  const [pushes, setPushes] = useState(0);
  const [feedback, setFeedback] = useState('Толкни, когда сиденье пройдёт через жёлтую линию.');
  const direction = useRef(1);
  const positionRef = useRef(-100);
  const canPush = useRef(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      let next = positionRef.current + direction.current * 4;
      if (next >= 100 || next <= -100) {
        direction.current *= -1;
        next = Math.max(-100, Math.min(100, next));
      }
      positionRef.current = next;
      if (Math.abs(next) > 48) canPush.current = true;
      setPosition(next);
    }, 32);
    return () => window.clearInterval(timer);
  }, []);

  const push = () => {
    if (!canPush.current || Math.abs(positionRef.current) > 25) {
      setFeedback('Чуть раньше. Толкай внизу, где жёлтая линия.');
      return;
    }
    canPush.current = false;
    const next = pushes + 1;
    setPushes(next);
    setFeedback(next >= 3 ? 'Качели снова скрипят в своём ритме.' : 'Да. Ещё один толчок на следующем проходе.');
    if (next >= 3) onReady();
  };

  return (
    <>
      <p className="task-guidance">{feedback}</p>
      <div className="swing-timing" style={{ '--swing-position': position } as SwingStyle}>
        <span className="swing-timing__center" />
        <span className="swing-timing__seat" />
      </div>
      <button className="timing-button" onClick={push} disabled={pushes >= 4}>Толкнуть качелю</button>
      <div className="task-dots">{[0, 1, 2].map((step) => <i className={step < pushes ? 'filled' : ''} key={step} />)}</div>
    </>
  );
}
