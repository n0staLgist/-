import type { DialogueLine } from '../../game/types';
import { displaySpeaker } from '../../game/playerName';
import { useAdvanceKeys } from '../../game/useAdvanceKeys';
import { useTypewriter } from '../../game/useTypewriter';
import { SpeakerPortrait } from './SpeakerPortrait';

type DialogueBoxProps = {
  line: DialogueLine;
  current: number;
  total: number;
  playerName: string;
  onNext: () => void;
};

export function DialogueBox({ line, current, total, playerName, onNext }: DialogueBoxProps) {
  const { visibleText, isComplete, complete } = useTypewriter(line.text);
  const advance = () => isComplete ? onNext() : complete();
  useAdvanceKeys(advance);

  return (
    <section className="dialogue" aria-live="polite">
      <SpeakerPortrait speaker={line.speaker} />
      {line.speaker && <span className="dialogue__speaker">{displaySpeaker(line.speaker, playerName)}</span>}
      <p>{visibleText}<i className={isComplete ? '' : 'typewriter-caret'} aria-hidden="true" /></p>
      {isComplete && <button className="dialogue__next" onClick={onNext}>
        {current === total - 1 ? 'Продолжить' : 'Дальше'}
        <span aria-hidden="true">→</span>
      </button>}
      <small className="dialogue__key-hint">Enter / Пробел</small>
    </section>
  );
}
