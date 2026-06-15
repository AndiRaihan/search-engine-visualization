# Phase 2: Keyword Search Journey - Research

**Researched:** 2026-06-15
**Domain:** Browser-only keyword-search teaching pipeline from tokenization through deterministic TF-IDF ranking. [VERIFIED: planning docs]
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

This section is copied from `02-CONTEXT.md` and carried forward as locked input for planning. [VERIFIED: planning docs]

### Locked Decisions
### TF-IDF Math Formulations
- **D-01:** Term Frequency (TF) formula is Relative Frequency: $\text{TF} = \frac{\text{count}}{\text{total words in document}}$.
- **D-02:** Inverse Document Frequency (IDF) uses the natural logarithm: $\text{IDF} = \ln\left(\frac{N}{\text{df}}\right)$.
- **D-03:** Use unsmoothed IDF. For empty queries or when a word does not exist in any document ($df = 0$), handle division by zero by setting the IDF score directly to $0$.

### Tokenization & Punctuation Rules
- **D-04:** Tokenize words by lowercasing and splitting punctuation (e.g. `"iPhone's"` splits into `["iphone", "s"]`).
- **D-05:** Handle empty inputs (e.g., query deleted or contains only punctuation) gracefully by returning an empty token list, setting all document scores to $0$, and displaying a placeholder indicator (e.g., `"No tokens found"`).

### Visual Cues for Common/Rare Terms
- **D-06:** Visually distinguish term strength (IDF weight) using bold weights and descriptive badges (e.g., `"★ Rare (Strong)"` and `"⬇ Common (Weak)"`) rather than color alone.
- **D-07:** Match highlights in the Word Matching step will use solid-border pills, checkmark icons, and textual summary cards listing matched and missing terms.

### Tie-Breaker and Ranking Details
- **D-08:** Resolve score ties in the final keyword ranking deterministically using the original document index order (e.g., Doc 1 ranks before Doc 2).
- **D-09:** Ranked result explanations will show detailed math breakdown of individual term TF-IDF contributions (e.g. `"Score: 0.450. Term 'iphone' contributed 0.450, 'the' contributed 0.000."`).

### the agent's Discretion
- Spacing, card styling details, exact layout of the calculation tables, pill styles, and visual decoration of the badges are left to the agent's discretion, provided they remain highly readable on classroom projectors.

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| KEYW-01 | User can see the query and documents tokenized into lowercase words with basic punctuation removed. | Use a pure tokenization helper and a token-pill visualization with an empty-state branch. [VERIFIED: planning docs][VERIFIED: codebase grep] |
| KEYW-02 | User can see which query tokens match each document and which query tokens are missing. | Build per-document match view models from the same token snapshot used by later steps. [VERIFIED: planning docs][VERIFIED: codebase grep] |
| KEYW-03 | User can inspect each query term's count, document word count, and term-frequency value rounded to three decimal places. | Keep TF math pure, preserve raw values internally, and round only for display tables. [VERIFIED: planning docs] |
| KEYW-04 | User can inspect each query term's document frequency and inverse-document-frequency value. | Implement unsmoothed `ln(N/df)` IDF with explicit `df = 0 -> 0` handling. [VERIFIED: planning docs] |
| KEYW-05 | User can see common query terms visually weakened and rare query terms visually strengthened without relying on color alone. | Reuse text-plus-badge semantics from the approved UI contract; do not rely on accent fill alone. [VERIFIED: planning docs] |
| KEYW-06 | User can inspect each query-term/document TF-IDF value and the resulting document keyword score. | Generate a document-by-term TF-IDF matrix and a per-document summed score from the same snapshot. [VERIFIED: planning docs][VERIFIED: codebase grep] |
| KEYW-07 | User can see keyword results ranked by descending full-precision TF-IDF score with deterministic tie handling. | Sort by raw score first and original document index second; display rounded score after ranking is finalized. [VERIFIED: planning docs] |
| KEYW-08 | User can read a result explanation generated from visible TF-IDF contributions, including after query or document edits. | Build explanations from visible term contributions so edited inputs update both score and explanation together. [VERIFIED: planning docs][VERIFIED: codebase grep] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- Keep the application browser-only and statically deployable; Phase 2 must not introduce a backend or any server dependency. [VERIFIED: planning docs]
- Keep all calculations instant in-browser for five to ten local documents; do not introduce heavyweight search infrastructure or network-bound processing. [VERIFIED: planning docs]
- Keep MVP instructional copy in English. [VERIFIED: planning docs]
- Preserve the simplified search model: relative TF, selectable Euclidean/cosine in later phases, and manually assigned 2D vectors; Phase 2 only implements the keyword side of that teaching model. [VERIFIED: planning docs]
- Preserve the fixed desktop/projector three-panel layout; tablet responsiveness remains deferred to v2. [VERIFIED: planning docs]
- Do not communicate state by color alone; keyboard-friendly controls and projector-legible text remain mandatory. [VERIFIED: planning docs]
- Keep core search logic pure and unit tested; UI automation for the full browser flow remains a later-phase concern. [VERIFIED: planning docs]
- Stay inside Phase 2 scope: no persistence, authentication, production NLP, production search infrastructure, or semantic-ranking implementation in this phase. [VERIFIED: planning docs]

## Summary

Phase 1 already delivered the session reducer, editable scenarios, lesson-step navigation, accessibility live-region pattern, and a placeholder visualization surface. Phase 2 is therefore an extension phase, not a restructuring phase: the right panel needs real keyword-step data and rendering, while the existing `useReducer` session model remains the correct orchestration layer. [VERIFIED: codebase grep]

The cleanest plan is to compute one pure keyword snapshot from `session.query` and `session.documents`, then fan that snapshot out into step-specific UI models for tokenization, matching, TF, IDF, TF-IDF, and ranking. This keeps every stage consistent after edits and avoids duplicating math in React components. [VERIFIED: codebase grep][VERIFIED: planning docs]

The repo already has a working test baseline: `npm test -- --run` passed 20 tests across 5 files on 2026-06-15, using Vitest with `jsdom` and React Testing Library. Phase 2 should expand that baseline instead of adding a new test stack. [VERIFIED: local test run][VERIFIED: codebase grep]

**Primary recommendation:** Extend the existing domain/reducer module with pure keyword helpers and step-specific derived selectors, then render those selectors through dedicated visualization subcomponents without adding packages or a new state layer. [VERIFIED: codebase grep][VERIFIED: planning docs]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Query/document editing and live recalculation | Browser / Client | — | Inputs already live in local React state and must update instantly without a backend round-trip. [VERIFIED: codebase grep][VERIFIED: planning docs] |
| Keyword math pipeline (tokenization, TF, IDF, TF-IDF, ranking) | Browser / Client | — | The product scope requires deterministic in-browser teaching math over a tiny local corpus. [VERIFIED: planning docs] |
| Scenario defaults and lesson metadata | Browser / Client | CDN / Static | Scenario content is stored locally in `src/content/scenarios.ts` and shipped as static assets. [VERIFIED: codebase grep] |
| Step-specific visual explanation rendering | Browser / Client | — | The existing `VisualizationPanel` is a client-rendered placeholder and should become a step router for keyword views. [VERIFIED: codebase grep] |
| Production hosting | CDN / Static | — | Vite produces static assets for deployment; Phase 2 should not add a server tier. [CITED: https://vite.dev/guide/] |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.7 (repo pin) [VERIFIED: codebase grep] | Component rendering, local state orchestration, accessible DOM updates. | The current app already uses React 19.x, and the official docs currently track React 19.2 as the latest documented line. [CITED: https://react.dev/versions] |
| TypeScript | 6.0.3 (repo pin) [VERIFIED: codebase grep] | Typed scenario/session models and keyword snapshot contracts. | The repo already depends on typed domain models; Phase 2 adds more value by extending those contracts than by adding runtime schema libraries. [VERIFIED: codebase grep] |
| Vite | 8.0.16 (repo pin) [VERIFIED: codebase grep] | Dev server, test config host, and static production build. | Vite’s official guide describes its React/TypeScript starter flow and optimized static production output, which matches the project’s static-SPA constraint. [CITED: https://vite.dev/guide/] |
| Tailwind CSS + `@tailwindcss/vite` | 4.3.1 / 4.3.1 (repo pins) [VERIFIED: codebase grep] | Projector-safe layout, typography, spacing, and table/card styling. | Tailwind’s official Vite install path matches the repo’s current `vite.config.ts` and `index.css` setup. [CITED: https://tailwindcss.com/docs/installation/using-vite] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 4.1.9 (repo pin) [VERIFIED: codebase grep] | Pure keyword-function tests and light component verification. | Use for all math coverage and fast regression checks during Phase 2. [CITED: https://vitest.dev/guide/] |
| `@testing-library/react` | 16.3.2 (repo pin; npm-audited OK) [VERIFIED: npm registry] | DOM-first tests for visible keyword steps and explanations. | Use for assertions by role, label, and text rather than implementation details. [CITED: https://testing-library.com/docs/react-testing-library/intro/] |
| Existing shadcn/ui primitives (`Card`, `Badge`, `Progress`, `Textarea`, `Select`) | repo-local [VERIFIED: codebase grep] | Accessible cards, badges, and score/status surfaces. | Reuse them to keep Phase 2 consistent with Phase 1 instead of adding a table or chart dependency. [VERIFIED: codebase grep] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Existing `useReducer` session + selectors [VERIFIED: codebase grep] | Zustand/Redux [ASSUMED] | A store library adds ceremony without solving a real Phase 2 problem in a one-page SPA. [VERIFIED: planning docs] |
| Semantic HTML tables/cards [VERIFIED: planning docs] | Data-grid or chart libraries [ASSUMED] | Native tables are easier to read on projectors and easier to test by role/text for this fixed-size dataset. [VERIFIED: planning docs] |
| Reusing current pinned dependencies [VERIFIED: codebase grep] | Upgrading to newly published latest packages [VERIFIED: npm registry] | The legitimacy audit flags several current latest releases as suspicious only because they are extremely new; Phase 2 should not become an upgrade phase. [VERIFIED: npm registry] |

**Installation:**
```bash
# No package changes are recommended for Phase 2.
# Reuse the dependencies already pinned in package.json.
```

**Version verification:** The current repo pins match the current npm latest versions for `react`, `react-dom`, `vite`, `vitest`, `tailwindcss`, `@tailwindcss/vite`, and `@testing-library/react` as of 2026-06-15; however, the legitimacy audit flags most of those latest releases as `SUS` purely because they were published very recently. Plan against the existing pins and avoid upgrade work in this phase. [VERIFIED: npm registry]

## Package Legitimacy Audit

> No new npm packages are recommended for Phase 2. This audit is informational and exists to prevent the planner from turning this phase into dependency-install or dependency-upgrade work. [VERIFIED: planning docs][VERIFIED: npm registry]

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `react` | npm | 14 days [VERIFIED: npm registry] | 142.5M/wk [VERIFIED: npm registry] | `facebook/react` [VERIFIED: npm registry] | `SUS` [VERIFIED: npm registry] | Already installed; do not schedule install/upgrade work in Phase 2. |
| `react-dom` | npm | 14 days [VERIFIED: npm registry] | 133.3M/wk [VERIFIED: npm registry] | `facebook/react` [VERIFIED: npm registry] | `SUS` [VERIFIED: npm registry] | Already installed; do not schedule install/upgrade work in Phase 2. |
| `vite` | npm | 14 days [VERIFIED: npm registry] | 138.8M/wk [VERIFIED: npm registry] | `vitejs/vite` [VERIFIED: npm registry] | `SUS` [VERIFIED: npm registry] | Already installed; do not schedule install/upgrade work in Phase 2. |
| `vitest` | npm | same day [VERIFIED: npm registry] | 68.6M/wk [VERIFIED: npm registry] | `vitest-dev/vitest` [VERIFIED: npm registry] | `SUS` [VERIFIED: npm registry] | Already installed; do not schedule install/upgrade work in Phase 2. |
| `tailwindcss` | npm | 3 days [VERIFIED: npm registry] | 117.3M/wk [VERIFIED: npm registry] | `tailwindlabs/tailwindcss` [VERIFIED: npm registry] | `SUS` [VERIFIED: npm registry] | Already installed; do not schedule install/upgrade work in Phase 2. |
| `@tailwindcss/vite` | npm | 3 days [VERIFIED: npm registry] | 36.5M/wk [VERIFIED: npm registry] | `tailwindlabs/tailwindcss` [VERIFIED: npm registry] | `SUS` [VERIFIED: npm registry] | Already installed; do not schedule install/upgrade work in Phase 2. |
| `@testing-library/react` | npm | ~5 months [VERIFIED: npm registry] | 44.2M/wk [VERIFIED: npm registry] | `testing-library/react-testing-library` [VERIFIED: npm registry] | `OK` [VERIFIED: npm registry] | Approved for continued use in Phase 2 tests. |

**Packages removed due to [SLOP] verdict:** none. [VERIFIED: npm registry]
**Packages flagged as suspicious [SUS]:** `react`, `react-dom`, `vite`, `vitest`, `tailwindcss`, `@tailwindcss/vite`. These are not hallucinated packages; they are flagged only because the current latest releases are extremely new. The planner should add a `checkpoint:human-verify` task only if it decides to install or upgrade them, which this research does not recommend. [VERIFIED: npm registry]

## Architecture Patterns

### System Architecture Diagram

```text
Editable query/documents
        |
        v
Simulation session (`useReducer`)
        |
        v
Pure keyword snapshot builder
  -> tokenization
  -> matching
  -> TF rows
  -> DF/IDF rows
  -> TF-IDF rows
  -> raw scores + contribution map
  -> stable ranking + explanation strings
        |
        v
Visualization step router
  -> Token pills
  -> Match cards
  -> TF tables
  -> IDF table + importance badges
  -> TF-IDF tables
  -> Ranking cards + score bars
```

The key planning boundary is that later lesson steps (`keyword-limitation`, `meaning-vectors`, `semantic-ranking`, `final-comparison`) remain outside this phase’s implementation scope even though their step IDs already exist in `lessonSteps.ts`. [VERIFIED: codebase grep][VERIFIED: planning docs]

### Recommended Project Structure

```text
src/
├── content/
│   ├── lessonSteps.ts            # existing step metadata
│   └── scenarios.ts              # existing local scenario dataset
├── domain/
│   ├── simulation.ts             # reducer + exported keyword helpers/selectors
│   └── simulation.test.ts        # reducer tests plus keyword math coverage
├── features/
│   └── visualization-panel/
│       ├── VisualizationPanel.tsx   # step router
│       └── keyword-steps/           # tokenization/matching/TF/IDF/TF-IDF/ranking views
└── test/
    └── setup.ts                  # shared RTL/Vitest setup
```

### Pattern 1: Single Derived Keyword Snapshot

**What:** Build one pure snapshot from `query` and `documents`, then have each keyword step render a slice of that snapshot rather than recomputing inside components. [VERIFIED: codebase grep][VERIFIED: planning docs]

**When to use:** Use this for every non-setup keyword step in Phase 2. [VERIFIED: planning docs]

**Example:**
```ts
// Source: project architecture pattern from src/App.tsx + src/domain/simulation.ts [VERIFIED: codebase grep]
const snapshot = buildKeywordSnapshot(session.query, session.documents)

switch (activeStepId) {
  case 'tokenization':
    return <TokenizationStep snapshot={snapshot} />
  case 'keyword-ranking':
    return <KeywordRankingStep snapshot={snapshot} />
}
```

### Pattern 2: Round at the Presentation Boundary

**What:** Keep raw floating-point values for sorting and explanation generation, then round to exactly three decimals only where the UI presents TF, IDF, TF-IDF, and total scores. [VERIFIED: planning docs]

**When to use:** Use this for every numeric table and ranking card in this phase. [VERIFIED: planning docs]

**Example:**
```ts
// Source: locked phase rules from REQUIREMENTS.md + 02-CONTEXT.md [VERIFIED: planning docs]
const ranked = sortByRawScore(rawScores)
const displayScore = formatThreeDecimals(ranked[0].rawScore)
```

### Anti-Patterns to Avoid

- **Recomputing math in JSX:** If tokenization/TF/IDF logic lives in components, edited inputs will drift across steps and tests will become brittle. [VERIFIED: codebase grep]
- **Sorting on rounded scores:** Ranking on `0.333` display values instead of raw values can create false ties and violate KEYW-07. [VERIFIED: planning docs]
- **Color-only importance cues:** Badge fill alone would violate the explicit non-color accessibility requirement and the approved UI contract. [VERIFIED: planning docs]
- **`dangerouslySetInnerHTML` for highlighted terms:** Render token pills and spans as React nodes instead of injecting HTML strings. [CITED: https://react.dev/reference/react-dom/components/common]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Phase-wide state sharing | A second store layer (`redux`, `zustand`) [ASSUMED] | Existing reducer + derived selectors [VERIFIED: codebase grep] | The current app is already structured around `useReducer`; a second state abstraction adds indirection without reducing complexity here. [VERIFIED: codebase grep] |
| Match highlighting | HTML-string concatenation with manual `<mark>` injection | Render token pills/spans as React elements | Avoids XSS risks and keeps labels/icons accessible. [CITED: https://react.dev/reference/react-dom/components/common] |
| Score bars | Custom div-width bars with ad hoc semantics | Existing `Progress` primitive or semantic equivalents already in the repo | The UI stack already includes a tested progress primitive with ARIA-friendly props. [VERIFIED: codebase grep] |
| Browser smoke harness in this phase | A custom E2E shell or premature Playwright adoption | Vitest + React Testing Library for Phase 2; browser smoke stays in Phase 5 per roadmap | Keeps Phase 2 focused on keyword correctness and visible UI evidence. [VERIFIED: planning docs] |

**Key insight:** The main failure mode in this phase is not missing infrastructure; it is duplicated or presentation-coupled math. Keep the math pure once, then project it into the UI many times. [VERIFIED: codebase grep][VERIFIED: planning docs]

## Common Pitfalls

### Pitfall 1: Early Rounding Changes the Winner
**What goes wrong:** Two documents that are distinct in raw score appear tied or swap order because the implementation sorts on rounded values. [VERIFIED: planning docs]
**Why it happens:** Developers format values for tables first and then reuse those strings or rounded numbers for ranking. [ASSUMED]
**How to avoid:** Preserve raw TF, IDF, TF-IDF, and total-score numbers until after ranking; only formatted values reach the UI. [VERIFIED: planning docs]
**Warning signs:** Snapshot tests pass for tables, but ranking order changes when multiple documents are close. [ASSUMED]

### Pitfall 2: Step Components Drift Out of Sync After Edits
**What goes wrong:** Tokenization, matching, and ranking disagree after a query/document edit because each component reruns a slightly different calculation path. [VERIFIED: codebase grep]
**Why it happens:** The visualization layer owns calculation logic instead of consuming one shared snapshot. [VERIFIED: codebase grep]
**How to avoid:** Centralize keyword math in exported pure helpers/selectors and keep step components presentational. [VERIFIED: codebase grep]
**Warning signs:** A user edits a document and one step updates while another still shows old counts or badges. [ASSUMED]

### Pitfall 3: Empty or Punctuation-Only Inputs Throw Edge Cases
**What goes wrong:** Empty token arrays trigger divide-by-zero or render-state errors. [VERIFIED: planning docs]
**Why it happens:** `df = 0`, `totalWords = 0`, or empty term lists are treated as impossible. [VERIFIED: planning docs]
**How to avoid:** Encode the explicit empty-state contract from `02-CONTEXT.md`: empty token lists, zero scores, and the `No tokens found` placeholder. [VERIFIED: planning docs]
**Warning signs:** The visualization panel shows `NaN`, `Infinity`, or blank tables after deleting the query. [ASSUMED]

### Pitfall 4: Accessibility Gets Lost in “Educational” Styling
**What goes wrong:** Rare/common badges or matched/missing tokens become visually attractive but semantically weak for keyboard and projector users. [VERIFIED: planning docs]
**Why it happens:** Styling decisions outrun the explicit text/icon requirements in the UI spec. [VERIFIED: planning docs]
**How to avoid:** Keep every state cue doubled up with text, icon/shape, and role/label-based test coverage. [VERIFIED: planning docs]
**Warning signs:** Tests rely on class names or colors instead of text like `Rare (Strong)`, `Common (Weak)`, `Matched`, or `Missing`. [CITED: https://testing-library.com/docs/react-testing-library/intro/] 

## Code Examples

Verified patterns from official sources:

### Vitest `jsdom` Setup
```ts
// Source: https://vitest.dev/guide/
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
})
```

### Tailwind Vite Plugin
```ts
// Source: https://tailwindcss.com/docs/installation/using-vite
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

### DOM-First Component Assertions
```tsx
// Source: https://testing-library.com/docs/react-testing-library/intro/
render(<Greeting name="Testing" />)
expect(screen.getByRole('heading')).toHaveTextContent('Hello, Testing!')
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Raw keyword counts or phrase matching [VERIFIED: planning docs] | Visible TF-IDF stages with per-term evidence [VERIFIED: planning docs] | Current product definition and Phase 2 lock-in [VERIFIED: planning docs] | Students can see why common terms weaken and rare terms strengthen instead of accepting a black-box score. [VERIFIED: planning docs] |
| Component-instance testing [CITED: https://testing-library.com/docs/react-testing-library/intro/] | DOM-first user-centric testing [CITED: https://testing-library.com/docs/react-testing-library/intro/] | Current Testing Library guidance [CITED: https://testing-library.com/docs/react-testing-library/intro/] | Tests stay aligned with labels, roles, and visible teaching copy. [CITED: https://testing-library.com/docs/react-testing-library/intro/] |
| Ad hoc build tooling [CITED: https://vite.dev/guide/] | Vite static SPA workflow [CITED: https://vite.dev/guide/] | Existing repo baseline [VERIFIED: codebase grep] | Phase 2 can stay frontend-only and deployable as static assets. [CITED: https://vite.dev/guide/] |

**Deprecated/outdated:**
- Adding a second client-state library for this phase is outdated project-wise because the existing reducer already models the whole lesson session cleanly. [VERIFIED: codebase grep]
- Browser smoke automation in Phase 2 is outdated against the current roadmap because QUAL-05 is explicitly mapped to Phase 5. [VERIFIED: planning docs]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Repeated query tokens should remain visible in token pills but collapse to unique normalized terms in calculation tables and explanations. [ASSUMED] | Architecture Patterns / Validation Architecture | Duplicate rows or duplicated term contributions could change both the UI shape and the expected test fixtures. |

## Open Questions

1. **How should duplicate query tokens behave in TF/IDF/TF-IDF tables?** [ASSUMED]
   What we know: the phase locks tokenization rules, rounding, and final explanations, but it does not explicitly define whether repeated query words become repeated rows or one normalized term row. [VERIFIED: planning docs]
   What's unclear: whether a query like `iphone iphone` should produce duplicate calculation rows or a single `iphone` row with duplicated token pills only. [ASSUMED]
   Recommendation: lock this before planning fixtures; the safest classroom default is unique normalized term rows with original token order preserved only in the tokenization view. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite 8 and Vitest 4 runtime [CITED: https://vite.dev/guide/][CITED: https://playwright.dev/docs/intro] | ✓ [VERIFIED: local test run] | 24.14.1 [VERIFIED: local test run] | — |
| npm | Package scripts and registry verification [VERIFIED: codebase grep] | ✓ [VERIFIED: local test run] | 11.17.0 [VERIFIED: local test run] | — |
| Vitest | Phase 2 automated validation [VERIFIED: codebase grep] | ✓ [VERIFIED: local test run] | 4.1.9 [VERIFIED: codebase grep] | — |
| `@testing-library/react` | Phase 2 component tests [VERIFIED: npm registry] | ✓ [VERIFIED: codebase grep] | 16.3.2 [VERIFIED: npm registry] | — |
| Playwright | Future QUAL-05 browser smoke only [VERIFIED: planning docs] | ✗ [VERIFIED: codebase grep] | — | Keep Phase 2 validation in Vitest + RTL; install in Phase 5 if roadmap stays unchanged. [VERIFIED: planning docs] |

**Missing dependencies with no fallback:**
- None for Phase 2. [VERIFIED: codebase grep][VERIFIED: planning docs]

**Missing dependencies with fallback:**
- Playwright is absent today, but Phase 2 does not require it because browser smoke coverage is roadmap-scoped to Phase 5. [VERIFIED: planning docs]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.9 with React Testing Library in `jsdom`. [VERIFIED: codebase grep][VERIFIED: npm registry] |
| Config file | `vite.config.ts`. [VERIFIED: codebase grep] |
| Quick run command | `npm test -- --run src/domain/simulation.test.ts` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| KEYW-01 | Lowercase tokenization, punctuation splitting, empty-state token handling. [VERIFIED: planning docs] | unit + component | `npm test -- --run src/domain/simulation.test.ts src/features/visualization-panel/VisualizationPanel.test.tsx` | ❌ Wave 0 |
| KEYW-02 | Matched vs missing query terms per document with visible labels/icons. [VERIFIED: planning docs] | component | `npm test -- --run src/features/visualization-panel/VisualizationPanel.test.tsx` | ❌ Wave 0 |
| KEYW-03 | Count, total words, and relative TF rows rounded to three decimals. [VERIFIED: planning docs] | unit + component | `npm test -- --run src/domain/simulation.test.ts src/features/visualization-panel/VisualizationPanel.test.tsx` | ❌ Wave 0 |
| KEYW-04 | DF and unsmoothed `ln(N/df)` IDF, including `df = 0 -> 0`. [VERIFIED: planning docs] | unit | `npm test -- --run src/domain/simulation.test.ts` | ✅ |
| KEYW-05 | Rare/common importance rendered without color-only signaling. [VERIFIED: planning docs] | component | `npm test -- --run src/features/visualization-panel/VisualizationPanel.test.tsx` | ❌ Wave 0 |
| KEYW-06 | TF-IDF matrix and per-document score summation from visible values. [VERIFIED: planning docs] | unit + component | `npm test -- --run src/domain/simulation.test.ts src/features/visualization-panel/VisualizationPanel.test.tsx` | ❌ Wave 0 |
| KEYW-07 | Descending raw-score ranking with original-index tie-breaks. [VERIFIED: planning docs] | unit | `npm test -- --run src/domain/simulation.test.ts` | ✅ |
| KEYW-08 | Evidence-based explanation strings update after query/document edits. [VERIFIED: planning docs] | component + regression | `npm test -- --run src/App.test.tsx src/features/visualization-panel/VisualizationPanel.test.tsx` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm test -- --run src/domain/simulation.test.ts`
- **Per wave merge:** `npm test -- --run`
- **Phase gate:** Full suite green before `$gsd-verify-work`

### Wave 0 Gaps

- [ ] Expand `src/domain/simulation.test.ts` to cover tokenization, TF, DF, IDF, TF-IDF, score summation, and deterministic tie-breaking for edited text inputs. [VERIFIED: codebase grep][VERIFIED: planning docs]
- [ ] Add `src/features/visualization-panel/VisualizationPanel.test.tsx` or equivalent step-focused tests for token pills, match/miss badges, three-decimal tables, importance badges, and ranking explanations. [VERIFIED: codebase grep][VERIFIED: planning docs]
- [ ] Add a shared test helper for building a `SimulationSession` at a chosen keyword step so step tests do not reimplement reducer setup. [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no [VERIFIED: planning docs] | No auth in MVP scope. [VERIFIED: planning docs] |
| V3 Session Management | no [VERIFIED: planning docs] | No server or authenticated session exists in this phase. [VERIFIED: planning docs] |
| V4 Access Control | no [VERIFIED: planning docs] | No user roles or protected resources exist in this phase. [VERIFIED: planning docs] |
| V5 Input Validation | yes [CITED: https://owasp.org/www-project-application-security-verification-standard/] | Keep user-edited query/document text in plain text flows, render through React nodes, and avoid raw HTML injection. [CITED: https://react.dev/reference/react-dom/components/common][CITED: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html] |
| V6 Cryptography | no [VERIFIED: planning docs] | No cryptographic feature exists in this phase. [VERIFIED: planning docs] |

### Known Threat Patterns for this Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| User-edited query/document text rendered as HTML | Tampering | Never use `dangerouslySetInnerHTML` for token highlighting or explanations; keep output in normal React text/element rendering paths. [CITED: https://react.dev/reference/react-dom/components/common] |
| Untrusted values inserted into dangerous DOM contexts (`on*`, raw `href/src`, inline HTML) | Tampering | Keep attributes hardcoded, keep explanations plain text, and rely on framework-default escaping/output encoding for normal text nodes. [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html] |
| Large pasted documents causing client-only UI slowdown | Denial of Service | Keep the tiny document-count assumption, centralize computation, and avoid repeated recomputation per component render. [VERIFIED: planning docs][ASSUMED] |

## Sources

### Primary (HIGH confidence)

- Local code inspection of `package.json`, `vite.config.ts`, `src/App.tsx`, `src/domain/simulation.ts`, `src/domain/simulation.test.ts`, `src/features/visualization-panel/VisualizationPanel.tsx`, `src/content/scenarios.ts`, and `src/content/lessonSteps.ts` for current architecture, test seams, and existing dependencies. [VERIFIED: codebase grep]
- Local `npm test -- --run` execution on 2026-06-15 for current validation baseline. [VERIFIED: local test run]
- npm registry verification and package legitimacy audit for phase-relevant packages. [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)

- `/vitejs/vite` and `https://vite.dev/guide/` for Vite 8 templates, Node requirements, and static build behavior. [CITED: https://vite.dev/guide/]
- `/vitest-dev/vitest` and `https://vitest.dev/guide/` for `jsdom` test-environment setup and config patterns. [CITED: https://vitest.dev/guide/]
- `/tailwindlabs/tailwindcss.com` and `https://tailwindcss.com/docs/installation/using-vite` for Tailwind 4 Vite integration. [CITED: https://tailwindcss.com/docs/installation/using-vite]
- `/reactjs/react.dev` and `https://react.dev/versions` plus `https://react.dev/reference/react-dom/components/common` for current React version line and raw-HTML safety guidance. [CITED: https://react.dev/versions][CITED: https://react.dev/reference/react-dom/components/common]
- `/testing-library/react-testing-library` and `https://testing-library.com/docs/react-testing-library/intro/` for DOM-first testing guidance. [CITED: https://testing-library.com/docs/react-testing-library/intro/]
- `https://owasp.org/www-project-application-security-verification-standard/` and `https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html` for ASVS and XSS controls. [CITED: https://owasp.org/www-project-application-security-verification-standard/][CITED: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html]

### Tertiary (LOW confidence)

- None. All non-codebase ecosystem claims in this document were checked against official docs or Context7-backed documentation. [VERIFIED: codebase grep]

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - package pins and official docs are verified, but the legitimacy gate flags several latest releases as suspicious solely because they are very new, so this phase should avoid upgrade work. [VERIFIED: npm registry]
- Architecture: HIGH - the implementation seams are directly visible in the current codebase and phase documents. [VERIFIED: codebase grep][VERIFIED: planning docs]
- Pitfalls: MEDIUM - the main risks are well supported by the locked requirements and current React/Testing Library guidance, but one duplicate-token behavior choice remains assumed. [VERIFIED: planning docs][ASSUMED]

**Research date:** 2026-06-15
**Valid until:** 2026-06-22
