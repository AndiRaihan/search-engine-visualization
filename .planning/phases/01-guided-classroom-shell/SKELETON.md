# Walking Skeleton — Interactive Search Engine Simulation

**Phase:** 1
**Generated:** 2026-06-14

## Capability Proven End-to-End

> A student can load the static browser application, choose a local teaching scenario, edit its query and documents, start the lesson, and move through registered classroom steps without any backend service.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | React 19.2, TypeScript, and Vite 8 SPA | Supports a single interactive page and emits static assets without server runtime concepts. |
| Styling and components | Tailwind CSS 4 through `@tailwindcss/vite`, official shadcn/ui preset `b1sAmVzcG`, native HTML, and native SVG | Implements the approved projector-safe UI contract while keeping later visualizations accessible and browser-native. |
| Data layer | Immutable TypeScript scenario modules copied into reducer-managed browser session state | Scenario data is small, deterministic, inspectable, and temporary. |
| API | Not applicable by locked project constraint | Phase 1 and the MVP are frontend-only; no network API is required or permitted. |
| Database | Not applicable by locked project constraint | Built-in scenarios ship in the static bundle and edits are intentionally session-local. |
| Auth | Not applicable by locked project constraint | The classroom simulation has no accounts, roles, or protected resources. |
| Deployment target | Vite `dist/` static bundle; local development and preview commands are the Phase 1 proof path | Static hosting provider selection is deferred to Phase 5, but the production artifact is host-agnostic. |
| Directory layout | `src/content`, `src/domain`, `src/features`, `src/components/ui`, `src/assets`, and `src/test` | Separates immutable lesson content, pure state contracts, user-facing slices, approved UI primitives, local assets, and validation utilities. |
| State controller | One pure `simulationReducer` plus derived selectors | Coordinated scenario, edit, reset, and navigation changes remain deterministic and unit-testable. |
| Lesson sequencing | Stable string step IDs in a local registry | Later phases can replace registered-step previews with real teaching views without changing navigation state. |

## Stack Touched in Phase 1

- [ ] Project scaffold: Vite React TypeScript, lint, Tailwind, test runner, and static build
- [ ] Browser route: the single `index.html` application entry
- [ ] Local data: five built-in scenario records with stable document IDs and curated vectors
- [ ] Reducer state: scenario selection, source edits, active step, reset, and bounded navigation
- [ ] UI interaction: scenario selection, editing, Start Search, Previous, Next, and Reset
- [ ] Validation: Vitest unit/component tests plus `npm run build`
- [ ] Local run: `npm run dev -- --host 127.0.0.1`
- [ ] Static preview: `npm run build` then `npm run preview -- --host 127.0.0.1`
- [x] Database: not applicable by locked frontend-only scope
- [x] API: not applicable by locked frontend-only scope
- [x] Authentication: not applicable by locked frontend-only scope

## Static Proof Commands

```powershell
npm install
npm run test -- --run
npm run build
npm run dev -- --host 127.0.0.1
npm run preview -- --host 127.0.0.1
```

The application must not require environment secrets, a server process, a database, authentication, or runtime network requests for scenario data.

## Out of Scope (Deferred to Later Slices)

- Keyword tokenization, term statistics, TF-IDF scoring, and keyword ranking are Phase 2.
- Meaning-map rendering and Euclidean ranking are Phase 3.
- Cosine similarity and semantic metric switching are Phase 4.
- Final side-by-side comparison, Run All, global keyboard shortcuts, browser smoke tests, and release hosting are Phase 5.
- Document add/remove controls, tablet layouts, 200% reflow, presentation mode, quizzes, scenario authoring, localization, and editable vectors are deferred beyond the Phase 1 boundary.

## Subsequent Slice Plan

Each later phase adds a vertical classroom capability without changing the static architecture:

- Phase 2: students inspect a complete deterministic keyword-search journey.
- Phase 3: students inspect curated meaning vectors and Euclidean ranking.
- Phase 4: students compare Euclidean distance with cosine similarity.
- Phase 5: students complete the lesson, compare both ranking models, and use the tested static release.
