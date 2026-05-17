# Sprint: External / Legacy Demos in the Grid

**Goal:** Add support for non-Coolify (AWS-hosted) demos in the portal — inline /admin form to create them, visual `· external` + `↗` marker on rows, all demo links open in new tab. Seed `mashreq-kiosk` and `eh3` on db init.

**Branch:** `feat/external-demos`
**Restore tag:** `restore/pre-sprint-1779047407`
**Full plan:** `/Users/Braeden-ai/Developer/proxmox/docs/superpowers/plans/2026-05-17-portal-external-demos.md`
**Spec:** `/Users/Braeden-ai/Developer/proxmox/docs/superpowers/specs/2026-05-17-portal-external-demos.md`

## Acceptance Criteria

1. **Schema migration + seed live** — `external_url` column added to `demos` via idempotent ALTER TABLE in `lib/db.ts`; `mashreq-kiosk` + `eh3` rows seeded with `INSERT OR IGNORE` on db init; both visible=0.
2. **DB helpers exposed** — `createExternalDemo({slug, externalUrl, title?, description?})` and `updateExternalUrl(slug, externalUrl)` functions exported from `lib/db.ts`; `DemoRow.external_url: string | null` typed; reconciler unchanged.
3. **`lib/demos.ts` extended** — `Demo` type includes `externalUrl: string | null`; `demoUrl(demo)` returns `external_url ?? built-in subdomain`; `isExternal(demo)` helper.
4. **`<DemoPreviewCard>` external mode** — accepts `external?: boolean`; renders `· external` in mono eyebrow; swaps OpticalArrow for lucide `<ArrowUpRight>`; all anchors always `target="_blank" rel="noopener noreferrer"`.
5. **`<DemoAdminCard>` external mode** — accepts `externalUrl: string | null`; shows `external` (not Coolify ID) in eyebrow; truncated URL line under title; password-gate badge suppressed.
6. **`<ExternalDemoForm>` shipped** — collapsible client component at top of `/admin`; trigger button → 3-input form (slug, URL, optional title) → calls `createExternalDemoAction`; inline error display.
7. **`<PreviewEditor>` external mode** — receives `external` + `externalUrl` in `initial`; renders External URL form section when external; suppresses Password gate section when external.
8. **Server actions ready** — `createExternalDemoAction(formData)` and `updateExternalUrlAction(slug, formData)` in `app/admin/actions.ts`; both validate slug (`/^[a-z0-9-]+$/`, ≤64) and URL (https://, ≤2048, no whitespace); both return `{ error?: string }` on validation/PK-collision failure.
9. **Final build + deploy live** — `tsc --noEmit` clean; `next build` clean; `next start` smoke test confirms `/admin` has "Add external demo" trigger and `/admin/eh3` renders "External URL" without "Password gate"; merged PR to main triggers Coolify auto-deploy; live `/admin` shows both seeded demos; clicking either demo (and clicking a Coolify demo) opens in new tab.

## Files Expected to Touch

**Modified:**
- `lib/db.ts`, `lib/demos.ts`
- `components/demos/demo-preview-card.tsx`, `demo-index-row.tsx`, `demo-admin-card.tsx`
- `components/admin/preview-editor.tsx`
- `app/page.tsx`, `app/admin/page.tsx`, `app/admin/[slug]/page.tsx`, `app/admin/actions.ts`

**New:**
- `components/admin/external-demo-form.tsx`

**Untouched (regression-safe):**
- `lib/coolify.ts`, `lib/polling.ts`, `lib/traefik.ts`, `lib/screenshots.ts`
- `lib/utils.ts`, all of `components/ui/`, `components/site/`
- `app/healthz/`, `app/screenshots/`, `app/layout.tsx`
- Build config (`tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `Dockerfile`)
- `app/design-tokens.css`, `app/fonts.css`, `public/fonts/*`

## Risks

- **In-code ALTER TABLE** — idempotent via try/catch of "duplicate column name" but if SQLite's error message changes wording across versions the catch could miss. Mitigation: regex match is loose (`/duplicate column name: external_url/i`).
- **All-links-new-tab behavior change** — Coolify rows now open in new tab too. User explicit preference; worth flagging in PR body.
- **External URL trust boundary** — operator-supplied URLs validated only for `https://` prefix, length, no whitespace. Trust is the /admin tailnet allowlist; no domain allowlist.
- **PreviewEditor signature change** — `initial` now requires `external` + `externalUrl`. Only one call site (`/admin/[slug]/page.tsx`); updated in same change.

## Verification Strategy

No unit-test infra (consistent with prior sprints). Per /start protocol, substitute concrete verification for the RED step:
- `npx tsc --noEmit` after each file batch
- `npx next build` at task boundaries
- `next start` + curl smoke test (Task 7)
- DB inspection via `node -e` script with `better-sqlite3` (Task 1 + post-deploy in Task 7)

## Parking Lot

(Items discovered mid-sprint that are out of scope — park here, don't action.)

— (empty)
