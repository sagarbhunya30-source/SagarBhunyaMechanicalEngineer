export default function ProjectDetails({ project }) {
  const rows = [
    ['Objective', project.objective],
    ['Working principle', project.principle],
    ['Contribution (as stated in CV)', project.contribution],
  ];
  return (
    <dl className="space-y-4">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="engraved !text-blueprint-400">{k}</dt>
          <dd className="mt-1 leading-relaxed text-steel-100">{v}</dd>
        </div>
      ))}
      <div>
        <dt className="engraved !text-blueprint-400">Relevant engineering concepts</dt>
        <dd className="mt-2">
          <ul className="flex flex-wrap gap-2">
            {project.concepts.map((c) => (
              <li key={c} className="chip">{c}</li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  );
}
