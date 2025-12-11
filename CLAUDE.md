# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based configuration tool for the TI CC1101 sub-GHz transceiver. Users can configure registers via a UI, see live-calculated derived values (frequency, data rate, TX power), and import/export register values in a `(0xAA, 0xBB)` format. State is shareable via URL hash.

## Commands

### Development

- `npm run dev` - Start Vite dev server (default port or as configured)
- `npm run build` - Production build to `dist/` (auto-detects GitHub Pages base path)
- `npm run preview` - Preview production build locally

### Code Quality

- `npm run type-check` - TypeScript type checking (`--noEmit`)
- `npm run lint` - ESLint with flat config
- `npm run format` / `npm run format:check` - Prettier formatting

### Testing

- `npm run test` - Unit tests with Vitest + happy-dom
- `npm run test:watch` - Vitest in watch mode
- `npm run test:e2e` - Playwright e2e tests (Chromium only)
  - **First time**: Run `npx playwright install --with-deps chromium`

## Architecture

### Directory Structure

- **`src/data/`** - Source of truth for CC1101 register definitions (`registers.ts`) and option tables (`options.ts`)
- **`src/config/`** - Field configuration metadata (maps bitfield names to UI controls, options, and dynamic calculations)
- **`src/logic/`** - Pure, side-effect-free helpers:
  - `bitFields.ts` - Bit extraction/manipulation
  - `transforms.ts` - Register value transforms (enforce read-only fields, clear FIFOTHR bit 7)
  - `calculations.ts` - Derived value calculations (frequency, data rate, TX power)
- **`src/state/`** - `RegisterState` class with observer pattern and computed getters; `useRegisterState` React hook
- **`src/ui/`** - React components and UI-specific logic (import/export lives here)
- **`src/types/`** - TypeScript type definitions

### Key Concepts

#### RegisterState (Observer Pattern)

The `RegisterState` class (`src/state/registerState.ts`) is the single source of truth for all register values. It:

- Stores register values as `{ [addr: number]: number }`
- Exposes `setValue()`, `getValue()`, `getAllValues()`, and `setCrystalFreq()`
- Provides computed getters (e.g., `getBaseFrequency()`, `getCarrierFrequency()`, `getDataRate()`)
- Implements an observer pattern via `subscribe()` - listeners receive `StateChange` events
- **React integration**: `useRegisterState` hook wraps the state and triggers re-renders on changes

#### Register Transforms

Two critical transforms are applied to all register writes (see `src/logic/transforms.ts`):

1. **`ensureFIFOTHRBit7Cleared(addr, value)`** - Ensures FIFOTHR register (0x03) bit 7 is always cleared (reserved bit must be 0)
2. **`enforceReadOnlyFields(addr, value)`** - Prevents modification of read-only bitfields by preserving their reset values

These transforms are applied in `App.tsx` whenever a register value is updated via UI or direct hex input.

#### Import/Export Format

- **Export**: `(0xAA, 0xBB)` format, one per line, sorted by address. Can filter to "only changed" registers.
- **Import**: Parses lines matching `(0xAA, 0xBB)` regex; invalid lines are silently ignored.
- **URL Hash**: State is encoded as `#0a:05;3e:c0;...` for sharing. Hash changes automatically rehydrate state.

#### Summary Cards & Scrolling

Summary cards at the top display derived values (frequency, data rate, etc.). Each card has a `data-scroll-to` attribute linking to the corresponding register. Clicking a summary item scrolls to the register card; if the register is filtered out, the filter is cleared first.

## Important Constraints

- **Node version**: Requires Node 22+ (matches CI)
- **Read-only fields**: Always use `RegisterTransforms.enforceReadOnlyFields()` when setting register values
- **FIFOTHR bit 7**: Always use `RegisterTransforms.ensureFIFOTHRBit7Cleared()` for register 0x03
- **Pure logic**: Keep `src/logic/` functions pure and side-effect-free
- **Crystal frequency**: Affects all frequency/rate calculations; stored in `RegisterState`

## Testing Strategy

- **Unit tests** (`src/__tests__/`) focus on logic, state, serialization, and bit manipulation
- **E2E tests** (`tests/e2e/`) cover DOM interactions and workflows
- Tests use Vitest with happy-dom for JSDOM-like environment
- Playwright config runs Chromium-only to keep CI fast

## Development Workflow

### After Making Changes

Always run the following commands to ensure code quality and prevent regressions:

1. `npm run type-check` - Verify TypeScript types
2. `npm run lint` - Check for linting errors
3. `npm run format:check` - Verify code formatting (or `npm run format` to auto-fix)
4. `npm run test` - Run unit tests
5. `npm run test:e2e` - Run e2e tests (optional but recommended for significant changes)

### Documentation Maintenance

- Keep `README.md` up-to-date when adding features, changing scripts, or modifying the project structure
- Keep `CLAUDE.md` up-to-date when changing architecture, adding new patterns, or introducing important constraints
