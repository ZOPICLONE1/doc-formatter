import type { DocDirection } from '../types';
import { DIRECTION_LABELS, DIRECTION_DESC } from '../constants';

interface Props {
  current: DocDirection;
  onChange: (d: DocDirection) => void;
}

const DIRECTIONS: DocDirection[] = ['official', 'academic', 'business'];

export default function DirectionTabs({ current, onChange }: Props) {
  return (
    <div className="direction-tabs">
      {DIRECTIONS.map((d) => (
        <button
          key={d}
          className={`direction-tab ${d === current ? 'active' : ''}`}
          onClick={() => onChange(d)}
          title={DIRECTION_DESC[d]}
        >
          <span className="direction-icon">
            {d === 'official' ? '🏛' : d === 'academic' ? '🎓' : '💼'}
          </span>
          <span className="direction-label">{DIRECTION_LABELS[d]}</span>
        </button>
      ))}
    </div>
  );
}
