import type { StoryScene } from '../../game/types';
import { useAdvanceKeys } from '../../game/useAdvanceKeys';
import { useTypewriter } from '../../game/useTypewriter';

type BlueRoomSceneProps = {
  scenes: StoryScene[];
  sceneIndex: number;
  onNext: () => void;
};

export function BlueRoomScene({ scenes, sceneIndex, onNext }: BlueRoomSceneProps) {
  const scene = scenes[sceneIndex];
  const { visibleText, isComplete, complete } = useTypewriter(scene.dialogue);
  const advance = isComplete ? onNext : complete;
  useAdvanceKeys(advance);
  const trapped = sceneIndex === 3;
  const freed = sceneIndex >= 4;
  const smiling = sceneIndex >= 5;

  return (
    <section className={`blue-room blue-room--${sceneIndex}`}>
      <div className="blue-room__paper" />
      <div className="empty-window"><span /></div>
      <div className="moving-boxes" aria-hidden="true"><i /><i /><i /></div>
      <div className="tally-wall" aria-label="Много отметок слова завтра">
        {Array.from({ length: 18 }).map((_, index) => <i key={index} />)}
      </div>
      <div className={`scribbled-door ${trapped ? 'is-closed' : ''} ${freed ? 'is-erased' : ''}`}>
        <span>ВЫХОД</span><i /><i /><i /><i />
      </div>

      <div className={`room-streak ${freed ? 'has-arm' : ''} ${smiling ? 'can-smile' : ''}`}>
        <span className="room-streak__head"><i /><i /><b /></span>
        <span className="room-streak__body" />
        <span className="room-streak__scarf" />
        <span className="room-streak__arm room-streak__arm--left" />
        <span className="room-streak__arm room-streak__arm--right" />
        <span className="room-streak__leg room-streak__leg--left" />
        <span className="room-streak__leg room-streak__leg--right" />
        {sceneIndex >= 2 && <span className="paper-tears"><i /><i /></span>}
      </div>

      <article className="blue-room__copy">
        <span className="eyebrow">Глава III · {scene.label}</span>
        <h1>{scene.title}</h1>
        <p>{scene.text}</p>
        <blockquote><b>{scene.speaker}</b>{visibleText}<i className={isComplete ? '' : 'typewriter-caret'} aria-hidden="true" /></blockquote>
        {isComplete && <button className="pencil-button" onClick={onNext}>{scene.action}</button>}
        <div className="blue-room__progress">
          {scenes.map((item, index) => <i className={index <= sceneIndex ? 'is-filled' : ''} key={item.title} />)}
        </div>
      </article>
    </section>
  );
}
