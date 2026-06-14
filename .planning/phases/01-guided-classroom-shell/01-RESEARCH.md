# Phase 1: Guided Classroom Shell - Research

**Researched:** 2026-06-14
**Domain:** Static React/TypeScript classroom shell for a one-page guided simulation [VERIFIED: 01-CONTEXT.md]
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

Copied verbatim from `.planning/phases/01-guided-classroom-shell/01-CONTEXT.md`. [VERIFIED: 01-CONTEXT.md]

### Locked Decisions
- **D-01:** Use a three-panel desktop/projector layout with the visualization panel receiving the most width.
- **D-02:** Keep inputs and documents on the left, step explanation and controls in the center, and visualization on the right.
- **D-03:** Use whole-page vertical scrolling rather than independently scrolling panels or shrinking all content to fit.
- **D-04:** Use a bright instructional-workspace tone: light surfaces, strong projector-safe contrast, restrained educational accent colors, and minimal decoration.
- **D-05:** Selecting another scenario switches immediately and discards edits from the previous scenario without confirmation.
- **D-06:** Scenario selection always returns the lesson to the setup/start position.
- **D-07:** Reset restores the selected scenario's complete immutable defaults, including query, documents, vectors, and starting step.
- **D-08:** Reset requires confirmation only when query or document content has been edited; an unchanged scenario resets immediately.
- **D-09:** `Start Search` moves directly from setup to the first registered lesson step.
- **D-10:** Show progress through a step number, current step title, and progress bar.
- **D-11:** Phase 1 navigation is sequential through Previous and Next; step indicators are not direct-navigation controls.
- **D-12:** Keep boundary controls visible but disabled with clear labels when no previous or next registered step exists.
- **D-13:** Present documents as compact numbered cards with stable identities and clear field boundaries.
- **D-14:** Document textareas auto-grow up to a sensible maximum before the page continues scrolling.
- **D-15:** Show one panel-level `Edited` status and Reset action rather than a changed badge on every field.
- **D-16:** Phase 1 exposes a fixed scenario-owned document collection and does not provide add/remove controls.
- **D-17:** Do not hard-code the document count into the scenario model, reducer, rendering, or reset logic. The internal design must allow later add/remove support without restructuring state.

### the agent's Discretion
- Exact panel width ratios, spacing scale, typography choices, accent palette, card styling, textarea growth limit, confirmation-dialog presentation, and progress-bar styling may be chosen during design and planning, provided they honor projector readability and the decisions above.

### Deferred Ideas (OUT OF SCOPE)
- Document add/remove controls remain outside Phase 1. The internal model should make that capability straightforward to add in a later phase.
</user_constraints>

<phase_requirements>
## Phase Requirements

Requirement descriptions are copied from `.planning/REQUIREMENTS.md`. [VERIFIED: .planning/REQUIREMENTS.md]

| ID | Description | Research Support |
|----|-------------|------------------|
| SCEN-01 | User can select from built-in teaching scenarios with predefined queries, documents, vectors, and learning goals. | Use a static scenario registry with immutable defaults, stable document IDs, and a reducer action that rebuilds the active session from the selected scenario. [VERIFIED: .planning/REQUIREMENTS.md] |
| SCEN-02 | User can edit the active query and see all keyword-derived calculations update. | Keep editable query text in reducer state now, but keep calculations derived outside reducer state so later keyword phases can recompute from one source of truth. [VERIFIED: .planning/REQUIREMENTS.md] |
| SCEN-03 | User can edit each document in the active scenario and see all keyword-derived calculations update. | Model documents as an array of `{ id, title?, text }` items with stable IDs and immutable update actions per document. [VERIFIED: .planning/REQUIREMENTS.md] |
| SCEN-04 | User can reset the selected scenario's query, documents, vectors, and current step to its defaults. | Build reset from the selected scenario snapshot, not from ad hoc field clears, and gate confirmation on derived dirty state only. [VERIFIED: .planning/REQUIREMENTS.md] |
| FLOW-01 | User can start the simulation from the query and document setup step. | Use a step registry with an explicit setup step and a `start` action that jumps to the first teachable step by stable step ID. [VERIFIED: .planning/REQUIREMENTS.md] |
| FLOW-02 | User can move to the next available simulation step. | Drive navigation from registry order plus reducer bounds checks so later phases can swap placeholder bodies without replacing navigation state. [VERIFIED: .planning/REQUIREMENTS.md] |
| FLOW-03 | User can return to the previous simulation step. | Keep previous/next behavior in the reducer and expose disabled boundary controls instead of hiding them. [VERIFIED: .planning/REQUIREMENTS.md] |
| FLOW-04 | User can see the current step and overall progress through the simulation. | Derive title, ordinal, and progress percentage from the active step and registry length; expose them as accessible text and progress UI. [VERIFIED: .planning/REQUIREMENTS.md] |
| QUAL-02 | User can read content with sufficient text and interface contrast on the supported desktop viewport. | Plan a projector-first token system with large type, high-contrast surfaces, and no state communicated by color alone. [VERIFIED: .planning/REQUIREMENTS.md] |
| QUAL-06 | User can load and run the application as a static browser site without a backend. | Use the official Vite React TypeScript SPA scaffold and keep all scenario data in local modules so `vite build` emits a static bundle. [VERIFIED: .planning/REQUIREMENTS.md] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

These directives come from `AGENTS.md` and the phase plan should not violate them. [VERIFIED: AGENTS.md]

- The application must stay browser-based and static; deployment must not require a backend. [VERIFIED: AGENTS.md]
- The MVP targets five to ten local documents and all calculations must complete instantly in the browser. [VERIFIED: AGENTS.md]
- English is the only MVP language; Indonesian content is deferred. [VERIFIED: AGENTS.md]
- The classroom experience is a fixed desktop/projector three-panel layout; tablet responsiveness is deferred to v2. [VERIFIED: AGENTS.md]
- State cannot be communicated by color alone, projector readability matters, and keyboard navigation for step controls is preferred. [VERIFIED: AGENTS.md]
- Core search logic must be pure and unit tested; practical UI smoke coverage is expected for the primary guided flow. [VERIFIED: AGENTS.md]
- Phase 1 should establish React, TypeScript, Vite, Tailwind CSS, and native SVG as the implementation baseline. [VERIFIED: AGENTS.md]
- Avoid Next.js, Canvas, D3, Redux-class global stores, real embeddings/NLP packages, and heavy animation libraries for the MVP. [VERIFIED: AGENTS.md]
- There is no existing application architecture to preserve; Phase 1 establishes the first code patterns. [VERIFIED: AGENTS.md]

## Summary

Phase 1 should be planned as a one-route Vite SPA that ships a static scenario registry, a reducer-managed classroom session, and a registered step sequence whose bodies are placeholders now and concrete keyword or semantic views later. [CITED: https://vite.dev/guide/] [CITED: https://react.dev/reference/react/useReducer] [VERIFIED: 01-CONTEXT.md]

The implementation boundary should be strict: store only editable source text, scenario identity, active step identity, and UI flow state in the reducer; keep progress, edited status, and future search calculations as derived selectors so later phases can add domain logic without rewriting Phase 1 state. [CITED: https://react.dev/reference/react/useReducer] [VERIFIED: 01-CONTEXT.md] [ASSUMED]

For planning, the highest leverage choice is to treat scenario defaults as immutable snapshots and rebuild the entire active session from the selected scenario on switch or reset. That directly satisfies D-05 through D-08, prevents mutation leaks across scenarios, and keeps future keyword or semantic phases layered on top of the same session contract. [VERIFIED: 01-CONTEXT.md] [CITED: https://react.dev/reference/react/useReducer] [ASSUMED]

**Primary recommendation:** Scaffold with `npm create vite@latest . -- --template react-ts`, add Tailwind through `@tailwindcss/vite`, keep scenario defaults in static content modules, and drive the shell with a pure reducer plus stable step IDs and derived selectors. [CITED: https://vite.dev/guide/] [CITED: https://tailwindcss.com/docs/installation/using-vite] [CITED: https://react.dev/reference/react/useReducer]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Scenario registry and immutable defaults | CDN / Static | Browser / Client | Scenario data should ship as static modules with the bundle and be copied into client session state on selection or reset. [VERIFIED: 01-CONTEXT.md] [CITED: https://vite.dev/guide/] |
| Editable query and document session state | Browser / Client | — | Edits are temporary, local, and reducer-driven; no backend or persistence exists in scope. [VERIFIED: AGENTS.md] [CITED: https://react.dev/reference/react/useReducer] |
| Guided lesson navigation and progress | Browser / Client | — | Previous/Next, step titles, disabled boundaries, and progress all depend on client interaction state and the local step registry. [VERIFIED: 01-CONTEXT.md] |
| Reset confirmation behavior | Browser / Client | — | Confirmation is only needed when the session is dirty, which is entirely local UI state; the dialog must follow accessible client-side modal semantics. [VERIFIED: 01-CONTEXT.md] [CITED: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/] |
| Static production bundle delivery | CDN / Static | Browser / Client | `vite build` emits static assets into `dist`, which a static host serves with no runtime backend. [CITED: https://vite.dev/config/build-options] [CITED: https://vite.dev/guide/] |

## Standard Stack

The stack below reflects official docs checked on 2026-06-14 plus current npm registry verification for installable packages. Packages flagged `SUS` by the legitimacy seam must stay in the plan behind `checkpoint:human-verify` before installation. [CITED: https://vite.dev/guide/] [CITED: https://tailwindcss.com/docs/installation/using-vite] [CITED: https://react.dev/versions]

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react` | `19.2` docs line [CITED: https://react.dev/versions] [WARNING: flagged as suspicious — verify before using.] | Component model for the one-page classroom shell. | Official docs identify React 19.2 as the latest documented major/minor line and Phase 1 needs state-driven UI composition, not routing or SSR. [CITED: https://react.dev/versions] [VERIFIED: AGENTS.md] |
| `react-dom` | `19.2` docs line [CITED: https://react.dev/reference/react/useReducer] [WARNING: flagged as suspicious — verify before using.] | Browser renderer for the SPA. | The Vite React TypeScript template and React Testing Library both assume a standard React DOM client application. [CITED: https://vite.dev/guide/] [CITED: https://testing-library.com/docs/react-testing-library/intro/] |
| `typescript` | `6.0.3` [VERIFIED: npm registry] | Typed scenario, step, reducer, and selector contracts. | TypeScript gives the planner explicit compile-time contracts for scenario defaults, action unions, and later domain snapshots. [CITED: https://www.typescriptlang.org/docs/] [ASSUMED] |
| `vite` | `8.0.x` docs line [CITED: https://vite.dev/guide/] [WARNING: flagged as suspicious — verify before using.] | Official React TS scaffold, dev server, and static build pipeline. | Vite is the official lightweight path to a static React app and documents the required Node versions and `react-ts` template. [CITED: https://vite.dev/guide/] |
| `@vitejs/plugin-react` | `6.0.2` [VERIFIED: npm registry] | React integration for the Vite config. | The official `template-react-ts` uses this plugin directly. [CITED: https://vite.dev/guide/] |
| `tailwindcss` | `4.3.x` docs line [CITED: https://tailwindcss.com/docs/installation/using-vite] [WARNING: flagged as suspicious — verify before using.] | Projector-friendly layout, spacing, typography, and tokenized visual system. | Tailwind 4 is the current official setup path and fits the fixed-layout, token-heavy shell work in this phase. [CITED: https://tailwindcss.com/docs/installation/using-vite] [VERIFIED: AGENTS.md] |
| `@tailwindcss/vite` | `4.3.x` docs line [CITED: https://tailwindcss.com/docs/installation/using-vite] [WARNING: flagged as suspicious — verify before using.] | Official Tailwind Vite plugin. | Tailwind’s Vite installation guide now uses the plugin instead of the older PostCSS-first workflow. [CITED: https://tailwindcss.com/docs/installation/using-vite] |
| Native HTML + SVG | Browser standard [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] | Form controls, progress UI, and future visual panels. | The dataset is tiny, projector clarity matters, and the project explicitly rejects Canvas/D3 for the MVP. [VERIFIED: AGENTS.md] [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `vitest` | `4.x` docs line [CITED: https://vitest.dev/guide/] [WARNING: flagged as suspicious — verify before using.] | Unit and component test runner for the Phase 1 shell. | Use immediately for reducer, selector, and component interaction tests in this phase. [CITED: https://vitest.dev/guide/] |
| `@testing-library/react` | `16.3.2` [VERIFIED: npm registry] | DOM-focused React component tests. | Use for scenario selection, query edit, document edit, start, previous/next, and reset tests. [CITED: https://testing-library.com/docs/react-testing-library/intro/] |
| `@testing-library/user-event` | `14.6.1` [VERIFIED: npm registry] | Realistic user interaction simulation. | Use when tests need typing, clicking, and focus flows that mirror browser behavior. [CITED: https://testing-library.com/docs/react-testing-library/intro/] |
| `jsdom` | `29.1.1` [VERIFIED: npm registry] | Browser-like environment for component tests under Vitest. | Use for DOM tests in the absence of a real browser runner. [CITED: https://vitest.dev/guide/] |
| `@playwright/test` | `1.60.0` [VERIFIED: npm registry] | Deferred browser smoke harness. | Reserve for later phases or CI smoke verification; it is not required to satisfy Phase 1 requirements if build and component coverage are in place. [CITED: https://playwright.dev/docs/intro] [VERIFIED: .planning/REQUIREMENTS.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `vite` | Next.js | Not justified because Phase 1 has no routing, SSR, or backend requirements. [VERIFIED: AGENTS.md] |
| Reducer-driven local state | Zustand/Redux | Adds a store abstraction before the app has enough cross-route or persistence complexity to need one. [VERIFIED: AGENTS.md] [ASSUMED] |
| Native SVG / HTML | D3 or Canvas | The current dataset size and projector accessibility constraints favor semantic DOM plus SVG labels over a heavier chart layer. [VERIFIED: AGENTS.md] [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] |

**Installation:** [CITED: https://vite.dev/guide/] [CITED: https://tailwindcss.com/docs/installation/using-vite]

```bash
npm create vite@latest . -- --template react-ts
npm install tailwindcss @tailwindcss/vite
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

`@vitejs/plugin-react`, `react`, `react-dom`, and `typescript` are supplied by the official `react-ts` scaffold. [CITED: https://vite.dev/guide/]

**Version verification:** [VERIFIED: npm registry]

```bash
npm view react version
npm view vite version
npm view tailwindcss version
npm view vitest version
npm view @testing-library/react version
npm view @testing-library/user-event version
npm view jsdom version
```

## Package Legitimacy Audit

> Required because Phase 1 installs external npm packages. Registry data and verdicts below were checked on 2026-06-14. [VERIFIED: npm registry]

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `react@19.2.7` [CITED: https://react.dev/versions] [WARNING: flagged as suspicious — verify before using.] | npm | 13 days | 142M/wk | `facebook/react` | SUS | Flagged — planner must add `checkpoint:human-verify` before scaffold verification. |
| `react-dom@19.2.7` [CITED: https://react.dev/reference/react/useReducer] [WARNING: flagged as suspicious — verify before using.] | npm | 13 days | 132M/wk | `facebook/react` | SUS | Flagged — planner must add `checkpoint:human-verify` before scaffold verification. |
| `typescript@6.0.3` [VERIFIED: npm registry] | npm | 58 days | 217M/wk | `microsoft/TypeScript` | OK | Approved |
| `vite@8.0.16` [CITED: https://vite.dev/guide/] [WARNING: flagged as suspicious — verify before using.] | npm | 13 days | 138M/wk | `vitejs/vite` | SUS | Flagged — planner must add `checkpoint:human-verify` before install. |
| `@vitejs/plugin-react@6.0.2` [VERIFIED: npm registry] | npm | 30 days | 63M/wk | `vitejs/vite-plugin-react` | OK | Approved |
| `tailwindcss@4.3.1` [CITED: https://tailwindcss.com/docs/installation/using-vite] [WARNING: flagged as suspicious — verify before using.] | npm | 2 days | 116M/wk | `tailwindlabs/tailwindcss` | SUS | Flagged — planner must add `checkpoint:human-verify` before install. |
| `@tailwindcss/vite@4.3.1` [CITED: https://tailwindcss.com/docs/installation/using-vite] [WARNING: flagged as suspicious — verify before using.] | npm | 2 days | 36M/wk | `tailwindlabs/tailwindcss` | SUS | Flagged — planner must add `checkpoint:human-verify` before install. |
| `vitest@4.1.8` [CITED: https://vitest.dev/guide/] [WARNING: flagged as suspicious — verify before using.] | npm | 13 days | 68M/wk | `vitest-dev/vitest` | SUS | Flagged — planner must add `checkpoint:human-verify` before install. |
| `@testing-library/react@16.3.2` [VERIFIED: npm registry] | npm | 146 days | 44M/wk | `testing-library/react-testing-library` | OK | Approved |
| `@testing-library/user-event@14.6.1` [VERIFIED: npm registry] | npm | 509 days | 37M/wk | `testing-library/user-event` | OK | Approved |
| `jsdom@29.1.1` [VERIFIED: npm registry] | npm | 45 days | 77M/wk | `jsdom/jsdom` | OK | Approved |

**Packages removed due to `SLOP` verdict:** none. [VERIFIED: npm registry]
**Packages flagged as suspicious `SUS`:** `react`, `react-dom`, `vite`, `tailwindcss`, `@tailwindcss/vite`, `vitest`. The seam flagged each for recency only, so keep them but gate installation behind `checkpoint:human-verify`. [VERIFIED: npm registry]

No package in the Phase 1 set exposed a `postinstall` script via `npm view <pkg> scripts.postinstall`. [VERIFIED: npm registry]

## Architecture Patterns

### System Architecture Diagram

```text
Static scenario modules
  -> buildSessionFromScenario(selectedScenarioId)
  -> simulationReducer(sessionState, action)
  -> derived selectors
      -> left panel: scenario picker + query/doc editors + edited/reset status
      -> center panel: step title + explanation + start/previous/next + progress
      -> right panel: placeholder step renderer keyed by stable step id

User input
  -> dispatch(action)
  -> reducer returns new immutable session state
  -> selectors recompute current step/progress/dirty flags
  -> UI rerenders

vite build
  -> dist/
  -> static host/browser
``` 

The diagram above keeps all runtime behavior inside the browser/client tier and all canonical defaults in shipped static modules. [CITED: https://vite.dev/config/build-options] [VERIFIED: 01-CONTEXT.md]

### Recommended Project Structure

```text
src/
├── app/                     # App bootstrap, top-level layout, providers
├── content/
│   ├── scenarios/           # Immutable built-in scenario snapshots
│   └── steps/               # Step registry metadata and placeholder copy
├── domain/
│   ├── model/               # Scenario, document, step, action, and session types
│   ├── session/             # Reducer, session factory, selectors
│   └── search/              # Reserved for later keyword/semantic pure logic
├── features/
│   ├── input-panel/         # Scenario picker, query editor, document cards
│   ├── lesson-panel/        # Step explanation, progress, navigation
│   └── visualization-panel/ # Placeholder-backed current-step renderer
├── styles/                  # Tailwind entry CSS and design tokens
└── test/                    # Vitest setup utilities and shared render helpers
```

Reserve `tests/e2e/` for later Playwright smoke tests, but do not block Phase 1 on browser automation setup. [CITED: https://playwright.dev/docs/intro] [ASSUMED]

### Pattern 1: Immutable Scenario Snapshot + Session Projection

**What:** Keep built-in scenarios as readonly source-of-truth modules and derive the active editable session with a single factory such as `buildSessionFromScenario(scenario)`. [VERIFIED: 01-CONTEXT.md] [ASSUMED]

**When to use:** Use for initial load, scenario switching, and reset so all three flows rebuild from exactly the same source snapshot. [VERIFIED: 01-CONTEXT.md]

**Example:**

```ts
// Source: https://react.dev/reference/react/useReducer
export type SimulationSession = {
  scenarioId: string
  query: string
  documents: SearchDocument[]
  vectors: Record<string, Vector2D>
  activeStepId: StepId
}

export function buildSessionFromScenario(scenario: Scenario): SimulationSession {
  return {
    scenarioId: scenario.id,
    query: scenario.defaultQuery,
    documents: scenario.documents.map((doc) => ({ ...doc })),
    vectors: { ...scenario.vectors },
    activeStepId: 'setup',
  }
}
```

### Pattern 2: Discriminated Reducer Actions for Coordinated UI State

**What:** Use a pure reducer with typed actions such as `scenarioSelected`, `queryChanged`, `documentChanged`, `started`, `nextStep`, `previousStep`, and `resetConfirmed`. [CITED: https://react.dev/reference/react/useReducer] [ASSUMED]

**When to use:** Use when one interaction changes more than one field, for example scenario switching also resetting step position and clearing dirty state. [VERIFIED: 01-CONTEXT.md]

**Example:**

```ts
// Source: https://react.dev/reference/react/useReducer
type Action =
  | { type: 'scenarioSelected'; scenarioId: string }
  | { type: 'queryChanged'; value: string }
  | { type: 'documentChanged'; documentId: string; value: string }
  | { type: 'started' }
  | { type: 'nextStep' }
  | { type: 'previousStep' }
  | { type: 'resetConfirmed' }
```

### Pattern 3: Step Registry as Data, Not Routing

**What:** Define a registry array with stable IDs, titles, summary copy, and a renderer reference for each phase-visible step. [VERIFIED: 01-CONTEXT.md] [ASSUMED]

**When to use:** Use when the UI must show placeholder content now and real instructional views later without changing navigation state shape. [VERIFIED: 01-CONTEXT.md]

**Example:**

```ts
export const lessonSteps: LessonStep[] = [
  { id: 'setup', title: 'Setup', kind: 'setup' },
  { id: 'tokenization', title: 'Tokenization', kind: 'placeholder' },
  { id: 'matching', title: 'Word Matching', kind: 'placeholder' },
  { id: 'keyword-ranking', title: 'Keyword Ranking', kind: 'placeholder' },
  { id: 'meaning-vectors', title: 'Meaning Vectors', kind: 'placeholder' },
  { id: 'final-comparison', title: 'Final Comparison', kind: 'placeholder' },
]
```

### Pattern 4: Derived Selectors for Dirty State and Progress

**What:** Compute `isEdited`, `currentStepIndex`, `canGoNext`, `canGoPrevious`, and progress percentage from session state plus the registry instead of storing them redundantly. [CITED: https://react.dev/reference/react/useReducer] [ASSUMED]

**When to use:** Use whenever a value can be recomputed from canonical state and would otherwise drift during scenario switch or reset. [ASSUMED]

### Anti-Patterns to Avoid

- **Mutating scenario defaults in place:** This breaks reset fidelity and leaks edits across scenario switches. Use cloned session state rebuilt from immutable defaults instead. [VERIFIED: 01-CONTEXT.md] [CITED: https://react.dev/reference/react/useReducer]
- **Hard-coding the document count:** D-17 explicitly forbids fixed-length reducer or render assumptions. Always iterate over document arrays by stable ID. [VERIFIED: 01-CONTEXT.md]
- **Keying navigation by raw array index only:** Index-only logic makes later step insertions brittle; keep stable step IDs and derive the current index from the registry. [VERIFIED: 01-CONTEXT.md] [ASSUMED]
- **Using `dangerouslySetInnerHTML` for edited text:** React warns that untrusted HTML introduces XSS risk. Render user-edited content as plain text. [CITED: https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html]
- **Shipping an inaccessible confirmation modal:** If reset confirmation is modal, it must behave like a modal for all users and expose alert dialog semantics. [CITED: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Frontend scaffolding and static build | A custom webpack/Rollup app shell | Vite React TS scaffold | The official scaffold already matches the static SPA requirement and current Node support expectations. [CITED: https://vite.dev/guide/] |
| Tailwind integration | Manual PostCSS-era config copied from old guides | `@tailwindcss/vite` + `@import "tailwindcss"` | Tailwind 4’s official Vite path is smaller and current. [CITED: https://tailwindcss.com/docs/installation/using-vite] |
| Component interaction testing | `querySelector`-style DOM probing | React Testing Library + user-event | Testing Library is explicitly designed to avoid implementation-detail coupling. [CITED: https://testing-library.com/docs/react-testing-library/intro/] |
| End-to-end smoke harness | Ad hoc browser scripts | Playwright when smoke tests enter scope | Playwright already provides a test runner, fixtures, reports, and `webServer` support. [CITED: https://playwright.dev/docs/intro] |
| Modal confirmation semantics | A bare absolutely-positioned div | Native `dialog` or an APG-compliant alert dialog wrapper | Focus handling and modal semantics are easy to get wrong and have accessibility consequences. [CITED: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/] |

**Key insight:** The shell is simple in scope but full of state-coordination edges, so hand-rolled scaffolding or accessibility primitives create more long-term risk than they save. [ASSUMED]

## Common Pitfalls

### Pitfall 1: Mutable Defaults Break Reset

**What goes wrong:** Reset appears to work for some fields but previously edited text leaks back in after switching scenarios or resetting twice. [ASSUMED]

**Why it happens:** The reducer keeps references to the original scenario objects or shallow-copies only part of the session. [CITED: https://react.dev/reference/react/useReducer] [ASSUMED]

**How to avoid:** Clone scenario-owned arrays and maps when building the session, and rebuild from the scenario snapshot on every switch/reset path. [VERIFIED: 01-CONTEXT.md] [ASSUMED]

**Warning signs:** Reset tests pass only once, or scenario A’s document edits appear after moving to scenario B. [ASSUMED]

### Pitfall 2: Step State Coupled to Placeholder Order

**What goes wrong:** Later phases cannot insert real steps without rewriting navigation behavior or invalidating progress math. [ASSUMED]

**Why it happens:** The implementation stores only a numeric step index and lets render order become the step identity. [ASSUMED]

**How to avoid:** Make stable `StepId` values canonical and derive the current index from the registry order. [VERIFIED: 01-CONTEXT.md] [ASSUMED]

**Warning signs:** Adding one new step changes multiple reducer cases, tests, and reset assumptions. [ASSUMED]

### Pitfall 3: Dirty State as Scattered Booleans

**What goes wrong:** Reset confirmation appears when it should not, or fails to appear after a real edit. [VERIFIED: 01-CONTEXT.md] [ASSUMED]

**Why it happens:** The UI stores `isEdited` flags per field instead of deriving dirty state by comparing the active session to the selected scenario defaults. [ASSUMED]

**How to avoid:** Derive a single panel-level dirty signal from query text and document text compared against the selected scenario snapshot. [VERIFIED: 01-CONTEXT.md] [ASSUMED]

**Warning signs:** A scenario switch requires manually clearing multiple booleans, or reset confirmation state drifts out of sync with visible content. [ASSUMED]

### Pitfall 4: Projector-Unfriendly Density

**What goes wrong:** The layout technically works on desktop but instructional copy, textareas, or progress labels become hard to read from a projector. [VERIFIED: AGENTS.md] [ASSUMED]

**Why it happens:** Teams optimize for laptop viewport density instead of classroom readability and high-contrast surfaces. [VERIFIED: AGENTS.md]

**How to avoid:** Plan type scale, line length, card spacing, and neutral background tokens early, then reserve a manual projector-readability validation task in the phase plan. [VERIFIED: AGENTS.md] [ASSUMED]

**Warning signs:** Thin gray text, narrow textareas, or multiple simultaneous scroll regions. [VERIFIED: 01-CONTEXT.md] [ASSUMED]

## Code Examples

Verified patterns from official sources:

### Combined Vite + React + Tailwind config

```ts
// Source: https://vite.dev/guide/
// Source: https://tailwindcss.com/docs/installation/using-vite
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Vitest DOM test baseline

```ts
// Source: https://vitest.dev/guide/
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

### Testing Library interaction style

```tsx
// Source: https://testing-library.com/docs/react-testing-library/intro/
render(<GuidedShell />)
await user.click(screen.getByRole('button', { name: /start search/i }))
expect(screen.getByRole('heading', { name: /tokenization/i })).toBeInTheDocument()
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Create React App baseline | `npm create vite@latest` with a framework template | Current Vite 8 docs. [CITED: https://vite.dev/guide/] | Faster scaffold and a clearer static-build path for this phase. [CITED: https://vite.dev/guide/] |
| Tailwind `@tailwind base/components/utilities` directives | Tailwind 4 `@import "tailwindcss"` plus `@tailwindcss/vite` | Tailwind 4 docs. [CITED: https://tailwindcss.com/docs/installation/using-vite] | Less configuration and a cleaner CSS entrypoint. [CITED: https://tailwindcss.com/docs/installation/using-vite] |
| Implementation-detail-heavy React tests | User-facing role/text queries with Testing Library and user-event | Current Testing Library guidance. [CITED: https://testing-library.com/docs/react-testing-library/intro/] | More stable tests as the shell layout evolves. [CITED: https://testing-library.com/docs/react-testing-library/intro/] |

**Deprecated/outdated:**

- Copying older Tailwind v3 setup snippets into a new Vite app is outdated for this phase; the current official install path uses the Vite plugin and CSS `@import`. [CITED: https://tailwindcss.com/docs/installation/using-vite]
- Planning Phase 1 around Create React App is outdated relative to the current official Vite React scaffold and static build path. [CITED: https://vite.dev/guide/]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The proposed `src/content`, `src/domain`, and `src/features` folder split is the cleanest initial layout for this repo. | Architecture Patterns | Low; file moves are easy early but could create churn in later plans. |
| A2 | Dirty state should be derived by comparing active query/doc text to the selected scenario snapshot rather than tracked as stored flags. | Architecture Patterns | Medium; if the planner chooses stored dirty flags instead, reset logic and tests need a different shape. |
| A3 | The first placeholder registry should already reserve future IDs like `tokenization`, `matching`, `keyword-ranking`, `meaning-vectors`, and `final-comparison`. | Architecture Patterns | Medium; later phases may rename or regroup steps, affecting reducer and validation naming. |
| A4 | Phase 1 can defer Playwright installation while still producing a strong Validation Architecture, because QUAL-05 is not in this phase’s requirement set. | Validation Architecture | Low; if the team wants browser smoke infrastructure early, Plan 01-01 should add it. |

## Open Questions

1. **What exact placeholder step list should Phase 1 lock?**
   - What we know: The PRD’s canonical flow spans setup, tokenization, matching, TF, IDF, TF-IDF, keyword ranking, keyword limitation, meaning vectors, distance, and final comparison, but Phase 1 only needs a registered placeholder-backed shell. [VERIFIED: docs/PRD.md]
   - What's unclear: Whether Phase 1 should register every eventual step now or a smaller stable subset that later phases can expand. [VERIFIED: 01-CONTEXT.md] [ASSUMED]
   - Recommendation: Plan a short decision checkpoint at the start of 01-03 and lock step IDs before component work begins. [ASSUMED]

2. **Should reset confirmation use native `<dialog>` or a custom APG-style modal wrapper?**
   - What we know: Any modal confirmation must behave like a real modal and expose alert dialog semantics. [CITED: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/]
   - What's unclear: Whether the supported classroom browser target is narrow enough to standardize on native `<dialog>` without compatibility follow-up. [ASSUMED]
   - Recommendation: Plan a spike-sized check during implementation; if native behavior is clean in the supported environment, use it, otherwise ship a small APG-compliant wrapper. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite 8, Vitest 4, static build, and future Playwright | ✓ | `24.14.1` | — |
| npm | `create-vite`, package installation, test/build scripts | ✓ | `11.17.0` | — |
| Existing app/test scaffold | Phase 1 implementation and validation | ✗ | — | Create from scratch in Plan 01-01 |

**Missing dependencies with no fallback:**

- none. The required runtime baseline is present. [VERIFIED: local environment]

**Missing dependencies with fallback:**

- Existing application source and test harness are missing, but that is expected because Phase 1 is the bootstrap slice. [VERIFIED: 01-CONTEXT.md]

## Validation Architecture

`workflow.nyquist_validation` is enabled in `.planning/config.json`, so this section is required. [VERIFIED: .planning/config.json]

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `4.x` plus React Testing Library for component interaction tests. [CITED: https://vitest.dev/guide/] [CITED: https://testing-library.com/docs/react-testing-library/intro/] |
| Config file | `none — create in Wave 0` |
| Quick run command | `npm run test -- --run` |
| Full suite command | `npm run test -- --run && npm run build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCEN-01 | Selecting a built-in scenario swaps the active query/documents and returns to setup. | component | `npm run test -- --run src/features/input-panel/ScenarioSelector.test.tsx -t "switches scenario and returns to setup"` | ❌ Wave 0 |
| SCEN-02 | Editing the query updates the controlled field and marks the session edited. | component | `npm run test -- --run src/features/input-panel/QueryEditor.test.tsx -t "edits query"` | ❌ Wave 0 |
| SCEN-03 | Editing one document updates only that document and preserves stable IDs. | component | `npm run test -- --run src/features/input-panel/DocumentCards.test.tsx -t "edits one document"` | ❌ Wave 0 |
| SCEN-04 | Reset restores the selected scenario defaults and setup step. | reducer + component | `npm run test -- --run src/domain/session/sessionReducer.test.ts src/features/lesson-panel/ResetFlow.test.tsx -t "restores defaults"` | ❌ Wave 0 |
| FLOW-01 | Start Search moves from setup to the first registered lesson step. | component | `npm run test -- --run src/features/lesson-panel/Navigation.test.tsx -t "starts at first registered step"` | ❌ Wave 0 |
| FLOW-02 | Next moves to the next registered step and disables at the end. | reducer + component | `npm run test -- --run src/features/lesson-panel/Navigation.test.tsx -t "moves next and disables at boundary"` | ❌ Wave 0 |
| FLOW-03 | Previous moves backward and disables at the beginning. | reducer + component | `npm run test -- --run src/features/lesson-panel/Navigation.test.tsx -t "moves previous and disables at boundary"` | ❌ Wave 0 |
| FLOW-04 | Current step title, ordinal, and progress UI stay in sync with the registry. | component | `npm run test -- --run src/features/lesson-panel/Progress.test.tsx -t "shows title number and progress"` | ❌ Wave 0 |
| QUAL-02 | The fixed desktop/projector layout keeps readable contrast and does not rely on color alone. | manual + visual audit | `— manual review required; optionally add axe checks for labels/roles later` | ❌ Wave 0 |
| QUAL-06 | The app builds and serves as a static site with no backend. | build smoke | `npm run build` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run test -- --run`
- **Per wave merge:** `npm run test -- --run && npm run build`
- **Phase gate:** Full suite green plus one manual projector-readability pass before `$gsd-verify-work`

### Wave 0 Gaps

- [ ] `package.json` scripts for `dev`, `build`, and `test` — scaffolded by Vite or added immediately after scaffold.
- [ ] `vite.config.ts` — include `react()` and `tailwindcss()` plugins.
- [ ] `src/test/setup.ts` — shared test setup for DOM matchers/utilities.
- [ ] `src/domain/session/sessionReducer.test.ts` — covers SCEN-01, SCEN-04, FLOW-02, FLOW-03.
- [ ] `src/features/input-panel/*.test.tsx` — covers SCEN-01, SCEN-02, SCEN-03.
- [ ] `src/features/lesson-panel/*.test.tsx` — covers FLOW-01, FLOW-02, FLOW-03, FLOW-04, reset confirmation.
- [ ] Manual validation checklist entry for QUAL-02 — contrast, focus order, disabled-state clarity, and projector readability.

## Security Domain

`security_enforcement` is enabled in `.planning/config.json`, so this section is required. [VERIFIED: .planning/config.json]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No authentication exists in Phase 1 scope. [VERIFIED: AGENTS.md] |
| V3 Session Management | no | No server session, cookie, or account state exists in Phase 1 scope. [VERIFIED: AGENTS.md] |
| V4 Access Control | no | No multi-user roles or protected resources exist in Phase 1 scope. [VERIFIED: AGENTS.md] |
| V5 Input Validation | yes | Use controlled form inputs, typed reducer actions, and plain-text rendering of edited content; do not inject user text as HTML. [CITED: https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html] [CITED: https://react.dev/reference/react/useReducer] |
| V6 Cryptography | no | Phase 1 has no secrets, hashing, or encryption requirements. [VERIFIED: AGENTS.md] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| User-edited text rendered as raw HTML | Tampering / Elevation | Never use `dangerouslySetInnerHTML` for query or document text; render as normal text nodes. [CITED: https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html] |
| Supply-chain risk from freshly published frontend packages | Tampering | Honor the package legitimacy audit and add `checkpoint:human-verify` before installing `SUS` packages. [VERIFIED: npm registry] |
| Modal confirmation that traps or loses focus | Denial of Service | Use a real modal implementation with APG-compliant alert dialog semantics and keyboard escape/close behavior. [CITED: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/] |

## Sources

### Primary (HIGH confidence)

- None. The confidence seam classified verified Context7 and official-web cross-checks as `MEDIUM` for this run. [VERIFIED: local environment]

### Secondary (MEDIUM confidence)

- `/vitejs/vite` via Context7 plus official docs `https://vite.dev/guide/` and `https://vite.dev/config/build-options` — scaffold commands, Node support, React template usage, and static output defaults.
- `/tailwindlabs/tailwindcss.com` via Context7 plus official docs `https://tailwindcss.com/docs/installation/using-vite` — current Tailwind 4 Vite setup and CSS import flow.
- `/reactjs/react.dev` via Context7 plus official docs `https://react.dev/versions`, `https://react.dev/reference/react/useReducer`, and `https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html` — React version line, reducer purity guidance, and XSS warning.
- `/vitest-dev/vitest` via Context7 plus official docs `https://vitest.dev/guide/` — jsdom test setup and Vite-native test runner guidance.
- `/testing-library/testing-library-docs` via Context7 plus official docs `https://testing-library.com/docs/react-testing-library/intro/` — user-focused React component testing guidance.
- `/microsoft/playwright.dev` via Context7 plus official docs `https://playwright.dev/docs/intro` — deferred smoke-test strategy, web server config, and Node support.
- `https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/` and `https://www.w3.org/WAI/ARIA/apg/practices/range-related-properties/` — reset confirmation and progress accessibility patterns.
- `https://www.typescriptlang.org/docs/` — TypeScript baseline documentation and current 6.0 release line.

### Tertiary (LOW confidence)

- Folder structure, step-registry shape, and derived dirty-state recommendations are repo-specific architectural judgments rather than official framework requirements. [ASSUMED]

## Metadata

**Confidence breakdown:**

- Standard stack: MEDIUM - official docs and registry checks are current, but several core packages are flagged `SUS` solely due to recent publication and require human verification before install. [VERIFIED: npm registry]
- Architecture: MEDIUM - reducer purity and accessibility requirements are documented, but the exact folder split and selector strategy are project-specific recommendations. [CITED: https://react.dev/reference/react/useReducer] [ASSUMED]
- Pitfalls: MEDIUM - the reset/mutation and modal issues are strongly grounded, while some warning signs are derived from implementation experience. [CITED: https://react.dev/reference/react/useReducer] [CITED: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/] [ASSUMED]

**Research date:** 2026-06-14
**Valid until:** 2026-06-21
