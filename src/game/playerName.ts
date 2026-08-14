const HERO_SPEAKER = /^Ты(?<suffix>.*)$/;

export function displaySpeaker(speaker: string | undefined, playerName: string) {
  if (!speaker) return undefined;
  const match = speaker.match(HERO_SPEAKER);
  return match ? `${playerName}${match.groups?.suffix ?? ''}` : speaker;
}
