# Sprint: impossible-ui Reskin

**Goal:** Reskin all three portal routes (`/`, `/admin`, `/admin/[slug]`) to match the Almost Impossible Agency brand — editorial fidelity end-to-end — by vendoring tokens, fonts, and a small slice of shadcn components from `impossible-project`. No data-layer changes.

**Branch:** `feat/impossible-ui-reskin`
**Restore tag:** `restore/pre-sprint-1779040019`
**Full plan:** `/Users/Braeden-ai/Developer/proxmox/docs/superpowers/plans/2026-05-17-portal-impossible-ui-reskin.md`
**Spec:** `/Users/Braeden-ai/Developer/proxmox/docs/superpowers/specs/2026-05-17-agency-demo-portal-impossible-ui-reskin.md`

## Acceptance Criteria

1. **Build deps + Tailwind config installed** — `tailwind.config.ts`, `postcss.config.mjs`, HSL token bindings present; `npx tsc --noEmit` clean.
2. **Design tokens + fonts wired** — `app/design-tokens.css`, `app/fonts.css`, 8 Klavika woff2 files in `public/fonts/`, `next/font/local` + Google loaders in `app/layout.tsx`; `next build` emits 8 Klavika files to `.next/static/media/`.
3. **shadcn primitives + OpticalArrow vendored** — 8 shadcn components in `components/ui/`, `lib/utils.ts` with `cn()` helper, `components.json` shadcn CLI config; `tsc --noEmit` clean.
4. **Portal-specific components built** — `page-frame`, `section-divider`, `state-badge`, `demo-index-row`, `demo-admin-card`, `demo-preview-card`, `preview-editor` all created and typecheck clean.
5. **`/` rewritten as editorial index** — renders Playfair "Demos." header + DemoIndexRow per visible demo; smoke test confirms `<title>` and editorial classes present.
6. **`/admin` rewritten as editorial card list** — Roster. header; DemoAdminCard per demo with Publish/Unpublish + Edit + state badge; Refresh-from-Coolify still works.
7. **`/admin/[slug]` rewritten with PreviewEditor** — 3-section form column (Metadata, Screenshot, Password) + live demo-card preview column; screenshot picker shows thumbnail via object URL.
8. **Final build clean + visible regression-safe** — `tsc --noEmit` + `next build` both clean; data layer untouched (lib/db.ts, polling.ts, traefik.ts, screenshots.ts, all server actions unchanged).

## Files Expected to Touch

**New:**
- `tailwind.config.ts`, `postcss.config.mjs`, `components.json`
- `app/design-tokens.css`, `app/fonts.css`
- `public/fonts/klavika-*.woff2` (×8)
- `lib/utils.ts`
- `components/ui/{button,card,input,label,textarea,checkbox,badge,dialog,optical-arrow}.tsx`
- `components/site/{page-frame,section-divider,state-badge}.tsx`
- `components/demos/{demo-index-row,demo-admin-card,demo-preview-card}.tsx`
- `components/admin/preview-editor.tsx`

**Modified:**
- `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/admin/page.tsx`, `app/admin/[slug]/page.tsx`, `package.json`, `tsconfig.json` (if `@/*` alias missing)

**Untouched (regression-safe):**
- `lib/db.ts`, `lib/coolify.ts`, `lib/demos.ts`, `lib/polling.ts`, `lib/screenshots.ts`, `lib/traefik.ts`
- `app/admin/actions.ts`, `instrumentation.ts`, `instrumentation-node.ts`
- `app/healthz/`, `app/screenshots/`, `Dockerfile`

## Risks

- **Klavika licensing** — same self-hosted woff2 files as agency site; assumption is the license covers the demo subdomain. Fallback: Klavika Fallback CSS (no display weight, still readable).
- **shadcn vendor drift** — components are copied once; future agency-site changes won't auto-propagate. Acceptable for primitives.
- **`next dev` smoke tests in plan** — may require killing background processes; using `pkill -f "next dev"` after each.
- **Tailwind config typo** — token bindings reference HSL CSS variables defined in `design-tokens.css`; misnamed variables surface as silent fallback colors. Caught by visual inspection at Phase 5.

## Verification Strategy

This is a pure-UI sprint. No unit-test infrastructure exists in the portal today, so per /start protocol we substitute concrete verification procedures for the RED step:
- `npx tsc --noEmit` (after each file batch)
- `npx next build` (after fonts + after each route rewrite)
- `curl -s http://localhost:3333/<route> | grep -oE '<expected text>'` (dev-server smoke test)
- Live deploy verification after push (Task 8.4–8.6)

## Parking Lot

(Items discovered mid-sprint that are out of scope — park here, don't action.)

— (empty)
