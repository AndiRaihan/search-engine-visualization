# Phase 5 Research

## Phase Summary

Phase 5 should be planned as a thin integration layer on top of the existing Phase 1-3 shell, not as a rewrite. The app already has a stable step registry, reducer-backed Previous/Next navigation, keyword ranking snapshots, Euclidean semantic ranking, focus restoration, live announcements, unit coverage, and a passing static build pipeline. The missing work is concentrated in three places: a real `final-comparison` visualization, a keyboard and Run All command layer, and browser-level smoke coverage. [CITED: .planning/ROADMAP.md] [CITED: src/domain/simulation.ts] [CITED: src/App.tsx] [CITED: package.json] [CITED: local command `npm test -- --run` on 2026-06-19] [CITED: local command `npm run build` on 2026-06-19]

Phase 5 also depends on unexecuted Phase 4 behavior. The live code has no `semanticMetric` state, no cosine calculation path, and no metric-aware final comparison UI yet, even though Phase 4 context and UI artifacts assume they will exist before Phase 5 starts. The Phase 5 plan should therefore begin with an explicit dependency checkpoint against the delivered Phase 4 shape before building comparison UI on top of it. [CITED: .planning/STATE.md] [CITED: .planning/phases/04-cosine-comparison/04-CONTEXT.md] [CITED: .planning/phases/04-cosine-comparison/04-UI-SPEC.md] [CITED: src/domain/simulation.ts] [CITED: src/features/visualization-panel/VisualizationPanel.tsx]

## Source Facts

- Phase 5 must satisfy `FLOW-05`, `FLOW-06`, `COMP-01`, `COMP-02`, `COMP-03`, `QUAL-01`, `QUAL-03`, and `QUAL-05`, with success criteria centered on Run All, keyboard controls, side-by-side comparison, non-color rank movement cues, reduced motion, and browser smoke coverage. [CITED: .planning/ROADMAP.md] [CITED: .planning/REQUIREMENTS.md]
- Project state is still "Ready to advance to Phase 4"; no Phase 4 code is recorded as executed in roadmap/state artifacts. [CITED: .planning/ROADMAP.md] [CITED: .planning/STATE.md]
- `src/domain/simulation.ts` already defines the full step list through `final-comparison`, reducer actions for `started`, `nextStep`, `previousStep`, and reset flows, plus centralized `buildKeywordSnapshot` and `buildSemanticSnapshot` selectors. [CITED: src/domain/simulation.ts]
- `src/content/lessonSteps.ts` already registers `final-comparison`, but only as copy; there is no dedicated comparison component behind it. [CITED: src/content/lessonSteps.ts] [CITED: src/features/visualization-panel/VisualizationPanel.tsx]
- `src/App.tsx` centralizes derived snapshots with `useMemo`, owns focus movement on scenario/step changes, and exposes an `aria-live="polite"` region for announcements. [CITED: src/App.tsx]
- `src/features/lesson-panel/LessonPanel.tsx` currently exposes `Start Search`, `Previous step`, and `Next step` buttons only. There is no Run All button, no shortcut legend, and no keyboard command handler in the reviewed app shell. [CITED: src/features/lesson-panel/LessonPanel.tsx] [CITED: src/App.tsx]
- `src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx` already supports Euclidean-only meaning vectors, distance lines, ranked semantic list selection, and an Euclidean breakdown card. There is no metric toggle, cosine rendering, or side-by-side comparison surface in live code. [CITED: src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx] [CITED: src/domain/simulation.ts]
- `src/index.css` already contains a global `prefers-reduced-motion: reduce` rule that suppresses transition and animation duration, so Phase 5 mainly needs to avoid introducing motion-heavy new behaviors that bypass that rule. [CITED: src/index.css]
- Current automated verification is Vitest-only: `package.json` exposes `test`, but no Playwright dependency or browser smoke script is installed yet. [CITED: package.json]
- Current automated verification passes: `npm test -- --run` succeeded with 64 tests across app, domain, lesson-panel, and visualization-panel coverage. [CITED: local command `npm test -- --run` on 2026-06-19]
- Current static release path passes: `npm run build` succeeded and emitted a Vite `dist/` bundle. [CITED: local command `npm run build` on 2026-06-19]

## Existing Patterns

- Navigation state belongs in the reducer/session layer in [`src/domain/simulation.ts`](src/domain/simulation.ts), while actual button wiring lives in [`src/App.tsx`](src/App.tsx) and [`src/features/lesson-panel/LessonPanel.tsx`](src/features/lesson-panel/LessonPanel.tsx). Phase 5 should extend that same split for Run All and keyboard-triggered navigation. [CITED: src/domain/simulation.ts] [CITED: src/App.tsx] [CITED: src/features/lesson-panel/LessonPanel.tsx]
- Snapshot computation is already centralized and pure: keyword data comes from `buildKeywordSnapshot`, semantic data from `buildSemanticSnapshot`, and UI reads those snapshots without duplicating math. Final comparison should follow the same pattern by deriving a comparison model from existing ranked outputs instead of recalculating ranking logic inside React components. [CITED: src/domain/simulation.ts] [CITED: src/App.tsx]
- Visualization step routing is currently a single switch inside [`src/features/visualization-panel/VisualizationPanel.tsx`](src/features/visualization-panel/VisualizationPanel.tsx). That makes Phase 5 straightforward: add a dedicated `FinalComparisonStep` branch instead of expanding the placeholder path. [CITED: src/features/visualization-panel/VisualizationPanel.tsx]
- Semantic selection patterns already exist: `SemanticRankingStep` keeps a selected document id, passes it into the map/list, and swaps detail panels from that single state value. The final comparison can reuse that pattern for a selected document detail or explanation region. [CITED: src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx]
- Focus and announcement patterns already exist in [`src/App.tsx`](src/App.tsx) and reset tests. Phase 5 should reuse them rather than inventing component-local focus tricks. [CITED: src/App.tsx] [CITED: src/features/lesson-panel/ResetFlow.test.tsx]

## Implementation Recommendations

- Build a dedicated `FinalComparisonStep` under `src/features/visualization-panel/` or `src/features/visualization-panel/semantic-steps/` and route `final-comparison` to it from [`src/features/visualization-panel/VisualizationPanel.tsx`](src/features/visualization-panel/VisualizationPanel.tsx). The component should consume existing keyword ranked documents and selected semantic ranked documents side by side instead of introducing a third ranking algorithm. [CITED: src/features/visualization-panel/VisualizationPanel.tsx] [CITED: src/domain/simulation.ts]
- Add a pure comparison selector in [`src/domain/simulation.ts`](src/domain/simulation.ts) that joins documents by `id` and returns: keyword rank, semantic rank, signed movement delta, movement direction, and the existing keyword/semantic explanation payloads. This keeps `COMP-01` to `COMP-03` testable without React. [ASSUMED]
- Represent rank movement with text-first cues such as `Moved up 2`, `Moved down 1`, or `No change`, optionally paired with icons/arrows. Do not rely on color-only emphasis. Keep the document label stable as `D{n}` so students can scan both columns quickly. [CITED: .planning/REQUIREMENTS.md] [ASSUMED]
- Keep the final comparison metric-aware. Phase 4 artifacts expect the semantic metric toggle to exist on `final-comparison`, so Phase 5 should read the delivered Phase 4 state and labels instead of hard-coding Euclidean copy. [CITED: .planning/phases/04-cosine-comparison/04-CONTEXT.md] [CITED: .planning/phases/04-cosine-comparison/04-UI-SPEC.md] [ASSUMED]
- Implement Run All as app-level navigation behavior, not as visualization-local state. The simplest fit is reducer-backed or `App.tsx`-backed progression that advances until `final-comparison`, cancels on manual navigation/reset/scenario change, and announces completion through the existing live region. [CITED: src/App.tsx] [CITED: src/domain/simulation.ts] [ASSUMED]
- Prefer modified keyboard shortcuts that do not conflict with typing in the query/doc textareas. A practical mapping is `Alt+ArrowLeft` for Previous, `Alt+ArrowRight` for Next, and `Alt+Shift+ArrowRight` for Run All, documented beside the controls and ignored while focus is inside editable fields unless the same buttons are focused directly. [CITED: src/App.tsx] [CITED: .planning/REQUIREMENTS.md] [ASSUMED]
- Reuse current heading-focus behavior on step changes. On Run All completion, move focus once to the final-comparison heading and announce that the lesson is complete; do not force focus on every intermediate auto-advanced step. [CITED: src/App.tsx] [ASSUMED]
- Treat reduced motion as a behavior constraint, not just a CSS token. Any Run All pacing, rank-movement animation, or comparison transition should become instant when reduced motion is preferred. Given `STATE.md` leaves pacing open, the safest default is immediate advancement with no animated replay. [CITED: .planning/STATE.md] [CITED: src/index.css] [ASSUMED]

## Testing and Release Verification

- Keep domain-level comparison logic in [`src/domain/simulation.ts`](src/domain/simulation.ts) and cover it with Vitest alongside the existing keyword and semantic unit suite in [`src/domain/simulation.test.ts`](src/domain/simulation.test.ts). Add tests for rank joining, deterministic movement deltas, and metric-aware explanation selection. [CITED: src/domain/simulation.test.ts] [ASSUMED]
- Extend component/integration coverage in [`src/App.test.tsx`](src/App.test.tsx) and visualization-panel tests for: reaching `final-comparison`, rendering both rankings, showing non-color movement text, and honoring Run All completion/focus behavior. [CITED: src/App.test.tsx] [CITED: src/features/visualization-panel/VisualizationPanel.test.tsx] [CITED: src/features/visualization-panel/SemanticVisualizationSteps.test.tsx] [ASSUMED]
- Add browser smoke coverage with Playwright because `QUAL-05` requires browser-level verification and `package.json` currently has no such layer. Keep it minimal: one happy-path smoke and one interaction/regression smoke are enough if they cover load, scenario selection, query edit, Previous/Next, Run All, reset, metric toggle, and final comparison. [CITED: .planning/REQUIREMENTS.md] [CITED: package.json] [ASSUMED]
- Run smoke tests against the built static app, not only dev mode. Reuse the existing `build` and `preview` scripts from [`package.json`](package.json) so release verification matches the deployed artifact shape. [CITED: package.json] [ASSUMED]
- Release gate for the phase should be: `npm test -- --run`, browser smoke suite green, and `npm run build` green. The build already passes today, so the planning focus is preserving that state while adding Playwright and final comparison UI. [CITED: local command `npm test -- --run` on 2026-06-19] [CITED: local command `npm run build` on 2026-06-19] [ASSUMED]

## Risks and Dependency Assumptions

- Main dependency risk: Phase 4 is not executed yet, and live code has no `semanticMetric`, cosine ranking, cosine explanation model, or final-comparison toggle support. Phase 5 must not assume those APIs until the delivered Phase 4 code is verified. [CITED: .planning/ROADMAP.md] [CITED: .planning/STATE.md] [CITED: src/domain/simulation.ts] [CITED: src/features/visualization-panel/VisualizationPanel.tsx]
- The Phase 4 context/UI artifacts specifically expect metric toggle state in the reducer and visibility on `semantic-ranking` and `final-comparison`. If implementation lands differently, Phase 5 comparison wiring and smoke tests will need to adapt. [CITED: .planning/phases/04-cosine-comparison/04-CONTEXT.md] [CITED: .planning/phases/04-cosine-comparison/04-UI-SPEC.md]
- Browser smoke tooling is missing from the repo today. Adding Playwright is a Phase 5 dependency, not a pre-existing capability. Package legitimacy and exact version selection should be verified at planning or implementation time before installation. [CITED: package.json] [ASSUMED]
- Run All pacing is unresolved in state docs. If the team chooses timed playback instead of immediate completion, the plan must budget for cancellation logic, reduced-motion overrides, and extra browser-test timing stability. [CITED: .planning/STATE.md] [ASSUMED]

## Suggested Plan Breakdown

1. **Comparison model and final step UI**
   - Verify delivered Phase 4 metric state shape first.
   - Add a pure final-comparison selector in `src/domain/simulation.ts`.
   - Replace the `final-comparison` placeholder in `src/features/visualization-panel/VisualizationPanel.tsx` with a dedicated comparison component.
   - Render keyword and semantic rankings side by side with text/icon rank movement cues and explanation details.

2. **Run All, keyboard controls, focus, and reduced motion**
   - Add Run All control to `src/features/lesson-panel/LessonPanel.tsx`.
   - Implement app-level Run All and keyboard shortcut handling in `src/App.tsx` with reducer support if needed.
   - Reuse existing live-region and focus patterns for completion announcements.
   - Make all auto-advance/comparison behavior instant under reduced-motion preference.

3. **Browser smoke and release gate**
   - Add Playwright setup and a minimal static-preview smoke suite.
   - Cover load, scenario switch, edit, Previous/Next, Run All, reset, metric toggle, and final comparison.
   - Keep Vitest coverage for pure comparison logic and run `npm test -- --run` plus `npm run build` as the phase gate.
