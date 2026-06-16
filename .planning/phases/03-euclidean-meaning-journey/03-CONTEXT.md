# Phase 3: Euclidean Meaning Journey - Context

**Gathered:** 2026-06-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Bridge from keyword search limitations to curated 2D vectors and distance-based semantic ranking. Students must be able to inspect a worked scenario where keyword search misses a relevant document, visualize the query and documents plotted on a 2D meaning map (with accessible labels and coordinates table), see Euclidean distance lines from the query to all documents, inspect step-by-step substitution calculations for Euclidean distance, and view documents ranked by smallest distance. If they edit the query or document text, a clear notice must explain that semantic vectors remain fixed default coordinates.

</domain>

<decisions>
## Implementation Decisions

### Meaning Map Visualization
- **D-01:** Stick with Option 2 (Generic 'Dimension 1' and 'Dimension 2') universally as axis labels to prevent confusion when text is edited.
- **D-02:** Use a Star symbol for the Query and Circle symbols for Documents, both with text labels (e.g. 'Query', 'D1', 'D2') embedded or adjacent for accessibility.
- **D-03:** Major grid lines every 0.2 units (0.0, 0.2, 0.4, 0.6, 0.8, 1.0) with tick labels on both axes to help students read coordinates easily.

### Euclidean Distance Display
- **D-04:** Draw dashed lines from the query point to all document points, but do not display distance text labels on the map itself (distances are shown in the side panel/table instead) to keep the map clean and prevent text overlapping.
- **D-05:** Detailed substitution breakdown: For each document, show the math step-by-step (e.g., `d = √((0.80 - 0.90)² + (0.70 - 0.80)²) = √(0.01 + 0.01) = √0.02 = 0.141`) when the document is inspected or selected.
- **D-06:** Explicitly label the ranks with proximity descriptors, e.g., 'Rank 1 (Closest)' at the top, and 'Rank 7 (Furthest)' at the bottom, alongside the distance.

### Static Vector Edit Notice
- **D-07:** Friendly inline alert in the Visualization Panel: Show a noticeable alert box at the top of the `meaning-vectors` and `semantic-ranking` step visualizations explaining that vectors remain static because there is no live AI/embedding backend.
- **D-08:** Conditional visibility: Display the notice ONLY when the scenario has been edited (`isEdited` is true) to keep the default interface clean.

### Keyword-Limitation Guidance
- **D-09:** Dynamic guidance + recommendation: Show a clear explanation based on the active scenario. If they are not on the 'Keyword Search Misses Meaning' scenario, show a friendly tip suggesting they switch to it for the best worked example.
- **D-10:** Highlight missed documents in the list: Show a list of documents where documents with a keyword score of 0 (but high semantic relevance) are highlighted with a border/warning icon and text explanation (e.g., `Score: 0.000 (Missed synonym: iPhone vs phone)`).

### the agent's Discretion
- Exact styling of the star and circle SVG markers, SVG colors and contrast levels (must meet projector guidelines), alert box colors and icons, and layout of the step-by-step substitution display.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product Scope and Constraints
- [.planning/PROJECT.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/.planning/PROJECT.md) — Project requirements, desktop/projector viewport limits, accessibility guidelines, and core values.
- [.planning/REQUIREMENTS.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/.planning/REQUIREMENTS.md) — Key requirements SCEN-05 and SEMA-01 through SEMA-05 mapping.
- [.planning/ROADMAP.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/.planning/ROADMAP.md) — Phase 3 goals, success criteria, and plans list.

### Original Product Definition
- [docs/PRD.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/docs/PRD.md) — PRD sections on guided flow, default dataset, meaning vector calculations, and step-by-step requirements (Steps 7 through 9).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- [src/domain/simulation.ts](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/domain/simulation.ts) — Holds the active step ID, reducer action handlers, and simulation session state. All new calculation helpers must be pure and testable here.
- [src/features/visualization-panel/VisualizationPanel.tsx](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/features/visualization-panel/VisualizationPanel.tsx) — Entry point to render step-specific visual components.
- [src/components/ui](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/components/ui) — Ready-made components: Card, Badge, Progress, Select, Textarea.

### Established Patterns
- Reducer-based simulation session state: components read state derived from pure model selectors.
- Strict screen-reader announcements using `announcement` live regions for transitions and updates.
- Centralized snapshot calculations in the domain engine (similar to `buildKeywordSnapshot` from Phase 2).

### Integration Points
- Extend [src/domain/simulation.ts](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/domain/simulation.ts) with pure Euclidean distance calculations, semantic ranking logic, and coordinate snapshots.
- Add new steps to [VisualizationPanel.tsx](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/features/visualization-panel/VisualizationPanel.tsx): `keyword-limitation`, `meaning-vectors`, and `semantic-ranking`.

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

*Phase: 3-Euclidean Meaning Journey*
*Context gathered: 2026-06-16*
