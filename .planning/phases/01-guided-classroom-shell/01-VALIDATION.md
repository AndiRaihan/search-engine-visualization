---
phase: 1
slug: guided-classroom-shell
status: verified
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-14
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x with React Testing Library and user-event |
| **Config file** | `vite.config.ts` and `src/test/setup.ts` — Wave 0 creates |
| **Quick run command** | `npm run test -- --run` |
| **Full suite command** | `npm run test -- --run && npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- --run`
- **After every plan wave:** Run `npm run test -- --run && npm run build`
- **Before `$gsd-verify-work`:** Full suite must be green and the projector-readability check must pass
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | QUAL-06 | T-01-02 | Package versions and sources are verified before installation | build smoke | `npm run build` | ✅ | ✅ green |
| 01-01-02 | 01 | 1 | QUAL-02 | N/A | Projector-safe tokens preserve readable contrast and visible focus | build + manual | `npm run build` | ✅ | ✅ green |
| 01-02-01 | 02 | 1 | SCEN-01, SCEN-04 | T-01-01 | Scenario defaults remain immutable and user text is treated as plain text | unit | `npm run test -- --run src/domain/simulation.test.ts` | ✅ | ✅ green |
| 01-02-02 | 02 | 1 | FLOW-02, FLOW-03 | N/A | Reducer bounds prevent navigation outside the registered sequence | unit | `npm run test -- --run src/domain/simulation.test.ts` | ✅ | ✅ green |
| 01-03-01 | 03 | 2 | SCEN-01, SCEN-02, SCEN-03 | T-01-01 | Edited content is rendered as text and updates only the selected field | component | `npm run test -- --run src/features/input-panel` | ✅ | ✅ green |
| 01-03-02 | 03 | 2 | SCEN-04 | T-01-03 | Reset confirmation is keyboard operable and only appears for edited content | component | `npm run test -- --run src/features/lesson-panel/ResetFlow.test.tsx` | ✅ | ✅ green |
| 01-03-03 | 03 | 2 | FLOW-01, FLOW-02, FLOW-03, FLOW-04 | N/A | Navigation labels, disabled boundaries, and progress remain synchronized | component | `npm run test -- --run src/features/lesson-panel` | ✅ | ✅ green |
| 01-03-04 | 03 | 2 | QUAL-02, QUAL-06 | N/A | Complete shell remains readable and produces a backend-free static bundle | full suite | `npm run test -- --run && npm run build` | ✅ | ✅ green |

Threat references for plan threat models:

- **T-01-01:** User-edited query or document text rendered as raw HTML.
- **T-01-02:** Unverified or unexpectedly recent frontend package versions.
- **T-01-03:** Reset confirmation loses focus or blocks keyboard users.

*Status: ⬜ pending · ✅ green · ❌ red · ⚠ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` — scripts for `dev`, `build`, and non-watch `test`
- [ ] `vite.config.ts` — React, Tailwind Vite plugin, and Vitest DOM configuration
- [ ] `src/test/setup.ts` — shared DOM test setup
- [ ] `src/domain/session/sessionReducer.test.ts` — scenario reset and navigation-boundary coverage
- [ ] `src/features/input-panel/*.test.tsx` — scenario, query, and document editing coverage
- [ ] `src/features/lesson-panel/*.test.tsx` — start, navigation, progress, and reset-confirmation coverage
- [ ] Manual validation checklist for contrast, focus order, disabled-state clarity, and projector readability

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Three-panel shell is legible on the supported desktop/projector viewport | QUAL-02 | Projector distance, visual hierarchy, and practical text density are not established by unit tests | Run the production build at the supported viewport, inspect from classroom viewing distance, and confirm readable text, clear panel hierarchy, visible focus, and understandable disabled states without relying on color alone |
| Reset confirmation manages focus correctly in the supported browser | SCEN-04 | Component tests cannot fully establish native browser dialog and focus behavior | Edit the query, invoke Reset by keyboard, verify focus enters the confirmation, cancel and confirm paths restore sensible focus, then verify an unchanged scenario resets without prompting |

---

## Validation Sign-Off

- [x] All tasks have automated verification or explicit Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verification
- [x] Wave 0 covers all missing test and configuration references
- [x] No watch-mode flags are used in verification commands
- [x] Feedback latency remains below 60 seconds
- [x] Full suite and static production build pass
- [x] Manual projector and dialog checks pass
- [x] `nyquist_compliant: true` is set in frontmatter

**Approval:** verified 2026-06-15
