# Pitfalls Research

**Domain:** Interactive educational search-engine visualization
**Researched:** 2026-06-14
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Correct Math, Wrong Lesson

**What goes wrong:**
The calculations are technically correct, but students cannot explain what changed or why ranking moved.

**Why it happens:**
Implementation follows formulas instead of the learner's causal sequence.

**How to avoid:**
For every step, require three outputs: what the engine did, visible evidence, and why it affects ranking. Validate copy with worked scenarios.

**Warning signs:**
Formula-heavy screens, unexplained decimals, or result cards that only show scores.

**Phase to address:**
Define the step model and teaching-copy contract before building visualizations.

---

### Pitfall 2: Visualizations Disagree

**What goes wrong:**
Token highlights, TF-IDF tables, score bars, and result cards show subtly different values or orders.

**Why it happens:**
Each component calculates, rounds, filters, or tie-breaks independently.

**How to avoid:**
Use pure domain functions and one canonical simulation snapshot. Round only for display; rank with full precision and stable document-order tie-breaking.

**Warning signs:**
Duplicated score formulas in components or snapshots asserted only visually.

**Phase to address:**
Core search engine and data-contract phase.

---

### Pitfall 3: Toy Semantics Presented as Real Embeddings

**What goes wrong:**
Students infer that arbitrary text naturally maps to the displayed hand-picked 2D coordinates.

**Why it happens:**
The simplification is not labeled, especially after users edit document text.

**How to avoid:**
Explicitly call the map a simplified teaching model. Keep scenario vectors curated and define edited-text behavior: preserve the teaching point with a notice rather than pretending to infer meaning.

**Warning signs:**
Coordinates change without an explained rule, or edited text receives fabricated "semantic" values.

**Phase to address:**
Semantic visualization design and scenario modeling.

---

### Pitfall 4: Editing Breaks the Demonstration

**What goes wrong:**
After editing a query or document, stale values remain, a scenario reset is incomplete, or the semantic stage becomes incoherent.

**Why it happens:**
Derived data is stored as state and scenario defaults are mutated.

**How to avoid:**
Keep immutable defaults, store only source edits, recompute snapshots, and test edit/reset transitions from multiple steps.

**Warning signs:**
Many setters fire after one edit or reset logic duplicates scenario data.

**Phase to address:**
Simulation controller and integration phase.

---

### Pitfall 5: Projector-Friendly Means Desktop-Only

**What goes wrong:**
The three-panel layout is readable on one laptop but clips on tablets, zoom, or smaller projectors.

**Why it happens:**
Fixed dimensions are optimized for a single screenshot.

**How to avoid:**
Define responsive panel behavior, minimum type sizes, horizontal table handling, and test at common projector/tablet widths plus 200% zoom.

**Warning signs:**
Critical controls require horizontal page scrolling or tables shrink below readable size.

**Phase to address:**
Application shell early; verify again during polish.

---

### Pitfall 6: Color and Motion Carry the Meaning

**What goes wrong:**
Matches, importance, rank movement, or Run All progress cannot be understood without color or animation.

**Why it happens:**
Visual polish is added before semantic labels and reduced-motion behavior.

**How to avoid:**
Pair color with text, shape, pattern, rank numbers, or icons; support keyboard focus and `prefers-reduced-motion`.

**Warning signs:**
Instructions say "the green word" or animations are the only evidence of a rank change.

**Phase to address:**
Component design and accessibility verification in every UI phase.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hard-code calculations into JSX | Fast first demo | Inconsistent values and untestable logic | Never |
| One giant `App.tsx` | Minimal setup | Coupled state, copy, formulas, and views | Only for a disposable spike, not MVP |
| Store all derived values in state | Easy to inspect | Stale data and complex reset behavior | Never |
| Hard-code teaching copy in every component | Quick rendering | Terminology drift and difficult review | Only before step registry exists |
| Skip stable tie-breaking | Less code | Results reorder unexpectedly in demos/tests | Never |
| Snapshot-only UI tests | Easy coverage | Misses broken interactions and semantics | Only as supplemental coverage |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Pages | Absolute asset paths fail under repository subpath | Configure Vite `base` for the deployment target |
| Playwright | Run a large cross-browser suite before flow stabilizes | Start with focused Chromium smoke tests, expand deliberately |
| Tailwind | Generate dynamic class names that scanning cannot detect | Use complete static class names or explicit style mappings |
| SVG | Render unlabeled dots/lines as the only source of information | Add labels, title/description, and a semantic distance table |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Premature memoization everywhere | Complex dependencies and stale UI | Recompute simple arrays; profile before optimizing | More likely to hurt now than help |
| Animating every token/table row | Jank and distracting lessons | Animate only step transitions/rank movement | Projectors and low-power tablets |
| Rendering oversized tables at tiny type | Technically complete but unreadable | Limit documents and use focused per-step tables | Above the intended ten-document maximum |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Rendering edited text as HTML | Script injection in a static app | Render text nodes; never use `dangerouslySetInnerHTML` |
| Importing scenario JSON without validation later | Malformed or hostile content | Keep import out of MVP; validate schema if introduced |
| Adding unnecessary external scripts/fonts | Privacy, availability, and CSP complications | Prefer bundled assets and minimal dependencies |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| All eleven steps visible at once | Cognitive overload | Reveal one step while preserving query/document context |
| Run All races through content | Students cannot inspect cause and effect | Make it cancellable and respect reduced motion |
| Formulas precede intuition | Learners disengage | Explain action first, then show worked formula |
| Reset has ambiguous scope | Users fear experimentation | Label whether it resets selected scenario inputs and step |
| Semantic map lacks scale explanation | Distance appears arbitrary | Show coordinates, lines, values, and "toy map" caveat |
| Side-by-side rankings lack movement cues | Comparison requires manual scanning | Show old/new rank and textual reason for movement |

## "Looks Done But Isn't" Checklist

- [ ] **Tokenization:** Verify punctuation, case, empty input, and repeated whitespace behavior.
- [ ] **TF-IDF:** Verify visible rounded values reconcile with scores calculated at full precision.
- [ ] **Ranking:** Verify deterministic ties and zero-score documents.
- [ ] **Editing:** Verify every dependent view updates and semantic-vector caveats remain accurate.
- [ ] **Reset:** Verify scenario query, documents, vectors, and step all restore correctly.
- [ ] **Meaning map:** Verify labels, distance lines, coordinate table, and non-color identification.
- [ ] **Navigation:** Verify keyboard operation, focus visibility, bounds, and Run All cancellation.
- [ ] **Static build:** Verify direct deployment and repository-subpath behavior where applicable.
- [ ] **Classroom display:** Verify projector contrast, tablet layout, and 200% zoom.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Divergent calculations | HIGH | Extract pure engine, create snapshot, replace component-local formulas, add fixture tests |
| Misleading semantic model | MEDIUM | Rewrite copy, constrain editing behavior, label curated vectors, add textual explanation |
| Fragile reset/edit state | MEDIUM | Normalize reducer state around immutable scenario defaults |
| Inaccessible graphics | MEDIUM | Add semantic tables/labels, keyboard paths, focus states, and non-color cues |
| Overloaded screens | MEDIUM | Split into focused steps and preserve context through shared panels |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Correct math, wrong lesson | Step-flow/content phase | Each step states action, evidence, and consequence |
| Visualizations disagree | Domain engine phase | Fixture tests compare snapshot values across views |
| Toy semantics presented as real | Semantic phase | Copy and edit behavior explicitly identify curated vectors |
| Editing breaks demonstration | Controller/integration phase | Edit/reset tests from multiple scenarios and steps |
| Projector-friendly means desktop-only | Shell and polish phases | Responsive, zoom, projector, and tablet checks |
| Color/motion carries meaning | Every UI phase | Keyboard, reduced-motion, and non-color verification |

## Sources

- https://www.w3.org/WAI/WCAG22/quickref/ - color, keyboard, focus, reflow, text resizing, and animation guidance
- https://www.w3.org/WAI/tutorials/images/complex/ - alternatives for complex visual information
- https://www.cast.org/what-we-do/universal-design-for-learning/ - learner variability and multiple forms of representation
- https://testing-library.com/docs/react-testing-library/intro/ - behavior-focused and accessibility-supporting tests
- `docs/PRD.md` - project-specific educational and interaction risks

---
*Pitfalls research for: interactive educational search-engine visualization*
*Researched: 2026-06-14*
