# Phase 1: Guided Classroom Shell - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-06-14
**Phase:** 1-Guided Classroom Shell
**Areas discussed:** Panel layout and visual hierarchy, scenario switching and reset, lesson navigation, document editing experience

---

## Panel Layout and Visual Hierarchy

| Question | Options considered | Selected |
|----------|--------------------|----------|
| Dominant panel | Visualization center stage; equal columns; explanation center stage | Visualization center stage |
| Explanation location | Center panel; right panel | Center panel |
| Overflow behavior | Whole-page scroll; independent panel scrolling; fit without scrolling | Whole-page vertical scroll |
| Visual tone | Bright instructional workspace; playful student interface; technical debugging console | Bright instructional workspace |

**Notes:** Inputs remain left, explanations and controls remain center, and visualization remains right. The user considered this area complete after four questions.

---

## Scenario Switching and Reset

| Question | Options considered | Selected |
|----------|--------------------|----------|
| Edits on scenario switch | Discard immediately; confirm; preserve per scenario | Discard immediately |
| Reset scope | Entire scenario; text and step only; separate reset actions | Entire scenario |
| Reset confirmation | Only after edits; always; never | Only after edits |
| Position after scenario switch | Setup/start; current step; remembered per scenario | Setup/start |

**Notes:** Switching scenarios is intentionally fast for classroom use. Reset protection applies only when editable content changed.

---

## Lesson Navigation

| Question | Options considered | Selected |
|----------|--------------------|----------|
| Start behavior | Enter first lesson step; remain on setup; use Next instead | Enter first lesson step |
| Progress display | Step number/title/bar; clickable list; labeled dots | Step number, title, and progress bar |
| Direct step access | Sequential only; completed steps clickable; all steps clickable | Sequential only |
| Boundary behavior | Visible disabled controls; hidden controls; active controls with message | Visible disabled controls |

**Notes:** The user accepted the guided linear sequence without additional navigation questions.

---

## Document Editing Experience

| Question | Options considered | Selected |
|----------|--------------------|----------|
| Document presentation | Compact numbered cards; spreadsheet-like list; expandable cards | Compact numbered cards |
| Editor sizing | Bounded auto-grow; fixed two lines; fixed four lines | Bounded auto-grow |
| Edit indication | Panel-level status; per-field badges; no indicator | Panel-level `Edited` status |
| Collection controls | Fixed documents; add only; add and remove | Fixed documents |

**Notes:** The user explicitly requested extensible code despite fixed Phase 1 controls. The scenario model and reducer must not assume a hard-coded document count.

## Agent's Discretion

- Exact layout ratios, spacing, typography, colors, card details, textarea maximum height, dialog style, and progress styling.

## Deferred Ideas

- Add/remove document controls may be introduced later; Phase 1 prepares the internal model but does not expose the capability.
