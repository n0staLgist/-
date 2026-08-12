import type { DialogueLine } from '../../game/types';

type DialogueBoxProps = {
  line: DialogueLine;
  current: number;
  total: number;
  onNext: () => void;
};

export function DialogueBox({ line, current, total, onNext }: DialogueBoxProps) {
  return (
    <section className="dialogue" aria-live="polite">
      {line.speaker && <span className="dialogue__speaker">{line.speaker}</span>}
      <p>{line.text}</p>
      <button className="dialogue__next" onClick={onNext}>
        {current === total - 1 ? 'Продолжить' : 'Дальше'}
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

