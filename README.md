# promate-frontend

Next.js storefront and embedded **ProMate** chat widget for the PartSelect case study
(refrigerator + dishwasher parts).

## Quickstart (local)

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_API_BASE_URL
pnpm install
pnpm dev                     # http://localhost:3000
```

Run the backend stack first (`promate-backend`: `docker compose up`).

## Scripts

- `pnpm dev` — development server
- `pnpm build` / `pnpm start` — production
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit`

## Phase 0 layout

```
app/           App Router pages and root layout (PartSelect branding)
components/    chat/, products/, ui/ land in later phases
lib/           API client + generated OpenAPI types (Phase 3+)
```
