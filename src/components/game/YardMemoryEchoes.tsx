import type { YardTask } from '../../game/types';

type YardMemoryEchoesProps = { completed: YardTask[] };

export function YardMemoryEchoes({ completed }: YardMemoryEchoesProps) {
  return (
    <div className="yard-memory-echoes" aria-hidden="true">
      {completed.includes('swing') && <span className="yard-memory-echoes__swing"><i /><i /></span>}
      {completed.includes('hopscotch') && <span className="yard-memory-echoes__chalk"><i /></span>}
      {completed.includes('window') && <span className="yard-memory-echoes__window"><i /><i /></span>}
    </div>
  );
}
