import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cadCommand, useWorkshop } from '../../lib.js';
import Readout, { VIEWS } from './Readout.jsx';
import { BlueprintTool, CaliperTool, ControlPanelTool, GearTool, ToolboxTool } from './tools.jsx';

function Door({ side, duration }) {
  const left = side === 'left';
  return (
    <motion.div
      aria-hidden="true"
      initial={false}
      exit={{ x: left ? '-101%' : '101%' }}
      transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
      className={`steel absolute inset-y-0 z-10 w-1/2 border-white/10 ${left ? 'left-0 rounded-l-xl border-r' : 'right-0 rounded-r-xl border-l'}`}
    >
      {/* Rivets and machining marks */}
      <div className="absolute inset-3 rounded-lg border border-white/5" />
      {[['top-5', left ? 'left-5' : 'right-5'], ['bottom-5', left ? 'left-5' : 'right-5']].map(([v, h]) => (
        <span key={v} className={`absolute ${v} ${h} h-2.5 w-2.5 rounded-full bg-gradient-to-br from-steel-300 to-steel-500`} />
      ))}
      <div className={`absolute top-1/2 h-24 w-2 -translate-y-1/2 rounded-full bg-black/40 ${left ? 'right-4' : 'left-4'}`} />
    </motion.div>
  );
}

export default function Workshop() {
  const { benchOpen, openBench, doorDuration, resetToken } = useWorkshop();
  const [active, setActive] = useState(null);
  const bench = useRef(null);

  const activeRef = useRef(null);

  const select = useCallback((id) => {
    if (activeRef.current === id) return;
    activeRef.current = id;
    setActive(id);
    cadCommand(id ? `OPEN  ${VIEWS[id].title}` : 'CLOSE');
  }, []);
  // Clicking an active tool again returns it (and the readout) to the initial state.
  const toggle = useCallback((id) => select(activeRef.current === id ? null : id), [select]);
  const reset = useCallback(() => select(null), [select]);

  // The hero switch turned back to standby.
  useEffect(() => {
    if (resetToken) {
      activeRef.current = null;
      setActive(null);
    }
  }, [resetToken]);

  // Tools behind closed doors are not focusable.
  useEffect(() => {
    if (bench.current) bench.current.inert = !benchOpen;
  }, [benchOpen]);

  return (
    <section id="workshop" aria-labelledby="workshop-title" className="bg-grid border-b border-white/10">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="section-label">Interactive · Optional</p>
            <h2 id="workshop-title" className="section-title">
              The workshop bench
            </h2>
            <div className="dim-line mt-4 w-24" aria-hidden="true" />
            <p className="mt-5 text-steel-200">
              Each tool opens part of Sagar’s profile in the readout; click it again to put it back. They are shortcuts — the
              same content is in the sections below.
            </p>
          </div>
        </div>

        <div className="relative mt-10">
          <div ref={bench} className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            <div className="grid grid-cols-2 content-start gap-3 sm:gap-4">
              <GearTool active={active === 'experience'} onToggle={toggle} />
              <ToolboxTool active={active === 'education'} onToggle={toggle} />
              <CaliperTool active={active === 'skills'} onSelect={select} />
              <BlueprintTool active={active === 'projects'} onToggle={toggle} />
              <ControlPanelTool active={active === 'contact'} onToggle={toggle} />
            </div>
            <Readout active={active} onReset={reset} />
          </div>

          <AnimatePresence>
            {!benchOpen && (
              <motion.div key="doors" className="absolute -inset-2 overflow-hidden rounded-xl" exit={{ opacity: 1 }} transition={{ duration: doorDuration }}>
                <Door side="left" duration={doorDuration} />
                <Door side="right" duration={doorDuration} />
                <motion.div
                  className="absolute inset-0 z-20 grid place-items-center p-4"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  <div className="rounded-xl border border-white/10 bg-graphite-900/90 px-6 py-5 text-center shadow-xl">
                    <p className="engraved">Bench · Standby</p>
                    <button type="button" onClick={openBench} className="btn-primary mt-3">
                      Open the bench
                    </button>
                    <p className="mt-2 text-xs text-steel-400">Or use the Start Exploring switch above.</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
