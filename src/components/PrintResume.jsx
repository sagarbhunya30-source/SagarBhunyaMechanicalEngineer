import { profile } from '../data/profile.js';

// Plain, ink-friendly resume shown only when printing.
export default function PrintResume() {
  const p = profile;
  const h2 = { fontSize: '11pt', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #999', margin: '14pt 0 6pt', paddingBottom: '2pt' };
  return (
    <div className="print-only" style={{ fontFamily: '"IBM Plex Sans", Arial, sans-serif', fontSize: '10pt', lineHeight: 1.45, color: '#111' }}>
      <h1 style={{ fontSize: '20pt', margin: 0 }}>{p.name}</h1>
      <p style={{ margin: '2pt 0', fontWeight: 600 }}>{p.title}</p>
      <p style={{ margin: '2pt 0' }}>
        {p.contact.email} · {p.contact.phoneDisplay} · {p.location}
      </p>

      <h2 style={h2}>Profile</h2>
      <p style={{ margin: 0 }}>{p.about.intro}</p>
      <p style={{ margin: '4pt 0 0' }}>
        <strong>Career focus:</strong> {p.about.careerFocus}
      </p>

      <h2 style={h2}>Experience &amp; industrial training</h2>
      {p.experience.map((e) => (
        <div key={e.id} style={{ marginBottom: '6pt', breakInside: 'avoid' }}>
          <strong>{e.role}</strong> — {e.organisation} ({e.type}, {e.duration})
          <ul style={{ margin: '2pt 0 0 14pt', padding: 0, listStyle: 'disc' }}>
            {e.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2 style={h2}>Technical skills</h2>
      {p.skills.map((g) => (
        <p key={g.id} style={{ margin: '0 0 2pt' }}>
          <strong>{g.group}:</strong> {g.items.join(', ')}
        </p>
      ))}

      <h2 style={h2}>Technical projects</h2>
      {p.projects.map((pr) => (
        <div key={pr.id} style={{ marginBottom: '6pt', breakInside: 'avoid' }}>
          <strong>{pr.title}</strong>
          <p style={{ margin: '1pt 0 0' }}>{pr.summary}</p>
        </div>
      ))}

      <h2 style={h2}>Education</h2>
      {p.education.map((q) => (
        <p key={q.id} style={{ margin: '0 0 3pt' }}>
          <strong>{q.qualification}</strong> — {q.institute} ({q.board}), {q.years} · {q.resultLabel}: {q.result}
        </p>
      ))}

      <h2 style={h2}>Languages</h2>
      <p style={{ margin: 0 }}>{p.about.languages.map((l) => `${l.name} (${l.level})`).join(' · ')}</p>
    </div>
  );
}
