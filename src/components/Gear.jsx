import { useCallback, useEffect, useRef, useState } from 'react';

// Spur-gear outline. Pitch radius = module * teeth / 2.
export function gearPath(teeth, module) {
  const r = (module * teeth) / 2;
  const tip = r + module;
  const root = r - 1.25 * module;
  const pitch = (Math.PI * 2) / teeth;
  const pts = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * pitch;
    pts.push([root, a - pitch * 0.3], [tip, a - pitch * 0.13], [tip, a + pitch * 0.13], [root, a + pitch * 0.3]);
  }
  return (
    pts
      .map(([rad, ang], i) => `${i ? 'L' : 'M'}${(rad * Math.cos(ang)).toFixed(2)} ${(rad * Math.sin(ang)).toFixed(2)}`)
      .join('') + 'Z'
  );
}

function circlePath(cx, cy, rad) {
  return `M${cx + rad} ${cy}A${rad} ${rad} 0 1 0 ${cx - rad} ${cy}A${rad} ${rad} 0 1 0 ${cx + rad} ${cy}Z`;
}

/**
 * Lays out a train of meshing gears. Each gear after the first meshes with the
 * previous one at `angle` (degrees). Returns centre, phase and speed ratio
 * relative to the driver so neighbouring gears turn in opposite directions at
 * speeds inversely proportional to their tooth counts.
 */
export function layoutGearTrain(module, specs, origin = [0, 0]) {
  const out = [];
  specs.forEach((spec, i) => {
    if (i === 0) {
      out.push({ ...spec, cx: origin[0], cy: origin[1], phase: spec.phase ?? 0, ratio: 1 });
      return;
    }
    const prev = out[i - 1];
    const rPrev = (module * prev.teeth) / 2;
    const r = (module * spec.teeth) / 2;
    const theta = spec.angle;
    const t = (theta * Math.PI) / 180;
    const cx = prev.cx + (rPrev + r) * Math.cos(t);
    const cy = prev.cy + (rPrev + r) * Math.sin(t);
    // Put a tooth gap of this gear where the previous gear has a tooth.
    const phase = theta + 180 + 180 / spec.teeth + ((theta - prev.phase) * prev.teeth) / spec.teeth;
    const ratio = (-prev.ratio * prev.teeth) / spec.teeth;
    out.push({ ...spec, cx, cy, phase, ratio });
  });
  return out;
}

export function Gear({ cx, cy, teeth, module, rotation = 0, tone = 'steel', spokes = true }) {
  const r = (module * teeth) / 2;
  const hub = Math.max(r * 0.22, 4);
  const holes = [];
  if (spokes && teeth >= 16) {
    const n = teeth >= 28 ? 6 : 4;
    const hr = r * 0.17;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      holes.push(circlePath(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, hr));
    }
  }
  const fills = {
    steel: { body: 'url(#gear-steel)', edge: '#5b6570' },
    amber: { body: 'url(#gear-amber)', edge: '#8a560f' },
    dark: { body: '#2b3138', edge: '#4a535d' },
  }[tone];
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotation})`} className={`gear-${tone}`}>
      <path
        className="gear-body"
        pathLength={1}
        d={gearPath(teeth, module) + holes.join('')}
        fillRule="evenodd"
        fill={fills.body}
        stroke={fills.edge}
        strokeWidth="1"
      />
      <circle className="gear-ring" r={r - 1.25 * module - 3} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
      <circle className="gear-hub" r={hub} fill="#14171b" stroke={fills.edge} strokeWidth="1.5" />
      <rect className="gear-hub" x={-hub * 0.2} y={-hub - 1} width={hub * 0.4} height={hub * 0.5} fill="#14171b" />
    </g>
  );
}

export function GearDefs() {
  return (
    <defs>
      <linearGradient id="gear-steel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#b9c1ca" />
        <stop offset="0.5" stopColor="#7d8792" />
        <stop offset="1" stopColor="#4f5862" />
      </linearGradient>
      <linearGradient id="gear-amber" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffc46b" />
        <stop offset="0.55" stopColor="#e08c1a" />
        <stop offset="1" stopColor="#9a5c0b" />
      </linearGradient>
    </defs>
  );
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Drives a gear train: returns current driver angle and a `spin(degrees, ms)` trigger. */
export function useGearDrive(reducedMotion) {
  const [angle, setAngle] = useState(0);
  const frame = useRef(0);
  const current = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const spin = useCallback(
    (degrees = 360, duration = 900) => {
      cancelAnimationFrame(frame.current);
      if (reducedMotion) {
        current.current += degrees;
        setAngle(current.current);
        return;
      }
      const from = current.current;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        current.current = from + degrees * easeInOut(t);
        setAngle(current.current);
        if (t < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [reducedMotion],
  );

  return [angle, spin];
}
