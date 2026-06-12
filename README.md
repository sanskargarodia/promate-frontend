# promate-frontend

Next.js **demo host** and embedded **ProMate** chat widget for the PartSelect case study
(refrigerator + dishwasher parts). This is not a full storefront — it provides catalog
context and a purchase handoff to PartSelect.com.

## Quickstart (local)

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_API_BASE_URL
pnpm install
pnpm dev                     # http://localhost:3000
```

Run the backend first (`promate-backend`: see its README).

## Demo prompts (open chat widget, bottom-right)

1. `My dishwasher won't drain — what part might I need?`
2. `Will PS11752778 fit model WDT780SAEM1?`
3. `How can I install part PS11752778?`
4. `I'm ready to buy PS11752778`
5. `What is the status of order ORD-DEMO-001?`

## What the mock site includes

- **Home** — demo explanation and sample prompts
- **Catalog** (`/parts`) — browse real catalog data from the backend
- **Part detail** (`/parts/[ps]`) — price, stock, compatibility, link to PartSelect.com
- **Chat widget** — streaming assistant with product sidebar and purchase handoff banner

No cart page, no Stripe checkout — conversion ends with **Order on PartSelect.com**.

## Scripts

- `pnpm dev` — development server
- `pnpm build` / `pnpm start` — production
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit`
