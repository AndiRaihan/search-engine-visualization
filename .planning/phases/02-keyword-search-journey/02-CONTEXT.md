# Phase 2: Keyword Search Journey - Context

**Gathered:** 2026-06-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a complete step-by-step keyword-search visual simulation. Students must be able to step through tokenization, word matching, TF, IDF, TF-IDF, and keyword ranking. The interface must show normalized tokens, visible term counts, rounded intermediate calculation values, clear visual cues for term strength, and ranked results with detailed explanations that update instantly when the query or documents are edited.

</domain>

<decisions>
## Implementation Decisions

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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product Scope and Constraints
- [.planning/PROJECT.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/.planning/PROJECT.md) — Project requirements, desktop/projector viewport limits, accessibility guidelines, and core values.
- [.planning/REQUIREMENTS.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/.planning/REQUIREMENTS.md) — Key requirements KEYW-01 through KEYW-08 mapping.
- [.planning/ROADMAP.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/.planning/ROADMAP.md) — Phase 2 goals, success criteria, and plans list.

### Original Product Definition
- [docs/PRD.md](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/docs/PRD.md) — PRD sections on guided flow, default dataset, TF-IDF formulas, step-by-step requirements (Steps 1 through 6).

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

### Integration Points
- Implement pure keyword pipeline functions (tokenization, TF, DF, IDF, TF-IDF, ranking) in [src/domain/simulation.ts](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/domain/simulation.ts).
- Update the right panel [src/features/visualization-panel/VisualizationPanel.tsx](file:///c:/Tugas%20Raihan/Latihan%20Python/search_engine_visualization/src/features/visualization-panel/VisualizationPanel.tsx) to render the keyword steps dynamically using derived calculations from the active session.

</code_context>

<specifics>
## Specific Ideas
- High school students should be able to reproduce calculations manually. Hence, we use natural log and relative TF.
- All floating point values (TF, IDF, TF-IDF, document scores) must round to three decimal places in the display tables to keep math inspection clear.

</specifics>

<deferred>
## Deferred Ideas
- None — discussion stayed within phase scope

</deferred>

---

*Phase: 2-Keyword Search Journey*
*Context gathered: 2026-06-15*
