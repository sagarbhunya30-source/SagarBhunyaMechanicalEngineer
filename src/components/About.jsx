import { profile } from '../data/profile.js';
import SectionHeading from './SectionHeading.jsx';

function Portrait() {
  const { photo } = profile;
  return (
    <figure className="relative mx-auto w-full max-w-sm">
      {/* Drawing-frame corner marks */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-3">
        {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((c) => (
          <span key={c} className={`absolute h-6 w-6 border-amber-400/70 ${c}`} />
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-white/15 bg-graphite-800">
        <picture>
          <source type="image/webp" srcSet={`${photo.webp[480]} 480w, ${photo.webp[800]} 800w`} sizes="(min-width: 1024px) 384px, 90vw" />
          <img
            src={photo.jpg[800]}
            srcSet={`${photo.jpg[480]} 480w, ${photo.jpg[800]} 800w`}
            sizes="(min-width: 1024px) 384px, 90vw"
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </picture>
      </div>
      <figcaption className="mt-3 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.16em] text-steel-400">
        <span>Fig. 1 — {profile.name}</span>
        <span>Jhargram, WB</span>
      </figcaption>
    </figure>
  );
}

export default function About() {
  const { about } = profile;
  return (
    <section id="about" aria-labelledby="about-title" className="border-b border-white/10">
      <div className="mx-auto grid max-w-page items-start gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16 lg:py-24">
        <Portrait />
        <div>
          <SectionHeading id="about-title" index="01" label="About" title="Diploma graduate with hands-on industrial training" />
          <p className="mt-6 text-lg leading-relaxed text-steel-100">{about.intro}</p>

          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="panel p-4">
              <dt className="engraved">Location</dt>
              <dd className="mt-1.5 text-paper">{profile.location}</dd>
            </div>
            <div className="panel p-4">
              <dt className="engraved">Career focus</dt>
              <dd className="mt-1.5 text-paper">{about.careerFocus}</dd>
            </div>
            <div className="panel p-4 sm:col-span-2">
              <dt className="engraved">Languages</dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-2">
                  {about.languages.map((l) => (
                    <li key={l.name} className="chip !text-sm">
                      <span className="text-paper">{l.name}</span>
                      <span className="mx-1.5 text-steel-500" aria-hidden="true">—</span>
                      <span className="sr-only">: </span>
                      {l.level}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
