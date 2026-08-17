import type { CSSProperties } from 'react';
import type { RoomPosition } from '../../game/useRoomMovement';

type InteractionPromptProps = {
  position: RoomPosition;
  text: string;
};

export function InteractionPrompt({ position, text }: InteractionPromptProps) {
  if (!text) return null;
  return (
    <p className="interaction-prompt" style={{ left: `${position.x}%`, top: `${position.y}%` } as CSSProperties}>
      <kbd>E</kbd><span>{text}</span>
    </p>
  );
}
