import { memo } from 'react';

import type { IconEntry } from './types';

type Props = {
  icons: IconEntry[];
  selectedIcon: IconEntry | null;
  onSelect: (icon: IconEntry) => void;
  getFontFamily: (family: string) => string;
};

const IconCard = memo(function IconCard({
  icon,
  isSelected,
  onSelect,
  fontFamily,
}: {
  icon: IconEntry;
  isSelected: boolean;
  onSelect: () => void;
  fontFamily: string;
}) {
  return (
    <button
      onClick={onSelect}
      className="card-glow flex flex-col items-center gap-2 rounded-lg border p-3 transition-all duration-200"
      style={{
        backgroundColor: isSelected ? 'var(--color-surface-hover)' : 'var(--color-surface)',
        borderColor: isSelected ? 'var(--color-accent-cyan)' : 'var(--color-border)',
        boxShadow: isSelected ? '0 0 20px rgba(6, 182, 212, 0.15)' : 'none',
      }}
    >
      <span
        className="text-3xl leading-none"
        style={{
          fontFamily: `'${fontFamily}'`,
          color: 'var(--color-text)',
        }}
      >
        {String.fromCodePoint(icon.codepoint)}
      </span>
      <span className="w-full truncate text-center text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
        {icon.name}
      </span>
      <span className="text-[9px]" style={{ color: 'var(--color-text-dim)' }}>
        {icon.meta.displayName}
      </span>
    </button>
  );
});

export function IconGrid({ icons, selectedIcon, onSelect, getFontFamily }: Props) {
  if (icons.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          No icons found
        </p>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-dim)' }}>
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {icons.map((icon) => (
        <IconCard
          key={`${icon.family}-${icon.name}`}
          icon={icon}
          isSelected={selectedIcon?.name === icon.name && selectedIcon?.family === icon.family}
          onSelect={() => onSelect(icon)}
          fontFamily={getFontFamily(icon.family)}
        />
      ))}
    </div>
  );
}
