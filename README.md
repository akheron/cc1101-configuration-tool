# CC1101 Configuration Tool

A modular Vite + TypeScript CC1101 configuration UI. Pure DOM (no framework) with typed register definitions, helpers, and tests.

## Getting Started

```bash
npm install
npm run dev
```

Then open the shown local URL.

## Scripts

- `npm run dev` – Vite dev server
- `npm run build` – production build
- `npm run preview` – preview built assets
- `npm run lint` – ESLint (flat config)
- `npm run format` / `npm run format:check` – Prettier
- `npm run type-check` – TypeScript `--noEmit`
- `npm run test` – Vitest (happy-dom)

## Project Layout

- `src/data` – register definitions and option tables
- `src/config` – field config metadata
- `src/logic` – pure helpers (bitfields, transforms, calculations)
- `src/state` – `RegisterState` with observers and computed getters
- `src/ui` – DOM rendering, event wiring, import/export helpers
- `src/styles` – base styling
- `public/index.html` / `index.html` – HTML shells for dev/build

## Development Notes

- Register transforms enforce read-only fields and clear FIFOTHR bit 7.
- Import/export helpers parse `(0xNN, 0xVV)` lines and support URL hash roundtrip.
- Tests focus on pure logic, state, and serialization; DOM is exercised lightly via happy-dom.

## Contributing

Run `npm run lint`, `npm run type-check`, and `npm run test` before pushing changes. Keep additions typed and side-effect free where possible.
