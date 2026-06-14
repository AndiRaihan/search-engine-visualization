# Project Research Summary

**Project:** Interactive Search Engine Simulation
**Domain:** Interactive educational search-engine visualization
**Researched:** 2026-06-14
**Confidence:** HIGH

## Executive Summary

This product is best built as a static React 19.2 and TypeScript application using Vite 8, Tailwind CSS 4.3, and native SVG. Next.js, a backend, a global state library, real embeddings, and a charting framework add complexity without serving the MVP. The document count is deliberately tiny, so architecture should optimize for correctness, teaching clarity, and maintainability rather than computation scale.

The central engineering pattern is a functional search core feeding one canonical simulation snapshot. Editable inputs and navigation are the only stored application state; tokenization, TF/IDF/TF-IDF, keyword ranking, distances, and semantic ranking are derived through pure functions. Every table, highlight, score bar, map, explanation, and result card must use that same snapshot.

The main risks are pedagogical rather than performance-related: mathematically correct screens that do not explain causality, visualizations that disagree, hand-curated vectors presented as real embeddings, and inaccessible projector-oriented UI. The roadmap should establish the tested domain engine and scenario contract before layering on the guided UI and visualizations.

## Key Findings

### Recommended Stack

Use a Vite React SPA with TypeScript and Tailwind, render the meaning map directly with SVG, test pure functions with Vitest, test user behavior with React Testing Library, and cover only the critical browser flow with Playwright.

**Core technologies:**
- React 19.2: component UI and state-driven step rendering
- TypeScript current stable 5.x: scenario, snapshot, and visualization contracts
- Vite 8.0.x: fast development and static build
- Tailwind CSS 4.3.x: fixed desktop/projector layout and visual tokens
- Native SVG: labeled, scalable, DOM-integrated meaning map

### Expected Features

**Must have (table stakes):**
- Guided Previous/Next/Start/Run All/Reset flow
- Built-in editable scenarios with deterministic reset
- Visible intermediate calculations and explanations
- Coordinated token, table, score, map, and ranking views
- Stable rankings with student-friendly reasons
- Keyboard, non-color, contrast, and projector readability support

**Should have (competitive):**
- Side-by-side keyword and semantic rankings
- A debugger-style "what changed and why" narrative
- Scenario-specific misconception callouts
- Textual equivalents for every significant visual

**Defer (v2+):**
- Real embeddings, dedicated cosine-angle visualization, draggable vectors, challenge mode, scenario authoring/import, quizzes, presentation mode, and localization

### Architecture Approach

Store selected scenario, editable query/documents, and current step in a reducer. Keep built-in scenarios immutable. Compose pure domain functions into a `SimulationSnapshot`, then render focused step components from that snapshot. Treat teaching copy and step metadata as data, not scattered JSX.

**Major components:**
1. Scenario catalog - curated query, documents, vectors, and teaching intent
2. Pure search engine - tokenization, TF-IDF, Euclidean distance, cosine similarity, and stable ranking
3. Snapshot builder - canonical derived data for all views
4. Simulation controller - edits, reset, navigation, and Run All
5. Step visualizations - semantic HTML plus SVG where spatial display is needed

### Critical Pitfalls

1. **Correct math, wrong lesson** - require every step to explain action, evidence, and ranking consequence.
2. **Visualizations disagree** - calculate once in a canonical snapshot and round only for display.
3. **Toy vectors look real** - label them as curated teaching coordinates and define edited-text behavior.
4. **Editing/reset becomes stale** - store source inputs only and derive all calculations.
5. **Projector UI becomes inaccessible** - design for keyboard, zoom, non-color cues, text equivalents, and reduced motion from the start.

## Implications for Roadmap

### Phase 1: Vertical Classroom Shell
**Rationale:** Validate the static stack, scenario contract, layout, and one thin end-to-end guided slice before building every calculation.
**Delivers:** App shell, scenario selection, editable inputs, reset, step navigation, responsive three-panel behavior, and one representative step.
**Addresses:** Core classroom flow and deployment.
**Avoids:** A technically layered build that cannot be demonstrated until late.

### Phase 2: Search Engine Core
**Rationale:** Every later view depends on trustworthy, consistent data.
**Delivers:** Pure tokenization, TF, IDF, TF-IDF, stable ranking, Euclidean distance, cosine similarity, snapshot builder, and unit tests.
**Uses:** TypeScript and Vitest.
**Implements:** Functional core and canonical snapshot.

### Phase 3: Keyword Learning Journey
**Rationale:** Tokenization through keyword ranking is one coherent learner-facing slice.
**Delivers:** Tokens, matching, TF/IDF/TF-IDF tables, score bars, ranking cards, and explanations.
**Avoids:** Formula-first screens and duplicated calculations.

### Phase 4: Semantic Learning Journey
**Rationale:** Build the conceptual bridge only after keyword limitations are visible.
**Delivers:** Keyword limitation step, curated vectors, labeled SVG meaning map, Euclidean distance, cosine similarity, a metric toggle, and semantic ranking.
**Avoids:** Presenting toy vectors as generated embeddings.

### Phase 5: Comparison, Accessibility, and Classroom Readiness
**Rationale:** Final comparison and cross-cutting quality require both pipelines to exist.
**Delivers:** Side-by-side final rankings, rank-movement explanations, Run All behavior, keyboard/reduced-motion support, fixed desktop/projector polish, smoke tests, and static deployment verification.
**Avoids:** Color-only meaning, fragile demos, and deployment surprises.

### Phase Ordering Rationale

- Begin with a vertical shell so the project produces a demonstrable classroom interaction early.
- Establish the pure calculation contract before implementing multiple dependent visualizations.
- Teach keyword search as a complete sequence before introducing semantic search.
- Add final comparison only after both independent rankings are trustworthy.
- Treat accessibility as a continuous constraint, with final integrated verification in the readiness phase.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** UI design contract for the fixed desktop/projector panel behavior and teaching-step layout.
- **Phase 4:** Accessible SVG labeling and precise behavior when users edit text backed by curated vectors.
- **Phase 5:** Static-host path configuration and classroom display verification.

Phases with standard patterns:
- **Phase 2:** Pure deterministic math functions and fixture-based unit tests.
- **Phase 3:** Semantic tables, token chips, highlights, and score bars using established web patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Current versions and compatibility checked against official documentation |
| Features | HIGH | Detailed PRD plus established educational/accessibility principles |
| Architecture | HIGH | Small deterministic SPA strongly favors a functional core and local state |
| Pitfalls | HIGH | Directly derived from product interactions, calculation consistency, and WCAG guidance |

**Overall confidence:** HIGH

### Gaps to Address

- **Edited text with curated vectors:** Decide exact UX during semantic steps; recommended behavior is to retain scenario coordinates with an explicit "teaching vector" notice.
- **Run All pacing:** Decide whether it reveals instantly or with cancellable pacing; it must respect reduced-motion preferences.
- **Static host:** Select Vercel, Netlify, or GitHub Pages during setup because base-path configuration differs.
- **Classroom validation:** Automated checks cannot establish projector legibility or explanation quality; include manual UAT.

## Sources

### Primary (HIGH confidence)
- https://react.dev/versions - React stable version
- https://vite.dev/guide/ - Vite version, templates, Node compatibility, static builds
- https://tailwindcss.com/docs/installation/using-vite - Tailwind version and Vite plugin
- https://vitest.dev/guide/ - test runner compatibility
- https://playwright.dev/docs/intro - browser smoke testing
- https://developer.mozilla.org/en-US/docs/Web/SVG - SVG platform characteristics
- https://www.w3.org/WAI/WCAG22/quickref/ - accessibility success criteria
- https://www.w3.org/WAI/tutorials/images/complex/ - complex visual alternatives
- https://www.cast.org/what-we-do/universal-design-for-learning/ - educational representation principles
- `docs/PRD.md` - authoritative product intent and scope

### Secondary (MEDIUM confidence)
- https://testing-library.com/docs/react-testing-library/intro/ - user-centered component test practices

---
*Research completed: 2026-06-14*
*Ready for roadmap: yes*
