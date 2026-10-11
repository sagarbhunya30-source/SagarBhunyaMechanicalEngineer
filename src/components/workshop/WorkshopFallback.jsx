import { navItems } from '../../data/profile.js';
import { goToSection } from '../../lib.js';

// Plain navigation used while the interactive bench loads, or if it fails.
export default function WorkshopFallback({ loading = false }) {
  return (
    <section id="workshop" aria-labelledby="workshop-title" className="border-b border-white/10">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6">
        <h2 id="workshop-title" className="section-title">The workshop bench</h2>
        <p className="mt-3 text-steel-200">
          {loading ? 'Loading the interactive bench…' : 'The interactive bench is unavailable. Jump straight to a section:'}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {navItems.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  goToSection(n.id);
                }}
                className="btn-secondary"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
