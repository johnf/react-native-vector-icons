import { useCallback, useMemo, useState } from 'react';

import { getFontFamily, type IconFamily, iconFamilies } from '../../data/icon-families';
import { FilterPanel } from './FilterPanel';
import { IconDetailPanel } from './IconDetailPanel';
import { IconGrid } from './IconGrid';
import { SearchBar } from './SearchBar';
import type { FilterState, GlyphmapIndex, IconEntry } from './types';

const RESULTS_PER_PAGE = 200;

type Props = {
  glyphmapIndex: GlyphmapIndex;
};

export function Directory({ glyphmapIndex }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    status: 'all',
    licence: 'all',
    styles: [],
    families: [],
  });
  const [selectedIcon, setSelectedIcon] = useState<IconEntry | null>(null);
  const [visibleCount, setVisibleCount] = useState(RESULTS_PER_PAGE);

  // Build the flat list of all icons with metadata
  const allIcons = useMemo(() => {
    const icons: IconEntry[] = [];
    for (const [family, glyphs] of Object.entries(glyphmapIndex)) {
      const meta = iconFamilies[family];
      if (!meta) continue;
      for (const [name, codepoint] of Object.entries(glyphs)) {
        icons.push({ name, codepoint, family, meta });
      }
    }
    return icons;
  }, [glyphmapIndex]);

  // Available styles for the filter (derived from data)
  const availableStyles = useMemo(() => {
    const styles = new Set<string>();
    for (const meta of Object.values(iconFamilies)) {
      if (meta.style) styles.add(meta.style);
    }
    return Array.from(styles).sort();
  }, []);

  // Available families (sorted by display name)
  const availableFamilies = useMemo(() => {
    return Object.entries(iconFamilies)
      .filter(([key]) => key in glyphmapIndex)
      .sort(([, a], [, b]) => a.displayName.localeCompare(b.displayName));
  }, [glyphmapIndex]);

  // Filtered results
  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase();
    return allIcons.filter((icon) => {
      // Text search
      if (q && !icon.name.toLowerCase().includes(q) && !icon.family.toLowerCase().includes(q)) {
        return false;
      }
      // Status filter
      if (filters.status !== 'all' && icon.meta.status !== filters.status) {
        return false;
      }
      // Licence filter
      if (filters.licence !== 'all' && icon.meta.licence !== filters.licence) {
        return false;
      }
      // Style filter
      if (filters.styles.length > 0 && (!icon.meta.style || !filters.styles.includes(icon.meta.style))) {
        return false;
      }
      // Family filter
      if (filters.families.length > 0 && !filters.families.includes(icon.family)) {
        return false;
      }
      return true;
    });
  }, [allIcons, filters]);

  const visibleIcons = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleFilterChange = useCallback((update: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...update }));
    setVisibleCount(RESULTS_PER_PAGE);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + RESULTS_PER_PAGE);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
        <span className="gradient-text">Icon Directory</span>
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {filtered.length.toLocaleString()} icons across {availableFamilies.length} font families
      </p>

      <div className="mt-6">
        <SearchBar query={filters.query} onChange={(query) => handleFilterChange({ query })} />
      </div>

      <div className="mt-4">
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          availableStyles={availableStyles}
          availableFamilies={availableFamilies}
        />
      </div>

      <div className="mt-6 flex gap-6">
        {/* Icon grid */}
        <div className="flex-1 min-w-0">
          <IconGrid
            icons={visibleIcons}
            selectedIcon={selectedIcon}
            onSelect={setSelectedIcon}
            getFontFamily={getFontFamily}
          />
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                className="rounded-lg border px-6 py-2 text-sm font-medium transition-colors duration-150"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-bright)';
                  e.currentTarget.style.color = 'var(--color-text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }}
              >
                Load more ({(filtered.length - visibleCount).toLocaleString()} remaining)
              </button>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedIcon && (
          <div className="hidden w-80 shrink-0 lg:block">
            <IconDetailPanel icon={selectedIcon} getFontFamily={getFontFamily} onClose={() => setSelectedIcon(null)} />
          </div>
        )}
      </div>

      {/* Mobile detail panel (overlay) */}
      {selectedIcon && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedIcon(null)} />
          <div
            className="relative w-full max-h-[80vh] overflow-y-auto rounded-t-2xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <IconDetailPanel icon={selectedIcon} getFontFamily={getFontFamily} onClose={() => setSelectedIcon(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
