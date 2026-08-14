import { useCallback, useEffect, useState } from 'react';
import { playWritingTick } from './audio';

const LETTER_DELAY = 30;

export function useTypewriter(text: string, speaker?: string) {
  const [visibleLength, setVisibleLength] = useState(0);
  const isComplete = visibleLength >= text.length;

  useEffect(() => setVisibleLength(0), [text]);
  useEffect(() => {
    if (isComplete) return;
    const timer = window.setTimeout(() => {
      setVisibleLength((length) => {
        const nextLength = Math.min(length + 1, text.length);
        const character = text[nextLength - 1];
        if (nextLength % 3 === 0 && character?.trim()) playWritingTick(speaker);
        return nextLength;
      });
    }, LETTER_DELAY);
    return () => window.clearTimeout(timer);
  }, [isComplete, speaker, text, visibleLength]);

  const complete = useCallback(() => setVisibleLength(text.length), [text]);
  return { visibleText: text.slice(0, visibleLength), isComplete, complete };
}
