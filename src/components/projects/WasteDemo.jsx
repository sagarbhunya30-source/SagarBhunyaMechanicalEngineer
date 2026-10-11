import { useId, useState } from 'react';
import { motion } from 'framer-motion';

const BINS = [
  { id: 'wet', label: 'Wet', x: 72, color: '#6fbf73' },
  { id: 'dry', label: 'Dry', x: 200, color: '#e0c38a' },
  { id: 'metallic', label: 'Metallic', x: 328, color: '#a8b0b9' },
];

function Item({ kind }) {
  if (kind === 'wet') return <path d="M0 -10C6 -2 8 2 8 5a8 8 0 0 1-16 0c0-3 2-7 8-15Z" fill="#6fbf73" stroke="#2f6b33" />;
  if (kind === 'dry') return <rect x="-9" y="-9" width="18" height="18" rx="1" fill="#e0c38a" stroke="#8a6d33" transform="rotate(8)" />;
  return (
    <g>
      <rect x="-7" y="-10" width="14" height="20" rx="2.5" fill="#c9ced5" stroke="#5b6570" />
      <line x1="-7" y1="-5" x2="7" y2="-5" stroke="#5b6570" />
      <line x1="-7" y1="5" x2="7" y2="5" stroke="#5b6570" />
    </g>
  );
}

// Conceptual demonstration: the visitor picks the category; nothing is detected.
export default function WasteDemo() {
  const [sample, setSample] = useState(null);
  const [run, setRun] = useState(0);
  const [arrived, setArrived] = useState(false);
  const captionId = useId();
  const bin = BINS.find((b) => b.id === sample);

  const choose = (id) => {
    setSample(id);
    setArrived(false);
    setRun((r) => r + 1);
  };

  return (
    <figure className="overflow-hidden rounded-lg border border-blueprint-700/60 bg-[var(--sheet-bg-2)]">
      <svg viewBox="0 0 400 230" className="block h-auto w-full" role="img" aria-labelledby={captionId}>
        {/* Infeed chute */}
        <path d="M10 72h150" stroke="var(--sheet-muted)" strokeWidth="4" />
        <text x="12" y="62" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1" fill="var(--sheet-text)">
          INFEED
        </text>
        {/* Detection zone */}
        <rect x="165" y="38" width="70" height="56" rx="4" fill="none" stroke="var(--sheet-accent)" strokeDasharray="5 4" strokeOpacity={sample ? 1 : 0.6} />
        <text x="200" y="30" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" letterSpacing="1" fill="var(--sheet-accent)">
          SENSING ZONE (CONCEPT)
        </text>
        {/* Diverter paths */}
        {BINS.map((b) => (
          <path
            key={b.id}
            d={`M200 94 L${b.x} 150`}
            stroke={sample === b.id ? b.color : 'var(--sheet-dim)'}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
        ))}
        {/* Bins */}
        {BINS.map((b) => (
          <g key={b.id}>
            <path
              d={`M${b.x - 38} 152h76l-6 58h-64z`}
              fill={arrived && sample === b.id ? `${b.color}33` : 'var(--sheet-panel)'}
              stroke={sample === b.id ? b.color : 'var(--sheet-line)'}
              strokeOpacity={sample === b.id ? 1 : 0.5}
              strokeWidth="1.5"
            />
            <text x={b.x} y="224" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="1.2" fill="var(--sheet-text)">
              {b.label.toUpperCase()}
            </text>
          </g>
        ))}
        {/* Sample item */}
        {bin && (
          <motion.g
            key={run}
            initial={{ x: 20, y: 60 }}
            animate={{ x: [20, 200, 200, bin.x], y: [60, 60, 60, 182] }}
            transition={{ duration: 1.6, times: [0, 0.4, 0.6, 1], ease: 'easeInOut' }}
            onAnimationComplete={() => setArrived(true)}
          >
            <Item kind={bin.id} />
          </motion.g>
        )}
      </svg>
      <figcaption className="border-t border-blueprint-700/60 px-4 py-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a sample waste category">
          {BINS.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={sample === b.id}
              onClick={() => choose(b.id)}
              className={`btn !min-h-[40px] !py-1.5 !text-xs border ${
                sample === b.id ? 'border-amber-400 bg-amber-400/15 text-amber-200' : 'border-white/20 bg-white/[0.03] text-paper hover:border-amber-400/70'
              }`}
            >
              {b.label} sample
            </button>
          ))}
          {sample && (
            <button
              type="button"
              onClick={() => {
                setSample(null);
                setArrived(false);
              }}
              className="btn-ghost !min-h-[40px] !px-2 !py-1.5 !text-xs"
            >
              Reset
            </button>
          )}
        </div>
        <p className="mt-3 min-h-[2.5rem] text-sm text-steel-100" aria-live="polite">
          {bin
            ? `${bin.label} sample → identified as ${bin.label.toLowerCase()} waste in the sensing zone → directed to the ${bin.label} bin.`
            : 'Select a sample category to see the intended sorting concept.'}
        </p>
        <p id={captionId} className="mt-1 text-xs text-steel-400">
          Conceptual demonstration of the sorting principle. You choose the category; this website performs no sensor detection,
          and the animation is not footage of the prototype.
        </p>
      </figcaption>
    </figure>
  );
}
