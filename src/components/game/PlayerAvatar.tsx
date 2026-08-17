import type { CSSProperties } from 'react';
import heroIdleSprite from '../../assets/game/hero-idle-four-direction-v1.webp';
import heroWalkSprite from '../../assets/game/hero-four-direction-v4.webp';
import type { FacingDirection, RoomPosition } from '../../game/useRoomMovement';
import '../../styles/playerAvatar.css';

type PlayerAvatarProps = {
  position: RoomPosition;
  facing: FacingDirection;
  isMoving: boolean;
};

type PlayerStyle = CSSProperties & {
  '--idle-sprite': string;
  '--player-scale': number;
  '--walk-sprite': string;
};

export function PlayerAvatar({ position, facing, isMoving }: PlayerAvatarProps) {
  const depthScale = 0.96 + ((position.y - 28) / 64) * 0.12;
  const style: PlayerStyle = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    '--idle-sprite': `url(${heroIdleSprite})`,
    '--player-scale': depthScale,
    '--walk-sprite': `url(${heroWalkSprite})`,
  };

  return (
    <div className={`player-avatar ${isMoving ? 'is-walking' : ''}`} data-facing={facing} style={style} aria-label="Герой">
      <span className="player-avatar__sprite" aria-hidden="true" />
    </div>
  );
}
