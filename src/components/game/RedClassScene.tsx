import type { StoryScene } from '../../game/types';

type RedClassSceneProps = {
  scenes: StoryScene[];
  sceneIndex: number;
  onNext: () => void;
};

export function RedClassScene({ scenes, sceneIndex, onNext }: RedClassSceneProps) {
  const scene = scenes[sceneIndex];
  const erased = sceneIndex >= 3;
  const restored = sceneIndex >= 4;

  return (
    <section className={`classroom-scene classroom-scene--${sceneIndex}`}>
      <div className="classroom-grid" />
      <div className="classroom-board">
        <span>ЗАВТРА</span>
        <small>классная работа</small>
      </div>
      <div className="faceless-students" aria-hidden="true">
        {[0, 1, 2, 3].map((student) => <i key={student} />)}
      </div>
      <div className="classroom-desks" aria-hidden="true"><i /><i /><i /></div>

      <div className={`desk-notebook ${erased ? 'is-erased' : ''} ${restored ? 'is-restored' : ''}`}>
        <div className="mini-streak"><i /><b /></div>
        <span className="red-strike" />
      </div>

      <article className="classroom-copy">
        <span className="eyebrow">Глава II · {scene.label}</span>
        <h1>{scene.title}</h1>
        <p>{scene.text}</p>
        <blockquote><b>{scene.speaker}</b>{scene.dialogue}</blockquote>
        <button className="pencil-button" onClick={onNext}>{scene.action}</button>
        <div className="story-card__progress">
          {scenes.map((item, index) => <i className={index <= sceneIndex ? 'is-filled' : ''} key={item.title} />)}
        </div>
      </article>
    </section>
  );
}
