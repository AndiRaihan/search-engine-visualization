# Phase 3: Euclidean Meaning Journey - Pattern Map

**Mapped:** 2026-06-16
**Files analyzed:** 5
**Analogs found:** 5 / 5

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/domain/simulation.ts` | model/service | transform | `src/domain/simulation.ts` | exact |
| `src/features/visualization-panel/VisualizationPanel.tsx` | component | request-response | `src/features/visualization-panel/VisualizationPanel.tsx` | exact |
| `src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx` | component | request-response | `src/features/visualization-panel/keyword-steps/KeywordFoundationsSteps.tsx` | role-match |
| `src/App.tsx` | component | request-response | `src/App.tsx` | exact |
| `src/domain/simulation.test.ts` and `src/features/visualization-panel/VisualizationPanel.test.tsx` | test | request-response | same files | exact |

## Pattern Assignments

### `src/domain/simulation.ts` (model/service, transform)

**Analog:** `src/domain/simulation.ts`

**Imports / domain seam** (lines 1-10):
```ts
import { lessonSteps } from '@/content/lessonSteps'

export interface SearchDocument {
  id: string
  title?: string
  text: string
}
```

**Session cloning pattern** (lines 63-75):
```ts
export function buildSessionFromScenario(scenario: Scenario): SimulationSession {
  return {
    scenarioId: scenario.id,
    query: scenario.defaultQuery,
    documents: scenario.documents.map((doc) => ({ ...doc })),
    vectors: {
      query: [...scenario.vectors.query] as Vector2D,
      documents: { ...scenario.vectors.documents },
    },
    activeStepId: 'setup',
  }
}
```

**Edited-state selector pattern** (lines 135-152):
```ts
export function selectIsEdited(
  session: SimulationSession,
  defaultScenario: Scenario
): boolean {
  if (session.scenarioId !== defaultScenario.id) return false
  if (session.query !== defaultScenario.defaultQuery) return true
  if (session.documents.length !== defaultScenario.documents.length) return true
```

**Ranking/formatting pattern** (lines 284-319):
```ts
export function rankByKeywordScore(documents: KeywordDocumentSnapshot[]): KeywordRankedDocument[] {
  const sorted = [...documents].sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score
    }
    return a.originalIndex - b.originalIndex
  })
  return sorted.map((doc, index) => {
    const rank = index + 1
    const formattedScore = formatThreeDecimals(doc.score)
```

**Snapshot-builder pattern** (lines 322-389):
```ts
export function buildKeywordSnapshot(query: string, documents: SearchDocument[]): KeywordSnapshot {
  const queryTokens = tokenize(query)
  const queryTerms = uniqueTermsInOrder(queryTokens)

  const docTokensList = documents.map((d) => tokenize(d.text))
  // Compute termStatistics
  const termStatistics: Record<string, KeywordTermStatistic> = {}
  ...
  const rankedDocuments = rankByKeywordScore(docSnapshots)
  const maxScore = docSnapshots.length > 0 ? Math.max(0, ...docSnapshots.map((d) => d.score)) : 0
}
```

**What to copy for Phase 3**
- Add a pure semantic snapshot builder beside `buildKeywordSnapshot`.
- Keep Euclidean distance math and rank ordering pure and derived from `session.query`, `session.documents`, and `session.vectors`.
- Reuse `formatThreeDecimals` for display-only formatting; do not rank on rounded values.

---

### `src/features/visualization-panel/VisualizationPanel.tsx` (component, request-response)

**Analog:** `src/features/visualization-panel/VisualizationPanel.tsx`

**Imports / step routing pattern** (lines 1-12):
```tsx
import React from 'react'
import type { StepId, KeywordSnapshot } from '@/domain/simulation'
import {
  TokenizationStep,
  MatchingStep,
  TermFrequencyStep,
  InverseDocumentFrequencyStep,
} from './keyword-steps/KeywordFoundationsSteps'
import {
  TfidfStep,
  KeywordRankingStep,
} from './keyword-steps/KeywordScoringSteps'
```

**Setup vs step shell pattern** (lines 27-56):
```tsx
const isSetup = activeStepId === 'setup'
...
{isSetup ? (
  <div className="flex flex-col gap-md transition-opacity duration-150 ease-in-out motion-reduce:transition-none">
    <h2 ref={setupHeadingRef} tabIndex={-1} className="text-heading font-weight-bold text-primary-text focus:outline-none">
      Your search workspace
    </h2>
```

**Step switch pattern** (lines 58-76):
```tsx
{activeStepId === 'tokenization' ? (
  <TokenizationStep snapshot={keywordSnapshot} />
) : activeStepId === 'matching' ? (
  <MatchingStep snapshot={keywordSnapshot} />
) : activeStepId === 'term-frequency' ? (
```

**What to copy for Phase 3**
- Extend the existing ternary routing with `keyword-limitation`, `meaning-vectors`, and `semantic-ranking`.
- Preserve the same outer shell, heading treatment, and placeholder fallback structure.
- Keep the panel focused on rendering step components, not on embedding math.

---

### `src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx` (component, request-response)

**Closest analog:** `src/features/visualization-panel/keyword-steps/KeywordFoundationsSteps.tsx`

**Analog imports / card pattern** (lines 1-20, 83-100, 142-160, 195-205):
```tsx
import React from 'react'
import type { KeywordSnapshot } from '@/domain/simulation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Check, Star, ArrowDown } from 'lucide-react'
import { formatThreeDecimals } from '@/domain/simulation'
```

**Document-card pattern** (lines 83-132):
```tsx
return (
  <Card key={doc.id} className="border border-border-custom bg-secondary">
    <CardHeader className="pb-2">
      <CardTitle className="text-body font-weight-bold text-primary-text">
        {doc.title || doc.id}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-md">
```

**Accessible table pattern** (lines 142-191 and 195-241):
```tsx
<table className="w-full text-left border-collapse text-body">
  <thead>
    <tr className="border-b border-border-custom text-label font-weight-bold text-primary-text">
      <th className="py-sm pr-md">Query Term</th>
      <th className="py-sm px-md text-right">Count in Doc</th>
      <th className="py-sm px-md text-right">Total Words in Doc</th>
      <th className="py-sm pl-md text-right">Relative TF</th>
```

**What to copy for Phase 3**
- Build the new semantic step component as a small set of React subcomponents, mirroring the current phase-2 split.
- Use `Card` / `CardContent` / `CardHeader` / `CardTitle` for each semantic card, list, and notice.
- Use `tabular-nums` for coordinates, distances, and substitution math.
- Use Lucide icons only alongside visible labels.

---

### `src/App.tsx` (component, request-response)

**Analog:** `src/App.tsx`

**Derived snapshot pattern** (lines 42-44):
```tsx
const keywordSnapshot = useMemo(() => {
  return buildKeywordSnapshot(session.query, session.documents)
}, [session.query, session.documents])
```

**Panel wiring pattern** (lines 160-166):
```tsx
<VisualizationPanel
  activeStepId={session.activeStepId}
  activeStepTitle={activeStep.title}
  setupHeadingRef={setupHeadingRef}
  keywordSnapshot={keywordSnapshot}
/>
```

**What to copy for Phase 3**
- Add the semantic snapshot in `useMemo` alongside the keyword snapshot.
- Pass the derived semantic data into `VisualizationPanel` rather than duplicating derived state in reducer/session state.
- Keep focus/announcement behavior in `App`, not inside the visualization step components.

---

### `src/domain/simulation.test.ts` and `src/features/visualization-panel/VisualizationPanel.test.tsx` (test, request-response)

**Analogs:** same files

**Domain test structure** (lines 27-40, 156-322):
```ts
describe('Simulation Domain Model and Reducer', () => {
  test('buildSessionFromScenario creates independent deep clones', () => {
```

```ts
describe('Phase 2 - Task 3: TF-IDF, Ranking, and Snapshot Builder', () => {
  test('rankByKeywordScore ranks descending by score, tie-breaks on original index', () => {
```

**Visualization test structure** (current file):
```ts
describe('VisualizationPanel - Tokenization and Matching Steps', () => {
  test('Tokenization step renders Query Tokens and Document Tokens', () => {
```

**What to copy for Phase 3**
- Add unit tests first for Euclidean helper math, deterministic ranking, and the selected-document substitution text.
- Add component tests for static-vector notice visibility, coordinates table, SVG labels, dashed lines, and ranking selection state.
- Assert visible text and ARIA roles, not implementation internals.

## Shared Patterns

### Derived Data in Render
**Source:** `src/App.tsx`, `src/domain/simulation.ts`
```tsx
const keywordSnapshot = useMemo(() => {
  return buildKeywordSnapshot(session.query, session.documents)
}, [session.query, session.documents])
```

Apply the same approach to the semantic snapshot: derive it from reducer state, do not store it in reducer/session fields.

### Accessible Tables and Tabular Numbers
**Source:** `src/features/visualization-panel/keyword-steps/KeywordFoundationsSteps.tsx`
```tsx
<td className="py-sm px-md text-right text-primary-text font-normal tabular-nums">{count}</td>
```

Use the same table structure for coordinates, distances, and math breakdown rows.

### Card-Based Step Layout
**Source:** `src/features/visualization-panel/keyword-steps/KeywordFoundationsSteps.tsx`
```tsx
<Card key={doc.id} className="border border-border-custom bg-secondary">
```

Use `Card` wrappers for notices, the semantic list, and the breakdown panel.

### Status Copy and Formatting
**Source:** `src/domain/simulation.ts`
```ts
return value.toFixed(3)
```

Keep distance display at three decimals, but compute ranks from raw floating-point values.

## No Analog Found

None. Every Phase 3 target has a direct or role-match analog already in the codebase.

## Metadata

**Analog search scope:** `src/domain`, `src/features/visualization-panel`, `src/App.tsx`, `src/features/visualization-panel/*.test.tsx`
**Files scanned:** 5 primary files plus supporting lesson/scenario content
**Pattern extraction date:** 2026-06-16

