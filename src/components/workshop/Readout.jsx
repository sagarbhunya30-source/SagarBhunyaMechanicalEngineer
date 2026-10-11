import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../../data/profile.js';
import { goToSection, useProjectDialog } from '../../lib.js';
import ContactActions from '../ContactActions.jsx';
import { ContactDetails } from '../Contact.jsx';
import { QualificationCards } from '../Education.jsx';
import { ExperienceTimeline } from '../Experience.jsx';
import { ArrowDownIcon } from '../Icons.jsx';
import { SkillGroups } from '../Skills.jsx';

function ProjectList() {
  const { openProject } = useProjectDialog();
  return (
    <ul className="grid gap-3">
      {profile.projects.map((p) => (
        <li key={p.id} className="rounded-lg border border-blueprint-700/60 bg-blueprint-900/30 p-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-amber-300">{p.drawingNo}</p>
          <h4 className="mt-1 font-semibold text-paper">{p.title}</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-steel-200">{p.summary}</p>
          <button type="button" onClick={(e) => openProject(p.id, e.currentTarget)} className="btn-secondary mt-3 !min-h-[40px] !py-1.5 !text-xs">
            Open drawing panel
          </button>
        </li>
      ))}
    </ul>
  );
}

export const VIEWS = {
  experience: { title: 'Experience', subtitle: 'Training timeline', section: 'experience', Body: () => <ExperienceTimeline compact /> },
  skills: { title: 'Skills', subtitle: 'Grouped technical skills', section: 'skills', Body: () => <SkillGroups compact /> },
  projects: { title: 'Projects', subtitle: 'Drawings in the folder', section: 'projects', Body: ProjectList },
  education: { title: 'Education', subtitle: 'Qualifications', section: 'education', Body: () => <QualificationCards compact /> },
  contact: {
    title: 'Contact',
    subtitle: 'Email and phone',
    section: 'contact',
    Body: () => (
      <div className="space-y-4">
        <ContactDetails compact />
        <ContactActions />
      </div>
    ),
  },
};

const GUIDE = [
  ['Gear assembly', 'Experience'],
  ['Vernier caliper', 'Skills'],
  ['Blueprint folder', 'Projects'],
  ['Toolbox', 'Education'],
  ['Control panel', 'Contact'],
];

export default function Readout({ active, onReset }) {
  const view = active ? VIEWS[active] : null;
  return (
    <section id="workshop-readout" aria-labelledby="readout-title" className="panel flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 sm:px-5">
        <h3 id="readout-title" className="engraved">
          Readout{view ? ` · ${view.title}` : ''}
        </h3>
        <div className="flex items-center gap-3">
          {view && (
            <button type="button" onClick={onReset} className="rounded px-2 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-steel-300 hover:text-amber-300">
              Reset<span className="sr-only"> bench</span>
            </button>
          )}
          <span className="flex items-center gap-1.5 engraved" aria-hidden="true">
            <span className={`h-2 w-2 rounded-full ${view ? 'bg-amber-400 shadow-[0_0_8px_rgba(242,163,58,0.7)]' : 'bg-graphite-600'}`} />
            {view ? 'Live' : 'Idle'}
          </span>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {view ? `Readout now showing ${view.title}.` : ''}
      </p>
      <div className="flex-1 p-4 sm:p-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active ?? 'idle'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {view ? (
              <>
                <p className="mb-4 text-lg font-semibold text-paper">{view.subtitle}</p>
                <view.Body />
                <a
                  href={`#${view.section}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goToSection(view.section);
                  }}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-amber-300 underline-offset-4 hover:underline"
                >
                  Go to the full {view.title} section <ArrowDownIcon width={16} height={16} />
                </a>
              </>
            ) : (
              <div>
                <p className="text-steel-100">Operate a tool on the bench to inspect a section of Sagar’s profile here.</p>
                <ul className="mt-4 space-y-2">
                  {GUIDE.map(([tool, target]) => (
                    <li key={tool} className="flex items-center justify-between gap-3 border-b border-dashed border-white/10 pb-2 text-sm">
                      <span className="text-steel-200">{tool}</span>
                      <span className="font-mono text-xs uppercase tracking-wider text-amber-300">→ {target}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-steel-400">
                  The tools are navigation shortcuts, not skill assessments. Every section is also available by scrolling or from the menu.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
