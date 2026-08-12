import type { StoryScene } from '../../game/types';

type StoryChapterProps = {
  chapter: string;
  color: 'red' | 'blue';
  scenes: StoryScene[];
  sceneIndex: number;
  onNext: () => void;
};

export function StoryChapter({ chapter, color, scenes, sceneIndex, onNext }: StoryChapterProps) {
  const scene = scenes[sceneIndex];
  return (
    <section className={`story-chapter story-chapter--${color}`}>
      <div className="story-chapter__texture" />
      <article className="story-card">
        <span className="eyebrow">{chapter} · {scene.label}</span>
        <div className="story-card__count">{String(sceneIndex + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}</div>
        <h1>{scene.title}</h1>
        <p className="story-card__scene">{scene.text}</p>
        <blockquote>
          <span>{scene.speaker}</span>
          {scene.dialogue}
        </blockquote>
        <button className="pencil-button" onClick={onNext}>{scene.action}</button>
        <div className="story-card__progress">
          {scenes.map((item, index) => <i className={index <= sceneIndex ? 'is-filled' : ''} key={item.title} />)}
        </div>
      </article>
    </section>
  );
}
