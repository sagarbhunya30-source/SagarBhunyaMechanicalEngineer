import { useEffect, useRef } from 'react';
import { profile } from '../data/profile.js';
import { cadCommand } from '../lib.js';
import { CloseIcon } from './Icons.jsx';
import ProjectDemo from './projects/ProjectDemo.jsx';
import ProjectDetails from './projects/ProjectDetails.jsx';

// Modal project panel built on the native <dialog> element (focus containment,
// Escape handling). Focus returns to the trigger via the onClose handler in App.
export default function ProjectDialog({ projectId, onClose }) {
  const ref = useRef(null);
  const project = profile.projects.find((p) => p.id === projectId);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      cadCommand(`XREF  ${project.drawingNo}  ${project.title}`);
      document.documentElement.style.overflow = 'hidden';
    } else if (!project && dialog.open) {
      dialog.close();
    }
    if (!project) document.documentElement.style.overflow = '';
  }, [project]);

  useEffect(() => () => (document.documentElement.style.overflow = ''), []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="project-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto w-[min(56rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-xl border border-white/15 bg-graphite-850 p-0 text-paper shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      {project && (
        <div>
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-graphite-850/95 px-5 py-3 backdrop-blur">
            <span className="engraved !text-blueprint-400">{project.drawingNo} · Project detail</span>
            <button type="button" onClick={onClose} className="btn-ghost !min-h-[40px] !px-2">
              <CloseIcon />
              <span className="sr-only">Close project panel</span>
            </button>
          </div>
          <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 id="project-dialog-title" className="text-2xl font-semibold leading-snug">
                {project.title}
              </h2>
              <p className="mt-3 leading-relaxed text-steel-100">{project.summary}</p>
              <div className="mt-6">
                <ProjectDetails project={project} />
              </div>
            </div>
            <div>
              <ProjectDemo id={project.id} />
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
