import { profile } from '../data/profile.js';
import SectionHeading from './SectionHeading.jsx';

// Hex bolt head used as a timeline node.
function BoltNode() {
  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden="true">
      <polygon points="14,2 24.4,8 24.4,20 14,26 3.6,20 3.6,8" fill="#2b3138" stroke="#f2a33a" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="5" fill="#14171b" stroke="#8a939e" />
    </svg>
  );
}

export function ExperienceTimeline({ compact = false }) {
  return (
    <ol className={`relative ${compact ? 'space-y-5' : 'space-y-8'}`}>
      <span aria-hidden="true" className="absolute bottom-2 left-[13px] top-2 w-px bg-gradient-to-b from-amber-400/70 via-steel-500/50 to-transparent" />
      {profile.experience.map((item) => (
        <li key={item.id} className="relative pl-12">
          <span className="absolute left-0 top-0.5">
            <BoltNode />
          </span>
          <div className={compact ? '' : 'panel p-5 sm:p-6'}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-amber-300">
                {item.type} · {item.duration}
              </span>
            </div>
            <h3 className={`mt-2 font-semibold text-paper ${compact ? 'text-base' : 'text-xl'}`}>{item.role}</h3>
            <p className={`text-blueprint-300 ${compact ? 'text-sm' : 'mt-0.5'}`}>
              {compact && item.shortOrganisation ? item.shortOrganisation : item.organisation}
            </p>
            <ul className={`mt-3 space-y-1.5 text-steel-100 ${compact ? 'text-sm' : ''}`}>
              {item.points.map((p) => (
                <li key={p} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[0.6em] h-1 w-2.5 shrink-0 bg-steel-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-b border-white/10">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading id="experience-title" index="02" label="Experience & industrial training" title="Training timeline">
          Industrial training completed as part of his preparation for the field. Both entries are training programmes, listed
          with the durations stated in his CV.
        </SectionHeading>
        <div className="mt-10 max-w-3xl">
          <ExperienceTimeline />
        </div>
      </div>
    </section>
  );
}
