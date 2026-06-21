# Phase 5: Final Comparison and Release Readiness - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-21
**Phase:** 05-final-comparison-and-release-readiness
**Areas discussed:** Run All Pacing & Controls, Keyboard Shortcuts Mapping, Rank Movement Representation, Comparison Layout Style

---

## Run All Pacing & Controls

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-play slideshow | Auto-advances with a customizable delay, e.g., 800ms, giving students a visual progression through each step | ✓ |
| Instant completion | Instantly jump straight to the final comparison step without displaying intermediate steps | |
| Toggleable / Configurable | User can choose between instant or slideshow inside the UI | |

**User's choice:** Auto-play slideshow (auto-advances with a customizable delay, e.g., 800ms, giving students a visual progression through each step)
**Notes:** Cancel immediately: Any click on navigation buttons (Previous, Next, Reset) or text edits cancels the autoplay and leaves the user on their current step. Force instant completion: If prefers-reduced-motion is active, skip the step delay entirely and jump straight to the final comparison.

---

## Keyboard Shortcuts Mapping

| Option | Description | Selected |
|--------|-------------|----------|
| Alt+Arrow keys | Alt+ArrowLeft (Previous), Alt+ArrowRight (Next), and Alt+Shift+ArrowRight (Run All) — standard, accessible, and avoids conflicts with cursor movement or typing in text areas | ✓ |
| Letter mnemonics | Alt+P (Previous), Alt+N (Next), and Alt+R (Run All) — letter-based mnemonics, avoids arrow conflicts completely | |
| Standard Arrows | ArrowLeft (Previous) and ArrowRight (Next) globally, but ONLY active when no input or textarea is currently focused | |

**User's choice:** Alt+ArrowLeft (Previous), Alt+ArrowRight (Next), and Alt+Shift+ArrowRight (Run All) — standard, accessible, and avoids conflicts with cursor movement or typing in text areas
**Notes:** Visible Legend: Display a small, persistent text legend or tooltip indicator directly next to the navigation controls in the Lesson Panel.

---

## Rank Movement Representation

| Option | Description | Selected |
|--------|-------------|----------|
| Text delta and arrows | Text delta and arrow icons — e.g., "Moved up 2" with an upward arrow, or "Moved down 1" with a downward arrow, ensuring readability without color reliance. | ✓ |
| Rank badge comparison | Display both the Keyword Rank and Semantic Rank explicitly on the row (e.g., "Keyword Rank: 2, Semantic Rank: 4 (Change: -2)"), relying on numeric changes. | |
| Visual connector lines | Visual connector lines (Bump chart style) — Draw connecting lines across the side-by-side rankings to visually link each document point across the two lists. | |

**User's choice:** Text delta and arrow icons — e.g., "Moved up 2" with an upward arrow, or "Moved down 1" with a downward arrow, ensuring readability without color reliance.
**Notes:** Distinct shapes, symbols, and labels: Upward triangle (▲) for up, downward triangle (▼) for down, and horizontal line (–) for no change, paired with explicit text and high contrast colors.

---

## Comparison Layout Style

| Option | Description | Selected |
|--------|-------------|----------|
| Two side-by-side columns | Two side-by-side ranked columns: Left column for Keyword rankings, Right column for Semantic rankings. Clicking a document highlights it in both lists and displays a detailed comparison card below. | ✓ |
| Combined table | Single combined comparison table: A single unified table with columns for Document ID, Keyword Rank, Semantic Rank, Rank Movement (Delta), and a brief comparison summary. | |

**User's choice:** Two side-by-side ranked columns: Left column for Keyword rankings, Right column for Semantic rankings. Clicking a document highlights it in both lists and displays a detailed comparison card below.
**Notes:** Side-by-side mathematical and scoring evidence: Display the keyword TF-IDF contribution breakdown on the left and the active semantic metric's distance/similarity calculation details on the right.

---

## the agent's Discretion

- Exact styling of the movement symbols (colors, margins), exact CSS animation attributes (complying with reduced-motion), layout positioning of the comparison columns, and the exact markup/styles for the side-by-side mathematical breakdown details.

## Deferred Ideas

- None — discussion stayed within phase scope
