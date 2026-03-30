import { useCallback, useRef } from 'react';

type Props = {
  query: string;
  onChange: (query: string) => void;
};

export function SearchBar({ query, onChange }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(value), 300);
    },
    [onChange],
  );

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: 'var(--color-text-dim)' }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        defaultValue={query}
        onChange={handleChange}
        placeholder="Search icons..."
        className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors duration-150 focus:border-[var(--color-accent-cyan)]"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
        }}
      />
    </div>
  );
}
