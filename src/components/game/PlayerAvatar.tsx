import type { CSSProperties } from 'react';
import heroWalkSprite from '../../assets/game/hero-walk-simple-v3.png';
import type { FacingDirection, RoomPosition } from '../../game/useRoomMovement';
import '../../styles/playerAvatar.css';

type PlayerAvatarProps = {
  position: RoomPosition;
  facing: FacingDirection;
  isMoving: boolean;
};

type PlayerStyle = CSSProperties & {
  '--player-scale': number;
  '--walk-sprite': string;
};

export function PlayerAvatar({ position, facing, isMoving }: PlayerAvatarProps) {
  const depthScale = 0.88 + ((position.y - 28) / 64) * 0.2;
  const style: PlayerStyle = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    '--player-scale': depthScale,
    '--walk-sprite': `url(${heroWalkSprite})`,
  };

  return (
    <div className={`player-avatar ${isMoving ? 'is-walking' : ''}`} data-facing={facing} style={style} aria-label="Герой">
      <span className="player-avatar__sprite" aria-hidden="true" />
    </div>
  );
}
