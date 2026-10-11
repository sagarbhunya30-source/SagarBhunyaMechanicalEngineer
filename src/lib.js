import { createContext, useContext, useEffect, useState } from 'react';

export function useMediaQuery(query) {
  const get = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** Scrolls to a section and moves keyboard focus to its heading. */
export function goToSection(id, { smooth = true } = {}) {
  const section = document.getElementById(id);
  if (!section) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  section.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' });
  const heading = section.querySelector('h2, h1');
  cadCommand(`ZOOM  ${heading?.textContent ?? id}`);
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

export const WorkshopContext = createContext(null);
export const useWorkshop = () => useContext(WorkshopContext);

export const ProjectDialogContext = createContext(null);
export const useProjectDialog = () => useContext(ProjectDialogContext);

/* ---------- Themes ---------- */
export const THEMES = ['dark', 'light', 'autocad'];
const THEME_COLORS = { dark: '#121417', light: '#f3f1ec', autocad: '#212830' };

export function readSavedTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (THEMES.includes(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* storage unavailable */
  }
}

export const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

/* ---------- AutoCAD command line ---------- */
// Components announce what they did; the command line (AutoCAD theme only) displays it.
export function cadCommand(text) {
  window.dispatchEvent(new CustomEvent('cad-command', { detail: text }));
}
