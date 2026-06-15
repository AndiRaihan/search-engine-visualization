# Phase 1: Guided Classroom Shell - Pattern Map

**Mapped:** 2026-06-14
**Files analyzed:** 10
**Analogs found:** 0 / 10

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `package.json` | config | batch | none - no app scaffold exists | no analog |
| `vite.config.ts` | config | batch | none - no app scaffold exists | no analog |
| `tsconfig.json` | config | batch | none - no app scaffold exists | no analog |
| `tsconfig.app.json` | config | batch | none - no app scaffold exists | no analog |
| `src/main.tsx` | component | request-response | none - no app scaffold exists | no analog |
| `src/App.tsx` | component | request-response | none - no app scaffold exists | no analog |
| `src/index.css` | config | batch | none - no app scaffold exists | no analog |
| `src/domain/session/sessionReducer.ts` | model | CRUD | none - no app scaffold exists | no analog |
| `src/features/input-panel/*.tsx` | component | request-response | none - no app scaffold exists | no analog |
| `src/features/lesson-panel/*.tsx` | component | request-response | none - no app scaffold exists | no analog |

## Pattern Assignments

### `package.json` (config, batch)

**Analog:** none in repository.

**Canonical sources:**
- `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` lines 79, 126-130, 482-488 for the scaffold, scripts, and test commands.
- `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` lines 41-61 for Vite/Tailwind/shadcn compatibility.

**Pattern to copy:**
- Use a Vite React TypeScript SPA script set: `dev`, `build`, `test`.
- Add `vitest`, `@testing-library/react`, `@testing-library/user-event`, and `jsdom` for Phase 1 validation.
- Keep the stack static-browser only; no backend or routing dependencies.

### `vite.config.ts` (config, batch)

**Analog:** none in repository.

**Canonical sources:**
- `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` lines 363-369 and 482-483 for `react()` + `tailwindcss()` plugin wiring.
- `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` lines 41-50 for `@/*` alias and Vite compatibility.

**Pattern to copy:**
- Define Vite with `react()` and `tailwindcss()` plugins.
- Map `@` to `./src`.
- Keep the build static and client-only.

### `tsconfig.json` and `tsconfig.app.json` (config, batch)

**Analog:** none in repository.

**Canonical sources:**
- `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` lines 41-50 for `@/*` alias requirements.
- `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` lines 200-203 for the proposed `src/content`, `src/domain`, and `src/features` layout.

**Pattern to copy:**
- Add `@` path aliases rooted at `src`.
- Preserve scaffolded TS strictness for typed scenario/session contracts.

### `src/main.tsx` (component, request-response)

**Analog:** none in repository.

**Canonical sources:**
- `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` lines 73-79 for one-route SPA + reducer-driven shell.
- `docs/PRD.md` via `01-CONTEXT.md` canonical refs for the classroom shell entrypoint.

**Pattern to copy:**
- Mount the app once into `#root`.
- Wrap the app in any global providers needed later, but keep Phase 1 minimal.

### `src/App.tsx` (component, request-response)

**Analog:** none in repository.

**Canonical sources:**
- `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` lines 181-207 for the three-panel shell structure and copy.
- `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` lines 176-180 for left/center/right panel responsibilities.

**Pattern to copy:**
- Render a single-page three-panel classroom shell.
- Keep left, center, and right panel content aligned to the phase contract.

### `src/index.css` (config, batch)

**Analog:** none in repository.

**Canonical sources:**
- `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` lines 66-135 for spacing, typography, and color tokens.
- `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` lines 142-173 for layout and panel surface rules.

**Pattern to copy:**
- Define projector-safe theme tokens, large readable typography, and 1-page scrolling layout defaults.
- Keep accent usage tightly reserved.

### `src/domain/session/sessionReducer.ts` (model, CRUD)

**Analog:** none in repository.

**Canonical sources:**
- `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` lines 221-259 for `buildSessionFromScenario(...)` and typed reducer actions.
- `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` lines 291-343 for derived selectors, immutable resets, and dirty-state rules.
- `.planning/phases/01-guided-classroom-shell/01-CONTEXT.md` lines 13-29 for D-05 through D-17.

**Pattern to copy:**
- Build active session state from immutable scenario snapshots.
- Keep scenario switching, query edits, document edits, start, next, previous, and reset as explicit reducer actions.
- Derive dirty state and progress instead of storing them as independent mutable fields.

### `src/features/input-panel/*.tsx` (component, request-response)

**Analog:** none in repository.

**Canonical sources:**
- `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` lines 181-199, 220-246 for scenario, query, document, and edited/reset UI.
- `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` lines 463-465 for the input-panel test targets.

**Pattern to copy:**
- Render scenario select, query textarea, numbered document cards, and a single panel-level `Edited`/reset row.
- Do not add document add/remove controls in Phase 1.

### `src/features/lesson-panel/*.tsx` (component, request-response)

**Analog:** none in repository.

**Canonical sources:**
- `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` lines 199-218, 248-268, 296-305 for step content, navigation, progress, and reset dialog copy.
- `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` lines 466-470 and 482-487 for lesson-panel test targets and validation gaps.

**Pattern to copy:**
- Show step title, step progress, placeholder lesson body, and sequential Previous/Next controls.
- Keep `Start Search` as the setup-to-step transition and gate dirty reset with confirmation.

## Shared Patterns

### Static scenario source of truth
**Source:** `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` lines 221-241 and `.planning/phases/01-guided-classroom-shell/01-CONTEXT.md` lines 13-29.

**Apply to:** `src/domain/session/sessionReducer.ts`, `src/features/input-panel/*.tsx`, `src/features/lesson-panel/*.tsx`

**Pattern:**
- Treat scenario defaults as immutable snapshots.
- Rebuild active session state from the selected scenario on switch and reset.

### Derived dirty/progress state
**Source:** `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` lines 291-343.

**Apply to:** `src/domain/session/sessionReducer.ts`, `src/features/lesson-panel/*.tsx`

**Pattern:**
- Derive edited status and progress from canonical state instead of storing redundant booleans.

### Projector-first shell layout
**Source:** `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` lines 142-218.

**Apply to:** `src/App.tsx`, `src/index.css`, `src/features/input-panel/*.tsx`, `src/features/lesson-panel/*.tsx`

**Pattern:**
- Use a bright three-panel desktop layout with one page scroll, large readable text, and visible disabled states.

### Accessibility and reset confirmation
**Source:** `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` lines 237-268 and 306-318.

**Apply to:** `src/features/lesson-panel/*.tsx`

**Pattern:**
- Use `AlertDialog` for dirty reset confirmation.
- Keep buttons visible and disabled at boundaries instead of hiding them.

## No Analog Found

All Phase 1 implementation files have no code analogs because this repository currently contains only planning and product documents.

| File | Role | Data Flow | Canonical source instead |
|------|------|-----------|--------------------------|
| `package.json` | config | batch | `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md`, `01-UI-SPEC.md` |
| `vite.config.ts` | config | batch | `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md`, `01-UI-SPEC.md` |
| `tsconfig.json` | config | batch | `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` |
| `tsconfig.app.json` | config | batch | `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` |
| `src/main.tsx` | component | request-response | `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` |
| `src/App.tsx` | component | request-response | `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` |
| `src/index.css` | config | batch | `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` |
| `src/domain/session/sessionReducer.ts` | model | CRUD | `.planning/phases/01-guided-classroom-shell/01-RESEARCH.md` |
| `src/features/input-panel/*.tsx` | component | request-response | `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` |
| `src/features/lesson-panel/*.tsx` | component | request-response | `.planning/phases/01-guided-classroom-shell/01-UI-SPEC.md` |

## Metadata

**Analog search scope:** repository root and `.planning/`
**Files scanned:** planning artifacts only; no application source exists yet
**Pattern extraction date:** 2026-06-14
