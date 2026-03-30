import { useCallback, useState } from 'react';

import type { IconEntry } from './types';

const SIZES = [16, 24, 32, 48, 64] as const;

const COLOUR_SWATCHES = [
  { name: 'White', value: '#ffffff' },
  { name: 'Grey', value: '#a1a1aa' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Violet', value: '#8b5cf6' },
] as const;

type Props = {
  icon: IconEntry;
  getFontFamily: (family: string) => string;
  onClose: () => void;
};

function CopyBox({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-dim)' }}>
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="rounded px-2 py-0.5 text-[10px] font-medium transition-colors duration-150"
          style={{
            backgroundColor: copied ? 'var(--color-accent-cyan)' : 'var(--color-bg)',
            color: copied ? '#000' : 'var(--color-text-muted)',
            border: `1px solid ${copied ? 'var(--color-accent-cyan)' : 'var(--color-border)'}`,
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre
        className="overflow-x-auto rounded-md p-2.5 text-[11px] leading-relaxed"
        style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function IconDetailPanel({ icon, getFontFamily, onClose }: Props) {
  const [size, setSize] = useState<number>(48);
  const [colour, setColour] = useState('#ffffff');
  const [bgLight, setBgLight] = useState(false);

  const fontFamily = getFontFamily(icon.family);
  const codepoint = `U+${icon.codepoint.toString(16).toUpperCase().padStart(4, '0')}`;
  const importCode = `import { ${icon.meta.componentName} } from '${icon.meta.packageName}/static';`;
  const usageCode = `<${icon.meta.componentName} name="${icon.name}" size={${size}} color="${colour}" />`;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {icon.name}
          </h3>
          <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
            {icon.meta.displayName}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 transition-colors duration-150"
          style={{ color: 'var(--color-text-dim)' }}
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Preview */}
      <div
        className="flex items-center justify-center rounded-lg p-6"
        style={{
          backgroundColor: bgLight ? '#f4f4f5' : 'var(--color-bg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <span
          style={{
            fontFamily: `'${fontFamily}'`,
            fontSize: `${size}px`,
            color: colour,
            lineHeight: 1,
          }}
        >
          {String.fromCodePoint(icon.codepoint)}
        </span>
      </div>

      {/* Size selector */}
      <div>
        <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-dim)' }}>
          Size
        </span>
        <div className="mt-1 flex gap-1">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className="rounded px-2 py-1 text-[11px] font-medium transition-colors duration-150"
              style={{
                backgroundColor: size === s ? 'var(--color-accent-cyan)' : 'var(--color-bg)',
                color: size === s ? '#000' : 'var(--color-text-muted)',
                border: `1px solid ${size === s ? 'var(--color-accent-cyan)' : 'var(--color-border)'}`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colour selector */}
      <div>
        <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-dim)' }}>
          Colour
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {COLOUR_SWATCHES.map((swatch) => (
            <button
              key={swatch.value}
              onClick={() => setColour(swatch.value)}
              className="h-6 w-6 rounded-full transition-transform duration-150"
              style={{
                backgroundColor: swatch.value,
                outline: colour === swatch.value ? '2px solid var(--color-accent-cyan)' : 'none',
                outlineOffset: '2px',
                transform: colour === swatch.value ? 'scale(1.1)' : 'scale(1)',
              }}
              title={swatch.name}
            />
          ))}
          <input
            type="color"
            value={colour}
            onChange={(e) => setColour(e.target.value)}
            className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
            title="Custom colour"
          />
        </div>
      </div>

      {/* Background toggle */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-dim)' }}>
          Background:
        </span>
        <button
          onClick={() => setBgLight(false)}
          className="rounded px-2 py-0.5 text-[10px] font-medium transition-colors duration-150"
          style={{
            backgroundColor: !bgLight ? 'var(--color-accent-cyan)' : 'var(--color-bg)',
            color: !bgLight ? '#000' : 'var(--color-text-muted)',
            border: `1px solid ${!bgLight ? 'var(--color-accent-cyan)' : 'var(--color-border)'}`,
          }}
        >
          Dark
        </button>
        <button
          onClick={() => setBgLight(true)}
          className="rounded px-2 py-0.5 text-[10px] font-medium transition-colors duration-150"
          style={{
            backgroundColor: bgLight ? 'var(--color-accent-cyan)' : 'var(--color-bg)',
            color: bgLight ? '#000' : 'var(--color-text-muted)',
            border: `1px solid ${bgLight ? 'var(--color-accent-cyan)' : 'var(--color-border)'}`,
          }}
        >
          Light
        </button>
      </div>

      {/* Copy boxes */}
      <CopyBox label="Import" code={importCode} />
      <CopyBox label="Usage" code={usageCode} />

      {/* Metadata */}
      <div
        className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-md p-3 text-[11px]"
        style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
      >
        <span style={{ color: 'var(--color-text-dim)' }}>Name</span>
        <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{icon.name}</span>
        <span style={{ color: 'var(--color-text-dim)' }}>Codepoint</span>
        <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{codepoint}</span>
        <span style={{ color: 'var(--color-text-dim)' }}>Family</span>
        <span style={{ color: 'var(--color-text-muted)' }}>{icon.meta.displayName}</span>
        <span style={{ color: 'var(--color-text-dim)' }}>Package</span>
        <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
          {icon.meta.packageName}
        </span>
      </div>
    </div>
  );
}
