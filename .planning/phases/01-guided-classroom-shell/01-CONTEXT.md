# Phase 1: Guided Classroom Shell - Context

**Gathered:** 2026-06-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the first usable static classroom shell: users can select a built-in scenario, edit its query and fixed document set, start and navigate a registered sequence of placeholder-backed lesson steps, see progress, and reset safely. Keyword and semantic calculations and their finished visualizations belong to later phases.

</domain>

<decisions>
## Implementation Decisions

### Panel Layout and Visual Hierarchy
- **D-01:** Use a three-panel desktop/projector layout with the visualization panel receiving the most width.
- **D-02:** Keep inputs and documents on the left, step explanation and controls in the center, and visualization on the right.
- **D-03:** Use whole-page vertical scrolling rather than independently scrolling panels or shrinking all content to fit.
- **D-04:** Use a bright instructional-workspace tone: light surfaces, strong projector-safe contrast, restrained educational accent colors, and minimal decoration.

### Scenario Switching and Reset
- **D-05:** Selecting another scenario switches immediately and discards edits from the previous scenario without confirmation.
- **D-06:** Scenario selection always returns the lesson to the setup/start position.
- **D-07:** Reset restores the selected scenario's complete immutable defaults, including query, documents, vectors, and starting step.
- **D-08:** Reset requires confirmation only when query or document content has been edited; an unchanged scenario resets immediately.

### Lesson Navigation
- **D-09:** `Start Search` moves directly from setup to the first registered lesson step.
- **D-10:** Show progress through a step number, current step title, and progress bar.
- **D-11:** Phase 1 navigation is sequential through Previous and Next; step indicators are not direct-navigation controls.
- **D-12:** Keep boundary controls visible but disabled with clear labels when no previous or next registered step exists.

### Document Editing Experience
- **D-13:** Present documents as compact numbered cards with stable identities and clear field boundaries.
- **D-14:** Document textareas auto-grow up to a sensible maximum before the page continues scrolling.
- **D-15:** Show one panel-level `Edited` status and Reset action rather than a changed badge on every field.
- **D-16:** Phase 1 exposes a fixed scenario-owned document collection and does not provide add/remove controls.
- **D-17:** Do not hard-code the document count into the scenario model, reducer, rendering, or reset logic. The internal design must allow later add/remove support without restructuring state.

### Agent's Discretion
- Exact panel width ratios, spacing scale, typography choices, accent palette, card styling, textarea growth limit, confirmation-dialog presentation, and progress-bar styling may be chosen during design and planning, provided they honor projector readability and the decisions above.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product Scope and Constraints
- `.planning/PROJECT.md` — Core value, target users, fixed desktop/projector constraint, accessibility constraints, and project-level decisions.
- `.planning/REQUIREMENTS.md` — Phase 1 requirement definitions and v1/v2 scope boundaries.
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, requirement mapping, and planned work breakdown.

### Original Product Definition
- `docs/PRD.md` — Canonical classroom flow, three-panel concept, default dataset, instructional tone, and source product acceptance criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None. The repository currently contains planning and product documents but no application source code.

### Established Patterns
- No implementation conventions have been established yet.
- The approved stack is React, TypeScript, Vite, Tailwind CSS, and local browser state; Phase 1 establishes the initial project patterns.

### Integration Points
- Phase 1 must create the application scaffold, typed scenario boundary, immutable scenario defaults, reducer-driven simulation controller, step registry, and the initial three-panel shell consumed by later phases.
- The step registry must support placeholder content now and concrete keyword and semantic step views in later phases without replacing navigation state.

</code_context>

<specifics>
## Specific Ideas

- The experience should resemble a bright instructional debugging workspace rather than a playful game or dark technical console.
- The visualization should be the visual focal point even though Phase 1 initially renders placeholder-backed registered steps.
- Fixed documents are a Phase 1 UI restriction, not a fixed-length domain-model assumption.

</specifics>

<deferred>
## Deferred Ideas

- Document add/remove controls remain outside Phase 1. The internal model should make that capability straightforward to add in a later phase.

</deferred>

---

*Phase: 1-Guided Classroom Shell*
*Context gathered: 2026-06-14*
