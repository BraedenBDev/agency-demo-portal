import { demoUrl, visibleDemos } from '@/lib/demos';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const demos = visibleDemos();
  return (
    <main style={mainStyle}>
      <header style={headerStyle}>
        <p style={eyebrowStyle}>Almost Impossible Agency</p>
        <h1 style={h1Style}>Demos</h1>
        <p style={leadStyle}>
          Live experiments, client-facing previews, and microsites hosted on agency
          infrastructure.
        </p>
      </header>

      <section style={gridStyle}>
        {demos.map((demo) => (
          <a key={demo.slug} href={demoUrl(demo.slug)} style={cardStyle}>
            <div style={cardSlugStyle}>{demo.slug}</div>
            <h2 style={cardTitleStyle}>{demo.title}</h2>
            <p style={cardDescStyle}>{demo.description}</p>
            <span style={cardLinkStyle}>
              {demo.slug}.demo.almostimpossible.agency →
            </span>
          </a>
        ))}
      </section>

      <footer style={footerStyle}>
        <span>{demos.length} demo{demos.length === 1 ? '' : 's'}</span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span style={{ opacity: 0.5 }}>v0</span>
      </footer>
    </main>
  );
}

const mainStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: '0 auto',
  padding: '6rem 2rem 4rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '3rem',
};

const headerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.85rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  opacity: 0.55,
};
const h1Style: React.CSSProperties = {
  margin: 0,
  fontSize: '3rem',
  letterSpacing: '-0.025em',
  fontWeight: 600,
};
const leadStyle: React.CSSProperties = { margin: 0, opacity: 0.7, fontSize: '1.05rem', maxWidth: 540 };

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '1rem',
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  padding: '1.5rem',
  borderRadius: 12,
  background: '#1a1a2e',
  border: '1px solid #2a2a3e',
  color: 'inherit',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease',
};
const cardSlugStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  opacity: 0.5,
  fontFamily: 'ui-monospace, "SF Mono", monospace',
};
const cardTitleStyle: React.CSSProperties = { margin: 0, fontSize: '1.25rem', fontWeight: 600 };
const cardDescStyle: React.CSSProperties = { margin: 0, opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.5 };
const cardLinkStyle: React.CSSProperties = {
  marginTop: '0.5rem',
  fontSize: '0.85rem',
  opacity: 0.6,
  fontFamily: 'ui-monospace, "SF Mono", monospace',
};

const footerStyle: React.CSSProperties = {
  marginTop: 'auto',
  display: 'flex',
  gap: '0.6rem',
  fontSize: '0.8rem',
  opacity: 0.55,
};
