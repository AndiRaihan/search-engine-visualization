---
phase: 3
slug: euclidean-meaning-journey
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-16
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.9 with React Testing Library and jsdom |
| **Config file** | `vite.config.ts` |
| **Quick run command** | `npm test -- src/domain/simulation.test.ts` for domain work; `npm test -- src/features/visualization-panel/SemanticVisualizationSteps.test.tsx` for semantic UI work |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run the relevant quick command for the edited layer.
- **After every plan wave:** Run `npm test -- --run`.
- **Before `$gsd-verify-work`:** Full suite must be green.
- **Max feedback latency:** 30 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | SCEN-05, SEMA-02 | T-03-01 | Edited text remains React-escaped and vectors remain curated defaults | unit | `npm test -- src/domain/simulation.test.ts -t "semantic"` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | SEMA-05 | T-03-01 | Euclidean rows derive from numeric vectors, not raw user text | unit | `npm test -- src/domain/simulation.test.ts -t "euclidean"` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | SEMA-01 | T-03-01 | User-edited document text is rendered as text, never HTML | component | `npm test -- src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "keyword misses meaning"` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | SEMA-02, SEMA-03 | T-03-02 | SVG labels and table labels derive from the same snapshot payload | component | `npm test -- src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "coordinates table"` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 3 | SEMA-04, SEMA-05 | T-03-02 | Distances are visible in table/list, not hidden in SVG-only state | component | `npm test -- src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "distance lines"` | ❌ W0 | ⬜ pending |
| 03-03-02 | 03 | 3 | SCEN-05, SEMA-05 | T-03-03 | Static-vector notice prevents misleading AI-inference claims after edits | component | `npm test -- src/features/visualization-panel/SemanticVisualizationSteps.test.tsx -t "static vectors notice"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/features/visualization-panel/SemanticVisualizationSteps.test.tsx` — component coverage for SCEN-05 and SEMA-01 through SEMA-04.
- [ ] Extend `src/domain/simulation.test.ts` — Euclidean helper, deterministic ranking, and substitution-breakdown cases for SEMA-05.
- [ ] Add one app-level regression that navigates from keyword ranking into semantic steps and verifies the notice/ranking bridge.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Projector readability of the SVG meaning map and dashed distance lines | SEMA-03, SEMA-04 | Automated DOM tests cannot judge classroom projection legibility | Run the app at the supported desktop/projector viewport and confirm all point labels, axes, grid ticks, and dashed lines are legible without relying on color alone. |
| Student comprehension of the keyword-limitation bridge copy | SEMA-01 | Copy clarity needs human review against the lesson objective | Select the `Keyword Search Misses Meaning` scenario and confirm the missed-document explanation clearly connects low keyword score to semantic proximity. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies.
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify.
- [ ] Wave 0 covers all MISSING references.
- [ ] No watch-mode flags.
- [ ] Feedback latency < 30s.
- [ ] `nyquist_compliant: true` set in frontmatter after Wave 0 passes.

**Approval:** pending
