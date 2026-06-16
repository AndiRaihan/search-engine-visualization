# Phase 3: Euclidean Meaning Journey - Research

**Researched:** 2026-06-16 [VERIFIED: codebase grep]
**Domain:** Browser-only semantic-search teaching UI using curated 2D vectors, Euclidean distance, accessible SVG, and pure client-side calculations [VERIFIED: codebase grep][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG]
**Confidence:** MEDIUM [CITED: https://react.dev/learn/you-might-not-need-an-effect][CITED: https://vitest.dev/guide/][VERIFIED: codebase grep]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Stick with Option 2 (Generic 'Dimension 1' and 'Dimension 2') universally as axis labels to prevent confusion when text is edited. [VERIFIED: codebase grep]
- **D-02:** Use a Star symbol for the Query and Circle symbols for Documents, both with text labels (e.g. 'Query', 'D1', 'D2') embedded or adjacent for accessibility. [VERIFIED: codebase grep]
- **D-03:** Major grid lines every 0.2 units (0.0, 0.2, 0.4, 0.6, 0.8, 1.0) with tick labels on both axes to help students read coordinates easily. [VERIFIED: codebase grep]
- **D-04:** Draw dashed lines from the query point to all document points, but do not display distance text labels on the map itself (distances are shown in the side panel/table instead) to keep the map clean and prevent text overlapping. [VERIFIED: codebase grep]
- **D-05:** Detailed substitution breakdown: For each document, show the math step-by-step (e.g., `d = √((0.80 - 0.90)² + (0.70 - 0.80)²) = √(0.01 + 0.01) = √0.02 = 0.141`) when the document is inspected or selected. [VERIFIED: codebase grep]
- **D-06:** Explicitly label the ranks with proximity descriptors, e.g., 'Rank 1 (Closest)' at the top, and 'Rank 7 (Furthest)' at the bottom, alongside the distance. [VERIFIED: codebase grep]
- **D-07:** Friendly inline alert in the Visualization Panel: Show a noticeable alert box at the top of the `meaning-vectors` and `semantic-ranking` step visualizations explaining that vectors remain static because there is no live AI/embedding backend. [VERIFIED: codebase grep]
- **D-08:** Conditional visibility: Display the notice ONLY when the scenario has been edited (`isEdited` is true) to keep the default interface clean. [VERIFIED: codebase grep]
- **D-09:** Dynamic guidance + recommendation: Show a clear explanation based on the active scenario. If they are not on the 'Keyword Search Misses Meaning' scenario, show a friendly tip suggesting they switch to it for the best worked example. [VERIFIED: codebase grep]
- **D-10:** Highlight missed documents in the list: Show a list of documents where documents with a keyword score of 0 (but high semantic relevance) are highlighted with a border/warning icon and text explanation (e.g., `Score: 0.000 (Missed synonym: iPhone vs phone)`). [VERIFIED: codebase grep]

### the agent's Discretion
- Exact styling of the star and circle SVG markers, SVG colors and contrast levels (must meet projector guidelines), alert box colors and icons, and layout of the step-by-step substitution display. [VERIFIED: codebase grep]

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope. [VERIFIED: codebase grep]
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SCEN-05 | User sees a clear notice that semantic vectors remain curated teaching coordinates after query or document text is edited. [VERIFIED: codebase grep] | Reuse existing `selectIsEdited` state and render the approved `Static Vectors` alert only in semantic steps, without mutating vectors on text edit. [VERIFIED: codebase grep][CITED: https://react.dev/learn/you-might-not-need-an-effect] |
| SEMA-01 | User can inspect a worked example where keyword scoring misses a semantically relevant document. [VERIFIED: codebase grep] | Use the existing `keyword-misses-meaning` scenario plus a semantic snapshot that cross-references keyword score and Euclidean proximity to flag misses. [VERIFIED: codebase grep] |
| SEMA-02 | User can see the query and documents represented by labeled, manually curated 2D teaching vectors. [VERIFIED: codebase grep] | Reuse scenario-owned vectors already present in content and render them in both SVG and a textual coordinates table. [VERIFIED: codebase grep][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] |
| SEMA-03 | User can inspect a meaning map that plots the query and document vectors and identifies each point without relying on color alone. [VERIFIED: codebase grep] | Use inline SVG with visible star/circle markers, adjacent labels, `<title>`/`<desc>` or `aria-labelledby`, and a coordinates table. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/desc][CITED: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label] |
| SEMA-04 | User can see lines from the query vector to document vectors when Euclidean distance is selected. [VERIFIED: codebase grep] | Render dashed SVG lines only in `semantic-ranking`, with values kept in the side panel per locked decision D-04. [VERIFIED: codebase grep] |
| SEMA-05 | User can inspect the Euclidean distance from the query to every document and see results ranked by smallest distance. [VERIFIED: codebase grep] | Add pure Euclidean helpers, deterministic ranking on full precision, display formatting at three decimals, and a selected-document substitution breakdown. [VERIFIED: codebase grep][CITED: https://vitest.dev/guide/learn/writing-tests] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- The feature must remain a browser-based static web application with no backend dependency. [VERIFIED: codebase grep]
- Phase 3 must keep all calculations instant in the browser for a five-to-ten-document local dataset. [VERIFIED: codebase grep]
- MVP copy remains English-only. [VERIFIED: codebase grep]
- The semantic model stays simplified and deterministic: curated 2D vectors plus explainable Euclidean distance, not production embeddings or inferred NLP output. [VERIFIED: codebase grep]
- The interaction model stays within the fixed three-panel desktop/projector layout; tablet responsiveness is deferred. [VERIFIED: codebase grep]
- Accessibility cannot rely on color alone, text must stay projector-legible, and keyboard navigation remains preferred for lesson controls. [VERIFIED: codebase grep]
- Core search logic must remain pure and unit tested, and practical UI smoke coverage must continue to verify the guided flow. [VERIFIED: codebase grep]
- Scope excludes backend services, persistence, authentication, production ML, and production search infrastructure. [VERIFIED: codebase grep]
- Use the existing stack direction: React, TypeScript, Vite, Tailwind CSS, and native SVG. [VERIFIED: codebase grep][CITED: https://react.dev/versions][CITED: https://vite.dev/guide/][CITED: https://tailwindcss.com/docs/installation/using-vite][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] |
- Do not make semantic-phase repo edits outside the GSD workflow unless explicitly bypassed by the user. [VERIFIED: codebase grep]

## Summary

Phase 3 is already scaffolded in the codebase: `StepId` and `lessonSteps` include `keyword-limitation`, `meaning-vectors`, and `semantic-ranking`; every scenario already carries curated vector coordinates; `buildSessionFromScenario` clones those vectors into client state; and `selectIsEdited` already detects query or document edits against scenario defaults. [VERIFIED: codebase grep] The missing work is implementation, not architecture, because `VisualizationPanel` currently renders Phase 2 components only and falls back to placeholders for later steps. [VERIFIED: codebase grep]

The current app architecture is the right seam to extend. [VERIFIED: codebase grep] React’s official guidance recommends using `useReducer` for complex workflow state and computing derived values during render instead of synchronizing duplicated derived state with Effects. [CITED: https://react.dev/learn/extracting-state-logic-into-a-reducer][CITED: https://react.dev/learn/you-might-not-need-an-effect] That matches the existing `simulationReducer` plus `buildKeywordSnapshot` pattern in `App.tsx`, so Phase 3 should add a pure `buildSemanticSnapshot`-style helper rather than storing distances, rankings, or selected breakdown text in reducer state. [VERIFIED: codebase grep][CITED: https://react.dev/reference/react/useReducer]

Native SVG remains the standard implementation medium for this phase because it is text-based, scales cleanly at projector sizes, and supports accessible names and descriptions through visible labels, `<title>`, `<desc>`, and ARIA references. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/desc] Pair the SVG with a semantic HTML coordinates table and a selectable ranking list so students can both see and read the same semantic facts. [CITED: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label] No new package is required for Phase 3; this should be planned as a code-and-tests phase on top of the existing workspace dependencies. [VERIFIED: codebase grep]

**Primary recommendation:** Keep authoritative state in the existing reducer, implement a pure semantic snapshot builder in `src/domain/simulation.ts`, and render each semantic fact twice: once as accessible SVG and once as textual table/list content. [VERIFIED: codebase grep][CITED: https://react.dev/learn/you-might-not-need-an-effect][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Curated scenario vectors and teaching copy | CDN / Static | Browser / Client | Scenario defaults are shipped as static content, then cloned into the client session on load. [VERIFIED: codebase grep] |
| Edited query/document state and `isEdited` notice gating | Browser / Client | — | Edit detection and step state already live entirely in the reducer and selectors. [VERIFIED: codebase grep] |
| Keyword-limitation bridge logic | Browser / Client | CDN / Static | It combines existing keyword scores with scenario-owned vectors to explain why a document was missed. [VERIFIED: codebase grep] |
| Euclidean distance calculations and semantic ranking | Browser / Client | — | The PRD and requirements require instant deterministic in-browser math over a tiny dataset. [VERIFIED: codebase grep] |
| Meaning map rendering and accessible textual equivalent | Browser / Client | — | SVG, tables, and selection UI are client-rendered presentation concerns backed by static data. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG][VERIFIED: codebase grep] |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | `19.2.x` with workspace pin `19.2.7` [CITED: https://react.dev/versions][VERIFIED: codebase grep] | Stateful single-page UI and reducer-driven lesson flow. [VERIFIED: codebase grep] | Official docs position `react.dev` as the latest version docs for React 19.2, and the current app already uses reducer-based local state successfully. [CITED: https://react.dev/versions][CITED: https://react.dev/learn/extracting-state-logic-into-a-reducer] |
| TypeScript | Workspace pin `6.0.3` [VERIFIED: codebase grep] | Contracts for scenarios, vectors, snapshots, and ranking rows. [VERIFIED: codebase grep] | The current domain layer already benefits from explicit interfaces for documents, vectors, steps, and keyword snapshots. [VERIFIED: codebase grep] |
| Vite | `8.0.x` with workspace pin `8.0.16` [CITED: https://vite.dev/guide/][VERIFIED: codebase grep] | Static SPA build, local dev, and Vitest integration. [VERIFIED: codebase grep] | Vite documents Node 20.19+ or 22.12+ support and the repo already uses its config entrypoint for React, Tailwind, aliases, and tests. [CITED: https://vite.dev/guide/][VERIFIED: codebase grep] |
| Tailwind CSS + `@tailwindcss/vite` | Workspace pin `4.3.1` [CITED: https://tailwindcss.com/docs/installation/using-vite][VERIFIED: codebase grep] | Projector-safe layout tokens, typography, and semantic-step styling. [VERIFIED: codebase grep] | Tailwind’s Vite plugin is the official integration path, and the repo already uses CSS `@import "tailwindcss"` plus theme tokens in `src/index.css`. [CITED: https://tailwindcss.com/docs/installation/using-vite][VERIFIED: codebase grep] |
| Native SVG | Browser standard [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] | Meaning map, dashed distance lines, point markers, and axis labels. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] | MDN documents SVG as text-based, scalable, searchable, and DOM-friendly, which fits a seven-point teaching map better than a charting dependency. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | `4.1.x` with workspace pin `4.1.9` [CITED: https://vitest.dev/guide/][VERIFIED: codebase grep] | Unit tests for Euclidean helpers, deterministic ranking, and semantic snapshot building. [VERIFIED: codebase grep] | Use for pure math and snapshot contracts in `src/domain`. [CITED: https://vitest.dev/guide/learn/writing-tests] |
| React Testing Library | Workspace pin `16.3.2` [VERIFIED: npm registry][VERIFIED: codebase grep] | Component tests for warning visibility, SVG labels, table content, and selection behavior. [VERIFIED: codebase grep] | Use when asserting behavior through accessible queries instead of component internals. [CITED: https://testing-library.com/docs/react-testing-library/intro/] |
| lucide-react | Workspace pin `0.475.0` [VERIFIED: codebase grep] | Optional alert or callout icons that always appear with visible text. [VERIFIED: codebase grep] | Use only where an icon reinforces the semantic-warning or keyword-miss callout copy. [VERIFIED: codebase grep][CITED: https://lucide.dev/guide/react] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native SVG meaning map [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] | D3 or a charting library [VERIFIED: codebase grep] | D3 becomes justified only when scales, interactions, or data volume exceed the fixed classroom dataset; Phase 3 does not cross that threshold. [VERIFIED: codebase grep] |
| Pure semantic snapshot builder [CITED: https://react.dev/learn/you-might-not-need-an-effect] | Reducer fields for distances, ranks, and selected math text [VERIFIED: codebase grep] | Persisting derived semantic data increases drift risk whenever query, docs, or scenario change. [CITED: https://react.dev/learn/you-might-not-need-an-effect] |
| Ranking-list-owned selection [VERIFIED: codebase grep] | Fully keyboard-focusable SVG point navigation [CITED: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label] | Making the list the primary selection surface is simpler and more readable for projector use; map interactivity can remain descriptive or pointer-enhanced. [VERIFIED: codebase grep] |

**Installation:** No additional install step is required for Phase 3; reuse the existing workspace dependency set. [VERIFIED: codebase grep]

```bash
npm install
```

## Package Legitimacy Audit

No new packages are required for Phase 3, so the planner should not add dependency-install tasks for this phase. [VERIFIED: codebase grep]

## Architecture Patterns

### System Architecture Diagram

```text
Static scenario defaults (query, docs, curated vectors)
  -> simulationReducer session state
      -> query/doc edits
      -> active step
      -> isEdited selector
          -> Static Vectors notice in semantic steps only

session.query + session.documents
  -> buildKeywordSnapshot(...)
      -> keyword-limitation bridge

session.query + session.documents + session.vectors + keywordSnapshot
  -> buildSemanticSnapshot(...)
      -> coordinates table
      -> meaning-map SVG
      -> Euclidean distance rows
      -> semantic ranking
      -> selected-document substitution breakdown

VisualizationPanel
  -> keyword-limitation
  -> meaning-vectors
  -> semantic-ranking
```

The important boundary is that edited text changes keyword-derived calculations immediately, while curated vector positions remain scenario-owned teaching data and never get recomputed from text. [VERIFIED: codebase grep]

### Recommended Project Structure

```text
src/
├── content/                      # Scenario defaults and lesson step metadata
├── domain/                       # Reducer, selectors, formatters, keyword and semantic snapshot builders
├── features/visualization-panel/ # Step components for keyword and semantic visuals
├── features/lesson-panel/        # Step explanations and navigation
├── components/ui/                # Shared shadcn primitives
└── test/                         # Vitest setup helpers
```

The planner should keep semantic math in `src/domain` and keep SVG/table rendering in `features/visualization-panel` instead of mixing calculations into JSX. [VERIFIED: codebase grep]

### Pattern 1: Semantic Snapshot Builder

**What:** Add one pure builder that derives all semantic-step facts from the existing session plus keyword snapshot: point coordinates, Euclidean distances, sorted ranking, zero-keyword/high-proximity misses, and the selected-document substitution payload. [VERIFIED: codebase grep][CITED: https://react.dev/learn/you-might-not-need-an-effect]

**When to use:** Use it for all three Phase 3 steps so every panel reads from the same semantic source of truth. [VERIFIED: codebase grep]

**Example:**

```ts
type SemanticSnapshot = {
  points: Array<{ id: string; label: string; x: number; y: number }>
  distances: Array<{ id: string; distance: number; keywordScore: number }>
  rankedByDistance: Array<{ id: string; rank: number; distance: number }>
}

function buildSemanticSnapshot(session: SimulationSession, keywordSnapshot: KeywordSnapshot) {
  const points = session.documents.map((doc, index) => {
    const [x, y] = session.vectors.documents[doc.id]
    return { id: doc.id, label: `D${index + 1}`, x, y }
  })

  const distances = points.map((point) => ({
    id: point.id,
    distance: euclideanDistance(session.vectors.query, [point.x, point.y]),
    keywordScore: keywordSnapshot.documents.find((doc) => doc.id === point.id)?.score ?? 0,
  }))

  return rankSemanticDistances(points, distances)
}
```

Source: Pattern aligned with the current `buildKeywordSnapshot` seam and React’s derived-data guidance. [VERIFIED: codebase grep][CITED: https://react.dev/learn/you-might-not-need-an-effect]

### Pattern 2: Accessible SVG + Textual Twin

**What:** Render the same semantic information in two synchronized views: an inline SVG for spatial intuition and a semantic HTML table/list for exact reading, focus, and screen-reader parity. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/desc]

**When to use:** Use this pattern in both `meaning-vectors` and `semantic-ranking`. [VERIFIED: codebase grep]

**Example:**

```tsx
<svg role="img" aria-labelledby="meaning-map-title meaning-map-desc" viewBox="0 0 100 100">
  <title id="meaning-map-title">Meaning map for the active scenario</title>
  <desc id="meaning-map-desc">
    Query is shown as a star. Documents are circles labeled D1 through D7.
  </desc>
  {/* grid, query star, document circles, labels, and dashed distance lines */}
</svg>

<table>
  <caption>Meaning coordinates</caption>
  <thead>
    <tr><th>Point</th><th>Dimension 1</th><th>Dimension 2</th></tr>
  </thead>
</table>
```

Source: Adapted from MDN guidance on SVG naming and descriptions. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/desc]

### Anti-Patterns to Avoid

- **Reducer-stored semantic ranking:** Do not store distances or rank lists in session state when they can be derived from query, docs, and vectors on each render. [CITED: https://react.dev/learn/you-might-not-need-an-effect]
- **Fake embedding recalculation after text edits:** Do not mutate `session.vectors` on query or document edits; that would violate the product scope and the locked SCEN-05 notice requirement. [VERIFIED: codebase grep]
- **SVG-only semantics:** Do not rely on marker color or geometric position alone; every point and distance must also exist as visible text. [CITED: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label]
- **Distance labels on the map:** Do not paint numeric distance values on the SVG; the locked design contract explicitly reserves those for tables/cards and the breakdown panel. [VERIFIED: codebase grep]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Semantic inference after edits | Fake embedding generator or heuristic vector recalculator [VERIFIED: codebase grep] | Scenario-owned curated vectors plus the edit-state notice [VERIFIED: codebase grep] | The PRD and requirements explicitly exclude real embeddings and automatic semantic inference. [VERIFIED: codebase grep] |
| Classroom charting layer | Canvas scene graph or D3 wrapper [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] | Inline SVG with DOM labels and a semantic table [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] | The dataset is tiny, labels matter more than animation, and SVG integrates cleanly with accessibility text. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title] |
| Semantic explanation storage | Separate cache for selected formula text [CITED: https://react.dev/learn/you-might-not-need-an-effect] | Derived substitution rows from the selected document ID and coordinates [CITED: https://react.dev/learn/you-might-not-need-an-effect] | Generated math text stays consistent with the full-precision ranking inputs. [VERIFIED: codebase grep] |
| Tooltip-only inspection | Hover-only distance or explanation overlays [VERIFIED: codebase grep] | Click/focus selection on the ranking list plus persistent detail panel [VERIFIED: codebase grep] | Hover-only explanations fail keyboard users and are brittle on projectors. [VERIFIED: codebase grep] |

**Key insight:** The phase is about making semantic facts inspectable, not about simulating a real embedding pipeline, so every implementation choice should favor determinism, shared derived data, and visible textual evidence. [VERIFIED: codebase grep]

## Common Pitfalls

### Pitfall 1: Semantic Snapshot Drift

**What goes wrong:** The SVG, distance table, and ranking list disagree after edits or scenario changes. [VERIFIED: codebase grep]

**Why it happens:** Distances or ranking rows are computed in multiple components or persisted separately from the authoritative session inputs. [CITED: https://react.dev/learn/you-might-not-need-an-effect]

**How to avoid:** Compute one semantic snapshot from `session` and reuse it everywhere in the semantic steps. [VERIFIED: codebase grep]

**Warning signs:** Ranking order changes in one panel but not another, or selected-document math does not match the displayed coordinates. [VERIFIED: codebase grep]

### Pitfall 2: Semantic UI Implies Live AI

**What goes wrong:** After text edits, students think the map updated from real semantic inference. [VERIFIED: codebase grep]

**Why it happens:** Query and document edits already recompute keyword math, so users naturally expect semantic positions to move too unless the UI says otherwise. [VERIFIED: codebase grep]

**How to avoid:** Reuse `isEdited` and show the approved `Static Vectors` alert only in semantic steps, with wording that explicitly says there is no live embedding backend. [VERIFIED: codebase grep]

**Warning signs:** Reviewers ask why coordinates did not change after editing text, or the planner proposes mutating vector coordinates on text change. [VERIFIED: codebase grep]

### Pitfall 3: Accessible Map Lost in Visual Polish

**What goes wrong:** The meaning map looks good visually but is unusable through labels, focus, or projector contrast. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG][VERIFIED: codebase grep]

**Why it happens:** SVG points and lines are easy to over-optimize for aesthetics while skipping visible labels or text alternatives. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title]

**How to avoid:** Keep visible labels on or beside every point, provide the coordinates table, and give the SVG an accessible name/description. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/desc]

**Warning signs:** A tester must rely on color alone to tell query from documents, or cannot derive point coordinates without reading source code. [VERIFIED: codebase grep]

### Pitfall 4: Rounding Changes the Ranking

**What goes wrong:** Two documents appear mis-ranked because displayed rounded values were used for sorting instead of full precision. [VERIFIED: codebase grep]

**Why it happens:** The current keyword phase already separates full-precision ranking from three-decimal display formatting, and Phase 3 can regress if it ranks on rounded distances. [VERIFIED: codebase grep]

**How to avoid:** Sort Euclidean distances on raw numbers, then format them only at the final display boundary. [VERIFIED: codebase grep]

**Warning signs:** Recomputing the shown three-decimal values by hand produces a different tie order than the UI. [VERIFIED: codebase grep]

## Code Examples

Verified patterns from official sources:

### Derived Data During Render

```tsx
function SemanticPanel({ query, documents }: Props) {
  const snapshot = buildSemanticSnapshot(query, documents)
  return <RankingList snapshot={snapshot} />
}
```

Source: React’s guidance is to calculate derived values during render instead of syncing duplicated state with Effects. [CITED: https://react.dev/learn/you-might-not-need-an-effect]

### Accessible SVG Naming

```tsx
<svg role="img" aria-labelledby="map-title map-desc">
  <title id="map-title">Meaning map</title>
  <desc id="map-desc">Query is a star. Documents are labeled circles.</desc>
</svg>
```

Source: MDN documents `<title>` as the accessible short name and `<desc>` as the long description for SVG graphics. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/desc]

### Contract-Focused Vitest Test

```ts
test('euclidean distance is zero for identical points', () => {
  expect(euclideanDistance([0.8, 0.7], [0.8, 0.7])).toBe(0)
})
```

Source: Vitest’s guidance favors small `.test.ts` files that verify behavior contracts directly. [CITED: https://vitest.dev/guide/learn/writing-tests][CITED: https://vitest.dev/guide/learn/testing-in-practice]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Effect-synchronized derived UI state [CITED: https://react.dev/learn/you-might-not-need-an-effect] | Render-time derived snapshots from reducer state [CITED: https://react.dev/learn/you-might-not-need-an-effect] | Current React 19 documentation line. [CITED: https://react.dev/versions] | Better consistency between semantic panels and less reducer complexity. [CITED: https://react.dev/learn/you-might-not-need-an-effect] |
| Raster/canvas-first mini charts [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] | DOM-backed inline SVG with accessible text equivalents [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title] | Stable SVG accessibility support has been broadly available since July 2015 on MDN’s SVG descriptive-element pages. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/desc] | Easier projector scaling, visible labels, and semantic fallback tables. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] |
| Implementation-detail component tests [CITED: https://testing-library.com/docs/react-testing-library/intro/] | User-centered DOM queries and behavior tests [CITED: https://testing-library.com/docs/react-testing-library/intro/] | Current Testing Library guidance. [CITED: https://testing-library.com/docs/react-testing-library/intro/] | Semantic-step tests should assert labels, notices, ranks, and table content the way a learner sees them. [CITED: https://testing-library.com/docs/react-testing-library/intro/] |

**Deprecated/outdated:**

- Storing semantic outputs in the reducer is outdated for this app because React’s current docs favor render-time derivation for dependent values. [CITED: https://react.dev/learn/you-might-not-need-an-effect]
- Any plan that recalculates semantic vectors from edited text is out of scope for the MVP and should be rejected. [VERIFIED: codebase grep]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| none | No assumptions were required in this research. [VERIFIED: codebase grep] | — | — |

## Open Questions

1. **Should the SVG points themselves be keyboard-selectable, or should the ranking list own semantic inspection?**
   - What we know: The approved UI contract requires an interactive semantic-ranking view and explicitly defines selection styling on ranking items. [VERIFIED: codebase grep]
   - What's unclear: The contract does not require a separate keyboard traversal model for the SVG points themselves. [VERIFIED: codebase grep]
   - Recommendation: Plan the ranking list as the primary focus/selection surface and treat SVG point interaction as optional pointer enhancement unless implementation stays trivial. [VERIFIED: codebase grep]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite build and Vitest execution. [CITED: https://vite.dev/guide/][CITED: https://vitest.dev/guide/] | ✓ [VERIFIED: test run] | `24.14.1` [VERIFIED: test run] | — |
| npm | Dependency install and test scripts. [VERIFIED: codebase grep] | ✓ [VERIFIED: test run] | `11.17.0` [VERIFIED: test run] | — |
| Vitest | Automated unit and component tests. [VERIFIED: codebase grep] | ✓ [VERIFIED: test run] | `4.1.9` workspace pin. [VERIFIED: codebase grep] | — |
| React Testing Library | User-facing component assertions. [VERIFIED: codebase grep] | ✓ [VERIFIED: codebase grep] | `16.3.2` workspace pin. [VERIFIED: npm registry][VERIFIED: codebase grep] | — |
| Playwright | Future browser smoke tests in later phases. [VERIFIED: codebase grep] | ✗ [VERIFIED: codebase grep] | — | Continue using existing Vitest + RTL integration coverage in Phase 3; defer Playwright to Phase 5. [VERIFIED: codebase grep] |

**Missing dependencies with no fallback:**

- None. [VERIFIED: codebase grep]

**Missing dependencies with fallback:**

- Playwright is not installed yet, but Phase 3 can rely on the existing Vitest + React Testing Library stack. [VERIFIED: codebase grep]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `4.1.9` with React Testing Library and `jsdom`. [VERIFIED: codebase grep] |
| Config file | `vite.config.ts`. [VERIFIED: codebase grep] |
| Quick run command | `npm test -- src/domain/simulation.test.ts`. [VERIFIED: codebase grep] |
| Full suite command | `npm test -- --run`. [VERIFIED: test run] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCEN-05 | Show the static-vector notice only after query/doc edits and only in semantic steps. [VERIFIED: codebase grep] | component | `npm test -- src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "static vectors notice"` | ❌ Wave 0 [VERIFIED: codebase grep] |
| SEMA-01 | Highlight zero-keyword but semantically close documents in the keyword-limitation step. [VERIFIED: codebase grep] | component | `npm test -- src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "keyword misses meaning"` | ❌ Wave 0 [VERIFIED: codebase grep] |
| SEMA-02 | Render query/doc labels and curated coordinates in both map and table. [VERIFIED: codebase grep] | component | `npm test -- src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "coordinates table"` | ❌ Wave 0 [VERIFIED: codebase grep] |
| SEMA-03 | Keep query/doc identification readable without color alone. [VERIFIED: codebase grep] | component | `npm test -- src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "point labels"` | ❌ Wave 0 [VERIFIED: codebase grep] |
| SEMA-04 | Draw dashed Euclidean lines from the query to each document in semantic ranking. [VERIFIED: codebase grep] | component | `npm test -- src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "distance lines"` | ❌ Wave 0 [VERIFIED: codebase grep] |
| SEMA-05 | Compute full-precision Euclidean distances, rank by smallest distance, and show a selected breakdown. [VERIFIED: codebase grep] | unit + component | `npm test -- src/domain/simulation.test.ts -t "euclidean"` | ❌ Wave 0 for semantic cases [VERIFIED: codebase grep] |

### Sampling Rate

- **Per task commit:** `npm test -- src/domain/simulation.test.ts` for math changes or `npm test -- src/features/visualization-panel/SemanticVisualizationSteps.test.tsx` for UI changes. [VERIFIED: codebase grep]
- **Per wave merge:** `npm test -- --run`. [VERIFIED: test run]
- **Phase gate:** Full suite green before `$gsd-verify-work`. [VERIFIED: codebase grep]

### Wave 0 Gaps

- [ ] `src/features/visualization-panel/SemanticVisualizationSteps.test.tsx` — covers SCEN-05 and SEMA-01 through SEMA-04. [VERIFIED: codebase grep]
- [ ] Extend `src/domain/simulation.test.ts` with Euclidean helper, deterministic ranking, and substitution-breakdown cases for SEMA-05. [VERIFIED: codebase grep]
- [ ] Add one app-level regression that navigates from keyword ranking into the semantic steps and verifies the notice/ranking bridge. [VERIFIED: codebase grep]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no [VERIFIED: codebase grep] | None; the app has no auth surface in scope. [VERIFIED: codebase grep] |
| V3 Session Management | no [VERIFIED: codebase grep] | None; session state is ephemeral local React state only. [VERIFIED: codebase grep] |
| V4 Access Control | no [VERIFIED: codebase grep] | None; there are no roles or protected resources. [VERIFIED: codebase grep] |
| V5 Input Validation | yes [VERIFIED: codebase grep] | Continue rendering user-edited text through normal React escaping, avoid `dangerouslySetInnerHTML`, and keep sanitized text assertions in tests. [VERIFIED: codebase grep] |
| V6 Cryptography | no [VERIFIED: codebase grep] | None; the phase introduces no secrets or cryptographic operations. [VERIFIED: codebase grep] |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Edited query or document text rendered into semantic labels or callouts could become XSS if raw HTML APIs are introduced. [VERIFIED: codebase grep] | Tampering | Keep all user text in normal React text nodes and preserve sanitization regression coverage. [VERIFIED: codebase grep] |
| SVG accessibility metadata could become misleading if visible labels and ARIA names diverge. [CITED: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label] | Spoofing | Derive visible labels and accessible names from the same semantic snapshot payload. [VERIFIED: codebase grep] |
| Large or malformed edit inputs could make formulas unreadable or overflow cards. [VERIFIED: codebase grep] | Denial of Service | Reuse the existing textarea constraints and render math from fixed vectors instead of raw user strings inside equations. [VERIFIED: codebase grep] |

## Sources

### Primary (HIGH confidence)

- None — no source in this run classified HIGH confidence by the local `classify-confidence` seam. [VERIFIED: codebase grep]

### Secondary (MEDIUM confidence)

- `/reactjs/react.dev` via Context7 — reducer and derived-data guidance. [CITED: https://react.dev/learn/extracting-state-logic-into-a-reducer][CITED: https://react.dev/learn/you-might-not-need-an-effect][CITED: https://react.dev/reference/react/useReducer]
- `/vitest-dev/vitest` via Context7 — TypeScript and behavior-focused testing patterns. [CITED: https://vitest.dev/guide/][CITED: https://vitest.dev/guide/learn/writing-tests][CITED: https://vitest.dev/guide/learn/testing-in-practice]
- React official versions page — current major line. [CITED: https://react.dev/versions]
- Vite guide — Node requirements and project baseline. [CITED: https://vite.dev/guide/]
- Tailwind CSS Vite installation guide — official plugin integration and zero-runtime output. [CITED: https://tailwindcss.com/docs/installation/using-vite]
- React Testing Library intro — user-centered testing guidance. [CITED: https://testing-library.com/docs/react-testing-library/intro/]
- Lucide React guide — inline SVG React components and tree-shaking. [CITED: https://lucide.dev/guide/react]
- MDN SVG overview and descriptive-element docs — SVG behavior, `<title>`, `<desc>`, and accessible labeling. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/desc][CITED: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label]
- Local codebase grep and test execution — current architecture, phase seams, and validation status. [VERIFIED: codebase grep][VERIFIED: test run]

### Tertiary (LOW confidence)

- None. [VERIFIED: codebase grep]

## Metadata

**Confidence breakdown:**

- Standard stack: MEDIUM - official docs and registry checks confirm the baseline, but Phase 3 should avoid dependency churn because the work is fully achievable with the current workspace stack. [CITED: https://react.dev/versions][CITED: https://vite.dev/guide/][VERIFIED: codebase grep]
- Architecture: MEDIUM - the recommendation is strongly grounded in the existing reducer/snapshot code seam and React’s current derived-data guidance. [VERIFIED: codebase grep][CITED: https://react.dev/learn/you-might-not-need-an-effect]
- Pitfalls: MEDIUM - they are supported by the current code shape, approved UI contract, and accessibility docs, but remain implementation-sensitive until the semantic components exist. [VERIFIED: codebase grep][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title]

**Research date:** 2026-06-16 [VERIFIED: codebase grep]
**Valid until:** 2026-06-23, because package and toolchain versions are fast-moving even though the UI architecture guidance is relatively stable. [CITED: https://react.dev/versions][CITED: https://vite.dev/guide/]
