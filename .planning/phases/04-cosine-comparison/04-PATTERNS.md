# Phase 4: Cosine Comparison - Pattern Map

**Mapped:** 2026-06-19
**Files analyzed:** 8
**Analogs found:** 8 / 8

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/domain/simulation.ts` | model/service | CRUD, transform | `src/domain/simulation.ts` | exact |
| `src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx` | component | request-response, transform | `src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx` | exact |
| `src/features/visualization-panel/VisualizationPanel.tsx` | component | request-response | `src/features/visualization-panel/VisualizationPanel.tsx` | exact |
| `src/content/lessonSteps.ts` | config | transform | `src/content/lessonSteps.ts` | exact |
| `src/domain/simulation.test.ts` | test | unit | `src/domain/simulation.test.ts` | exact |
| `src/features/visualization-panel/SemanticVisualizationSteps.test.tsx` | test | component | `src/features/visualization-panel/SemanticVisualizationSteps.test.tsx` | exact |
| `src/features/visualization-panel/VisualizationPanel.test.tsx` | test | component | `src/features/visualization-panel/VisualizationPanel.test.tsx` | exact |
| `src/App.test.tsx` | test | integration | `src/App.test.tsx` | exact |

## Pattern Assignments

### `src/domain/simulation.ts` (model/service, CRUD + transform)

**Analog:** `src/domain/simulation.ts`

**Imports / session shape** (lines 1-80):
```typescript
import { lessonSteps } from '@/content/lessonSteps'

export interface SimulationSession {
  scenarioId: string
  query: string
  documents: SearchDocument[]
  vectors: ScenarioVectors
  activeStepId: StepId
}

export type SimulationAction =
  | { type: 'scenarioSelected'; scenario: Scenario }
  | { type: 'queryChanged'; value: string }
  | { type: 'documentChanged'; documentId: string; value: string }
  | { type: 'started' }
  | { type: 'nextStep' }
  | { type: 'previousStep' }
  | { type: 'resetConfirmed'; scenario: Scenario }
```

**Reducer pattern** (lines 76-128):
```typescript
export function simulationReducer(
  state: SimulationSession,
  action: SimulationAction
): SimulationSession {
  switch (action.type) {
    case 'scenarioSelected':
      return buildSessionFromScenario(action.scenario)
    case 'queryChanged':
      return { ...state, query: action.value }
    case 'documentChanged':
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.documentId ? { ...doc, text: action.value } : doc
        ),
      }
```

**Semantic ranking + breakdown pattern** (lines 467-609):
```typescript
export function rankByEuclideanDistance(
  queryCoords: Vector2D,
  documents: { id: string; originalIndex: number; vector: Vector2D }[]
): { id: string; originalIndex: number; distance: number; rank: number }[] {
  const scored = documents.map((doc) => {
    const distance = euclideanDistance(queryCoords, doc.vector)
    return { id: doc.id, originalIndex: doc.originalIndex, distance }
  })

  scored.sort((a, b) => {
    if (Math.abs(a.distance - b.distance) > 1e-9) {
      return a.distance - b.distance
    }
    return a.originalIndex - b.originalIndex
  })
```

**Error handling / formatting guard** (lines 315-323, 493-523):
```typescript
export function formatThreeDecimals(value: number): string {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return '0.000'
  }
  return value.toFixed(3)
}
```

### `src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx` (component, request-response + transform)

**Analog:** `src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx`

**Static notice pattern** (lines 9-31):
```typescript
export const StaticVectorsNotice: React.FC<StaticVectorsNoticeProps> = ({ isEdited }) => {
  if (!isEdited) return null
  return (
    <div ... data-testid="static-vectors-notice">
      <AlertCircle ... />
      <div>
        <h3 ...>Static Vectors</h3>
        <p ...>Coordinates on the meaning map are preset teaching values ...</p>
      </div>
    </div>
  )
}
```

**Ranking list pattern** (lines 95-150):
```typescript
<button
  data-testid={`rank-item-${doc.id}`}
  onClick={() => onSelectDocument(doc.id)}
  className={cn(
    "w-full text-left p-md rounded-[8px] border transition-all cursor-pointer min-h-[44px]",
    isSelected ? "border-2 border-accent-fill bg-secondary ring-2 ring-accent-fill/20"
               : "border-border-custom bg-secondary hover:bg-subtle-surface/50"
  )}
  aria-selected={isSelected}
>
  <span className="text-[16px] text-primary-text font-tabular font-bold">
    Distance: {formatThreeDecimals(doc.distance)}
  </span>
</button>
```

**Euclidean breakdown pattern** (lines 163-215):
```typescript
<CardTitle className="text-body font-weight-bold text-primary-text">
  Distance Calculation for {documentLabel} ({documentTitle || 'Untitled'})
</CardTitle>
...
<div className="text-muted-text font-bold">Final Distance:</div>
<div className="font-bold text-accent-fill font-mono bg-subtle-surface/50 px-sm py-xs rounded">
  d = {breakdown.finalDistance}
</div>
```

**Meaning map overlay pattern** (lines 264-495):
```typescript
export const MeaningMap: React.FC<MeaningMapProps> = ({
  semanticSnapshot,
  showDistanceLines = false,
  selectedDocumentId,
}) => {
  ...
  {showDistanceLines &&
    semanticSnapshot.documentPoints.map((docPoint) => {
      const [qx, qy] = semanticSnapshot.queryPoint.coordinates
      const [dx, dy] = docPoint.coordinates
      return (
        <line
          key={`line-${docPoint.id}`}
          x1={qSvgX}
          y1={qSvgY}
          x2={dSvgX}
          y2={dSvgY}
          strokeDasharray="4,4"
        />
      )
    })}
```

**Semantic ranking composition** (lines 219-259):
```typescript
export const SemanticRankingStep: React.FC<StepProps> = ({ semanticSnapshot, isEdited }) => {
  const [selectedDocumentId, setSelectedDocumentId] = React.useState<string>(
    semanticSnapshot.rankedDocuments[0]?.id || ''
  )
  ...
  <MeaningMap semanticSnapshot={semanticSnapshot} showDistanceLines={true} selectedDocumentId={selectedDocumentId} />
  <SemanticRankingList ... />
  <EuclideanBreakdownPanel breakdown={selectedDoc.breakdown} ... />
}
```

### `src/features/visualization-panel/VisualizationPanel.tsx` (component, request-response)

**Analog:** `src/features/visualization-panel/VisualizationPanel.tsx`

**Step routing pattern** (lines 1-80):
```typescript
export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  activeStepId,
  activeStepTitle,
  setupHeadingRef,
  keywordSnapshot,
  semanticSnapshot,
  isEdited,
  activeScenarioId,
  onSwitchToKeywordMissesMeaning,
}) => {
  const isSetup = activeStepId === 'setup'
  ...
  {activeStepId === 'semantic-ranking' ? (
    <SemanticRankingStep semanticSnapshot={semanticSnapshot} isEdited={isEdited} />
  ) : (
    <div className="border border-dashed ...">[ {activeStepTitle} Visuals Placeholder ]</div>
  )}
}
```

### `src/content/lessonSteps.ts` (config, transform)

**Analog:** `src/content/lessonSteps.ts`

**Semantic step copy** (lines 48-66):
```typescript
{
  id: 'semantic-ranking',
  title: 'Semantic Ranking',
  description: 'This step measures the straight-line distance between the query and documents on the meaning map to rank them.',
  kind: 'preview',
},
{
  id: 'final-comparison',
  title: 'Final Comparison',
  description: 'This step compares the keyword and semantic rankings side-by-side to highlight their key differences.',
  kind: 'preview',
},
```

### `src/domain/simulation.test.ts` (test, unit)

**Analog:** `src/domain/simulation.test.ts`

**Domain math test patterns** (lines 1-260):
```typescript
test('euclidean: rankByEuclideanDistance sorts by raw smallest distance and tie-breaks deterministically', () => {
  const ranked = rankByEuclideanDistance(queryPoint, docs)
  expect(ranked[0].id).toBe('doc-a')
  expect(ranked[1].id).toBe('doc-c')
})

test('euclidean: buildEuclideanBreakdown exposes formula, substitutions, calculations', () => {
  const breakdown = buildEuclideanBreakdown('Query', 'D1', [0.80, 0.70], [0.90, 0.80])
  expect(breakdown.formula).toBe('d = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}')
})
```

### `src/features/visualization-panel/SemanticVisualizationSteps.test.tsx` (test, component)

**Analog:** `src/features/visualization-panel/SemanticVisualizationSteps.test.tsx`

**Step-level rendering pattern** (lines 1-360):
```typescript
render(
  <SemanticRankingStep
    semanticSnapshot={semanticSnapshot}
    isEdited={false}
  />
)
expect(screen.getByText(/Formula:/i)).toBeDefined()
expect(screen.getByText(/Final Distance:/i)).toBeDefined()
```

**SVG overlay assertion pattern** (lines 191-218):
```typescript
const dashedLines = Array.from(container.querySelectorAll('svg line')).filter(
  (line) => line.getAttribute('stroke-dasharray') === '4,4'
)
expect(dashedLines.length).toBe(semanticSnapshot.documentPoints.length)
```

**Interactive selection pattern** (lines 219-263):
```typescript
const lastDocBtn = screen.getByTestId(`rank-item-${lastDoc.id}`)
fireEvent.click(lastDocBtn)
expect(screen.getAllByText(new RegExp(lastDocBreakdown.finalDistance, 'i')).length).toBeGreaterThanOrEqual(1)
```

### `src/features/visualization-panel/VisualizationPanel.test.tsx` (test, component)

**Analog:** `src/features/visualization-panel/VisualizationPanel.test.tsx`

**Panel routing test pattern** (lines 1-170):
```typescript
renderPanel('semantic-ranking', 'Semantic Ranking', snapshot)
expect(screen.getByText(/Rank 1 \(Closest\)/i)).toBeDefined()
expect(screen.getByText(/Formula:/i)).toBeDefined()
expect(screen.getByText(/Final Distance:/i)).toBeDefined()
```

### `src/App.test.tsx` (test, integration)

**Analog:** `src/App.test.tsx`

**Guided flow regression pattern** (lines 1-170):
```typescript
render(<App />)
await user.click(startButton)
for (let i = 0; i < 8; i++) {
  await user.click(nextButton)
}
expect(screen.getByRole('heading', { name: /Semantic Ranking is ready/i })).toBeDefined()
expect(screen.getByText(/Formula:/i)).toBeDefined()
```

## Shared Patterns

### Reducer-owned session state
**Source:** `src/domain/simulation.ts`
**Apply to:** `src/domain/simulation.ts`, `src/App.tsx`
```typescript
export type SimulationAction =
  | { type: 'scenarioSelected'; scenario: Scenario }
  | { type: 'queryChanged'; value: string }
  | { type: 'documentChanged'; documentId: string; value: string }
  | { type: 'started' }
  | { type: 'nextStep' }
  | { type: 'previousStep' }
  | { type: 'resetConfirmed'; scenario: Scenario }
```

### Derived snapshot in `useMemo`
**Source:** `src/App.tsx`
**Apply to:** `src/App.tsx`
```typescript
const keywordSnapshot = useMemo(() => {
  return buildKeywordSnapshot(session.query, session.documents)
}, [session.query, session.documents])

const semanticSnapshot = useMemo(() => {
  return buildSemanticSnapshot(session, keywordSnapshot)
}, [session, keywordSnapshot])
```

### Metric-aware semantic copy
**Source:** `src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx`, `src/content/lessonSteps.ts`
**Apply to:** ranking list labels, breakdown headings, lesson descriptions
```typescript
Distance: {formatThreeDecimals(doc.distance)}
Distance Calculation for {documentLabel}
This step measures the straight-line distance between the query and documents...
```

### SVG overlay switching
**Source:** `src/features/visualization-panel/semantic-steps/SemanticVisualizationSteps.tsx`
**Apply to:** cosine mode in `MeaningMap`
```typescript
<line
  key={`line-${docPoint.id}`}
  strokeDasharray="4,4"
/>
```

### Deterministic ranking and formatting
**Source:** `src/domain/simulation.ts`
**Apply to:** all semantic ranking math
```typescript
scored.sort((a, b) => {
  if (Math.abs(a.distance - b.distance) > 1e-9) {
    return a.distance - b.distance
  }
  return a.originalIndex - b.originalIndex
})
```

## No Analog Found

All phase files have a direct or role-matched analog in the current codebase.

## Metadata

**Analog search scope:** `src/domain`, `src/features/visualization-panel`, `src/content`, `src/App.tsx`
**Files scanned:** 8
**Pattern extraction date:** 2026-06-19
