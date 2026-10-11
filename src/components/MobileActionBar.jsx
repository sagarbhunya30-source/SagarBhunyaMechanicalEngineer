import { profile } from '../data/profile.js';
import { goToSection } from '../lib.js';
import { DownloadIcon, MailIcon } from './Icons.jsx';

// Persistent CV / contact actions on small screens.
export default function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-graphite-900/95 px-4 py-2.5 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            goToSection('contact');
          }}
          className="btn-secondary w-full"
        >
          <MailIcon /> Contact Sagar
        </a>
        <a href={profile.cv.href} download={profile.cv.fileName} className="btn-primary w-full">
          <DownloadIcon /> Download CV
        </a>
      </div>
    </div>
  );
}
