import { useId, useState } from 'react';
import { profile } from '../data/profile.js';
import { useProjectDialog } from '../lib.js';
import { ChevronIcon } from './Icons.jsx';
import ProjectDemo from './projects/ProjectDemo.jsx';
import ProjectDetails from './projects/ProjectDetails.jsx';
import SectionHeading from './SectionHeading.jsx';

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false);
  const { openProject } = useProjectDialog();
  const detailsId = useId();
  return (
    <article className="panel flex flex-col overflow-hidden" aria-labelledby={`${project.id}-title`}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="engraved !text-blueprint-400">{project.drawingNo}</span>
        <span className="engraved">Project {index + 1}</span>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <h3 id={`${project.id}-title`} className="text-xl font-semibold leading-snug text-paper">
          {project.title}
        </h3>
        <ProjectDemo id={project.id} />
        <p className="leading-relaxed text-steel-100">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-secondary"
            aria-expanded={expanded}
            aria-controls={detailsId}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? 'Hide details' : 'Show details'}
            <ChevronIcon className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <button type="button" className="btn-ghost" onClick={(e) => openProject(project.id, e.currentTarget)}>
            Open drawing panel
          </button>
        </div>
        <div id={detailsId} hidden={!expanded} className="border-t border-white/10 pt-5">
          <ProjectDetails project={project} />
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="border-b border-white/10">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading id="projects-title" index="04" label="Technical projects" title="Project drawings">
          Two technical projects listed in his CV. The animations are conceptual illustrations of each operating principle, not
          footage or test data from the prototypes.
        </SectionHeading>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {profile.projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
