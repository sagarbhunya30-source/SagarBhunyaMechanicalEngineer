import { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from '../../lib.js';

const START_X = 34;
const END_X = 300;
const JETS = Array.from({ length: 13 }, (_, i) => 30 + i * 26);

// Conceptual animation: an object glides above a perforated air surface.
export default function ConveyorDemo() {
  const [running, setRunning] = useState(false);
  const reducedMotion = useReducedMotion();
  const objectRef = useRef(null);
  const pos = useRef(START_X);
  const captionId = useId();

  // Stop and return the object to its starting position.
  const reset = () => {
    setRunning(false);
    pos.current = START_X;
    objectRef.current?.setAttribute('transform', `translate(${START_X} 0)`);
  };

  useEffect(() => {
    if (!running) return;
    let frame;
    let last = performance.now();
    const speed = reducedMotion ? 30 : 60; // svg units per second
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      pos.current += speed * dt;
      if (pos.current > END_X) pos.current = START_X;
      const bob = reducedMotion ? 0 : Math.sin(now / 260) * 1.2;
      objectRef.current?.setAttribute('transform', `translate(${pos.current.toFixed(2)} ${bob.toFixed(2)})`);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, reducedMotion]);

  return (
    <figure className="overflow-hidden rounded-lg border border-blueprint-700/60 bg-[var(--sheet-bg-2)]">
      <svg viewBox="0 0 400 210" className="block h-auto w-full" role="img" aria-labelledby={captionId}>
        <defs>
          <marker id="air-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0L10 5L0 10z" fill="var(--sheet-strong)" />
          </marker>
        </defs>
        {/* Plenum / air supply */}
        <rect x="16" y="140" width="368" height="40" rx="3" fill="var(--sheet-panel)" stroke="var(--sheet-line)" />
        <text x="200" y="165" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9.5" letterSpacing="1.5" fill="var(--sheet-text)">
          PRESSURISED AIR SUPPLY
        </text>
        {/* Perforated conveying surface */}
        <rect x="16" y="134" width="368" height="6" fill="#8a939e" />
        {JETS.map((x) => (
          <rect key={x} x={x - 1.5} y="134" width="3" height="6" fill="var(--sheet-panel)" />
        ))}
        {/* Air jets, inclined in the direction of travel */}
        <g
          stroke="var(--sheet-strong)"
          strokeWidth="1.4"
          strokeDasharray="4 4"
          markerEnd="url(#air-arrow)"
          style={running ? { animation: 'airflow 0.5s linear infinite' } : undefined}
        >
          {JETS.map((x) => (
            <line key={x} x1={x} y1="131" x2={x + 7} y2="112" />
          ))}
        </g>
        {/* Object carried on the air layer */}
        <g ref={objectRef} transform={`translate(${START_X} 0)`}>
          <rect x="0" y="82" width="56" height="26" rx="3" fill="#c9ced5" stroke="#5b6570" />
          <path d="M8 95h40" stroke="#5b6570" strokeDasharray="3 3" />
          {/* Clearance marker: no contact with the surface */}
          <line x1="28" y1="110" x2="28" y2="130" stroke="#f2a33a" strokeWidth="1" strokeDasharray="2 2" />
        </g>
        <text x="16" y="30" fontFamily="IBM Plex Mono, monospace" fontSize="9.5" letterSpacing="1.2" fill="var(--sheet-accent)">
          NO DIRECT MECHANICAL CONTACT
        </text>
        <text x="16" y="46" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1" fill="var(--sheet-text)">
          OBJECT SUPPORTED AND MOVED BY AIRFLOW →
        </text>
        <text x="200" y="200" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" letterSpacing="1" fill="var(--sheet-muted)">
          CONCEPTUAL · NOT TO SCALE
        </text>
      </svg>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-blueprint-700/60 px-4 py-3">
        <span id={captionId} className="text-xs text-steel-300">
          Conceptual illustration of the operating principle.
        </span>
        <div className="flex gap-2">
          <button type="button" aria-pressed={running} onClick={() => setRunning((r) => !r)} className="btn-secondary !min-h-[40px] !py-1.5 !text-xs">
            {running ? 'Pause' : 'Run Demo'}
          </button>
          <button type="button" onClick={reset} className="btn-ghost !min-h-[40px] !px-2 !py-1.5 !text-xs">
            Reset
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
