import { useEffect, useRef, useState } from 'react';
import { navItems, profile } from '../data/profile.js';
import { goToSection } from '../lib.js';
import { CloseIcon, DownloadIcon, MenuIcon } from './Icons.jsx';
import ThemeSwitcher from './ThemeSwitcher.jsx';

function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const ids = navItems.map((n) => n.id);

export default function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);
  const menuButton = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    goToSection(id);
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-graphite-900/85 backdrop-blur-md">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-page items-center gap-4 px-4 sm:px-6">
        <a href="#top" onClick={(e) => go(e, 'top')} className="flex items-center gap-3 rounded">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-md border border-amber-400/50 bg-graphite-800 font-mono text-sm font-medium text-amber-300"
          >
            SB
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-paper">{profile.name}</span>
            <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.14em] text-steel-400 sm:block lg:hidden xl:block">
              Mechanical · Quality
            </span>
          </span>
        </a>

        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => go(e, item.id)}
                aria-current={active === item.id ? 'location' : undefined}
                className={`whitespace-nowrap rounded px-2 py-2 text-sm transition-colors xl:px-3 ${
                  active === item.id ? 'text-amber-300' : 'text-steel-200 hover:text-paper'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto lg:ml-4">
          <ThemeSwitcher />
        </div>

        <div className="ml-2 hidden items-center gap-2 md:flex">
          <a href="#contact" onClick={(e) => go(e, 'contact')} className="btn-secondary !min-h-[38px] whitespace-nowrap !py-1.5 lg:hidden xl:inline-flex">
            Contact Sagar
          </a>
          <a href={profile.cv.href} download={profile.cv.fileName} className="btn-primary !min-h-[38px] whitespace-nowrap !py-1.5">
            <DownloadIcon /> Download CV
          </a>
        </div>

        <button
          ref={menuButton}
          type="button"
          className="btn-ghost ml-1 !px-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-graphite-900 lg:hidden">
          <ul className="mx-auto grid max-w-page grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-3 sm:px-6">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => go(e, item.id)}
                  className="flex min-h-[44px] items-center rounded px-3 text-sm text-steel-100 hover:bg-white/5"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
