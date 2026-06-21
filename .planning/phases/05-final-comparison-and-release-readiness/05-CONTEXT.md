# Phase 5: Final Comparison and Release Readiness - Context

**Gathered:** 2026-06-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a side-by-side comparison step (`final-comparison`) where students can contrast Keyword and Semantic rankings for the selected scenario, inspect rank changes via accessible indicator deltas, read explanation details comparing both models, navigate using keyboard controls, trigger an autoplay "Run All" sequence, and ensure the entire experience is covered by browser smoke tests and runs as a static site.

</domain>

<decisions>
## Implementation Decisions

### Run All Pacing & Controls
- **D-01:** Run All plays as an autoplay slideshow that auto-advances through the simulation steps with a delay of ~800ms per step.
- **D-02:** Autoplay is cancelled immediately if the user interacts with any manual navigation button (Previous, Next, Reset) or edits text in any query/document textarea. The user is left on their current step.
- **D-03:** If `prefers-reduced-motion` is active in the user's browser, Run All skips the step-by-step auto-play delay completely and jumps instantly to the final comparison step.

### Keyboard Shortcuts Mapping
- **D-04:** Keyboard shortcuts are mapped to `Alt+ArrowLeft` for Previous step, `Alt+ArrowRight` for Next step, and `Alt+Shift+ArrowRight` for Run All.
- **D-05:** Document the keyboard shortcuts using a visible legend or tooltip helper directly next to the navigation controls in the Lesson Panel.

### Rank Movement Representation
- **D-06:** Represent rank changes for each document in the side-by-side comparison using a text delta description and arrow icons (e.g., "Moved up 2" or "Moved down 1").
- **D-07:** Use distinct shapes/symbols for the arrow icons to ensure projector readability and accessibility without relying on color alone: upward triangle (▲) for positive movement, downward triangle (▼) for negative movement, and horizontal line (–) for no change.

### Comparison Layout Style
- **D-08:** The final comparison layout consists of two side-by-side columns: Left column for Keyword rankings, Right column for Semantic rankings.
- **D-09:** Clicking a document row highlights that document in both columns and displays a detailed side-by-side comparison card below.
- **D-10:** The detailed comparison card shows side-by-side mathematical and scoring evidence: the keyword TF-IDF contribution breakdown on the left and the active semantic metric's distance/similarity calculations on the right.

### the agent's Discretion
- Exact styling of the movement symbols (colors, margins), exact CSS animation attributes (complying with reduced-motion), layout positioning of the comparison columns, and the exact markup/styles for the side-by-side mathematical breakdown details.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product Scope and Constraints
- [.planning/PROJECT.md](file:///.planning/PROJECT.md) — Viewport limits, projector design guidelines, and out-of-scope details.
- [.planning/REQUIREMENTS.md](file:///.planning/REQUIREMENTS.md) — Mapping for FLOW-05, FLOW-06, COMP-01, COMP-02, COMP-03, QUAL-01, QUAL-03, QUAL-05.
- [.planning/ROADMAP.md](file:///.planning/ROADMAP.md) — Phase 5 goals, success criteria, and list of plans.

### Original Product Definition
- [docs/PRD.md](file:///docs/PRD.md) — PRD sections on side-by-side rankings, keyboard shortcuts, and Run All.

### Prior Phase Context
- [.planning/phases/04-cosine-comparison/04-CONTEXT.md](file:///.planning/phases/04-cosine-comparison/04-CONTEXT.md) — State shape, metric actions, and cosine similarity calculations.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- [src/domain/simulation.ts](file:///src/domain/simulation.ts) — Contains state management, session selectors, snapshot builders, and keyword/semantic calculations.
- [src/App.tsx](file:///src/App.tsx) — App entry point, coordinates navigation, reducer state, focus management, and announcements.
- [src/features/lesson-panel/LessonPanel.tsx](file:///src/features/lesson-panel/LessonPanel.tsx) — Lesson panel controls and buttons.
- [src/features/visualization-panel/VisualizationPanel.tsx](file:///src/features/visualization-panel/VisualizationPanel.tsx) — Visualization routing.
- [src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx](file:///src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx) — Contains semantic step visuals, maps, and list details.

### Established Patterns
- Centralized snapshots computed on changes to query or documents using React `useMemo` hooks in `src/App.tsx`.
- Math rendering using string sanitization/substitution (e.g., replacing LaTeX codes like `\sqrt{}` with custom unicode counterparts like `√( )`).

### Integration Points
- Add a new pure comparison selector in [simulation.ts](file:///src/domain/simulation.ts) that joins documents by `id` and returns: keyword rank, semantic rank, signed movement delta, movement direction, and explanation payloads.
- Replace the placeholder for `final-comparison` in [VisualizationPanel.tsx](file:///src/features/visualization-panel/VisualizationPanel.tsx) with a new `FinalComparisonStep` component.
- Implement the keyboard shortcut listeners and autoplay timer in [App.tsx](file:///src/App.tsx) and expose the relevant callbacks.

</code_context>

<specifics>
## Specific Ideas

- No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-final-comparison-and-release-readiness*
*Context gathered: 2026-06-21*
