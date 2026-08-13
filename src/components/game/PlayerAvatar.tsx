import type { CSSProperties } from 'react';
import heroSprite from '../../assets/game/hero-topdown.png';
import heroWalkSprite from '../../assets/game/hero-walk.png';
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
      <img className="player-avatar__idle" src={heroSprite} alt="" draggable={false} />
      <span className="player-avatar__walk" aria-hidden="true" />
    </div>
  );
}
