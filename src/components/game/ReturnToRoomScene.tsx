import { useState } from 'react';
import '../../styles/returnToRoom.css';

type ReturnToRoomSceneProps = {
  onContinue: () => void;
};

export function ReturnToRoomScene({ onContinue }: ReturnToRoomSceneProps) {
  const [isReading, setIsReading] = useState(false);

  return (
    <section className="return-room" aria-label="Возвращение из тетради">
      <div className="return-room__desk" aria-hidden="true">
        <div className="return-room__notebook"><span>Штрих<br />и его мир</span></div>
      </div>

      {isReading ? (
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
          <h1>Комната не изменилась.</h1>
          <p>Тетрадь лежит открытой на столе. Рядом виден сложенный медицинский документ.</p>
          <div className="return-room__actions">
            <button onClick={() => setIsReading(true)}>Прочитать документ</button>
            <button onClick={onContinue}>Позвать Аю</button>
          </div>
        </article>
      )}
    </section>
  );
}
