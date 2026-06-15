---
phase: 2
slug: keyword-search-journey
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-15
---

# Phase 2 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.9 with React Testing Library in jsdom |
| **Config file** | `vite.config.ts` |
| **Quick run command** | `npm test -- --run src/domain/simulation.test.ts` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run src/domain/simulation.test.ts`
- **After every plan wave:** Run `npm test -- --run`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | KEYW-01 | T-02-01 | Edited text remains plain text and tokenization returns lowercase punctuation-split tokens | unit | `npm test -- --run src/domain/simulation.test.ts` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | KEYW-03, KEYW-04 | T-02-02 | Empty documents and missing terms produce finite zero values, never `NaN` or `Infinity` | unit | `npm test -- --run src/domain/simulation.test.ts` | ✅ | ⬜ pending |
| 02-01-03 | 01 | 1 | KEYW-06, KEYW-07 | T-02-02 | TF-IDF scores retain full precision for sorting and use original document index for ties | unit | `npm test -- --run src/domain/simulation.test.ts` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 2 | KEYW-01, KEYW-02 | T-02-01 | Query and document text is rendered through React text nodes with matched and missing labels | component | `npm test -- --run src/features/visualization-panel/VisualizationPanel.test.tsx` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | KEYW-03, KEYW-04, KEYW-05 | T-02-02 | Tables show exactly three decimals and importance uses visible text plus icons, not color alone | component | `npm test -- --run src/features/visualization-panel/VisualizationPanel.test.tsx` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 3 | KEYW-06 | T-02-02 | Visible term contributions sum to each document's raw keyword score | unit + component | `npm test -- --run src/domain/simulation.test.ts src/features/visualization-panel/VisualizationPanel.test.tsx` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 3 | KEYW-07 | T-02-02 | Ranking order uses raw scores and stable original-index tie handling while displaying three decimals | unit + component | `npm test -- --run src/domain/simulation.test.ts src/features/visualization-panel/VisualizationPanel.test.tsx` | ❌ W0 | ⬜ pending |
| 02-03-03 | 03 | 3 | KEYW-08 | T-02-01 | Explanations are generated from escaped visible contributions and update after query or document edits | integration | `npm test -- --run src/App.test.tsx src/features/visualization-panel/VisualizationPanel.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠ flaky*

---

## Wave 0 Requirements

- [ ] Expand `src/domain/simulation.test.ts` with tokenization, relative TF, document frequency, unsmoothed IDF, TF-IDF, score summation, empty-input, full-precision ranking, and stable tie-break fixtures.
- [ ] Add `src/features/visualization-panel/VisualizationPanel.test.tsx` for token pills, match/miss summaries, three-decimal tables, rare/common text badges, score bars, ranking order, and explanations.
- [ ] Add or extend `src/App.test.tsx` with an edit-driven regression proving visible calculations and explanations update from the active session.
- [ ] Add a shared test helper for constructing a `SimulationSession` at a selected keyword step without duplicating reducer setup.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Calculation tables, token groups, badges, and ranking cards remain readable on the supported desktop/projector viewport | KEYW-01 through KEYW-08 | Projector legibility and visual density require human inspection | Run `npm run dev`, inspect all six keyword steps at the supported viewport, and confirm no clipped labels, unreadable values, or horizontal page overflow |
| Importance and match states remain understandable without color | KEYW-02, KEYW-05 | Automated tests can verify labels/icons but not the complete visual hierarchy | Inspect matched/missing pills and rare/common badges in grayscale and confirm text, border style, and icons preserve meaning |

---

## Threat References

| Threat | Risk | Required Mitigation |
|--------|------|---------------------|
| T-02-01 | User-edited query or document text is inserted into an unsafe HTML context | Render tokens and explanations as React text/elements; do not use `dangerouslySetInnerHTML` or string-built markup |
| T-02-02 | Empty or large inputs cause invalid arithmetic or excessive repeated calculation | Guard zero denominators and `df = 0`, centralize one pure snapshot, and keep every displayed numeric value finite |

---

## Validation Sign-Off

- [x] All tasks have automated verification or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all missing references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-06-15
