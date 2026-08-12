import { useEffect } from 'react';

export function useAdvanceKeys(onAdvance: () => void) {
  useEffect(() => {
    const advance = (event: KeyboardEvent) => {
      if (event.repeat || (event.code !== 'Enter' && event.code !== 'Space')) return;
      event.preventDefault();
      onAdvance();
    };
    window.addEventListener('keydown', advance);
    return () => window.removeEventListener('keydown', advance);
  }, [onAdvance]);
}
