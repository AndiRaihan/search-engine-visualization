# Architecture Research

**Domain:** Interactive educational search-engine visualization
**Researched:** 2026-06-14
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
+----------------------------------------------------------------+
| React Application Shell                                        |
| Scenario/Input | Step Explanation | Current Visualization       |
+---------------------------+------------------------------------+
                            |
                            v
+----------------------------------------------------------------+
| Simulation Controller                                           |
| editable state | current step | reset/navigation/run-all actions|
+---------------------------+------------------------------------+
                            |
                            v
+----------------------------------------------------------------+
| Pure Search Domain Engine                                       |
| tokenize | TF/IDF/TF-IDF | keyword rank | distance | semantic rank|
+---------------------------+------------------------------------+
                            |
                            v
+----------------------------------------------------------------+
| Local Scenario Catalog                                          |
| query | documents | teaching metadata | manually assigned vectors|
+----------------------------------------------------------------+
```

The controller owns only editable inputs and navigation. A pure derivation layer creates one canonical `SimulationSnapshot`; tables, bars, highlights, explanations, maps, and rankings render from that snapshot.

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Scenario catalog | Validated built-in teaching data and vectors | Typed immutable TypeScript objects |
| Search engine | Tokenization, statistics, scores, distances, stable ranking | Pure functions with unit tests |
| Snapshot builder | Derive all values needed by every step | Pure composition function/selectors |
| Simulation controller | Scenario selection, edits, reset, current step, Run All | `useReducer` with explicit actions |
| Step registry | Ordered metadata and visualization association | Typed array keyed by stable step IDs |
| Input panel | Query, documents, scenario selection | Controlled semantic form elements |
| Explanation panel | Plain-language action and consequence | Data-driven copy per step/scenario |
| Visualization panel | Tokens, matches, tables, bars, map, rankings | Focused React components; SVG for map |
| Accessibility layer | Labels, focus flow, live status, textual equivalents | Native semantics first, limited ARIA |

## Recommended Project Structure

```text
src/
|-- app/
|   |-- App.tsx
|   |-- simulationReducer.ts
|   `-- stepRegistry.ts
|-- domain/
|   |-- search.ts
|   |-- ranking.ts
|   |-- vectors.ts
|   |-- snapshot.ts
|   `-- types.ts
|-- scenarios/
|   |-- scenarios.ts
|   `-- validation.ts
|-- components/
|   |-- input/
|   |-- navigation/
|   |-- explanation/
|   `-- visualizations/
|-- content/
|   `-- teachingCopy.ts
|-- styles/
|   `-- index.css
`-- test/
    `-- fixtures.ts
e2e/
`-- guided-search.spec.ts
```

### Structure Rationale

- **`domain/`:** isolates mathematical behavior from React so every displayed value can be tested directly.
- **`scenarios/`:** separates curated pedagogy from algorithms and UI.
- **`app/`:** owns orchestration without becoming a calculation layer.
- **`components/visualizations/`:** keeps each step focused while sharing typed snapshot data.
- **`content/`:** makes teaching language reviewable without searching through rendering code.

## Architectural Patterns

### Pattern 1: Functional Core, Interactive Shell

**What:** All search and ranking operations are pure. React handles inputs, actions, and rendering.
**When to use:** Always for this project.
**Trade-offs:** Requires deliberate data modeling, but removes synchronization bugs and enables direct unit testing.

```typescript
const snapshot = buildSimulationSnapshot({
  query,
  documents,
  vectors,
});
```

### Pattern 2: Canonical Derived Snapshot

**What:** Compute one immutable structure containing tokens, term statistics, keyword scores, distances, and rankings.
**When to use:** Whenever multiple views display related calculations.
**Trade-offs:** May compute more than the current step needs, but the dataset is tiny and consistency is more valuable.

```typescript
type SimulationSnapshot = {
  queryTokens: string[];
  documents: DocumentAnalysis[];
  idfByTerm: Record<string, number>;
  keywordRanking: RankedDocument[];
  semanticRanking: RankedDocument[];
};
```

### Pattern 3: Reducer-Based State Machine

**What:** Navigation and editing use named actions and bounded transitions.
**When to use:** The flow has reset, scenario switching, previous/next, and Run All.
**Trade-offs:** More explicit than several `useState` calls, but easier to reason about and test.

```typescript
type SimulationAction =
  | { type: "selectScenario"; scenarioId: string }
  | { type: "editQuery"; value: string }
  | { type: "editDocument"; id: string; value: string }
  | { type: "goToStep"; step: number }
  | { type: "reset" };
```

### Pattern 4: Visual Plus Textual Equivalence

**What:** Each visual communicates through labels and a semantic table/list, not color or geometry alone.
**When to use:** Score bars, token matches, meaning map, and rank movement.
**Trade-offs:** Adds markup, but supports accessibility, projector failures, and clearer testing.

## Data Flow

### Interaction Flow

```text
User edits/selects/navigates
    -> reducer updates canonical editable state
    -> snapshot builder recomputes pure derived data
    -> active step reads snapshot
    -> explanation and visualization render the same evidence
```

### State Management

```text
Scenario defaults ----+
                      +--> reducer state --> snapshot builder --> UI
User edits/actions ----+          |
                                  `--> reset restores scenario defaults
```

### Key Data Flows

1. **Scenario selection:** Load query, documents, vectors, and teaching metadata atomically; return to the starting step.
2. **Text editing:** Update source text, retokenize, and recompute all keyword-derived values immediately.
3. **Step navigation:** Change only the active step; calculations remain derived from the current inputs.
4. **Final comparison:** Read separate keyword and semantic rankings from the same snapshot and show rank movement.
5. **Reset:** Restore the selected scenario's immutable defaults, not global hard-coded values.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 5-10 documents | Recompute synchronously on every edit; simplest and correct |
| 10-100 documents | Debounce text edits and profile table rendering before changing architecture |
| 100+ documents | Outside product scope; consider workers/virtualization only if scope changes |

### Scaling Priorities

1. **First bottleneck:** Visual clutter, not computation; preserve the teaching document limit.
2. **Second bottleneck:** Scenario/content maintenance; add schema validation before adding infrastructure.

## Anti-Patterns

### Anti-Pattern 1: Calculations Inside Visual Components

**What people do:** Each table, chart, and result card recalculates its own score.
**Why it's wrong:** Rounding, tie-breaking, and filtering drift between views.
**Do this instead:** Build one domain snapshot and pass typed data down.

### Anti-Pattern 2: Duplicate Keyword and Semantic Pipelines in UI State

**What people do:** Store every intermediate value and manually synchronize it after edits.
**Why it's wrong:** State becomes stale and reset logic becomes fragile.
**Do this instead:** Store only editable inputs/navigation; derive the rest.

### Anti-Pattern 3: Treating Toy Vectors as Generated Embeddings

**What people do:** Invent coordinates for arbitrary edited text without explaining the model.
**Why it's wrong:** Misrepresents semantic search and produces pedagogically false confidence.
**Do this instead:** Label vectors as curated teaching coordinates and define behavior when text is edited.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Static host | Upload Vite `dist/` output | Configure base path if deploying under a GitHub Pages subpath |
| CI | Run lint, unit tests, build, and selected Playwright smoke tests | No runtime secrets required |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Scenario catalog <-> controller | Typed data copy | Defaults remain immutable |
| Controller <-> domain engine | Plain typed values | Domain code never imports React |
| Snapshot <-> visualizations | Read-only props | Visuals do not recalculate scores |
| Step registry <-> navigation | Stable IDs/index mapping | Prevent labels and components drifting apart |

## Sources

- https://react.dev/learn/managing-state - React state design principles
- https://vite.dev/guide/ - static SPA tooling and build behavior
- https://developer.mozilla.org/en-US/docs/Web/SVG - DOM-integrated, scalable vector graphics
- https://www.w3.org/WAI/WCAG22/quickref/ - semantic, keyboard, color, focus, and motion requirements
- `docs/PRD.md` - domain functions, data model, flow, and deployment constraints

---
*Architecture research for: interactive educational search-engine visualization*
*Researched: 2026-06-14*
