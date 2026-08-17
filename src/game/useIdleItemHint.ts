import { useEffect, useState } from 'react';
import type { RoomItem } from './types';

export function useIdleItemHint(remaining: RoomItem[], isMoving: boolean) {
  const [hintedItem, setHintedItem] = useState<RoomItem | null>(null);
  const nextItem = remaining[0] ?? null;

  useEffect(() => {
    setHintedItem(null);
    if (isMoving || !nextItem) return;
    const showTimer = window.setTimeout(() => setHintedItem(nextItem), 3800);
    const hideTimer = window.setTimeout(() => setHintedItem(null), 6500);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [isMoving, nextItem]);

  return hintedItem;
}
