# Feature Research

**Domain:** Interactive educational search-engine visualization
**Researched:** 2026-06-14
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Guided step navigation | A teaching simulation must control cognitive sequence | MEDIUM | Previous, Next, Start, Run All, and Reset need predictable state |
| Visible source data | Students need to connect calculations to query and documents | LOW | Keep query and all documents present or easily inspectable |
| Editable examples with reset | Exploration requires safe experimentation and recovery | MEDIUM | Changes must recompute every dependent step |
| Intermediate calculations | A final score alone does not teach the process | HIGH | Show counts, denominators, rounded values, and formulas together |
| Multiple coordinated representations | Learners need words, tables, bars, maps, and explanations | HIGH | Every representation must derive from the same values |
| Built-in teaching scenarios | Instructors need reliable demonstrations without setup | MEDIUM | Each scenario should name its intended misconception |
| Clear ranking explanations | Students must understand why order changed | MEDIUM | Use evidence from visible query terms or distances |
| Projector-readable and keyboard-operable UI | Classroom use and accessibility demand it | MEDIUM | Large type, strong contrast, visible focus, non-color cues |
| Deterministic outcomes | Live demonstrations cannot produce surprising changes | LOW | Stable tie-breaking and scenario-owned vectors |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Side-by-side keyword and semantic rankings | Makes the central conceptual difference directly observable | MEDIUM | Highlight movements without implying one universal "correct" ranking |
| "What changed and why" narrative | Turns calculations into causal understanding | MEDIUM | Each step states action, effect, and ranking consequence |
| Debugger-style progression | Encourages active inspection instead of passive reading | MEDIUM | Preserve context while revealing one transformation at a time |
| Scenario-specific misconception callouts | Helps instructors connect examples to lesson goals | LOW | Example: common word noise or missing synonym |
| Dual visual and textual equivalents | Improves accessibility and supports varied learners | MEDIUM | Meaning map needs labels and a distance table |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Real embeddings | Feels authentic | Makes coordinates and ranking opaque and may require services | Manually curated 2D vectors with explicit caveat |
| Combined final score | Produces one neat ranking | Requires arbitrary normalization/weights and hides the lesson | Compare keyword and selected semantic rankings side by side |
| Automatic timed playback | Looks polished in demos | Students lose control of pacing and accessibility suffers | Run All reveals steps with pause/cancel controls or immediate completion |
| Dense formula-first presentation | Appears rigorous | Overloads first-time learners before intuition forms | Plain-language explanation, worked values, then formula |
| Unlimited documents | Feels flexible | Creates clutter and weakens projector readability | Enforce the five-to-ten document teaching range |
| Gamification in MVP | May appear engaging | Distracts from validating the core explanatory flow | Add challenge/quiz modes after classroom validation |

## Feature Dependencies

```text
Scenario data and reset
    -> Pure search calculations
        -> Canonical simulation snapshot
            -> Step visualizations
                -> Keyword ranking
                -> Euclidean and cosine semantic ranking
                    -> Side-by-side final comparison

Accessible semantic structure
    -> Keyboard navigation
    -> Text equivalents for graphics
    -> Reliable UI tests
```

### Dependency Notes

- **All visualizations require pure calculations:** visible values and rankings must be generated from the same tested engine.
- **Run All requires stable navigation state:** it should orchestrate existing steps, not implement a second calculation path.
- **Final comparison requires both ranking pipelines:** keyword and distance results remain distinct rather than being blended.
- **Editable content requires invalidation:** query/document changes must recompute derived statistics and keep the current step coherent.
- **Meaning map requires scenario vectors:** free-form text cannot receive a meaningful toy vector automatically in the MVP.

## MVP Definition

### Launch With (v1)

- [ ] Built-in scenarios with editable query/documents and reliable reset
- [ ] Guided Previous, Next, Start, Run All, and step progress
- [ ] Tokenization and query-word matching views
- [ ] TF, IDF, TF-IDF tables with visible worked calculations
- [ ] Keyword score bars, deterministic ranking, and explanations
- [ ] Keyword-limitation bridge into semantic search
- [ ] Labeled 2D meaning map, Euclidean distance table/lines, cosine values, and a metric toggle
- [ ] Side-by-side keyword and semantic final rankings
- [ ] Fixed desktop/projector layout with keyboard and non-color cues
- [ ] Unit tests for the domain engine and smoke tests for the guided flow

### Add After Validation (v1.x)

- [ ] Instructor presentation mode - add after observing live classroom friction
- [ ] Short concept checkpoints - add after educators validate lesson pacing
- [ ] Indonesian scenarios/localization - add when translation ownership is clear
- [ ] Scenario import/export - add if instructors need reusable custom examples

### Future Consideration (v2+)

- [ ] Dedicated cosine-angle visualization - adds geometric depth beyond the v1 numeric cosine comparison
- [ ] Draggable/editable vectors - useful for experimentation but needs accessible alternatives
- [ ] Challenge mode - valuable only after core explanations are proven
- [ ] Scenario editor - increases validation, persistence, and authoring complexity

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Pure calculation engine | HIGH | MEDIUM | P1 |
| Guided step flow | HIGH | MEDIUM | P1 |
| TF-IDF visual sequence | HIGH | HIGH | P1 |
| Meaning map and distance | HIGH | HIGH | P1 |
| Side-by-side final comparison | HIGH | MEDIUM | P1 |
| Editable scenarios and reset | HIGH | MEDIUM | P1 |
| Projector/accessibility baseline | HIGH | MEDIUM | P1 |
| Presentation mode | MEDIUM | MEDIUM | P2 |
| Quiz checkpoints | MEDIUM | MEDIUM | P2 |
| Dedicated cosine-angle visualization | MEDIUM | HIGH | P3 |
| Dragging vectors | MEDIUM | HIGH | P3 |

## Comparable Product Pattern Analysis

| Pattern | Static lesson/slides | General search demo | Our Approach |
|---------|----------------------|---------------------|--------------|
| Process visibility | Fixed snapshots | Often final-result focused | Stateful, step-by-step transformations |
| Experimentation | Usually none | Query editing only | Editable query/documents plus deterministic reset |
| Keyword vs semantic | Explained separately | May hide scoring internals | Side-by-side rankings with visible evidence |
| Accessibility | Depends on authoring | Graphics may be canvas-only | Semantic controls, tables, labels, and SVG |
| Classroom pacing | Instructor-controlled slides | User-controlled tool | Both guided navigation and Run All |

## Sources

- https://www.cast.org/what-we-do/universal-design-for-learning/ - representation, engagement, and action/expression principles
- https://www.w3.org/WAI/WCAG22/quickref/ - color, contrast, keyboard, focus, and motion criteria
- https://www.w3.org/WAI/tutorials/images/complex/ - textual equivalents for complex visual information
- `docs/PRD.md` - target users, learning outcomes, scenarios, and explicit MVP boundary

---
*Feature research for: interactive educational search-engine visualization*
*Researched: 2026-06-14*
