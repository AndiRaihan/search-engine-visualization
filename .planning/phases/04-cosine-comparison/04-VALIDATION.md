---
phase: 04
slug: cosine-comparison
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-19
---

# Phase 04 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest with React Testing Library |
| **Config file** | `vite.config.ts` with `test.environment = 'jsdom'` and `setupFiles = './src/test/setup.ts'` |
| **Quick run command** | `npm test -- --run src/domain/simulation.test.ts -t "semantic|euclidean|cosine"` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run src/domain/simulation.test.ts -t "semantic|euclidean|cosine"` for domain changes, or the narrow component/app test named in the task.
- **After every plan wave:** Run `npm test -- --run`.
- **Before `$gsd-verify-work`:** Full suite must be green.
- **Max feedback latency:** 30 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | SEMA-06, QUAL-04 | T-04-01 | Cosine helpers return finite values and never expose `NaN`/`Infinity` for zero vectors. | unit | `npm test -- --run src/domain/simulation.test.ts -t "cosine"` | ✅ | ✅ green |
| 04-01-02 | 01 | 1 | SEMA-06, QUAL-04 | T-04-02 | Cosine ranking sorts by raw highest similarity with deterministic original-index tie handling. | unit | `npm test -- --run src/domain/simulation.test.ts -t "semantic|cosine|ranking"` | ✅ | ✅ green |
| 04-02-01 | 02 | 2 | SEMA-07 | T-04-03 | The metric toggle updates reducer state without resetting scenario, query, documents, or active progress. | component | `npm test -- --run src/App.test.tsx -t "metric toggle"` | ✅ | ✅ green |
| 04-02-02 | 02 | 2 | SEMA-08 | T-04-04 | Ranking labels, explanations, and selected-document breakdowns cite the active metric. | component | `npm test -- --run src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "cosine breakdown|metric explanation"` | ✅ | ✅ green |
| 04-02-03 | 02 | 2 | SEMA-07, SEMA-08 | T-04-05 | Final-comparison renders the shared metric toggle even before Phase 5 comparison content is implemented. | component | `npm test -- --run src/features/visualization-panel/VisualizationPanel.test.tsx -t "final-comparison"` | ✅ | ✅ green |

*Status: green · red · flaky*

---

## Wave 0 Requirements

- [x] `src/domain/simulation.test.ts` - add cosine similarity, zero-vector guard, descending rank, and deterministic tie tests.
- [x] `src/features/visualization-panel/SemanticVisualizationSteps.test.tsx` - add active-metric labels, origin rays, and cosine breakdown assertions.
- [x] `src/App.test.tsx` - add guided-flow metric persistence coverage.
- [x] `src/features/visualization-panel/VisualizationPanel.test.tsx` - add shared toggle coverage for `final-comparison`.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Projector readability of the toggle and cosine breakdown card | SEMA-07, SEMA-08 | The MVP targets a fixed classroom/projector viewport, and visual density must be inspected alongside automated assertions. | Open the semantic-ranking step at the supported desktop viewport, toggle both modes, and confirm the active state, ranking labels, and math table remain legible without relying on color alone. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all MISSING references.
- [x] No watch-mode flags.
- [x] Feedback latency < 30s.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved
