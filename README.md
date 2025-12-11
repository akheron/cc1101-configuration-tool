# CC1101 Configuration Tool

An in-browser UI for configuring the TI CC1101 sub-GHz transceiver registers.

- Live app: https://akheron.github.io/cc1101-configuration-tool/
- Built with Vite + TypeScript; deploys to GitHub Pages.
- Entirely vibe coded.

## Features

- Live summary of derived values (base/carrier frequency, channel spacing, data rate, TX power).
- Searchable register cards with bitfield radios, numeric inputs, and per-register reset.
- Import/export using `(0xAA, 0xBB)` lines, with “only changed” filtering and copy-to-clipboard.
- Shareable state via URL hash; hash changes rehydrate the register state automatically.
- Crystal frequency selector updates all derived calculations.

## Requirements

- Node 22+ (matches CI) and npm 10+.

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (Vite dev server).

## Scripts

- `npm run dev` – Vite dev server
- `npm run build` – production build (`dist/`), base path auto-set for GitHub Pages
- `npm run preview` – preview the built assets locally
- `npm run lint` – ESLint (flat config)
- `npm run format` / `npm run format:check` – Prettier
- `npm run type-check` – TypeScript `--noEmit`
- `npm run test` – Unit tests with Vitest + happy-dom
- `npm run test:e2e` – Playwright e2e (Chromium). Run once before e2e: `npx playwright install --with-deps chromium`

## Project Layout

- `src/data` – register definitions and option tables
- `src/config` – field config metadata
- `src/logic` – pure helpers (bitfields, transforms, calculations)
- `src/state` – `RegisterState` with observers and computed getters
- `src/ui` – DOM rendering, event wiring, import/export helpers
- `src/styles` – base styling
- `public/index.html` / `index.html` – HTML shells for dev/build

## Import/Export Notes

- Lines like `(0x3E, 0xC0)` are parsed; invalid lines are ignored.
- Exports sort by address and can include all registers or only those differing from reset.
- State is also encoded in the URL hash (`#0a:05;3e:c0;...`) for easy sharing.

## Development Notes

- Register transforms enforce read-only fields and clear FIFOTHR bit 7.
- Summary cards link to the corresponding register card via `data-scroll-to`.
- Tests focus on logic/state/serialization; DOM coverage is light but exercised in e2e.

## Contributing

Before opening a PR, run `npm run lint`, `npm run type-check`, `npm run test`, and (optionally) `npm run test:e2e`. Keep additions typed and side-effect free where practical.
