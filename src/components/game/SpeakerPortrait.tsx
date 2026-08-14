import ayaPortrait from '../../assets/game/portrait-aya-v2.png';
import heroPortrait from '../../assets/game/portrait-hero-v3.png';
import shtrikhChildPortrait from '../../assets/game/portrait-shtrikh-child-v1.png';
import shtrikhPortrait from '../../assets/game/portrait-shtrikh-present-v1.png';

type SpeakerPortraitProps = { speaker?: string; childhood?: boolean };

export function SpeakerPortrait({ speaker, childhood = false }: SpeakerPortraitProps) {
  if (!speaker || speaker.includes('Мама') || !/(Ая|Штрих|Ты|Одноклассник)/.test(speaker)) return null;
  const character = speaker.includes('Ая') ? 'aya' : speaker.includes('Штрих') ? 'shtrikh' : speaker.includes('Одноклассник') ? 'classmate' : 'hero';
  const image = character === 'aya'
    ? ayaPortrait
    : character === 'shtrikh'
      ? (childhood ? shtrikhChildPortrait : shtrikhPortrait)
      : heroPortrait;
  return <span className={`speaker-portrait speaker-portrait--${character}`} aria-hidden="true"><img src={image} alt="" /></span>;
}
