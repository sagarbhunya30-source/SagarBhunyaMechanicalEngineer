import { profile } from '../data/profile.js';
import SectionHeading from './SectionHeading.jsx';

export function QualificationCards({ compact = false }) {
  return (
    <div className={`grid gap-4 ${compact ? '' : 'md:grid-cols-2 md:gap-6'}`}>
      {profile.education.map((q) => (
        <article
          key={q.id}
          className={`relative overflow-hidden ${compact ? 'rounded-lg border border-white/10 bg-graphite-900/60 p-4' : 'panel p-5 sm:p-6'}`}
        >
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-amber-400/70" />
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-blueprint-400">{q.years}</p>
          <h3 className={`mt-1 font-semibold text-paper ${compact ? 'text-base' : 'text-xl'}`}>{q.qualification}</h3>
          <dl className={`mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 ${compact ? 'text-sm' : ''}`}>
            <dt className="text-steel-400">Institute</dt>
            <dd className="text-steel-100">{q.institute}</dd>
            <dt className="text-steel-400">Board</dt>
            <dd className="text-steel-100">{q.board}</dd>
            <dt className="text-steel-400">Years</dt>
            <dd className="text-steel-100">{q.years}</dd>
            <dt className="text-steel-400">{q.resultLabel}</dt>
            <dd className="font-semibold text-amber-300">{q.result}</dd>
          </dl>
        </article>
      ))}
    </div>
  );
}

export default function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="bg-grid border-b border-white/10">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading id="education-title" index="05" label="Education" title="Qualifications" />
        <div className="mt-10">
          <QualificationCards />
        </div>
      </div>
    </section>
  );
}
