import { useEffect, useRef } from 'react';

// AutoCAD-style full-screen crosshair with pickbox. Decorative; the real cursor stays visible.
export default function CadCrosshair() {
  const h = useRef(null);
  const v = useRef(null);
  const box = useRef(null);

  useEffect(() => {
    let frame = 0;
    let x = -100;
    let y = -100;
    const draw = () => {
      frame = 0;
      if (h.current) h.current.style.transform = `translateY(${y}px)`;
      if (v.current) v.current.style.transform = `translateX(${x}px)`;
      if (box.current) box.current.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
    };
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const leave = () => {
      x = -100;
      y = -100;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  const line = 'pointer-events-none fixed left-0 top-0 z-[60] bg-white/25';
  return (
    <div aria-hidden="true">
      <div ref={h} className={`${line} h-px w-screen`} style={{ transform: 'translateY(-100px)' }} />
      <div ref={v} className={`${line} h-screen w-px`} style={{ transform: 'translateX(-100px)' }} />
      <div
        ref={box}
        className="pointer-events-none fixed left-0 top-0 z-[60] h-2.5 w-2.5 border border-white/70"
        style={{ transform: 'translate(-100px, -100px)' }}
      />
    </div>
  );
}
