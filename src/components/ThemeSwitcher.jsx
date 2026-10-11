import { useTheme } from '../lib.js';

const ico = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

const OPTIONS = [
  {
    id: 'dark',
    label: 'Dark',
    icon: (
      <svg {...ico}>
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    ),
  },
  {
    id: 'light',
    label: 'Light',
    icon: (
      <svg {...ico}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    id: 'autocad',
    label: 'AutoCAD',
    short: 'CAD',
    icon: (
      <svg {...ico}>
        {/* crosshair + pickbox */}
        <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
        <rect x="9.5" y="9.5" width="5" height="5" />
      </svg>
    ),
  },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div role="group" aria-label="Colour theme" className="flex items-center rounded-md border border-white/15 bg-white/[0.03] p-0.5">
      {OPTIONS.map((o) => {
        const on = theme === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            title={`${o.label} theme`}
            onClick={() => setTheme(o.id)}
            className={`flex h-8 min-w-[2rem] items-center justify-center gap-1 rounded px-1.5 font-mono text-[0.65rem] font-medium uppercase tracking-wider transition-colors ${
              on ? 'bg-amber-400 text-on-accent' : 'text-steel-300 hover:text-paper'
            }`}
          >
            {o.icon}
            {o.short && <span className="hidden xl:inline">{o.short}</span>}
            <span className="sr-only">{o.label} theme</span>
          </button>
        );
      })}
    </div>
  );
}
