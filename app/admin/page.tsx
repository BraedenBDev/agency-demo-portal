import Link from 'next/link';

import { listAllDemos, type DemoRow } from '@/lib/db';
import { refreshFromCoolifyAction, togglePublishAction } from './actions';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const demos = listAllDemos();
  return (
    <main style={mainStyle}>
      <header style={headerStyle}>
        <h1 style={h1Style}>Admin · Demos</h1>
        <p style={leadStyle}>
          {demos.length} total · {demos.filter((d) => d.visible && !d.archived).length} visible ·{' '}
          {demos.filter((d) => d.archived).length} archived
        </p>
        <form action={refreshFromCoolifyAction}>
          <button type="submit" style={buttonStyle}>Refresh from Coolify</button>
        </form>
      </header>

      <table style={tableStyle}>
        <thead>
          <tr style={trHeadStyle}>
            <th style={thStyle}>Slug</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>State</th>
            <th style={thStyle}>Password</th>
            <th style={thStyle}>Coolify</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {demos.map((d) => (
            <DemoRowView key={d.slug} d={d} />
          ))}
        </tbody>
      </table>
    </main>
  );
}

function DemoRowView({ d }: { d: DemoRow }) {
  const state =
    d.archived ? 'archived' :
    d.visible ? 'visible' :
    'hidden';
  const toggle = togglePublishAction.bind(null, d.slug);
  const canToggle = d.archived !== 1;
  const isPublished = d.visible === 1;
  return (
    <tr style={trStyle}>
      <td style={tdMonoStyle}>{d.slug}</td>
      <td style={tdStyle}>{d.title || <span style={muted}>—</span>}</td>
      <td style={tdStyle}><span style={stateBadge(state)}>{state}</span></td>
      <td style={tdStyle}>{d.password_gated ? '🔒 gated' : <span style={muted}>open</span>}</td>
      <td style={tdMonoStyle}>{d.coolify_app_id ? d.coolify_app_id.slice(0, 8) : <span style={muted}>—</span>}</td>
      <td style={tdActionsStyle}>
        {canToggle && (
          <form action={toggle} style={inlineFormStyle}>
            <button
              type="submit"
              style={isPublished ? unpublishButtonStyle : publishButtonStyle}
              title={isPublished ? 'Hide from public landing' : 'Show on public landing'}
            >
              {isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </form>
        )}
        <Link href={`/admin/${d.slug}`} style={linkStyle}>Edit →</Link>
      </td>
    </tr>
  );
}

const mainStyle: React.CSSProperties = {
  maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem',
  display: 'flex', flexDirection: 'column', gap: '2rem',
};
const headerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const h1Style: React.CSSProperties = { margin: 0, fontSize: '1.8rem', fontWeight: 600 };
const leadStyle: React.CSSProperties = { margin: 0, opacity: 0.6, fontSize: '0.9rem' };
const buttonStyle: React.CSSProperties = {
  marginTop: '0.5rem', padding: '0.5rem 1rem', borderRadius: 8,
  background: '#2a2a3e', color: '#f5f5f7', border: '1px solid #3a3a4e',
  fontSize: '0.85rem', cursor: 'pointer', alignSelf: 'flex-start',
};
const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse',
  background: '#16162a', borderRadius: 8, overflow: 'hidden',
};
const trHeadStyle: React.CSSProperties = { background: '#1f1f33' };
const trStyle: React.CSSProperties = { borderTop: '1px solid #25253a' };
const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem',
  letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.6,
};
const tdStyle: React.CSSProperties = { padding: '0.75rem 1rem', fontSize: '0.9rem' };
const tdMonoStyle: React.CSSProperties = {
  ...tdStyle,
  fontFamily: 'ui-monospace, "SF Mono", monospace',
  fontSize: '0.85rem',
};
const linkStyle: React.CSSProperties = { color: '#8ab4ff', textDecoration: 'none', fontSize: '0.85rem' };
const tdActionsStyle: React.CSSProperties = {
  ...tdStyle,
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  justifyContent: 'flex-end',
};
const inlineFormStyle: React.CSSProperties = { display: 'inline-flex', margin: 0 };
const publishButtonStyle: React.CSSProperties = {
  padding: '0.3rem 0.7rem',
  borderRadius: 6,
  background: '#22c55e',
  color: '#0f0f1a',
  border: 'none',
  fontSize: '0.78rem',
  fontWeight: 600,
  cursor: 'pointer',
};
const unpublishButtonStyle: React.CSSProperties = {
  ...publishButtonStyle,
  background: '#2a2a3e',
  color: '#f5f5f7',
  border: '1px solid #3a3a4e',
};
const muted: React.CSSProperties = { opacity: 0.4 };

function stateBadge(state: 'visible' | 'hidden' | 'archived'): React.CSSProperties {
  const color =
    state === 'visible' ? '#4ade80' :
    state === 'archived' ? '#9ca3af' :
    '#fbbf24';
  return {
    display: 'inline-block', padding: '0.2rem 0.55rem', borderRadius: 999,
    background: `${color}22`, color, fontSize: '0.75rem', fontWeight: 600,
  };
}
