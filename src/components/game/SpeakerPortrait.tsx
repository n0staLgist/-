import { useState } from 'react';
import ayaPortrait from '../../assets/game/portrait-aya-v2.webp';
import heroPortrait from '../../assets/game/portrait-hero-v3.webp';
import shtrikhChildPortrait from '../../assets/game/portrait-shtrikh-child-v1.webp';
import shtrikhPortrait from '../../assets/game/portrait-shtrikh-present-v1.webp';

type SpeakerPortraitProps = { speaker?: string; childhood?: boolean };

export function SpeakerPortrait({ speaker, childhood = false }: SpeakerPortraitProps) {
  if (!speaker || speaker.includes('Мама') || !/(Ая|Штрих|Ты|Одноклассник)/.test(speaker)) return null;
  const character = speaker.includes('Ая') ? 'aya' : speaker.includes('Штрих') ? 'shtrikh' : speaker.includes('Одноклассник') ? 'classmate' : 'hero';
  const image = character === 'aya'
    ? ayaPortrait
    : character === 'shtrikh'
      ? (childhood ? shtrikhChildPortrait : shtrikhPortrait)
      : heroPortrait;
  return <PortraitImage key={image} character={character} image={image} />;
}

function PortraitImage({ character, image }: { character: string; image: string }) {
  const [loaded, setLoaded] = useState(false);
  return <span className={`speaker-portrait speaker-portrait--${character} ${loaded ? 'is-loaded' : 'is-loading'}`} aria-hidden="true">
    <img src={image} alt="" decoding="async" onLoad={() => setLoaded(true)} />
  </span>;
}
