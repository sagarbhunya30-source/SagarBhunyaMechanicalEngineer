export default function SectionHeading({ id, index, label, title, children }) {
  return (
    <div className="max-w-3xl">
      <p className="section-label">
        <span aria-hidden="true">{index} / </span>
        {label}
      </p>
      <h2 id={id} className="section-title">
        {title}
      </h2>
      <div className="dim-line mt-4 w-24" aria-hidden="true" />
      {children && <p className="mt-5 text-base leading-relaxed text-steel-200">{children}</p>}
    </div>
  );
}
