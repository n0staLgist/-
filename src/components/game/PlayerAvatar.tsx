import type { CSSProperties } from 'react';
import type { FacingDirection, RoomPosition } from '../../game/useRoomMovement';
import '../../styles/playerAvatar.css';

type PlayerAvatarProps = {
  position: RoomPosition;
  facing: FacingDirection;
  isMoving: boolean;
};

type PlayerStyle = CSSProperties & { '--player-scale': number };

export function PlayerAvatar({ position, facing, isMoving }: PlayerAvatarProps) {
  const depthScale = 0.72 + ((position.y - 53) / 41) * 0.38;
  const style: PlayerStyle = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    '--player-scale': depthScale,
  };

  return (
    <div className={`player-avatar ${isMoving ? 'is-walking' : ''}`} data-facing={facing} style={style} aria-label="Герой">
      <i className="player-avatar__head" />
      <i className="player-avatar__hair" />
      <i className="player-avatar__body" />
      <i className="player-avatar__arm player-avatar__arm--front" />
      <i className="player-avatar__arm player-avatar__arm--back" />
      <i className="player-avatar__leg player-avatar__leg--front" />
      <i className="player-avatar__leg player-avatar__leg--back" />
    </div>
  );
}
