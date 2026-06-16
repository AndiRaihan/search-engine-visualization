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

// Phase 2 Keyword Search Journey Types & Interfaces

export type KeywordStepId =
  | 'tokenization'
  | 'matching'
  | 'term-frequency'
  | 'inverse-document-frequency'
  | 'tf-idf'
  | 'keyword-ranking'

export interface KeywordTermStatistic {
  term: string
  documentFrequency: number
  totalDocuments: number
  rawRatio: number
  idf: number
  importance: 'rare' | 'common'
}

export interface KeywordTermContribution {
  term: string
  count: number
  totalWords: number
  tf: number
  idf: number
  tfidf: number
}

export interface KeywordMatchSummary {
  matchedTerms: string[]
  missingTerms: string[]
}

export interface KeywordDocumentSnapshot {
  id: string
  title?: string
  text: string
  originalIndex: number
  tokens: string[]
  matchSummary: KeywordMatchSummary
  contributions: Record<string, KeywordTermContribution>
  score: number
}

export interface KeywordRankedDocument {
  id: string
  title?: string
  text: string
  originalIndex: number
  score: number
  rank: number
  explanation: string
}

export interface KeywordSnapshot {
  queryTokens: string[]
  queryTerms: string[]
  termStatistics: Record<string, KeywordTermStatistic>
  documents: KeywordDocumentSnapshot[]
  rankedDocuments: KeywordRankedDocument[]
  maxScore: number
}

// Pure keyword calculation helper stubs for TDD

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

export function uniqueTermsInOrder(tokens: string[]): string[] {
  return Array.from(new Set(tokens))
}

export function getTermFrequency(term: string, documentTokens: string[]): number {
  if (documentTokens.length === 0) return 0
  const count = documentTokens.filter((t) => t === term).length
  return count / documentTokens.length
}

export function getDocumentFrequency(term: string, allDocumentTokens: string[][]): number {
  let count = 0
  for (const tokens of allDocumentTokens) {
    if (tokens.includes(term)) {
      count++
    }
  }
  return count
}

export function getIdf(term: string, allDocumentTokens: string[][]): number {
  const N = allDocumentTokens.length
  if (N === 0) return 0
  const df = getDocumentFrequency(term, allDocumentTokens)
  if (df === 0) return 0
  return Math.log(N / df)
}

export function getTfidf(tf: number, idf: number): number {
  return 0
}

export function getDocumentKeywordScore(contributions: Record<string, KeywordTermContribution>): number {
  return 0
}

export function rankByKeywordScore(documents: KeywordDocumentSnapshot[]): KeywordRankedDocument[] {
  return []
}

export function formatThreeDecimals(value: number): string {
  return '0.000'
}

export function buildKeywordSnapshot(query: string, documents: SearchDocument[]): KeywordSnapshot {
  return {
    queryTokens: [],
    queryTerms: [],
    termStatistics: {},
    documents: [],
    rankedDocuments: [],
    maxScore: 0,
  }
}

