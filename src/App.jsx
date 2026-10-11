import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Education from './components/Education.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import MobileActionBar from './components/MobileActionBar.jsx';
import PrintResume from './components/PrintResume.jsx';
import ProjectDialog from './components/ProjectDialog.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { GearDefs } from './components/Gear.jsx';
import WorkshopFallback from './components/workshop/WorkshopFallback.jsx';
import CadIntro from './components/cad/CadIntro.jsx';
import CadCommandLine from './components/cad/CadCommandLine.jsx';
import CadCrosshair from './components/cad/CadCrosshair.jsx';
import {
  ProjectDialogContext,
  ThemeContext,
  WorkshopContext,
  applyTheme,
  cadCommand,
  goToSection,
  readSavedTheme,
  useMediaQuery,
  useReducedMotion,
} from './lib.js';

const Workshop = lazy(() => import('./components/workshop/Workshop.jsx'));

// Timeline of the "Start Exploring" sequence (ms). Total ≈ 1.25 s.
const SCROLL_AT = 350;
const DOORS_AT = 600;
const DOOR_DURATION = 0.65;

export default function App() {
  const reducedMotion = useReducedMotion();
  const isPhone = useMediaQuery('(max-width: 767px)');
  const [switchOn, setSwitchOn] = useState(false);
  // Doors start closed only on larger screens for visitors without reduced motion.
  const [benchOpen, setBenchOpen] = useState(() => reducedMotion || isPhone);
  const [sequenceRunning, setSequenceRunning] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (reducedMotion || isPhone) setBenchOpen(true);
  }, [reducedMotion, isPhone]);

  const finish = useCallback(() => {
    clearTimers();
    setSwitchOn(true);
    setBenchOpen(true);
    setSequenceRunning(false);
  }, []);

  const skip = useCallback(() => {
    finish();
    goToSection('workshop', { smooth: false });
  }, [finish]);

  const startExploring = useCallback(() => {
    if (reducedMotion || benchOpen) {
      finish();
      goToSection('workshop');
      return;
    }
    clearTimers();
    setSwitchOn(true);
    setSequenceRunning(true);
    timers.current.push(
      setTimeout(() => goToSection('workshop'), SCROLL_AT),
      setTimeout(() => setBenchOpen(true), DOORS_AT),
      setTimeout(() => setSequenceRunning(false), DOORS_AT + DOOR_DURATION * 1000 + 50),
    );
  }, [reducedMotion, benchOpen, finish]);

  const openBench = useCallback(() => {
    setSwitchOn(true);
    setBenchOpen(true);
  }, []);

  // Turning the switch back returns everything to its initial state.
  const standby = useCallback(() => {
    clearTimers();
    setSwitchOn(false);
    setSequenceRunning(false);
    setBenchOpen(reducedMotion || isPhone);
    setResetToken((t) => t + 1);
    cadCommand('RESET  Workshop returned to standby');
  }, [reducedMotion, isPhone]);

  const toggleSwitch = useCallback(() => (switchOn ? standby() : startExploring()), [switchOn, standby, startExploring]);

  const workshop = useMemo(
    () => ({
      switchOn,
      benchOpen,
      sequenceRunning,
      resetToken,
      startExploring,
      toggleSwitch,
      standby,
      skip,
      openBench,
      doorDuration: DOOR_DURATION,
    }),
    [switchOn, benchOpen, sequenceRunning, resetToken, startExploring, toggleSwitch, standby, skip, openBench],
  );

  // Colour theme: Dark, Light or AutoCAD (with a short drafting intro).
  const [theme, setThemeState] = useState(readSavedTheme);
  const [cadIntro, setCadIntro] = useState(false);
  const [themeAnnouncement, setThemeAnnouncement] = useState('');
  const finePointer = useMediaQuery('(pointer: fine) and (min-width: 768px)');
  const drawTimer = useRef();
  useEffect(() => () => clearTimeout(drawTimer.current), []);

  const setTheme = useCallback(
    (next) => {
      if (next === theme) return;
      applyTheme(next);
      setThemeState(next);
      setThemeAnnouncement(`${next === 'autocad' ? 'AutoCAD' : next === 'light' ? 'Light' : 'Dark'} theme applied`);
      setCadIntro(next === 'autocad' && !reducedMotion);
    },
    [theme, reducedMotion],
  );

  // After the intro, parts on screen are "drawn in" as wireframes.
  const endCadIntro = useCallback(() => {
    setCadIntro(false);
    const html = document.documentElement;
    html.classList.add('cad-drawing');
    clearTimeout(drawTimer.current);
    drawTimer.current = setTimeout(() => html.classList.remove('cad-drawing'), 1800);
    cadCommand('REGEN  Regenerating model.');
  }, []);

  const themeValue = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  // Project detail dialog (shared by the blueprint folder and project cards).
  const [dialog, setDialog] = useState({ id: null, trigger: null });
  const projectDialog = useMemo(
    () => ({
      openProject: (id, trigger) => setDialog({ id, trigger: trigger ?? document.activeElement }),
    }),
    [],
  );
  const closeDialog = useCallback(() => {
    const trigger = dialog.trigger;
    setDialog({ id: null, trigger: null });
    if (trigger && typeof trigger.focus === 'function') requestAnimationFrame(() => trigger.focus());
  }, [dialog.trigger]);

  return (
    <MotionConfig reducedMotion="user">
      <ThemeContext.Provider value={themeValue}>
      <WorkshopContext.Provider value={workshop}>
        <ProjectDialogContext.Provider value={projectDialog}>
          <div className="screen-only">
            {/* Shared SVG gradients for all gear illustrations */}
            <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
              <GearDefs />
            </svg>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-amber-400 focus:px-4 focus:py-2 focus:font-semibold focus:text-on-accent"
            >
              Skip to content
            </a>
            <Nav />
            <main id="main" className="pb-20 md:pb-0">
              <Hero />
              <ErrorBoundary fallback={<WorkshopFallback />}>
                <Suspense fallback={<WorkshopFallback loading />}>
                  <Workshop />
                </Suspense>
              </ErrorBoundary>
              <About />
              <Experience />
              <Skills />
              <Projects />
              <Education />
              <Contact />
            </main>
            <Footer />
            <MobileActionBar />
            <ProjectDialog projectId={dialog.id} onClose={closeDialog} />
            {theme === 'autocad' && <CadCommandLine />}
            {theme === 'autocad' && finePointer && <CadCrosshair />}
            <AnimatePresence>{cadIntro && <CadIntro key="cad-intro" onDone={endCadIntro} />}</AnimatePresence>
            <p className="sr-only" role="status" aria-live="polite">
              {themeAnnouncement}
            </p>
          </div>
          <PrintResume />
        </ProjectDialogContext.Provider>
      </WorkshopContext.Provider>
      </ThemeContext.Provider>
    </MotionConfig>
  );
}
