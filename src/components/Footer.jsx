import { mailtoHref, profile, telHref } from '../data/profile.js';
import { PrintIcon } from './Icons.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-graphite-950">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-4 py-8 text-sm text-steel-300 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-semibold text-paper">{profile.name}</span> · {profile.location}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a className="hover:text-amber-300" href={mailtoHref}>{profile.contact.email}</a>
          <a className="hover:text-amber-300" href={telHref}>{profile.contact.phoneDisplay}</a>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 hover:text-amber-300">
            <PrintIcon width={16} height={16} /> Print résumé view
          </button>
        </div>
      </div>
      <p className="mx-auto max-w-page px-4 pb-8 font-mono text-[0.7rem] text-steel-500 sm:px-6">
        Project animations on this site are conceptual illustrations of operating principles, not footage or data from the original prototypes.
      </p>
    </footer>
  );
}
