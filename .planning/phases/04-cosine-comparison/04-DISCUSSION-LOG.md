# Phase 4: Cosine Comparison - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-18
**Phase:** 4-Cosine Comparison
**Areas discussed:** Metric Toggle Placement & Interaction, Meaning Map Visuals for Cosine Similarity, Mathematical Breakdown Detail Level

---

## Metric Toggle Placement & Interaction

| Option | Description | Selected |
|--------|-------------|----------|
| Option 1 (Recommended) | State-backed toggle inside the Visualization Panel (persists across step navigation) | ✓ |
| Option 2 | Local React state toggle (resets when steps change) | |
| Option 3 | Input Panel toggle (placed below the scenario selector) | |

**User's choice:** Option 1 (Recommended)
**Notes:** Proceeded with the recommended approach to store `semanticMetric` in `SimulationSession` reducer state.

---

## Meaning Map Visuals for Cosine Similarity

| Option | Description | Selected |
|--------|-------------|----------|
| Option 1 (Recommended) | Origin-connecting rays (Vector lines from (0,0) to points) | ✓ |
| Option 2 | Clean map (No lines) | |
| Option 3 | Faded Euclidean lines | |

**User's choice:** Option 1 (Recommended)
**Notes:** Proceeded with the recommended approach to draw dashed lines from (0,0) to represent vectors when Cosine Similarity is active.

---

## Mathematical Breakdown Detail Level

| Option | Description | Selected |
|--------|-------------|----------|
| Option 1 (Recommended) | Step-by-step component breakdown (Formula, Dot Product, Query Length, Doc Length, Final Sim) | ✓ |
| Option 2 | Simplified breakdown (direct substitution) | |
| Option 3 | Conceptual explanation with math on demand | |

**User's choice:** Option 1 (Recommended)
**Notes:** Proceeded with the recommended approach to match the detailed layout of the Euclidean breakdown card.

---

## The Agent's Discretion

- Exact visual style of the toggle switch.
- Stroke width and styling of origin-connecting rays.
- Math layout and rendering alignment.

---

## Deferred Ideas

- None.
