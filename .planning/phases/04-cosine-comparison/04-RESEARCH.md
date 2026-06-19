# Phase 4: Cosine Comparison - Research

**Researched:** 2026-06-19
**Domain:** React/TypeScript client-side semantic ranking, cosine similarity math, and metric-aware visualization flow. [VERIFIED: codebase grep]
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
### Metric Toggle Placement & Interaction
- **D-01:** Place the Euclidean/Cosine toggle inside the **Visualization Panel** at the top-right of both the `semantic-ranking` step and the `final-comparison` step.
- **D-02:** Back the toggle selection in the global reducer state. Update `SimulationSession` to include `semanticMetric: 'euclidean' | 'cosine'` (defaulting to `'euclidean'`) and support a `metricToggled` action to toggle or select the active metric. This guarantees that user metric choices persist across step transitions.

### Meaning Map Visuals for Cosine Similarity
- **D-03:** When `semanticMetric` is `'cosine'`, hide the Euclidean dashed lines connecting the query directly to document points.
- **D-04:** Draw thin dashed lines from the origin $(0, 0)$ to the query point and to all document points to represent the direction vectors. This visually reinforces that Cosine Similarity measures directional alignment.
- **D-05:** Maintain the interactive zoom, pan, and coordinate table features unchanged across both modes.

### Step-by-Step Cosine Similarity Mathematical Breakdown
- **D-06:** Display a detailed, tabular breakdown card when a document is selected in Cosine mode. The breakdown must show:
  - **Formula:** $\text{sim}(\mathbf{q}, \mathbf{d}) = \frac{\mathbf{q} \cdot \mathbf{d}}{\|\mathbf{q}\| \|\mathbf{d}\|}$ (rendered via clean LaTeX math styling).
  - **Dot Product ($\mathbf{q} \cdot \mathbf{d}$):** Explicit substitution and evaluation: $q_x d_x + q_y d_y = (val \times val) + (val \times val) = val$.
  - **Query Length ($\|\mathbf{q}\|$):** Explicit calculation: $\sqrt{q_x^2 + q_y^2} = val$.
  - **Doc Length ($\|\mathbf{d}\|$):** Explicit calculation: $\sqrt{d_x^2 + d_y^2} = val$.
  - **Final Similarity:** The division and final rounded value: $\frac{\text{Dot Product}}{\text{Length } q \times \text{Length } d} = val$.
- **D-07:** Implement a division-by-zero guard in the cosine similarity calculation. If the magnitude of either vector is zero, return a similarity score of `0.000` to prevent runtime crashes.

### Result Explanations
- **D-08:** The text descriptions and explanations in the ranking panel must dynamically cite the active metric (e.g., "Similarity: 0.998" vs "Distance: 0.141") and explain the rank order (highest similarity first vs smallest distance first).

### the agent's Discretion
- Exact styling of the toggle switch/segmented control, exact stroke width and color of the origin rays, and the layout alignment of the cosine mathematical steps.

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEMA-06 | User can inspect the cosine similarity between the query and every document and see results ranked by highest similarity. [VERIFIED: codebase grep] | Extend the existing pure semantic engine with cosine helpers, full-precision descending ranking, and a shared ranked row shape so the list, map, and breakdown all read the same source of truth. [VERIFIED: codebase grep] |
| SEMA-07 | User can toggle semantic ranking between Euclidean distance and cosine similarity. [VERIFIED: codebase grep] | Put `semanticMetric` in `SimulationSession` and route a shared toggle above both `semantic-ranking` and the current `final-comparison` placeholder so the state survives step changes. [VERIFIED: codebase grep] |
| SEMA-08 | User can read a semantic result explanation generated from the selected displayed metric and curated vectors. [VERIFIED: codebase grep] | Generalize the current Euclidean-only ranking copy and breakdown card into metric-aware text and formulas keyed from the active metric. [VERIFIED: codebase grep] |
| QUAL-04 | Core tokenization, TF, document frequency, IDF, TF-IDF, Euclidean distance, cosine similarity, and ranking functions are covered by unit tests. [VERIFIED: codebase grep] | Reuse `src/domain/simulation.test.ts` and extend existing semantic component/app tests rather than adding a second test harness. [VERIFIED: codebase grep][CITED: https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/guide/filtering.md] |
</phase_requirements>

## Summary

Phase 4 should extend the existing Phase 2/3 architecture, not replace it. The codebase already centralizes editable lesson state in `simulationReducer`, computes keyword and semantic snapshots with `useMemo` in [src/App.tsx](/C:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/App.tsx), and renders the semantic map, ranking list, and math breakdown from [src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx](/C:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx). [VERIFIED: codebase grep] React’s current docs still recommend this split: keep complex updates in a reducer and derive calculated data during render or `useMemo` instead of duplicating it in state or Effects. [CITED: https://github.com/reactjs/react.dev/blob/main/src/content/learn/extracting-state-logic-into-a-reducer.md][CITED: https://github.com/reactjs/react.dev/blob/main/src/content/learn/you-might-not-need-an-effect.md]

The main planning risk is that the current semantic path is hard-coded to Euclidean behavior in four places: `SimulationSession` has no metric field, `SemanticSnapshot` only exposes distance-oriented rows and `EuclideanBreakdown`, `SemanticRankingStep` hard-codes `Distance:` copy, and `lessonSteps.ts` describes semantic ranking as straight-line distance only. [VERIFIED: codebase grep] A second risk is that locked decision D-01 requires the toggle on `final-comparison`, but `VisualizationPanel` still renders that step as a placeholder. [VERIFIED: codebase grep] The least disruptive plan is to add a shared metric toggle wrapper at the `VisualizationPanel` boundary, then make the domain snapshot and semantic components metric-aware underneath it. [VERIFIED: codebase grep]

**Primary recommendation:** Use one metric-aware semantic snapshot builder in `src/domain/simulation.ts`, one reducer-backed `semanticMetric` state field, and one shared Visualization Panel toggle that feeds both `semantic-ranking` and `final-comparison`. [VERIFIED: codebase grep][CITED: https://github.com/reactjs/react.dev/blob/main/src/content/learn/extracting-state-logic-into-a-reducer.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Semantic metric state (`euclidean` vs `cosine`) | Browser / Client | — | The app is a static SPA with no backend; the current reducer already owns scenario, query, document, and step state. [VERIFIED: codebase grep] |
| Cosine similarity calculation and deterministic ranking | Browser / Client | — | All keyword and semantic calculations already run in pure client-side helpers inside `src/domain/simulation.ts`. [VERIFIED: codebase grep] |
| Meaning map overlay switching (query-to-doc lines vs origin rays) | Browser / Client | CDN / Static | Rendering is done with native SVG in React, while deployment remains static `dist` output. [VERIFIED: codebase grep][CITED: https://github.com/vitejs/vite/blob/v8.0.10/docs/guide/build.md] |
| Final comparison metric persistence | Browser / Client | CDN / Static | Phase 5 will render comparison UI, but the metric itself must already survive step transitions in the client session for D-01/D-02. [VERIFIED: codebase grep] |

## Project Constraints (from AGENTS.md)

- Keep the phase browser-only and static; do not add backend services, persistence, or server-only logic. [VERIFIED: codebase grep]
- Keep all calculations instant for five to ten local documents; do not introduce remote calls or heavy visualization/math dependencies. [VERIFIED: codebase grep]
- Keep English-only MVP behavior; Indonesian examples remain deferred. [VERIFIED: codebase grep]
- Preserve the simplified teaching model: TF-IDF plus selectable Euclidean distance or cosine similarity over manually curated 2D vectors. [VERIFIED: codebase grep]
- Preserve the fixed desktop/projector-oriented three-panel experience; tablet responsiveness remains out of scope for this phase. [VERIFIED: codebase grep]
- Do not communicate state by color alone; keep toggle selection, ranking state, and metric explanations explicit in text or shape. [VERIFIED: codebase grep]
- Keep core search logic pure and unit tested; extend practical UI tests only along the primary guided flow. [VERIFIED: codebase grep]
- Do not add real embeddings, production NLP/search infrastructure, Canvas, D3, Redux/Zustand, or heavy animation libraries for this phase. [VERIFIED: codebase grep]

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react` [WARNING: flagged as suspicious — verify before using.] | `19.2.7` published 2026-06-01. [CITED: https://registry.npmjs.org/react] | Own reducer state, `useMemo` snapshots, and semantic step rendering. [VERIFIED: codebase grep] | Already wired through the app, and the official docs still recommend reducers for complex update logic plus render-time derived data. [VERIFIED: codebase grep][CITED: https://github.com/reactjs/react.dev/blob/main/src/content/learn/extracting-state-logic-into-a-reducer.md][CITED: https://github.com/reactjs/react.dev/blob/main/src/content/learn/you-might-not-need-an-effect.md] |
| `vite` [WARNING: flagged as suspicious — verify before using.] | `8.0.16` published 2026-06-01. [CITED: https://registry.npmjs.org/vite] | Provides the static build, aliasing, and embedded Vitest config used by this repo. [VERIFIED: codebase grep] | The repo already uses Vite’s standard `dev`/`build`/`preview` flow and static `dist` deployment model. [VERIFIED: codebase grep][CITED: https://github.com/vitejs/vite/blob/v8.0.10/docs/guide/index.md][CITED: https://github.com/vitejs/vite/blob/v8.0.10/docs/guide/build.md] |
| `vitest` [WARNING: flagged as suspicious — verify before using.] | `4.1.9` published 2026-06-15. [CITED: https://registry.npmjs.org/vitest] | Runs the unit and component suite that already covers keyword and Euclidean behavior. [VERIFIED: codebase grep] | The repo already uses `npm test`, and Vitest supports focused file/name filters that fit phase-level validation. [VERIFIED: codebase grep][CITED: https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/guide/filtering.md][CITED: https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/guide/cli.md] |
| Native SVG | Browser standard. [CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] | Renders the existing meaning map, labels, and Phase 4 origin rays without adding a chart dependency. [VERIFIED: codebase grep] | The current `MeaningMap` already handles pan/zoom and all point overlays in SVG, so cosine mode should stay in the same surface. [VERIFIED: codebase grep] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@testing-library/react` | `16.3.2` published 2026-01-19. [VERIFIED: npm registry] | Extends Phase 4 tests with user-visible assertions around toggle state, ranking copy, and breakdown text. [VERIFIED: codebase grep] | Use for semantic step and app-level metric toggle tests; keep assertions user-facing. [VERIFIED: codebase grep] |
| `lucide-react` [WARNING: flagged as suspicious — verify before using.] | Installed in the repo and published 2026-06-18. [CITED: https://registry.npmjs.org/lucide-react] | Already supplies visual warning icons; no new icon package is needed for a metric toggle or explanatory badges. [VERIFIED: codebase grep] | Reuse only if an icon reinforces a text label; do not use it as the sole indicator for the active metric. [VERIFIED: codebase grep] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Reducer-backed `semanticMetric` in `SimulationSession` | Component-local toggle state inside `SemanticRankingStep` | Local state would fail locked decision D-01 on `final-comparison` and would not persist across step transitions. [VERIFIED: codebase grep] |
| Extending `buildSemanticSnapshot` | Recomputing cosine values directly in JSX | Component-local math would duplicate ranking logic, explanation logic, and tie handling across list/map/breakdown surfaces. [VERIFIED: codebase grep] |
| Extending the existing `MeaningMap` SVG | Building a second cosine-only visualization component | A second map would duplicate pan/zoom, axes, point labels, and table alignment for no product gain. [VERIFIED: codebase grep] |

**Installation:**
```bash
# None — Phase 4 should reuse the existing dependency set.
```

## Package Legitimacy Audit

No new packages are required for Phase 4; this audit covers the existing packages cited in this research so the planner does not add unnecessary dependencies. [VERIFIED: codebase grep]

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `react` | npm | 18 days (2026-06-01). [CITED: https://registry.npmjs.org/react] | 147,686,985/wk. [CITED: https://registry.npmjs.org/react] | `github.com/facebook/react`. [CITED: https://registry.npmjs.org/react] | SUS | Flagged — existing dependency only; add a human checkpoint before any reinstall or upgrade. [CITED: https://registry.npmjs.org/react] |
| `vite` | npm | 18 days (2026-06-01). [CITED: https://registry.npmjs.org/vite] | 142,402,157/wk. [CITED: https://registry.npmjs.org/vite] | `github.com/vitejs/vite`. [CITED: https://registry.npmjs.org/vite] | SUS | Flagged — existing dependency only; add a human checkpoint before any reinstall or upgrade. [CITED: https://registry.npmjs.org/vite] |
| `vitest` | npm | 4 days (2026-06-15). [CITED: https://registry.npmjs.org/vitest] | 71,212,231/wk. [CITED: https://registry.npmjs.org/vitest] | `github.com/vitest-dev/vitest`. [CITED: https://registry.npmjs.org/vitest] | SUS | Flagged — existing dependency only; add a human checkpoint before any reinstall or upgrade. [CITED: https://registry.npmjs.org/vitest] |
| `@testing-library/react` | npm | 151 days (2026-01-19). [VERIFIED: npm registry] | 45,336,981/wk. [VERIFIED: npm registry] | `github.com/testing-library/react-testing-library`. [VERIFIED: npm registry] | OK | Approved. [VERIFIED: npm registry] |
| `lucide-react` | npm | 1 day (2026-06-18). [CITED: https://registry.npmjs.org/lucide-react] | 87,299,279/wk. [CITED: https://registry.npmjs.org/lucide-react] | `github.com/lucide-icons/lucide`. [CITED: https://registry.npmjs.org/lucide-react] | SUS | Flagged — existing dependency only; add a human checkpoint before any reinstall or upgrade. [CITED: https://registry.npmjs.org/lucide-react] |

**Packages removed due to [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** `react`, `vite`, `vitest`, `lucide-react` — the seam flagged these because their currently pinned releases are recent, not because the packages lack reputation or source repos. [CITED: https://registry.npmjs.org/react][CITED: https://registry.npmjs.org/vite][CITED: https://registry.npmjs.org/vitest][CITED: https://registry.npmjs.org/lucide-react]

## Architecture Patterns

### System Architecture Diagram

```text
User edits query/docs
  -> simulationReducer session state
     -> query, documents, activeStepId, semanticMetric
       -> useMemo(buildKeywordSnapshot)
       -> useMemo(buildSemanticSnapshot(session, keywordSnapshot))
          -> if euclidean:
               distance rows
               ascending rank
               Euclidean breakdown
               query-to-document dashed lines
          -> if cosine:
               similarity rows
               descending rank
               Cosine breakdown
               origin rays
            -> VisualizationPanel
               -> shared SemanticMetricToggle
               -> semantic-ranking
               -> final-comparison placeholder / Phase 5 surface
                  -> list, map, breakdown, explanations all read one snapshot
```

The current repo already follows every stage in this flow except `semanticMetric` and cosine-specific branches. [VERIFIED: codebase grep]

### Recommended Project Structure
```text
src/
├── domain/
│   ├── simulation.ts              # reducer state, pure math helpers, semantic snapshot
│   └── simulation.test.ts         # unit coverage for keyword + semantic math
├── features/
│   └── visualization-panel/
│       ├── VisualizationPanel.tsx # shared toggle boundary + step routing
│       ├── VisualizationPanel.test.tsx
│       └── semantic-steps/
│           └── SemanticVisualizationSteps.tsx  # map, ranking list, metric breakdown
├── content/
│   └── lessonSteps.ts             # copy that must stop being Euclidean-only
└── App.tsx                        # snapshot derivation + top-level dispatch wiring
```

### Pattern 1: Centralized Metric-Aware Semantic Snapshot
**What:** Keep cosine math, sorting, formatted evidence, and metric-specific explanation strings in `src/domain/simulation.ts`, next to the existing Euclidean helpers. [VERIFIED: codebase grep]
**When to use:** Use this for every value that can affect ranking order, selected breakdowns, or the text shown beside a result. [VERIFIED: codebase grep]
**Example:**
```typescript
// Source: existing buildSemanticSnapshot pattern in src/domain/simulation.ts
type SemanticMetric = 'euclidean' | 'cosine'

interface SemanticRankedDocument {
  id: string
  originalIndex: number
  score: number
  rank: number
  metricLabel: 'Distance' | 'Similarity'
  explanation: string
}

function buildSemanticSnapshot(session: SimulationSession, keywordSnapshot: KeywordSnapshot) {
  const rows = session.semanticMetric === 'cosine'
    ? rankByCosineSimilarity(session.vectors.query, docsForRanking)
    : rankByEuclideanDistance(session.vectors.query, docsForRanking)

  return {
    metric: session.semanticMetric,
    queryPoint,
    documentPoints,
    rankedDocuments: rows.map(/* map raw math -> UI-safe evidence */),
  }
}
```

### Pattern 2: Shared Toggle at the Visualization Boundary
**What:** Render one reusable metric toggle in `VisualizationPanel.tsx` whenever the active step is `semantic-ranking` or `final-comparison`, then pass the active metric into the step body. [VERIFIED: codebase grep]
**When to use:** Use this whenever a control must survive step navigation and eventually be reused by Phase 5. [VERIFIED: codebase grep]
**Example:**
```typescript
// Source: existing VisualizationPanel routing + locked D-01/D-02
const showMetricToggle =
  activeStepId === 'semantic-ranking' || activeStepId === 'final-comparison'

return (
  <section>
    {showMetricToggle ? (
      <SemanticMetricToggle
        metric={session.semanticMetric}
        onChange={(metric) => dispatch({ type: 'metricToggled', metric })}
      />
    ) : null}
    {renderStepBody()}
  </section>
)
```

### Pattern 3: One Meaning Map, Metric-Specific Overlays
**What:** Keep the existing SVG, axes, labels, zoom, pan, and coordinate table; swap only the overlay lines and accessible description when the metric changes. [VERIFIED: codebase grep]
**When to use:** Use this for any semantic view that still plots the same curated coordinates but explains them differently. [VERIFIED: codebase grep]

### Anti-Patterns to Avoid
- **Sorting on formatted strings:** `0.998` vs `1.000` display strings must never drive rank order; sort on raw numbers only. [VERIFIED: codebase grep]
- **Metric-local component math:** Do not compute cosine in `SemanticRankingStep` or `MeaningMap`; reuse snapshot data from the domain layer. [VERIFIED: codebase grep]
- **Hard-coding Euclidean copy in shared surfaces:** `lessonSteps.ts`, ranking labels, and breakdown headings currently say “distance”; leaving those unchanged will violate D-08. [VERIFIED: codebase grep]
- **Building a cosine-only second map:** It would duplicate the current pan/zoom SVG behavior and make Phase 5 harder to reuse. [VERIFIED: codebase grep]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-step metric persistence | A second global store or ad hoc prop chains | The existing reducer session plus a new `metricToggled` action | The reducer already owns all lesson progress state and is the only place that naturally satisfies D-02. [VERIFIED: codebase grep][CITED: https://github.com/reactjs/react.dev/blob/main/src/content/learn/extracting-state-logic-into-a-reducer.md] |
| Metric-specific rendering surfaces | Separate cosine-only ranking/map components | Prop-driven extensions of `SemanticRankingStep`, `SemanticRankingList`, and `MeaningMap` | The repo already has reusable semantic components, and duplicating them would fork accessibility and styling behavior. [VERIFIED: codebase grep] |
| Client-side charting | Canvas or a chart package | The existing native SVG `MeaningMap` | Current data size is tiny, and SVG already supports labels, zoom/pan, and DOM assertions in tests. [VERIFIED: codebase grep][CITED: https://developer.mozilla.org/en-US/docs/Web/SVG] |
| XSS-safe semantic explanations | Manual HTML sanitization plus `dangerouslySetInnerHTML` | Normal React text rendering and existing RTL regressions | The repo already verifies hostile input is rendered as text nodes rather than executable markup. [VERIFIED: codebase grep] |

**Key insight:** The cheapest correct implementation is to make the current semantic pipeline metric-aware, not to add a parallel cosine pipeline. [VERIFIED: codebase grep]

## Common Pitfalls

### Pitfall 1: Ranking by Display Precision
**What goes wrong:** Documents appear in the wrong order or tie behavior flips when two cosine scores round to the same three-decimal string. [VERIFIED: codebase grep]
**Why it happens:** The current UI displays formatted numbers, but the Euclidean ranker sorts on raw values with a deterministic original-index tie-break. [VERIFIED: codebase grep]
**How to avoid:** Mirror the Euclidean ranker pattern: compare raw cosine values first, then break ties on `originalIndex`, and format only at the rendering boundary. [VERIFIED: codebase grep]
**Warning signs:** Tests pass for pretty labels but fail when raw scores are nearly equal. [VERIFIED: codebase grep]

### Pitfall 2: Putting the Toggle Too Low in the Tree
**What goes wrong:** The toggle works on `semantic-ranking` but disappears on `final-comparison`, violating locked decision D-01. [VERIFIED: codebase grep]
**Why it happens:** `VisualizationPanel.tsx` still renders `final-comparison` as a placeholder, and `SemanticRankingStep` is not used there. [VERIFIED: codebase grep]
**How to avoid:** Render the shared toggle at the `VisualizationPanel` level for both semantic steps before handing off to the step body. [VERIFIED: codebase grep]
**Warning signs:** The reducer stores `semanticMetric`, but `final-comparison` has no visible control or metric label. [VERIFIED: codebase grep]

### Pitfall 3: Divide-by-Zero and Missing Vector Fallbacks
**What goes wrong:** Cosine calculations return `NaN` or crash when a vector is `[0, 0]`. [VERIFIED: codebase grep]
**Why it happens:** The current semantic snapshot already falls back to `[0, 0]` when a document vector is missing, which is harmless for Euclidean distance but unsafe for cosine denominators. [VERIFIED: codebase grep]
**How to avoid:** Guard zero query length or zero document length and return similarity `0` before formatting to `0.000`, exactly as locked decision D-07 requires. [VERIFIED: codebase grep]
**Warning signs:** `formatThreeDecimals` is asked to clean up non-finite values instead of the cosine helper returning a finite number itself. [VERIFIED: codebase grep]

### Pitfall 4: Selected-Document Behavior Becomes Ambiguous
**What goes wrong:** The ranking order changes after a metric toggle, but the breakdown still shows a previously selected document with no deliberate UX choice. [VERIFIED: codebase grep]
**Why it happens:** `SemanticRankingStep` initializes `selectedDocumentId` once with `useState` and does not resync it when `semanticSnapshot` changes. [VERIFIED: codebase grep]
**How to avoid:** Choose the behavior explicitly in planning: either preserve the selected document across toggles or reset to the new rank-1 document whenever the active metric changes. [VERIFIED: codebase grep]
**Warning signs:** Tests only assert list order, not which document the breakdown panel shows after toggling. [VERIFIED: codebase grep]

### Pitfall 5: Leaving Lesson Copy Euclidean-Only
**What goes wrong:** Students see “straight-line distance” copy while cosine mode is active, which undermines trust in the simulation. [VERIFIED: codebase grep]
**Why it happens:** `src/content/lessonSteps.ts` currently describes `semantic-ranking` only in Euclidean terms. [VERIFIED: codebase grep]
**How to avoid:** Either make the lesson copy metric-neutral or switch the copy dynamically from the active metric. [VERIFIED: codebase grep]
**Warning signs:** The list says `Similarity:` while the lesson panel still says “measures the straight-line distance.” [VERIFIED: codebase grep]

## Code Examples

Verified patterns from official and codebase sources:

### Reducer + Derived Snapshot Split
```typescript
// Source: current codebase in src/App.tsx + React docs
const [session, dispatch] = useReducer(simulationReducer, defaultScenario, buildSessionFromScenario)

const keywordSnapshot = useMemo(() => {
  return buildKeywordSnapshot(session.query, session.documents)
}, [session.query, session.documents])

const semanticSnapshot = useMemo(() => {
  return buildSemanticSnapshot(session, keywordSnapshot)
}, [session, keywordSnapshot])
```

### Focused Vitest Command Pattern
```bash
# Source: package.json + verified local runs + Vitest docs
npm test -- --run src/domain/simulation.test.ts -t "semantic|euclidean|cosine"
npm test -- --run src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "metric toggle|cosine breakdown"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Mirroring calculated data into component state or Effects | Calculate derived values during render and use `useMemo` only for expensive work. [CITED: https://github.com/reactjs/react.dev/blob/main/src/content/learn/you-might-not-need-an-effect.md] | Current React guidance. [CITED: https://github.com/reactjs/react.dev/blob/main/src/content/learn/you-might-not-need-an-effect.md] | Fits this repo’s `buildKeywordSnapshot` / `buildSemanticSnapshot` pattern and keeps Phase 4 math testable. [VERIFIED: codebase grep] |
| Separate per-step semantic logic | One shared domain snapshot feeding step components. [VERIFIED: codebase grep] | Already established by Phase 3. [VERIFIED: codebase grep] | Phase 4 should extend the shared snapshot with metric branches instead of forking the UI. [VERIFIED: codebase grep] |

**Deprecated/outdated:**
- Euclidean-only semantic ranking copy in `src/content/lessonSteps.ts` is outdated for Phase 4 and must become metric-neutral or metric-aware. [VERIFIED: codebase grep]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Preserving the selected document across metric toggles is the selected Phase 4 behavior. If the selected document no longer exists, fall back to the first-ranked document. [RESOLVED] | Common Pitfalls / Open Questions | Plan 04-02 encodes this behavior in tests and implementation tasks so the breakdown remains focused on the user's chosen document while all values and labels switch to the active metric. |

## Open Questions (RESOLVED)

1. **Should a metric toggle preserve the currently selected document or reset the breakdown to the new top-ranked result?** **Resolved: preserve selection.**
   - What we know: `SemanticRankingStep` already preserves selection incidentally because `selectedDocumentId` is local state, and the locked context does not override that behavior. [VERIFIED: codebase grep]
   - Decision: Preserve the selected document across metric toggles so the learner's explanation focus remains stable while the displayed evidence switches between distance and similarity. [RESOLVED]
   - Fallback: If the selected document id no longer exists in the ranked list, select the first-ranked document for the active metric. [RESOLVED]
   - Plan linkage: Plan `04-02` adds tests that preserve selection across toggles and verify the selected breakdown always cites the active metric correctly. [RESOLVED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite/Vitest execution and local static build workflow. [VERIFIED: codebase grep] | ✓ | `v24.14.1`. [VERIFIED: codebase grep] | — |
| npm | Script execution, dependency inspection, and registry verification. [VERIFIED: codebase grep] | ✓ | `11.17.0`. [VERIFIED: codebase grep] | — |
| Vitest CLI via `npm test` | QUAL-04 verification. [VERIFIED: codebase grep] | ✓ | `v4.1.9` in local run output. [VERIFIED: codebase grep] | — |

**Missing dependencies with no fallback:** none verified. [VERIFIED: codebase grep]

**Missing dependencies with fallback:** none verified. [VERIFIED: codebase grep]

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest `4.1.9` with React Testing Library `16.3.2`. [VERIFIED: codebase grep] |
| Config file | [vite.config.ts](/C:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/vite.config.ts) with `test.environment = 'jsdom'` and `setupFiles = './src/test/setup.ts'`. [VERIFIED: codebase grep] |
| Quick run command | `npm test -- --run src/domain/simulation.test.ts -t "semantic|euclidean|cosine"` once Phase 4 tests exist. [CITED: https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/guide/filtering.md] |
| Full suite command | `npm test -- --run`. [CITED: https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/guide/cli.md] |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEMA-06 | Cosine similarity rows are computed at full precision and ranked highest-first with deterministic ties. [VERIFIED: codebase grep] | unit | `npm test -- --run src/domain/simulation.test.ts -t "cosine"` | ✅ extend existing [src/domain/simulation.test.ts](/C:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/domain/simulation.test.ts) |
| SEMA-07 | Metric toggling changes the semantic model without mutating scenario, query, edited text, or active lesson progress. [VERIFIED: codebase grep] | integration/component | `npm test -- --run src/App.test.tsx -t "metric toggle"` | ✅ extend existing [src/App.test.tsx](/C:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/App.test.tsx) |
| SEMA-08 | Ranking labels and breakdown explanations cite `Distance` or `Similarity` from the active metric. [VERIFIED: codebase grep] | component | `npm test -- --run src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "cosine breakdown|metric explanation"` | ✅ extend existing [src/features/visualization-panel/SemanticVisualizationSteps.test.tsx](/C:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/features/visualization-panel/SemanticVisualizationSteps.test.tsx) |
| QUAL-04 | Tokenization, TF, DF, IDF, TF-IDF, Euclidean distance, cosine similarity, and deterministic ranking all stay covered together. [VERIFIED: codebase grep] | unit | `npm test -- --run src/domain/simulation.test.ts` | ✅ existing |

### Sampling Rate
- **Per task commit:** `npm test -- --run src/domain/simulation.test.ts -t "semantic|euclidean|cosine"` once new tests land. [CITED: https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/guide/filtering.md]
- **Per wave merge:** `npm test -- --run src/features/visualization-panel/SemanticVisualizationSteps.test.tsx` plus the matching app-level metric toggle test. [VERIFIED: codebase grep]
- **Phase gate:** `npm test -- --run` must stay green before `$gsd-verify-work`. [CITED: https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/guide/cli.md]

### Wave 0 Gaps
- [ ] `src/domain/simulation.test.ts` — add cosine similarity, zero-vector guard, and descending tie-break tests. [VERIFIED: codebase grep]
- [ ] `src/features/visualization-panel/SemanticVisualizationSteps.test.tsx` — add metric toggle, origin rays, and cosine breakdown assertions. [VERIFIED: codebase grep]
- [ ] `src/App.test.tsx` — add a guided-flow test that toggles metrics without resetting scenario or edited content. [VERIFIED: codebase grep]
- [ ] `src/features/visualization-panel/VisualizationPanel.test.tsx` — add a regression that the shared toggle renders on `final-comparison` even before Phase 5 comparison visuals exist. [VERIFIED: codebase grep]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Out of scope for this static classroom app. [VERIFIED: codebase grep] |
| V3 Session Management | no | No authenticated session exists; only local reducer state exists in memory. [VERIFIED: codebase grep] |
| V4 Access Control | no | No roles, users, or protected resources exist in this phase. [VERIFIED: codebase grep] |
| V5 Input Validation | yes | Keep user text rendered as normal React children and keep all metric math in pure helpers that return finite values. [VERIFIED: codebase grep] |
| V6 Cryptography | no | No cryptographic behavior is required for cosine comparison. [VERIFIED: codebase grep] |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS or markup injection from edited query/document text | Tampering | Continue rendering user input as text nodes and keep regression tests that assert no `script`, `img[onerror]`, or `foreignObject` nodes appear. [VERIFIED: codebase grep] |
| Inconsistent semantic evidence between list, map, and breakdown | Spoofing | Derive every metric-specific row, line overlay, and explanation from one shared semantic snapshot. [VERIFIED: codebase grep] |
| `NaN`/`Infinity` from cosine denominators | Denial of Service | Apply the zero-vector guard before formatting, and assert the helper returns finite numbers directly. [VERIFIED: codebase grep] |

## Sources

### Primary (HIGH confidence)
- Local codebase inspection: `src/domain/simulation.ts`, `src/domain/simulation.test.ts`, `src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx`, `src/features/visualization-panel/SemanticVisualizationSteps.test.tsx`, `src/features/visualization-panel/VisualizationPanel.tsx`, `src/features/visualization-panel/VisualizationPanel.test.tsx`, `src/App.tsx`, `src/App.test.tsx`, `src/content/lessonSteps.ts`, `src/content/scenarios.ts`, `vite.config.ts`, and `package.json`. [VERIFIED: codebase grep]
- npm registry checks via `npm view` for current versions and publish dates of `react`, `vite`, `vitest`, `@testing-library/react`, and `lucide-react`. [CITED: https://registry.npmjs.org/react][CITED: https://registry.npmjs.org/vite][CITED: https://registry.npmjs.org/vitest][CITED: https://registry.npmjs.org/@testing-library/react][CITED: https://registry.npmjs.org/lucide-react]

### Secondary (MEDIUM confidence)
- React official docs via Context7: reducer extraction and render-time derived data guidance. [CITED: https://github.com/reactjs/react.dev/blob/main/src/content/learn/extracting-state-logic-into-a-reducer.md][CITED: https://github.com/reactjs/react.dev/blob/main/src/content/learn/you-might-not-need-an-effect.md]
- Vitest official docs via Context7: CLI/watch behavior, jsdom environment, and filtered test runs. [CITED: https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/guide/cli.md][CITED: https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/guide/filtering.md][CITED: https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/config/environment.md]
- Vite official docs via Context7: standard scripts and static production builds. [CITED: https://github.com/vitejs/vite/blob/v8.0.10/docs/guide/index.md][CITED: https://github.com/vitejs/vite/blob/v8.0.10/docs/guide/build.md]

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - current versions were verified, but the legitimacy seam flags several June 2026 releases as SUS due recency. [CITED: https://registry.npmjs.org/react][CITED: https://registry.npmjs.org/vite][CITED: https://registry.npmjs.org/vitest]
- Architecture: HIGH - the Phase 4 extension seams are directly visible in the current codebase and Phase 3 summaries. [VERIFIED: codebase grep]
- Pitfalls: HIGH - the main failure modes come from currently hard-coded Euclidean behavior, a placeholder final-comparison step, and the present local selection state. [VERIFIED: codebase grep]

**Research date:** 2026-06-19
**Valid until:** 2026-06-26 for package/version freshness, 2026-07-19 for codebase architecture if no parallel refactor lands first.
