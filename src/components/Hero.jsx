import { useEffect, useMemo, useRef } from 'react';
import { profile } from '../data/profile.js';
import { goToSection, useReducedMotion, useWorkshop } from '../lib.js';
import { Gear, layoutGearTrain, useGearDrive } from './Gear.jsx';
import { DownloadIcon, PinIcon } from './Icons.jsx';
import RecruiterSummary from './RecruiterSummary.jsx';

const MODULE = 6;

function Workstation({ driveAngle }) {
  const gears = useMemo(
    () =>
      layoutGearTrain(
        MODULE,
        [
          { teeth: 18, tone: 'amber' },
          { teeth: 12, angle: 24, tone: 'steel' },
          { teeth: 30, angle: -38, tone: 'steel' },
        ],
        [150, 196],
      ),
    [],
  );
  const out = gears[2];
  const outR = (MODULE * out.teeth) / 2 + MODULE;

  return (
    <svg viewBox="0 0 560 400" className="h-auto w-full" role="img" aria-labelledby="ws-title">
      <title id="ws-title">Workstation illustration: a three-gear assembly on an engineering drawing with a vernier caliper</title>

      <defs>
        <pattern id="ws-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--sheet-grid)" strokeWidth="1" />
        </pattern>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="var(--sheet-strong)" />
        </marker>
        <linearGradient id="caliper-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d5dbe1" />
          <stop offset="1" stopColor="#8d96a0" />
        </linearGradient>
      </defs>

      {/* Drawing sheet */}
      <rect x="10" y="10" width="540" height="380" rx="6" fill="var(--sheet-bg)" />
      <rect x="10" y="10" width="540" height="380" rx="6" fill="url(#ws-grid)" />
      <rect x="22" y="22" width="516" height="356" fill="none" stroke="var(--sheet-line)" strokeWidth="1" />

      {/* Title block */}
      <g fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="var(--sheet-text)" letterSpacing="1">
        <rect x="378" y="324" width="160" height="54" fill="var(--sheet-bg-2)" stroke="var(--sheet-line)" />
        <line x1="378" y1="342" x2="538" y2="342" stroke="var(--sheet-line)" />
        <line x1="378" y1="360" x2="538" y2="360" stroke="var(--sheet-line)" />
        <text x="386" y="336">WORKSHOP PORTFOLIO</text>
        <text x="386" y="354">GEAR TRAIN · G.A.</text>
        <text x="386" y="372">S. BHUNYA</text>
      </g>

      {/* Centre lines */}
      <g stroke="var(--sheet-accent)" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="14 4 2 4">
        {gears.map((g, i) => (
          <g key={i}>
            <line x1={g.cx - (MODULE * g.teeth) / 2 - 18} y1={g.cy} x2={g.cx + (MODULE * g.teeth) / 2 + 18} y2={g.cy} />
            <line x1={g.cx} y1={g.cy - (MODULE * g.teeth) / 2 - 18} x2={g.cx} y2={g.cy + (MODULE * g.teeth) / 2 + 18} />
          </g>
        ))}
      </g>

      {/* Pitch circles */}
      {gears.map((g, i) => (
        <circle key={i} cx={g.cx} cy={g.cy} r={(MODULE * g.teeth) / 2} fill="none" stroke="var(--sheet-line)" strokeDasharray="6 4" />
      ))}

      {/* Gears */}
      {gears.map((g, i) => (
        <Gear key={i} cx={g.cx} cy={g.cy} teeth={g.teeth} module={MODULE} tone={g.tone} rotation={g.phase + g.ratio * driveAngle} />
      ))}

      {/* Dimension arrow over output gear (label only, no value) */}
      <g>
        <line x1={out.cx - outR} y1={out.cy - outR - 14} x2={out.cx + outR} y2={out.cy - outR - 14} stroke="var(--sheet-strong)" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <line x1={out.cx - outR} y1={out.cy - 20} x2={out.cx - outR} y2={out.cy - outR - 20} stroke="var(--sheet-line)" />
        <line x1={out.cx + outR} y1={out.cy - 20} x2={out.cx + outR} y2={out.cy - outR - 20} stroke="var(--sheet-line)" />
        <rect x={out.cx - 46} y={out.cy - outR - 21} width="92" height="14" fill="var(--sheet-bg)" />
        <text x={out.cx} y={out.cy - outR - 10.5} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="var(--sheet-text)" letterSpacing="1.5">
          OUTSIDE DIA.
        </text>
      </g>

      {/* Vernier caliper resting on the drawing */}
      <g transform="translate(40 330) rotate(-4)" className="cad-wire">
        <rect x="0" y="0" width="300" height="16" rx="2" fill="url(#caliper-steel)" />
        {Array.from({ length: 56 }, (_, i) => (
          <line key={i} x1={14 + i * 5} y1="0" x2={14 + i * 5} y2={i % 10 === 0 ? 8 : i % 5 === 0 ? 6 : 4} stroke="#2b3138" strokeWidth="0.8" />
        ))}
        <path d="M0 0h14v46l-6 6H0z" fill="url(#caliper-steel)" />
        <g transform="translate(180 -6)">
          <rect x="0" y="0" width="54" height="28" rx="3" fill="#b9c1ca" stroke="#5b6570" />
          <path d="M0 22h14v30l-6-6H0z" fill="url(#caliper-steel)" />
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={18 + i * 3.2} y1="20" x2={18 + i * 3.2} y2={i % 5 === 0 ? 12 : 15} stroke="#2b3138" strokeWidth="0.7" />
          ))}
          <circle cx="44" cy="8" r="3.5" fill="#5b6570" />
        </g>
      </g>
    </svg>
  );
}

function RotarySwitch() {
  const { switchOn, sequenceRunning, toggleSwitch, skip } = useWorkshop();
  return (
    <div className="steel flex flex-col gap-4 rounded-b-xl border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleSwitch}
          aria-pressed={switchOn}
          aria-describedby="switch-help"
          className="group relative grid h-16 w-16 shrink-0 place-items-center rounded-full"
        >
          <span className="sr-only">Start Exploring</span>
          <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="#14171b" stroke="#4a535d" />
            {/* Position marks */}
            <line x1="12" y1="12" x2="16" y2="16" stroke={switchOn ? '#5b6570' : '#f2a33a'} strokeWidth="2" />
            <line x1="52" y1="12" x2="48" y2="16" stroke={switchOn ? '#f2a33a' : '#5b6570'} strokeWidth="2" />
            <g
              style={{
                transform: `rotate(${switchOn ? 45 : -45}deg)`,
                transformOrigin: '32px 32px',
                transition: 'transform 220ms cubic-bezier(.3,1.4,.5,1)',
              }}
            >
              <circle cx="32" cy="32" r="21" fill="url(#knob)" stroke="#2b3138" />
              <rect x="29" y="12" width="6" height="40" rx="3" fill="#2b3138" />
              <rect x="30.5" y="13" width="3" height="10" rx="1.5" fill="#f2a33a" />
            </g>
            <defs>
              <radialGradient id="knob" cx="0.35" cy="0.3" r="0.8">
                <stop offset="0" stopColor="#c9ced5" />
                <stop offset="1" stopColor="#5b6570" />
              </radialGradient>
            </defs>
          </svg>
          <span className="pointer-events-none absolute inset-0 rounded-full ring-amber-400/0 transition group-hover:ring-2 group-hover:ring-amber-400/50" />
        </button>
        <div>
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-paper">Start Exploring</p>
          <p id="switch-help" className="mt-0.5 text-xs text-steel-300">
            {switchOn ? 'Turn back to return everything to standby.' : 'Turns the gears and opens the workshop bench.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:ml-auto">
        <div className="flex items-center gap-2" role="status" aria-live="polite">
          <span
            aria-hidden="true"
            className={`h-3 w-3 rounded-full border transition-colors duration-300 ${
              switchOn
                ? 'border-amber-300 bg-amber-400 shadow-[0_0_10px_2px_rgba(242,163,58,0.55)]'
                : 'border-steel-500 bg-graphite-700'
            }`}
          />
          <span className="engraved !text-steel-200">{switchOn ? 'Active' : 'Standby'}</span>
        </div>
        <button
          type="button"
          onClick={skip}
          className={`whitespace-nowrap rounded px-2 py-2 font-mono text-xs uppercase tracking-wider underline-offset-4 hover:underline ${
            sequenceRunning ? 'text-amber-300' : 'text-steel-300'
          }`}
        >
          Skip animation
        </button>
      </div>
    </div>
  );
}

export default function Hero() {
  const { switchOn, startExploring } = useWorkshop();
  const reducedMotion = useReducedMotion();
  const [angle, spin] = useGearDrive(reducedMotion);
  const wasOn = useRef(switchOn);

  // Turn the gear train when the switch is operated, and back again on standby.
  useEffect(() => {
    if (switchOn && !wasOn.current) spin(240, 1000);
    if (!switchOn && wasOn.current) spin(-240, 800);
    wasOn.current = switchOn;
  }, [switchOn, spin]);

  return (
    <section id="top" aria-labelledby="hero-title" className="bg-grid relative overflow-hidden border-b border-white/10">
      <div className="mx-auto grid max-w-page gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-16 lg:pt-16">
        <div className="flex flex-col justify-center">
          <p className="engraved !text-blueprint-400">Portfolio · Mechanical Workshop</p>
          <h1 id="hero-title" className="mt-3 text-4xl font-bold tracking-tight text-paper sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-amber-300 sm:text-xl">{profile.title}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-steel-100 sm:text-lg">{profile.tagline}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-steel-300">
            <PinIcon width={16} height={16} /> {profile.location}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={startExploring} className="btn-primary">
              Explore the Workshop
            </button>
            <a
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                goToSection('experience');
              }}
              className="btn-secondary"
            >
              View Experience
            </a>
            <a href={profile.cv.href} download={profile.cv.fileName} className="btn-secondary">
              <DownloadIcon /> Download CV
            </a>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 sm:px-5">
            <span className="engraved">Station 01 · Gear assembly</span>
            <span className="engraved hidden sm:inline">Control panel</span>
          </div>
          <div className="bg-graphite-950/60 p-2 sm:p-3">
            <Workstation driveAngle={angle} />
          </div>
          <RotarySwitch />
        </div>
      </div>

      <RecruiterSummary />
    </section>
  );
}
