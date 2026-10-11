import { profile } from '../data/profile.js';

// 15-second overview for recruiters, directly under the hero.
export default function RecruiterSummary() {
  return (
    <div className="mx-auto max-w-page px-4 pb-12 sm:px-6 lg:pb-16">
      <div className="panel p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-mono text-sm font-medium uppercase tracking-[0.18em] text-amber-300">Spec sheet · At a glance</h2>
          <p className="text-xs text-steel-400">Summary of the CV</p>
        </div>
        <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.summary.map((item, i) => (
            <div key={i} className="border-l-2 border-blueprint-500/50 pl-3">
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-blueprint-400">{item.label}</dt>
              <dd className="mt-0.5 text-[0.95rem] leading-snug text-paper">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
