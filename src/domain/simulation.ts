import { lessonSteps } from '@/content/lessonSteps'

export interface SearchDocument {
  id: string
  title?: string
  text: string
}

export type Vector2D = [number, number]

export interface ScenarioVectors {
  query: Vector2D
  documents: Record<string, Vector2D>
}

export interface Scenario {
  id: string
  title: string
  description: string
  learningGoal: string
  defaultQuery: string
  documents: readonly SearchDocument[]
  vectors: ScenarioVectors
}

export type StepId =
  | 'setup'
  | 'tokenization'
  | 'matching'
  | 'term-frequency'
  | 'inverse-document-frequency'
  | 'tf-idf'
  | 'keyword-ranking'
  | 'keyword-limitation'
  | 'meaning-vectors'
  | 'semantic-ranking'
  | 'final-comparison'

export interface LessonStep {
  id: StepId
  title: string
  description: string
  kind: 'setup' | 'preview'
}

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

export function simulationReducer(
  state: SimulationSession,
  action: SimulationAction
): SimulationSession {
  switch (action.type) {
    case 'scenarioSelected':
      return buildSessionFromScenario(action.scenario)

    case 'queryChanged':
      return {
        ...state,
        query: action.value,
      }

    case 'documentChanged':
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.documentId ? { ...doc, text: action.value } : doc
        ),
      }

    case 'started':
      return {
        ...state,
        activeStepId: 'tokenization',
      }

    case 'nextStep': {
      const currentIndex = lessonSteps.findIndex((s) => s.id === state.activeStepId)
      if (currentIndex !== -1 && currentIndex < lessonSteps.length - 1) {
        return {
          ...state,
          activeStepId: lessonSteps[currentIndex + 1].id,
        }
      }
      return state
    }

    case 'previousStep': {
      const currentIndex = lessonSteps.findIndex((s) => s.id === state.activeStepId)
      if (currentIndex > 0) {
        return {
          ...state,
          activeStepId: lessonSteps[currentIndex - 1].id,
        }
      }
      return state
    }

    case 'resetConfirmed':
      return buildSessionFromScenario(action.scenario)

    default:
      return state
  }
}

// Selectors
export function selectIsEdited(
  session: SimulationSession,
  defaultScenario: Scenario
): boolean {
  if (session.scenarioId !== defaultScenario.id) return false
  if (session.query !== defaultScenario.defaultQuery) return true
  if (session.documents.length !== defaultScenario.documents.length) return true

  for (let i = 0; i < session.documents.length; i++) {
    const doc = session.documents[i]
    const defaultDoc = defaultScenario.documents.find((d) => d.id === doc.id)
    if (!defaultDoc || doc.text !== defaultDoc.text) return true
  }

  return false
}

export function selectCurrentStepIndex(activeStepId: StepId): number {
  return lessonSteps.findIndex((s) => s.id === activeStepId)
}

export function selectCanGoPrevious(activeStepId: StepId): boolean {
  return selectCurrentStepIndex(activeStepId) > 1 // setup is index 0, first step (tokenization) is index 1
}

export function selectCanGoNext(activeStepId: StepId): boolean {
  const idx = selectCurrentStepIndex(activeStepId)
  return idx !== -1 && idx < lessonSteps.length - 1
}

export function selectProgress(activeStepId: StepId): number {
  const total = lessonSteps.length
  const current = selectCurrentStepIndex(activeStepId)
  if (current === -1) return 0
  return Math.round((current / (total - 1)) * 100)
}
