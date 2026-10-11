import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { gearPath } from '../Gear.jsx';

const DURATION = 2100; // ms before the overlay closes itself
const COMMANDS = ['_CIRCLE', '_ARRAY  24 items', '_DIMLINEAR', 'REGEN  Regenerating model.'];

// Short "drafting" sequence played when the visitor switches to the AutoCAD theme.
// Any click or key press skips it.
export default function CadIntro({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, DURATION);
    const skip = () => onDone();
    window.addEventListener('keydown', skip);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', skip);
    };
  }, [onDone]);

  const draw = (delay, duration = 0.8) => ({
    initial: { pathLength: 0, opacity: 1 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { delay, duration, ease: [0.4, 0, 0.2, 1] },
  });

  return (
    <motion.div
      aria-hidden="true"
      onClick={onDone}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-grid fixed inset-0 z-[90] flex cursor-pointer flex-col items-center justify-center"
      style={{ backgroundColor: '#212830' }}
    >
      <svg viewBox="0 0 640 340" className="w-[min(92vw,720px)]">
        {/* Centre lines */}
        <motion.path d="M70 170H330M200 40V300" stroke="#ff4d4d" strokeWidth="1" strokeDasharray="16 4 3 4" fill="none" {...draw(0, 0.4)} />
        {/* Gear profile */}
        <motion.path
          d={gearPath(24, 8)}
          transform="translate(200 170)"
          fill="none"
          stroke="#f5d90a"
          strokeWidth="1.6"
          {...draw(0.15, 0.95)}
        />
        <motion.circle cx="200" cy="170" r="96" fill="none" stroke="#33d6e6" strokeWidth="1" strokeDasharray="6 4" {...draw(0.35, 0.7)} />
        <motion.circle cx="200" cy="170" r="22" fill="none" stroke="#ff4d4d" strokeWidth="1.4" {...draw(0.5, 0.5)} />
        {/* Dimension line */}
        <motion.path d="M96 318H304M96 310V326M304 310V326" stroke="#e8e8e8" strokeWidth="1" fill="none" {...draw(0.9, 0.4)} />
        <motion.text
          x="200"
          y="306"
          textAnchor="middle"
          fill="#e8e8e8"
          fontSize="11"
          fontFamily="IBM Plex Mono, monospace"
          letterSpacing="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          OUTSIDE DIA.
        </motion.text>
        {/* Title */}
        <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.4 }}>
          <text x="360" y="150" fill="#f0f0f0" fontSize="30" fontFamily="IBM Plex Mono, monospace" fontWeight="500">
            SAGAR BHUNYA
          </text>
          <text x="362" y="180" fill="#33d6e6" fontSize="12" fontFamily="IBM Plex Mono, monospace" letterSpacing="2">
            MECHANICAL · QUALITY
          </text>
        </motion.g>
        <motion.path d="M360 196H600" stroke="#f5d90a" strokeWidth="1.5" fill="none" {...draw(1.2, 0.5)} />
      </svg>

      <div className="mt-6 w-[min(92vw,720px)] border-t border-white/15 pt-3 font-mono text-xs text-[#cdd2d8]">
        {COMMANDS.map((c, i) => (
          <motion.p key={c} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.4 }}>
            <span className="text-[#8a96a6]">Command:</span> {c}
          </motion.p>
        ))}
        <p className="mt-3 text-[0.65rem] uppercase tracking-widest text-[#8a96a6]">Click or press any key to skip</p>
      </div>
    </motion.div>
  );
}
