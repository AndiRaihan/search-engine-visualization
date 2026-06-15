# Phase 2: Keyword Search Journey - Pattern Map

**Mapped:** 2026-06-15
**Files analyzed:** 6
**Analogs found:** 6 / 6

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/domain/simulation.ts` | service / model | CRUD / transform | `src/domain/simulation.ts` | exact |
| `src/features/visualization-panel/VisualizationPanel.tsx` | component | request-response | `src/features/visualization-panel/VisualizationPanel.tsx` | exact |
| `src/domain/simulation.test.ts` | test | request-response | `src/domain/simulation.test.ts` | exact |
| `src/features/visualization-panel/VisualizationPanel.test.tsx` | test | request-response | `src/features/input-panel/InputPanel.test.tsx` | role-match |
| `src/App.test.tsx` | test | request-response | `src/App.test.tsx` | exact |
| `src/test/keyword-step-session.ts` (shared helper, inferred) | utility / test | transform | `src/test/setup.ts` | role-match |

## Pattern Assignments

### `src/domain/simulation.ts` (service / model, CRUD / transform)

**Analog:** `src/domain/simulation.ts`

**Imports + domain contracts** (lines 1-54):
```ts
import { lessonSteps } from '@/content/lessonSteps'

export interface SearchDocument {
  id: string
  title?: string
  text: string
}

export type Vector2D = [number, number]
export interface SimulationSession {
  scenarioId: string
  query: string
  documents: SearchDocument[]
  vectors: ScenarioVectors
  activeStepId: StepId
}
```

**Reducer pattern** (lines 63-131):
```ts
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

**Selector pattern** (lines 135-169):
```ts
export function selectIsEdited(
  session: SimulationSession,
  defaultScenario: Scenario
): boolean {
  if (session.scenarioId !== defaultScenario.id) return false
  if (session.query !== defaultScenario.defaultQuery) return true
  if (session.documents.length !== defaultScenario.documents.length) return true
  ...
}

export function selectCanGoPrevious(activeStepId: StepId): boolean {
  return selectCurrentStepIndex(activeStepId) > 1
}
```

**What to copy for Phase 2:**
- Keep the keyword pipeline pure in this module.
- Add tokenization, matching, TF, DF, IDF, TF-IDF, ranking, and explanation helpers here rather than in React components.
- Preserve stable cloning / immutable session updates as the existing reducer does.
- Keep raw numeric values for ranking and only round for presentation.

### `src/features/visualization-panel/VisualizationPanel.tsx` (component, request-response)

**Analog:** `src/features/visualization-panel/VisualizationPanel.tsx`

**Imports + shell** (lines 1-10):
```tsx
import React from 'react'
import type { StepId } from '@/domain/simulation'

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  activeStepId,
  activeStepTitle,
  setupHeadingRef,
}) => {
```

**Setup vs step switch** (lines 12-35):
```tsx
const isSetup = activeStepId === 'setup'

return (
  <section aria-label="Visualization" ...>
    {isSetup ? (
      <div className="flex flex-col gap-md transition-opacity duration-150 ease-in-out motion-reduce:transition-none">
        <h2 ref={setupHeadingRef} tabIndex={-1}>Your search workspace</h2>
        <p>Choose a scenario, review the query and documents, then start the search.</p>
      </div>
    ) : (
```

**Placeholder step body** (lines 36-50):
```tsx
<div className="border border-dashed border-border-custom rounded-[8px] p-2xl flex items-center justify-center bg-subtle-surface">
  <span className="text-label text-muted-text uppercase tracking-wider">
    [ {activeStepTitle} Visuals Placeholder ]
  </span>
</div>
```

**What to copy for Phase 2:**
- Keep the right panel as a step router.
- Preserve the setup heading focus target.
- Replace the placeholder branch with step-specific keyword views driven by derived snapshot data.
- Reuse the existing projector-safe panel shell, border, spacing, and motion-reduce handling.

### `src/domain/simulation.test.ts` (test, request-response)

**Analog:** `src/domain/simulation.test.ts`

**Reducer and selector coverage style** (lines 1-139):
```ts
import { describe, test, expect } from 'vitest'
import {
  buildSessionFromScenario,
  simulationReducer,
  selectIsEdited,
  selectCanGoNext,
  selectCanGoPrevious,
  selectProgress,
} from './simulation'

describe('Simulation Domain Model and Reducer', () => {
  test('buildSessionFromScenario creates independent deep clones', () => {
    ...
  })
```

**What to copy for Phase 2:**
- Keep math tests in the domain layer, not in the component test file.
- Use stable scenario fixtures from `src/content/scenarios.ts`.
- Add explicit cases for punctuation splitting, empty inputs, df=0, raw-score ranking, and stable tie ordering.

### `src/features/visualization-panel/VisualizationPanel.test.tsx` (test, request-response)

**Analog:** `src/features/input-panel/InputPanel.test.tsx`

**Component test style** (lines 1-143):
```tsx
import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputPanel } from './InputPanel'
import { buildSessionFromScenario } from '@/domain/simulation'
import { scenarios } from '@/content/scenarios'

describe('InputPanel Component', () => {
  ...
})
```

**Relevant assertions to mirror for Phase 2:**
- Role/label-based queries instead of class-name assertions.
- `getByText` checks for visible teaching copy such as badges, summaries, and explanation strings.
- Plain-text rendering checks for edited query/document values.

**What to copy for Phase 2:**
- Build the visualization test around visible step output, not internal helper calls.
- Use a shared session builder so each step test can start at a keyword step.
- Assert text plus icon/badge semantics for rare/common and matched/missing states.

### `src/App.test.tsx` (test, request-response)

**Analog:** `src/App.test.tsx`

**Current regression shape** (lines 1-56):
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import App from './App'

test('full guided classroom flow regression test', async () => {
  const user = userEvent.setup()
  render(<App />)
  ...
})
```

**What to copy for Phase 2:**
- Keep the top-level integration regression focused on live edits changing visible outputs.
- Preserve the user-event driven flow for step navigation and state updates.
- Add the keyword-ranking explanation update regression here if it spans App + VisualizationPanel behavior.

### `src/test/keyword-step-session.ts` (shared helper, inferred; utility / transform)

**Closest analog:** `src/test/setup.ts`

**Current setup pattern** (lines 1-5):
```ts
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

**What to copy for Phase 2:**
- Add a small test helper under `src/test/` that builds a `SimulationSession` at a chosen keyword step.
- Keep the helper pure and reusable by both domain and visualization tests.
- Prefer a simple factory API over test-local reducer setup duplication.

## Shared Patterns

### Pure domain math
**Source:** `src/domain/simulation.ts`
**Apply to:** keyword tokenization, TF, DF, IDF, TF-IDF, ranking, and explanation builders
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

### Step-router visualization
**Source:** `src/features/visualization-panel/VisualizationPanel.tsx`
**Apply to:** all keyword step views
```tsx
{isSetup ? (
  ...
) : (
  ...
)}
```

### DOM-first component tests
**Source:** `src/features/input-panel/InputPanel.test.tsx`
**Apply to:** `src/features/visualization-panel/VisualizationPanel.test.tsx` and `src/App.test.tsx`
```tsx
expect(screen.getByText(/Edited/i)).toBeDefined()
expect(screen.getByLabelText(/Query/i)).toBeDefined()
```

### Reusable session setup
**Source:** `src/domain/simulation.test.ts`
**Apply to:** new keyword math tests and visualization tests
```ts
const session = buildSessionFromScenario(scenario1)
```

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `src/features/visualization-panel/keyword-steps/*` | component | request-response | No step-specific keyword subcomponent exists yet; use `VisualizationPanel.tsx` as the structural analog and `InputPanel.test.tsx` for test shape. |

## Metadata

**Analog search scope:** `src/domain`, `src/features`, `src/content`, `src/test`
**Files scanned:** 8
**Pattern extraction date:** 2026-06-15
