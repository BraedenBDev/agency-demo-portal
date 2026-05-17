# agency-demo-portal

Landing page for `demo.almostimpossible.agency` — the agency's hosted demo portal.
v0 ships a hardcoded list of demos. v1 will add SQLite, Coolify API polling, and
admin CRUD (see design spec in the `proxmox` repo).

## Local dev

```
npm install
npm run dev
```

## Deployment

Auto-deployed via Coolify (VM 200) on push to `main`.
- Domain: `https://demo.almostimpossible.agency`
- Build pack: Nixpacks
- Exposed port: 3000

## Architecture

- Next.js 15 App Router, server-rendered, `output: standalone`
- Demos sourced from `lib/demos.ts` (v0). v1 will swap this to a SQLite-backed loader.
- `/healthz` returns `{ ok: true }` for liveness checks.
