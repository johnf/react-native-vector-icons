import type { IconFamily } from '../../data/icon-families';
import type { FilterState } from './types';

type Props = {
  filters: FilterState;
  onChange: (update: Partial<FilterState>) => void;
  availableStyles: string[];
  availableFamilies: [string, IconFamily][];
};

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150"
      style={{
        backgroundColor: active ? 'var(--color-accent-cyan)' : 'var(--color-surface)',
        color: active ? '#000' : 'var(--color-text-muted)',
        borderWidth: '1px',
        borderColor: active ? 'var(--color-accent-cyan)' : 'var(--color-border)',
      }}
    >
      {label}
    </button>
  );
}

export function FilterPanel({ filters, onChange, availableStyles, availableFamilies }: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Status */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-dim)' }}>
          Status:
        </span>
        <Chip label="All" active={filters.status === 'all'} onClick={() => onChange({ status: 'all' })} />
        <Chip label="Active" active={filters.status === 'active'} onClick={() => onChange({ status: 'active' })} />
        <Chip
          label="Deprecated"
          active={filters.status === 'deprecated'}
          onClick={() => onChange({ status: 'deprecated' })}
        />
      </div>

      {/* Licence */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-dim)' }}>
          Licence:
        </span>
        <Chip label="All" active={filters.licence === 'all'} onClick={() => onChange({ licence: 'all' })} />
        <Chip label="Free" active={filters.licence === 'free'} onClick={() => onChange({ licence: 'free' })} />
        <Chip label="Pro" active={filters.licence === 'pro'} onClick={() => onChange({ licence: 'pro' })} />
      </div>

      {/* Style */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-dim)' }}>
          Style:
        </span>
        {availableStyles.map((style) => (
          <Chip
            key={style}
            label={style}
            active={filters.styles.includes(style)}
            onClick={() => {
              const styles = filters.styles.includes(style)
                ? filters.styles.filter((s) => s !== style)
                : [...filters.styles, style];
              onChange({ styles });
            }}
          />
        ))}
      </div>

      {/* Family dropdown */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-dim)' }}>
          Family:
        </span>
        <select
          multiple={false}
          value={filters.families.length === 1 ? filters.families[0] : ''}
          onChange={(e) => {
            const val = e.target.value;
            onChange({ families: val ? [val] : [] });
          }}
          className="rounded-lg border py-1 pl-2 pr-6 text-xs outline-none transition-colors duration-150"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <option value="">All families</option>
          {availableFamilies.map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.displayName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
