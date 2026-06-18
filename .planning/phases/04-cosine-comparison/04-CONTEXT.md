# Phase 4: Cosine Comparison - Context

**Gathered:** 2026-06-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Cosine Similarity calculation and metric switching to the semantic search journey. Users must be able to inspect cosine similarity values for every document and see results ranked by highest similarity. A state-backed metric toggle must let users switch between Euclidean distance and cosine similarity without losing session progress (like scenario selection or edited text). The details panel must show a step-by-step mathematical breakdown of the cosine calculation (Formula, Dot Product, Query Length, Document Length, and Final Similarity). The Meaning Map must update dynamically: in Cosine mode, Euclidean direct lines are hidden, replaced by dashed origin-connecting rays to visually represent direction vectors. Finally, unit tests must cover the new calculations (cosine similarity and rankings) and the complete engine logic.

</domain>

<decisions>
## Implementation Decisions

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

### The Agent's Discretion
- Exact styling of the toggle switch/segmented control, exact stroke width and color of the origin rays, and the layout alignment of the cosine mathematical steps.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product Scope and Constraints
- [.planning/PROJECT.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/.planning/PROJECT.md) — Viewport limits, projector design guidelines, and out-of-scope details (e.g., dedicated angle visualizations are out of scope).
- [.planning/REQUIREMENTS.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/.planning/REQUIREMENTS.md) — Mapping for SEMA-06, SEMA-07, SEMA-08, and QUAL-04.
- [.planning/ROADMAP.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/.planning/ROADMAP.md) — Phase 4 goals, success criteria, and list of plans.

### Original Product Definition
- [docs/PRD.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/docs/PRD.md) — PRD sections on semantic metric toggle, cosine calculations, and expected formulas.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- [src/domain/simulation.ts](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/domain/simulation.ts) — Contains state management, session selectors, snapshot builders, and existing Euclidean distance formulas.
- [src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx) — Main visual step components for semantic rankings, including the interactive SVG meaning map and math breakdowns.

### Established Patterns
- Centralized snapshots computed on changes to query or documents using React `useMemo` hooks in `src/App.tsx`.
- Math rendering using string sanitization/substitution (e.g., replacing LaTeX codes like `\sqrt{}` with custom unicode counterparts like `√( )`).

### Integration Points
- Update `SimulationSession` and `simulationReducer` in [simulation.ts](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/domain/simulation.ts) to track and toggle `'euclidean' | 'cosine'`.
- Add cosine similarity, ranking, and breakdown computation to `buildSemanticSnapshot`.
- Add toggle control and conditional origin rays/breakdown panels to `SemanticVisualizationSteps.tsx`.

</code_context>

<specifics>
## Specific Ideas

- None — discussion stayed within phase scope.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 4-Cosine Comparison*
*Context gathered: 2026-06-18*
