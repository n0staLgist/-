import { useAdvanceKeys } from '../../game/useAdvanceKeys';
import { useTypewriter } from '../../game/useTypewriter';

type ExamineTextProps = { text: string; onClose: () => void };

export function ExamineText({ text, onClose }: ExamineTextProps) {
  const { visibleText, isComplete, complete } = useTypewriter(text);
  const advance = isComplete ? onClose : complete;
  useAdvanceKeys(advance);

  return (
    <aside className="examine-text" aria-live="polite">
      <span aria-hidden="true">✦</span>
      <p>{visibleText}<i className={isComplete ? '' : 'typewriter-caret'} aria-hidden="true" /></p>
      {isComplete && <button onClick={onClose}>Закрыть</button>}
    </aside>
  );
}
