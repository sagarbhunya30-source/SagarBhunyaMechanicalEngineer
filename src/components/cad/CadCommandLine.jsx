import { useEffect, useRef, useState } from 'react';

function UcsIcon() {
  return (
    <svg viewBox="0 0 60 60" className="h-12 w-12" aria-hidden="true">
      <path d="M8 52H50" stroke="#ff4d4d" strokeWidth="2" />
      <path d="M50 52l-7-4v8z" fill="#ff4d4d" />
      <path d="M8 52V10" stroke="#3be23b" strokeWidth="2" />
      <path d="M8 10l-4 7h8z" fill="#3be23b" />
      <text x="52" y="46" fill="#ff4d4d" fontSize="10" fontFamily="IBM Plex Mono, monospace">X</text>
      <text x="13" y="12" fill="#3be23b" fontSize="10" fontFamily="IBM Plex Mono, monospace">Y</text>
    </svg>
  );
}

// AutoCAD-style command line: shows the last action as a typed command and live cursor coordinates.
export default function CadCommandLine() {
  const [history, setHistory] = useState(['Command: REGEN  Regenerating model.']);
  const [typed, setTyped] = useState('');
  const coords = useRef(null);

  useEffect(() => {
    let timer;
    const onCommand = (e) => {
      const full = String(e.detail).toUpperCase();
      clearInterval(timer);
      let i = 0;
      timer = setInterval(() => {
        i += 1;
        setTyped(full.slice(0, i));
        if (i >= full.length) {
          clearInterval(timer);
          setHistory((h) => [...h.slice(-1), `Command: ${full}`]);
          setTimeout(() => setTyped(''), 50);
        }
      }, 22);
    };
    window.addEventListener('cad-command', onCommand);
    return () => {
      clearInterval(timer);
      window.removeEventListener('cad-command', onCommand);
    };
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (!coords.current) return;
      const x = (e.pageX / 10).toFixed(4);
      const y = ((document.documentElement.scrollHeight - e.pageY) / 10).toFixed(4);
      coords.current.textContent = `${x}, ${y}, 0.0000`;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <div aria-hidden="true" className="hidden md:block">
      <div className="pointer-events-none fixed bottom-11 left-3 z-30 opacity-80">
        <UcsIcon />
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-graphite-950/95 font-mono text-[0.72rem] text-steel-200 backdrop-blur">
        <div className="flex h-9 items-center gap-4 px-3">
          <span className="rounded-sm bg-graphite-700 px-1.5 py-0.5 text-[0.65rem] text-amber-300">MODEL</span>
          <div className="min-w-0 flex-1 truncate">
            <span className="text-steel-400">{history[history.length - 1]}</span>
            <span className="mx-3 text-steel-500">|</span>
            <span className="text-paper">Command: {typed}</span>
            <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-paper" style={{ animation: 'caret 1s steps(1) infinite' }} />
          </div>
          <span ref={coords} className="hidden tabular-nums text-steel-300 lg:inline">0.0000, 0.0000, 0.0000</span>
          <span className="hidden gap-2 text-[0.65rem] text-steel-400 lg:flex">
            {['GRID', 'SNAP', 'ORTHO', 'OSNAP'].map((t, i) => (
              <span key={t} className={i % 2 === 0 ? 'text-blueprint-400' : ''}>{t}</span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
