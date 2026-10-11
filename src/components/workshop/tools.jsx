import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { profile } from '../../data/profile.js';
import { useMediaQuery, useProjectDialog, useReducedMotion } from '../../lib.js';
import { Gear, layoutGearTrain, useGearDrive } from '../Gear.jsx';

const READOUT = 'workshop-readout';

export function ToolCard({ name, target, active, className = '', children }) {
  return (
    <div
      className={`panel flex flex-col p-3 transition-colors sm:p-4 ${active ? '!border-amber-400/70' : ''} ${className}`}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <span className="engraved">{name}</span>
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-amber-300">
          <span aria-hidden="true">→ </span>
          {target}
        </span>
      </div>
      {children}
    </div>
  );
}

const toolButton =
  'group block w-full rounded-lg border border-white/5 bg-graphite-950/50 p-2 transition hover:border-amber-400/40 hover:bg-graphite-950/80';

/* ---------- Gear assembly → Experience ---------- */
export function GearTool({ active, onToggle }) {
  const reducedMotion = useReducedMotion();
  const [angle, spin] = useGearDrive(reducedMotion);
  const gears = useMemo(
    () => layoutGearTrain(5, [{ teeth: 11, tone: 'amber' }, { teeth: 17, angle: -8, tone: 'steel' }], [52, 62]),
    [],
  );
  return (
    <ToolCard name="Gear assembly" target="Experience" active={active}>
      <button
        type="button"
        className={toolButton}
        aria-pressed={active}
        aria-controls={READOUT}
        onClick={() => {
          spin(active ? -200 : 200, 650);
          onToggle('experience');
        }}
      >
        <span className="sr-only">Gear assembly: show Experience and training timeline</span>
        <svg viewBox="0 0 190 120" className="mx-auto h-24 w-auto sm:h-28" aria-hidden="true">
          {gears.map((g, i) => (
            <Gear key={i} cx={g.cx} cy={g.cy} teeth={g.teeth} module={5} tone={g.tone} rotation={g.phase + g.ratio * angle} />
          ))}
        </svg>
      </button>
    </ToolCard>
  );
}

/* ---------- Vernier caliper → Skills ---------- */
const JAW_CLOSED = 70;
const JAW_TRAVEL = 290;
const REVEAL_AT = 0.6;

function CaliperDrawing({ open }) {
  const x = JAW_CLOSED + open * JAW_TRAVEL;
  return (
    <svg viewBox="0 0 520 130" className="cad-wire block h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="cal-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dde2e7" />
          <stop offset="1" stopColor="#8d96a0" />
        </linearGradient>
      </defs>
      {/* Beam with main scale */}
      <rect x="40" y="30" width="465" height="22" rx="2" fill="url(#cal-beam)" />
      {Array.from({ length: 86 }, (_, i) => (
        <line key={i} x1={72 + i * 5} y1="30" x2={72 + i * 5} y2={i % 10 === 0 ? 42 : i % 5 === 0 ? 39 : 36} stroke="#2b3138" strokeWidth="0.8" />
      ))}
      {/* Fixed jaw */}
      <path d="M40 30h30v90l-12-10H40z" fill="url(#cal-beam)" stroke="#5b6570" strokeWidth="0.8" />
      <path d="M52 30V12l18 6v12z" fill="url(#cal-beam)" stroke="#5b6570" strokeWidth="0.8" />
      {/* Gap label */}
      <text
        x={(70 + x) / 2}
        y="92"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="13"
        letterSpacing="2"
        fill="#f2a33a"
        opacity={Math.min(1, Math.max(0, (open - 0.25) / 0.35))}
      >
        SKILLS
      </text>
      {/* Movable jaw + slider */}
      <g transform={`translate(${x} 0)`}>
        <rect x="0" y="22" width="96" height="38" rx="3" fill="#c3cad1" stroke="#5b6570" />
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={10 + i * 4.5} y1="52" x2={10 + i * 4.5} y2={i % 5 === 0 ? 42 : 46} stroke="#2b3138" strokeWidth="0.8" />
        ))}
        <path d="M0 60h30v50l-12 10H0z" fill="url(#cal-beam)" stroke="#5b6570" strokeWidth="0.8" />
        <path d="M0 22V12l-18 6v4z" fill="url(#cal-beam)" stroke="#5b6570" strokeWidth="0.8" />
        <circle cx="78" cy="33" r="5" fill="#5b6570" />
        <path d="M66 62h22l-4 10h-14z" fill="#8a939e" />
      </g>
    </svg>
  );
}

export function CaliperTool({ active, onSelect }) {
  const canDrag = useMediaQuery('(min-width: 768px) and (pointer: fine), (min-width: 1024px)');
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(0);
  const openRef = useRef(0);
  const wrap = useRef(null);
  const dragging = useRef(false);
  const frame = useRef(0);
  const wasActive = useRef(active);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const animateTo = useCallback(
    (target) => {
      cancelAnimationFrame(frame.current);
      if (reducedMotion) {
        openRef.current = target;
        setOpen(target);
        return;
      }
      const from = openRef.current;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 450);
        const v = from + (target - from) * (1 - Math.pow(1 - t, 3));
        openRef.current = v;
        setOpen(v);
        if (t < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [reducedMotion],
  );

  // When another tool is chosen (or the bench is reset) the jaw closes again.
  useEffect(() => {
    if (wasActive.current && !active && !dragging.current) animateTo(0);
    wasActive.current = active;
  }, [active, animateTo]);

  const update = (v) => {
    cancelAnimationFrame(frame.current);
    const next = Math.max(0, Math.min(1, v));
    if (openRef.current < REVEAL_AT && next >= REVEAL_AT) onSelect('skills');
    if (openRef.current >= REVEAL_AT && next < REVEAL_AT) onSelect(null);
    openRef.current = next;
    setOpen(next);
  };

  const fromPointer = (clientX) => {
    const rect = wrap.current.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / rect.width) * 520;
    update((svgX - 48 - JAW_CLOSED) / JAW_TRAVEL);
  };

  const toggle = () => {
    if (active) {
      onSelect(null);
      animateTo(0);
    } else {
      onSelect('skills');
      animateTo(1);
    }
  };

  const onKeyDown = (e) => {
    const steps = { ArrowRight: 0.1, ArrowUp: 0.1, ArrowLeft: -0.1, ArrowDown: -0.1, PageUp: 0.25, PageDown: -0.25 };
    if (e.key in steps) update(openRef.current + steps[e.key]);
    else if (e.key === 'Home') update(0);
    else if (e.key === 'End') update(1);
    else return;
    e.preventDefault();
  };

  const thumbLeft = ((JAW_CLOSED + open * JAW_TRAVEL - 4) / 520) * 100;
  const valueText = open >= REVEAL_AT ? 'Open — skills shown' : open > 0.02 ? 'Partly open' : 'Closed';

  return (
    <ToolCard name="Vernier caliper" target="Skills" active={active} className="col-span-2">
      <div className="rounded-lg border border-white/5 bg-graphite-950/50 px-2 py-1">
        <div ref={wrap} className="relative touch-pan-y">
          <CaliperDrawing open={open} />
          {canDrag && (
            <div
              role="slider"
              tabIndex={0}
              aria-label="Caliper jaw: slide open to reveal skills"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(open * 100)}
              aria-valuetext={valueText}
              aria-controls={READOUT}
              onKeyDown={onKeyDown}
              onPointerDown={(e) => {
                dragging.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
              onPointerUp={() => (dragging.current = false)}
              onPointerCancel={() => (dragging.current = false)}
              className="absolute top-[14%] h-[80%] w-[19%] cursor-ew-resize touch-none rounded-md ring-amber-400/0 hover:ring-2 hover:ring-amber-400/40"
              style={{ left: `${thumbLeft}%` }}
            />
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-steel-400">
          {canDrag ? 'Drag the movable jaw (or use arrow keys), or press the button.' : 'Tap the button to open the caliper.'}
        </p>
        <button type="button" onClick={toggle} aria-controls={READOUT} aria-pressed={active} className="btn-secondary !min-h-[40px] !py-1.5 !text-xs">
          {active ? 'Close caliper' : 'Show skills'}
        </button>
      </div>
    </ToolCard>
  );
}

/* ---------- Toolbox → Education ---------- */
export function ToolboxTool({ active, onToggle }) {
  return (
    <ToolCard name="Toolbox" target="Education" active={active}>
      <button type="button" className={toolButton} aria-pressed={active} aria-controls={READOUT} onClick={() => onToggle('education')}>
        <span className="sr-only">Toolbox: open to show Education and qualifications</span>
        <svg viewBox="0 0 190 120" className="cad-wire mx-auto h-24 w-auto sm:h-28" style={{ '--wire': '#3be23b' }} aria-hidden="true">
          {/* Qualification cards inside the tray */}
          <g opacity={active ? 1 : 0} style={{ transition: 'opacity 250ms 150ms' }}>
            <rect x="52" y="34" width="38" height="30" rx="2" fill="#ece8e1" transform="rotate(-6 71 49)" />
            <rect x="96" y="32" width="38" height="30" rx="2" fill="#ece8e1" transform="rotate(5 115 47)" />
            <path d="M58 44h22M58 50h16M102 42h22M102 48h16" stroke="#4a8fd6" strokeWidth="2" transform="rotate(-2 95 46)" />
          </g>
          {/* Box body */}
          <rect x="30" y="56" width="130" height="50" rx="4" fill="#b86f0e" />
          <rect x="30" y="56" width="130" height="50" rx="4" fill="url(#gear-amber)" opacity="0.85" />
          <rect x="30" y="76" width="130" height="4" fill="rgba(0,0,0,0.25)" />
          <rect x="88" y="66" width="14" height="8" rx="1.5" fill="#2b3138" />
          {/* Lid, hinged at the back edge */}
          <g
            style={{
              transform: active ? 'rotate(-28deg)' : 'rotate(0deg)',
              transformOrigin: '30px 56px',
              transition: 'transform 300ms cubic-bezier(.3,1.3,.5,1)',
            }}
          >
            <path d="M30 56h130l-6-14H36z" fill="#e08c1a" stroke="#8a560f" />
            <path d="M78 42v-8h34v8" fill="none" stroke="#2b3138" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      </button>
    </ToolCard>
  );
}

/* ---------- Blueprint folder → Projects ---------- */
export function BlueprintTool({ active, onToggle }) {
  const { openProject } = useProjectDialog();
  return (
    <ToolCard name="Blueprint folder" target="Projects" active={active}>
      <button type="button" className={toolButton} aria-pressed={active} aria-controls={READOUT} onClick={() => onToggle('projects')}>
        <span className="sr-only">Blueprint folder: show Projects</span>
        <svg viewBox="0 0 190 100" className="cad-wire mx-auto h-20 w-auto sm:h-24" style={{ '--wire': '#33d6e6' }} aria-hidden="true">
          <path d="M28 22h44l8 8h82v62H28z" fill="#1e4a78" stroke="#4a8fd6" />
          <g
            style={{
              transform: active ? 'translateY(-10px)' : 'translateY(0)',
              transition: 'transform 250ms ease-out',
            }}
          >
            <rect x="46" y="24" width="100" height="56" fill="#123456" stroke="#9cc7f2" strokeWidth="0.8" />
            <path d="M54 32h84v40H54z" fill="none" stroke="#7ab0e8" strokeWidth="0.6" strokeDasharray="3 2" />
            <circle cx="80" cy="52" r="12" fill="none" stroke="#9cc7f2" />
            <path d="M100 44h30M100 52h22M100 60h26" stroke="#9cc7f2" strokeWidth="1.2" />
          </g>
          <path d="M28 46h134v46H28z" fill="#16406b" stroke="#4a8fd6" />
          <text x="95" y="74" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="2" fill="#9cc7f2">
            DRAWINGS
          </text>
        </svg>
      </button>
      <ul className="mt-2 grid gap-1.5">
        {profile.projects.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={(e) => openProject(p.id, e.currentTarget)}
              className="flex min-h-[40px] w-full items-center gap-2 rounded border border-blueprint-700/70 bg-blueprint-900/40 px-2.5 py-1.5 text-left text-xs text-blueprint-300 hover:border-blueprint-400"
            >
              <span className="font-mono text-amber-300">{p.drawingNo}</span>
              <span className="truncate">{p.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </ToolCard>
  );
}

/* ---------- Control panel → Contact ---------- */
export function ControlPanelTool({ active, onToggle }) {
  return (
    <ToolCard name="Control panel" target="Contact" active={active}>
      <div className="steel flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-white/10 px-3 py-4">
        <div className="flex items-center gap-4" aria-hidden="true">
          {['PWR', 'COM'].map((l, i) => (
            <span key={l} className="flex items-center gap-1.5 font-mono text-[0.6rem] tracking-widest text-steel-300">
              <span
                className={`h-2 w-2 rounded-full ${
                  i === 0 || active ? 'bg-amber-400 shadow-[0_0_8px_rgba(242,163,58,0.7)]' : 'bg-graphite-600'
                }`}
              />
              {l}
            </span>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={active}
          aria-controls={READOUT}
          aria-label="Contact button: show email and phone"
          onClick={() => onToggle('contact')}
          className="group grid h-20 w-20 place-items-center rounded-full border-4 border-graphite-700 bg-graphite-950 shadow-inner"
        >
          <span
            className={`grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b from-[#ffc46b] to-[#c27712] font-mono text-[0.6rem] font-semibold tracking-wider text-[#141619] shadow-[0_4px_0_#7a4a08] transition-transform group-active:translate-y-[3px] group-active:shadow-[0_1px_0_#7a4a08] ${
              active ? 'translate-y-[2px] shadow-[0_2px_0_#7a4a08]' : ''
            }`}
          >
            CONTACT
          </span>
        </button>
      </div>
    </ToolCard>
  );
}
