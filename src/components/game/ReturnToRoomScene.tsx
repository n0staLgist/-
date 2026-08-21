import { useEffect, useState } from 'react';
import '../../styles/returnToRoom.css';

type ReturnToRoomSceneProps = {
  onContinue: () => void;
};

export function ReturnToRoomScene({ onContinue }: ReturnToRoomSceneProps) {
  const [isReading, setIsReading] = useState(false);
  const [isArriving, setIsArriving] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsArriving(false), 2100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className={`return-room ${isArriving ? 'return-room--arriving' : ''}`} aria-label="Возвращение из тетради">
      <div className="return-room__desk" aria-hidden="true">
        <div className="return-room__notebook">
          <span>Штрих<br />и его мир</span>
          <i className="return-room__colors" />
        </div>
      </div>

      {isArriving ? <div className="return-room__arrival" aria-hidden="true"><i /><i /><i /></div> : null}
      {!isArriving && (isReading ? (
        <article className="medical-note">
          <span>выписка из консультативного заключения</span>
          <h1>Предварительное заключение</h1>
          <p>Реакция на продолжительный стресс. Отмечаются нарушения сна и краткие эпизоды дереализации.</p>
          <p>Рекомендованы наблюдение, стабильный режим сна и возвращение к привычной творческой деятельности.</p>
          <i aria-hidden="true">подпись неразборчива</i>
          <button onClick={onContinue}>Отложить документ и позвать Аю</button>
        </article>
      ) : (
        <article className="return-room__copy">
          <span>снова дома</span>
          <h1>Комната осталась на месте.</h1>
          <p>Тетрадь лежит открытой на столе. Три цвета пересекают сгиб. Рядом — сложенный медицинский документ.</p>
          <div className="return-room__actions">
            <button onClick={() => setIsReading(true)}>Прочитать документ</button>
            <button onClick={onContinue}>Позвать Аю</button>
          </div>
        </article>
      ))}
    </section>
  );
}
