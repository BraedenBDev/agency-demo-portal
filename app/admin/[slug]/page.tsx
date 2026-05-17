import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getDemo } from '@/lib/db';
import {
  setPasswordAction,
  updateMetaAction,
  uploadScreenshotAction,
} from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo) notFound();

  const updateMeta = updateMetaAction.bind(null, slug);
  const setPassword = setPasswordAction.bind(null, slug);
  const uploadScreenshot = uploadScreenshotAction.bind(null, slug);

  return (
    <main style={mainStyle}>
      <Link href="/admin" style={backStyle}>← Admin</Link>

      <header>
        <div style={slugStyle}>{demo.slug}</div>
        <h1 style={h1Style}>Edit demo</h1>
        <p style={leadStyle}>
          {demo.archived
            ? <span style={{ color: '#9ca3af' }}>archived (Coolify app removed)</span>
            : <a href={`https://${demo.slug}.demo.almostimpossible.agency`} style={linkStyle}>
                {demo.slug}.demo.almostimpossible.agency ↗
              </a>}
        </p>
      </header>

      <Section title="Metadata">
        <form action={updateMeta} style={formStyle}>
          <label style={labelStyle}>
            Title
            <input name="title" defaultValue={demo.title} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Description
            <textarea name="description" defaultValue={demo.description} rows={3} style={inputStyle} />
          </label>
          <label style={checkboxRowStyle}>
            <input type="checkbox" name="visible" defaultChecked={demo.visible === 1} />
            <span>Visible on public landing page</span>
          </label>
          <button type="submit" style={primaryButtonStyle}>Save metadata</button>
        </form>
      </Section>

      <Section title="Screenshot">
        {demo.screenshot_path && (
          <img
            src={`/${demo.screenshot_path}`}
            alt={`${demo.slug} screenshot`}
            style={{ maxWidth: 320, borderRadius: 8, marginBottom: '1rem', display: 'block' }}
          />
        )}
        <form action={uploadScreenshot} style={formStyle}>
          <input
            type="file"
            name="screenshot"
            accept="image/png,image/jpeg,image/webp"
            style={fileInputStyle}
          />
          <button type="submit" style={primaryButtonStyle}>Upload</button>
        </form>
      </Section>

      <Section title="Password gate">
        <p style={subtleStyle}>
          {demo.password_gated === 1
            ? '🔒 Currently gated. Submit a new password to rotate, or submit blank to remove.'
            : 'Currently open. Set a password to enable basic-auth on the demo subdomain.'}
        </p>
        <form action={setPassword} style={formStyle}>
          <input
            type="password"
            name="password"
            placeholder={demo.password_gated === 1 ? '(rotate or leave blank to clear)' : 'new password'}
            style={inputStyle}
          />
          <button type="submit" style={primaryButtonStyle}>
            {demo.password_gated === 1 ? 'Update password' : 'Set password'}
          </button>
        </form>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h2 style={h2Style}>{title}</h2>
      {children}
    </section>
  );
}

const mainStyle: React.CSSProperties = {
  maxWidth: 720, margin: '0 auto', padding: '4rem 2rem',
  display: 'flex', flexDirection: 'column', gap: '2rem',
};
const backStyle: React.CSSProperties = { color: '#8ab4ff', textDecoration: 'none', fontSize: '0.85rem' };
const slugStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, "SF Mono", monospace',
  fontSize: '0.85rem', opacity: 0.55, marginBottom: '0.4rem',
};
const h1Style: React.CSSProperties = { margin: 0, fontSize: '1.8rem', fontWeight: 600 };
const leadStyle: React.CSSProperties = { margin: '0.4rem 0 0', fontSize: '0.9rem', opacity: 0.7 };
const linkStyle: React.CSSProperties = { color: '#8ab4ff', textDecoration: 'none' };

const sectionStyle: React.CSSProperties = {
  background: '#16162a', borderRadius: 12, padding: '1.5rem',
  display: 'flex', flexDirection: 'column', gap: '0.75rem',
};
const h2Style: React.CSSProperties = { margin: 0, fontSize: '1.05rem', fontWeight: 600 };
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.75rem' };
const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', opacity: 0.85 };
const inputStyle: React.CSSProperties = {
  padding: '0.6rem 0.75rem', borderRadius: 6, border: '1px solid #2a2a3e',
  background: '#0f0f1a', color: '#f5f5f7', fontSize: '0.9rem', fontFamily: 'inherit',
};
const checkboxRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' };
const primaryButtonStyle: React.CSSProperties = {
  padding: '0.6rem 1.1rem', borderRadius: 6,
  background: '#3b82f6', color: '#fff', border: 'none',
  fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start',
};
const fileInputStyle: React.CSSProperties = { fontSize: '0.85rem', color: '#cbd5e1' };
const subtleStyle: React.CSSProperties = { margin: 0, fontSize: '0.85rem', opacity: 0.7 };
