import { useState } from 'react';
import type { StoryScene } from '../../game/types';
import { displaySpeaker } from '../../game/playerName';
import { useAdvanceKeys } from '../../game/useAdvanceKeys';
import { useTypewriter } from '../../game/useTypewriter';
import { SpeakerPortrait } from './SpeakerPortrait';

type RedClassSceneProps = {
  scenes: StoryScene[];
  sceneIndex: number;
  playerName: string;
  onNext: () => void;
};

export function RedClassScene({ scenes, sceneIndex, playerName, onNext }: RedClassSceneProps) {
  const [exitRevealed, setExitRevealed] = useState(false);
  const scene = scenes[sceneIndex];
  const { visibleText, isComplete, complete } = useTypewriter(scene.dialogue, scene.speaker);
  const advance = isComplete ? onNext : complete;
  useAdvanceKeys(advance);
  const erased = sceneIndex >= 4;
  const restored = sceneIndex >= scenes.length - 1;
  const actionLabel = sceneIndex === 4 && exitRevealed ? 'Бросить его снова' : scene.action;
  const handleAction = () => {
    if (sceneIndex === 4 && !exitRevealed) {
      setExitRevealed(true);
      return;
    }
    onNext();
  };

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
        <blockquote><SpeakerPortrait speaker={scene.speaker} /><b>{displaySpeaker(scene.speaker, playerName)}</b>{visibleText}<i className={isComplete ? '' : 'typewriter-caret'} aria-hidden="true" /></blockquote>
        {isComplete && <button className="pencil-button" aria-live="polite" onClick={handleAction}>{actionLabel}</button>}
        <div className="story-card__progress">
          {scenes.map((item, index) => <i className={index <= sceneIndex ? 'is-filled' : ''} key={item.title} />)}
        </div>
      </article>
    </section>
  );
}
