import { profile } from '../data/profile.js';
import SectionHeading from './SectionHeading.jsx';

// Tool-inspired line icons for each skill group.
function GroupIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-amber-300" aria-hidden="true">
      {type === 'drawing' && (
        <g {...common}>
          <rect x="6" y="9" width="36" height="28" rx="2" />
          <path d="M12 31 22 17l6 8 4-5 6 11" />
          <path d="M6 41h36M10 41v-2M38 41v-2" />
        </g>
      )}
      {type === 'lathe' && (
        <g {...common}>
          <rect x="4" y="16" width="10" height="16" rx="1.5" />
          <path d="M14 21h20v6H14z" />
          <path d="M34 19l6 5-6 5z" />
          <path d="M4 38h40M9 32v6M38 29v9" />
        </g>
      )}
      {type === 'gauge' && (
        <g {...common}>
          <path d="M6 14h36v6H6z" />
          <path d="M10 20v14l-3 4M15 20v18" />
          <path d="M26 20v18M31 20v14l3 4" />
          <path d="M12 14v-3M18 14v-2M24 14v-3M30 14v-2M36 14v-3" />
        </g>
      )}
    </svg>
  );
}

export function SkillGroups({ compact = false }) {
  return (
    <div className={`grid gap-4 ${compact ? '' : 'md:grid-cols-3 md:gap-5'}`}>
      {profile.skills.map((group) => (
        <article key={group.id} className={compact ? 'rounded-lg border border-white/10 bg-graphite-900/60 p-4' : 'panel p-5 sm:p-6'}>
          <div className="flex items-center gap-3">
            {!compact && <GroupIcon type={group.icon} />}
            <h3 className={`font-semibold text-paper ${compact ? 'text-sm' : 'text-lg'}`}>{group.group}</h3>
          </div>
          <ul className={`flex flex-wrap gap-2 ${compact ? 'mt-3' : 'mt-5'}`}>
            {group.items.map((s) => (
              <li key={s} className="chip !text-[0.8rem] !text-steel-100">
                {s}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="bg-grid border-b border-white/10">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading id="skills-title" index="03" label="Technical skills" title="Skills, grouped by application">
          Skills listed in his CV and covered in his training, without ratings or proficiency scores.
        </SectionHeading>
        <div className="mt-10">
          <SkillGroups />
        </div>
      </div>
    </section>
  );
}
