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
  semanticMetric: 'euclidean' | 'cosine'
}

export type SimulationAction =
  | { type: 'scenarioSelected'; scenario: Scenario }
  | { type: 'queryChanged'; value: string }
  | { type: 'documentChanged'; documentId: string; value: string }
  | { type: 'started' }
  | { type: 'nextStep' }
  | { type: 'previousStep' }
  | { type: 'resetConfirmed'; scenario: Scenario }
  | { type: 'metricToggled'; metric?: 'euclidean' | 'cosine' }

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
    semanticMetric: 'euclidean',
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

    case 'metricToggled': {
      const nextMetric = action.metric || (state.semanticMetric === 'euclidean' ? 'cosine' : 'euclidean')
      return {
        ...state,
        semanticMetric: nextMetric,
      }
    }

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
  return tf * idf
}

export function getDocumentKeywordScore(contributions: Record<string, KeywordTermContribution>): number {
  let score = 0
  for (const term in contributions) {
    score += contributions[term].tfidf
  }
  return score
}

export function rankByKeywordScore(documents: KeywordDocumentSnapshot[]): KeywordRankedDocument[] {
  const sorted = [...documents].sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score
    }
    return a.originalIndex - b.originalIndex
  })
  return sorted.map((doc, index) => {
    const rank = index + 1
    const queryTerms = Object.keys(doc.contributions)
    const formattedScore = formatThreeDecimals(doc.score)
    let explanation = `Score: ${formattedScore}.`
    if (queryTerms.length > 0) {
      const termStrings = queryTerms.map(term => {
        const contribVal = doc.contributions[term]?.tfidf || 0
        return `'${term}' contributed ${formatThreeDecimals(contribVal)}`
      })
      explanation += ` Term ${termStrings.join(', ')}.`
    }
    return {
      id: doc.id,
      title: doc.title,
      text: doc.text,
      originalIndex: doc.originalIndex,
      score: doc.score,
      rank,
      explanation,
    }
  })
}

export function formatThreeDecimals(value: number): string {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return '0.000'
  }
  return value.toFixed(3)
}

export function buildKeywordSnapshot(query: string, documents: SearchDocument[]): KeywordSnapshot {
  const queryTokens = tokenize(query)
  const queryTerms = uniqueTermsInOrder(queryTokens)

  const docTokensList = documents.map((d) => tokenize(d.text))

  // Compute termStatistics
  const termStatistics: Record<string, KeywordTermStatistic> = {}
  for (const term of queryTerms) {
    const df = getDocumentFrequency(term, docTokensList)
    const N = documents.length
    const rawRatio = N > 0 ? df / N : 0
    const idf = getIdf(term, docTokensList)
    const importance = df <= Math.floor(N / 2) ? 'rare' : 'common'
    termStatistics[term] = {
      term,
      documentFrequency: df,
      totalDocuments: N,
      rawRatio,
      idf,
      importance,
    }
  }

  // Compute KeywordDocumentSnapshot for each doc
  const docSnapshots: KeywordDocumentSnapshot[] = documents.map((doc, originalIndex) => {
    const tokens = docTokensList[originalIndex]
    const matchedTerms = queryTerms.filter((t) => tokens.includes(t))
    const missingTerms = queryTerms.filter((t) => !tokens.includes(t))
    const matchSummary: KeywordMatchSummary = { matchedTerms, missingTerms }

    const contributions: Record<string, KeywordTermContribution> = {}
    for (const term of queryTerms) {
      const count = tokens.filter((t) => t === term).length
      const totalWords = tokens.length
      const tf = getTermFrequency(term, tokens)
      const idf = termStatistics[term]?.idf || 0
      const tfidf = getTfidf(tf, idf)
      contributions[term] = {
        term,
        count,
        totalWords,
        tf,
        idf,
        tfidf,
      }
    }

    const score = getDocumentKeywordScore(contributions)

    return {
      id: doc.id,
      title: doc.title,
      text: doc.text,
      originalIndex,
      tokens,
      matchSummary,
      contributions,
      score,
    }
  })

  // Rank documents
  const rankedDocuments = rankByKeywordScore(docSnapshots)

  // Compute maxScore
  const maxScore = docSnapshots.length > 0 ? Math.max(0, ...docSnapshots.map((d) => d.score)) : 0

  return {
    queryTokens,
    queryTerms,
    termStatistics,
    documents: docSnapshots,
    rankedDocuments,
    maxScore: isFinite(maxScore) ? maxScore : 0,
  }
}

// Phase 3 Semantic Journey Types & Interfaces

export interface SemanticPoint {
  id: string
  label: string
  coordinates: Vector2D
}

export interface SemanticDistanceRow {
  id: string
  label: string
  distance: number
  coordinates: Vector2D
}

export interface SemanticRankedDocument {
  id: string
  title?: string
  text: string
  originalIndex: number
  distance: number
  similarity?: number
  rank: number
  coordinates: Vector2D
  breakdown: EuclideanBreakdown
  cosineBreakdown?: CosineBreakdown
}

export interface SemanticMissedDocument {
  id: string
  title?: string
  text: string
  originalIndex: number
  distance: number
  coordinates: Vector2D
  explanation: string
}

export interface EuclideanBreakdown {
  formula: string
  substitution: string
  numericalSubstitution: string
  differenceCalculation: string
  squaredDifferences: string
  sum: string
  finalDistance: string
}

export interface CosineBreakdown {
  formula: string
  dotProduct: string
  queryLength: string
  docLength: string
  denominator: string
  finalSimilarity: string
}

export interface SemanticSnapshot {
  queryPoint: SemanticPoint
  documentPoints: SemanticPoint[]
  rankedDocuments: SemanticRankedDocument[]
  missedDocuments: SemanticMissedDocument[]
  defaultBreakdown: EuclideanBreakdown
  defaultCosineBreakdown?: CosineBreakdown
  metric: 'euclidean' | 'cosine'
}

export function formatTwoDecimals(value: number): string {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return '0.00'
  }
  return value.toFixed(2)
}

export function euclideanDistance(p1: Vector2D, p2: Vector2D): number {
  const dx = p1[0] - p2[0]
  const dy = p1[1] - p2[1]
  return Math.sqrt(dx * dx + dy * dy)
}

export function rankByEuclideanDistance(
  queryCoords: Vector2D,
  documents: { id: string; originalIndex: number; vector: Vector2D }[]
): { id: string; originalIndex: number; distance: number; rank: number }[] {
  const scored = documents.map((doc) => {
    const distance = euclideanDistance(queryCoords, doc.vector)
    return {
      id: doc.id,
      originalIndex: doc.originalIndex,
      distance,
    }
  })

  scored.sort((a, b) => {
    if (Math.abs(a.distance - b.distance) > 1e-9) {
      return a.distance - b.distance
    }
    return a.originalIndex - b.originalIndex
  })

  return scored.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }))
}

export function buildEuclideanBreakdown(
  queryLabel: string,
  docLabel: string,
  queryCoords: Vector2D,
  docCoords: Vector2D
): EuclideanBreakdown {
  const qx = queryCoords[0]
  const qy = queryCoords[1]
  const dx = docCoords[0]
  const dy = docCoords[1]

  const diffX = qx - dx
  const diffY = qy - dy

  const sqX = diffX * diffX
  const sqY = diffY * diffY
  const sumSq = sqX + sqY
  const dist = Math.sqrt(sumSq)

  const qxStr = formatTwoDecimals(qx)
  const qyStr = formatTwoDecimals(qy)
  const dxStr = formatTwoDecimals(dx)
  const dyStr = formatTwoDecimals(dy)

  const diffXStr = formatTwoDecimals(diffX)
  const diffYStr = formatTwoDecimals(diffY)

  const sqXStr = formatThreeDecimals(sqX)
  const sqYStr = formatThreeDecimals(sqY)
  const sumSqStr = formatThreeDecimals(sumSq)
  const distStr = formatThreeDecimals(dist)

  return {
    formula: 'd = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}',
    substitution: `d = \\sqrt{(${queryLabel}_x - ${docLabel}_x)^2 + (${queryLabel}_y - ${docLabel}_y)^2}`,
    numericalSubstitution: `d = \\sqrt{(${qxStr} - ${dxStr})^2 + (${qyStr} - ${dyStr})^2}`,
    differenceCalculation: `d = \\sqrt{(${diffXStr})^2 + (${diffYStr})^2}`,
    squaredDifferences: `d = \\sqrt{${sqXStr} + ${sqYStr}}`,
    sum: `d = \\sqrt{${sumSqStr}}`,
    finalDistance: distStr,
  }
}

export function cosineSimilarity(p1: Vector2D, p2: Vector2D): number {
  const mag1 = Math.sqrt(p1[0] * p1[0] + p1[1] * p1[1])
  const mag2 = Math.sqrt(p2[0] * p2[0] + p2[1] * p2[1])
  if (mag1 === 0 || mag2 === 0) {
    return 0
  }
  const dot = p1[0] * p2[0] + p1[1] * p2[1]
  const raw = dot / (mag1 * mag2)
  return Math.max(-1, Math.min(1, raw))
}

export function rankByCosineSimilarity(
  queryCoords: Vector2D,
  documents: { id: string; originalIndex: number; vector: Vector2D }[]
): { id: string; originalIndex: number; similarity: number; rank: number }[] {
  const scored = documents.map((doc) => {
    const similarity = cosineSimilarity(queryCoords, doc.vector)
    return {
      id: doc.id,
      originalIndex: doc.originalIndex,
      similarity,
    }
  })

  scored.sort((a, b) => {
    if (Math.abs(a.similarity - b.similarity) > 1e-9) {
      return b.similarity - a.similarity
    }
    return a.originalIndex - b.originalIndex
  })

  return scored.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }))
}

export function buildCosineBreakdown(
  queryLabel: string,
  docLabel: string,
  queryCoords: Vector2D,
  docCoords: Vector2D
): CosineBreakdown {
  const qx = queryCoords[0]
  const qy = queryCoords[1]
  const dx = docCoords[0]
  const dy = docCoords[1]

  const dot = qx * dx + qy * dy
  const magQ = Math.sqrt(qx * qx + qy * qy)
  const magD = Math.sqrt(dx * dx + dy * dy)
  const denom = magQ * magD
  const sim = denom === 0 ? 0 : dot / denom
  const clampedSim = Math.max(-1, Math.min(1, sim))

  const qxStr = formatTwoDecimals(qx)
  const qyStr = formatTwoDecimals(qy)
  const dxStr = formatTwoDecimals(dx)
  const dyStr = formatTwoDecimals(dy)

  const dotStr = formatThreeDecimals(dot)
  const magQStr = formatThreeDecimals(magQ)
  const magDStr = formatThreeDecimals(magD)
  const denomStr = formatThreeDecimals(denom)
  const simStr = formatThreeDecimals(clampedSim)

  return {
    formula: '\\text{sim}(\\mathbf{q}, \\mathbf{d}) = \\frac{\\mathbf{q} \\cdot \\mathbf{d}}{\\|\\mathbf{q}\\| \\|\\mathbf{d}\\|}',
    dotProduct: `\\mathbf{q} \\cdot \\mathbf{d} = q_x d_x + q_y d_y = (${qxStr} \\times ${dxStr}) + (${qyStr} \\times ${dyStr}) = ${dotStr}`,
    queryLength: `\\|\\mathbf{q}\\| = \\sqrt{q_x^2 + q_y^2} = \\sqrt{(${qxStr})^2 + (${qyStr})^2} = ${magQStr}`,
    docLength: `\\|\\mathbf{d}\\| = \\sqrt{d_x^2 + d_y^2} = \\sqrt{(${dxStr})^2 + (${dyStr})^2} = ${magDStr}`,
    denominator: `\\|\\mathbf{q}\\| \\|\\mathbf{d}\\| = ${magQStr} \\times ${magDStr} = ${denomStr}`,
    finalSimilarity: simStr,
  }
}

export function buildSemanticSnapshot(
  session: SimulationSession,
  keywordSnapshot: KeywordSnapshot
): SemanticSnapshot {
  const queryPoint: SemanticPoint = {
    id: 'query',
    label: 'Query',
    coordinates: session.vectors.query,
  }

  const documentPoints: SemanticPoint[] = session.documents.map((doc, idx) => {
    const coordinates = session.vectors.documents[doc.id] || [0, 0]
    return {
      id: doc.id,
      label: `D${idx + 1}`,
      coordinates,
    }
  })

  const docsForRanking = session.documents.map((doc, idx) => {
    const originalIndex = keywordSnapshot.documents.find((kd) => kd.id === doc.id)?.originalIndex ?? idx
    const vector = session.vectors.documents[doc.id] || [0, 0]
    return {
      id: doc.id,
      originalIndex,
      vector,
    }
  })

  const metric = session.semanticMetric || 'euclidean'
  let rankedScored: { id: string; originalIndex: number; rank: number; distance?: number; similarity?: number }[] = []

  if (metric === 'cosine') {
    const cosineRanked = rankByCosineSimilarity(session.vectors.query, docsForRanking)
    rankedScored = cosineRanked
  } else {
    const euclideanRanked = rankByEuclideanDistance(session.vectors.query, docsForRanking)
    rankedScored = euclideanRanked
  }

  const rankedDocuments: SemanticRankedDocument[] = rankedScored.map((rankedItem) => {
    const doc = session.documents.find((d) => d.id === rankedItem.id)!
    const docIdx = session.documents.findIndex((d) => d.id === rankedItem.id)
    const docLabel = `D${docIdx + 1}`
    const vector = session.vectors.documents[rankedItem.id] || [0, 0]
    
    const distance = rankedItem.distance ?? euclideanDistance(session.vectors.query, vector)
    const similarity = rankedItem.similarity ?? cosineSimilarity(session.vectors.query, vector)
    
    const breakdown = buildEuclideanBreakdown('Query', docLabel, session.vectors.query, vector)
    const cosineBreakdown = buildCosineBreakdown('Query', docLabel, session.vectors.query, vector)

    return {
      id: rankedItem.id,
      title: doc.title,
      text: doc.text,
      originalIndex: rankedItem.originalIndex,
      distance,
      similarity,
      rank: rankedItem.rank,
      coordinates: vector,
      breakdown,
      cosineBreakdown,
    }
  })

  const missedDocuments: SemanticMissedDocument[] = []
  if (session.scenarioId === 'keyword-misses-meaning' && session.query.toLowerCase().includes('phone')) {
    for (const doc of rankedDocuments) {
      const kwDoc = keywordSnapshot.documents.find((d) => d.id === doc.id)
      if (kwDoc && kwDoc.score === 0) {
        if (doc.text.toLowerCase().includes('iphone')) {
          missedDocuments.push({
            id: doc.id,
            title: doc.title,
            text: doc.text,
            originalIndex: doc.originalIndex,
            distance: doc.distance,
            coordinates: doc.coordinates,
            explanation: 'Score: 0.000 (Missed synonym: iPhone vs phone)',
          })
        }
      }
    }
  }

  const defaultBreakdown =
    rankedDocuments.length > 0
      ? rankedDocuments[0].breakdown
      : buildEuclideanBreakdown('Query', 'D1', session.vectors.query, [0, 0])

  const defaultCosineBreakdown =
    rankedDocuments.length > 0
      ? rankedDocuments[0].cosineBreakdown
      : buildCosineBreakdown('Query', 'D1', session.vectors.query, [0, 0])

  return {
    queryPoint,
    documentPoints,
    rankedDocuments,
    missedDocuments,
    defaultBreakdown,
    defaultCosineBreakdown,
    metric,
  }
}


