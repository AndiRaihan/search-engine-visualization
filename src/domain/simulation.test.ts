import { describe, test, expect } from 'vitest'
import {
  buildSessionFromScenario,
  simulationReducer,
  selectIsEdited,
  selectCanGoNext,
  selectCanGoPrevious,
  selectProgress,
  tokenize,
  uniqueTermsInOrder,
  getTermFrequency,
  getDocumentFrequency,
  getIdf,
  getTfidf,
  getDocumentKeywordScore,
  rankByKeywordScore,
  formatThreeDecimals,
  buildKeywordSnapshot,
  formatTwoDecimals,
  euclideanDistance,
  rankByEuclideanDistance,
  buildEuclideanBreakdown,
  buildSemanticSnapshot,
} from './simulation'
import type { Scenario, KeywordDocumentSnapshot } from './simulation'
import { scenarios } from '@/content/scenarios'
import { buildKeywordStepSession } from '../test/keyword-step-session'




describe('Simulation Domain Model and Reducer', () => {
  const scenario1 = scenarios[0]
  const scenario2 = scenarios[1]

  test('buildSessionFromScenario creates independent deep clones', () => {
    const session1 = buildSessionFromScenario(scenario1)
    const session2 = buildSessionFromScenario(scenario1)

    // Verify independent arrays
    expect(session1.documents).not.toBe(scenario1.documents)
    expect(session1.documents).not.toBe(session2.documents)
    
    // Verify editing document in session1 doesn't affect scenario or session2
    session1.documents[0].text = 'Modified Text'
    expect(scenario1.documents[0].text).not.toBe('Modified Text')
    expect(session2.documents[0].text).not.toBe('Modified Text')

    // Verify independent vectors
    expect(session1.vectors).not.toBe(scenario1.vectors)
    expect(session1.vectors.query).not.toBe(scenario1.vectors.query)
    expect(session1.vectors.documents).not.toBe(scenario1.vectors.documents)
  })

  test('scenarioSelected switches scenario and resets step to setup', () => {
    const initialState = buildSessionFromScenario(scenario1)
    initialState.activeStepId = 'tokenization'

    const action = { type: 'scenarioSelected' as const, scenario: scenario2 }
    const nextState = simulationReducer(initialState, action)

    expect(nextState.scenarioId).toBe(scenario2.id)
    expect(nextState.activeStepId).toBe('setup')
    expect(nextState.query).toBe(scenario2.defaultQuery)
  })

  test('queryChanged changes query and marks session as edited', () => {
    const session = buildSessionFromScenario(scenario1)
    expect(selectIsEdited(session, scenario1)).toBe(false)

    const action = { type: 'queryChanged' as const, value: 'new query' }
    const nextState = simulationReducer(session, action)

    expect(nextState.query).toBe('new query')
    expect(selectIsEdited(nextState, scenario1)).toBe(true)

    // Reverting query back makes it unedited
    const revertAction = { type: 'queryChanged' as const, value: scenario1.defaultQuery }
    const revertedState = simulationReducer(nextState, revertAction)
    expect(selectIsEdited(revertedState, scenario1)).toBe(false)
  })

  test('documentChanged changes document text by stable ID', () => {
    const session = buildSessionFromScenario(scenario1)
    const targetDocId = 'doc-4'
    const targetDoc = session.documents.find(d => d.id === targetDocId)!
    const originalText = targetDoc.text

    const action = { type: 'documentChanged' as const, documentId: targetDocId, value: 'new doc text' }
    const nextState = simulationReducer(session, action)

    const nextTargetDoc = nextState.documents.find(d => d.id === targetDocId)!
    expect(nextTargetDoc.text).toBe('new doc text')
    expect(selectIsEdited(nextState, scenario1)).toBe(true)

    // Verify other docs are unchanged
    const otherDoc = nextState.documents.find(d => d.id === 'doc-1')!
    expect(otherDoc.text).toBe(session.documents.find(d => d.id === 'doc-1')!.text)

    // Revert doc text back to default
    const revertAction = { type: 'documentChanged' as const, documentId: targetDocId, value: originalText }
    const revertedState = simulationReducer(nextState, revertAction)
    expect(selectIsEdited(revertedState, scenario1)).toBe(false)
  })

  test('accepts scenarios with arbitrary document counts', () => {
    const customScenario: Scenario = {
      id: 'custom',
      title: 'Custom',
      description: 'Custom',
      learningGoal: 'Custom',
      defaultQuery: 'test',
      documents: [
        { id: 'custom-1', text: 'One doc' }
      ],
      vectors: {
        query: [0, 0],
        documents: {
          'custom-1': [1, 1]
        }
      }
    }

    const session = buildSessionFromScenario(customScenario)
    expect(session.documents.length).toBe(1)
    expect(session.documents[0].id).toBe('custom-1')

    const action = { type: 'documentChanged' as const, documentId: 'custom-1', value: 'Changed' }
    const nextState = simulationReducer(session, action)
    expect(nextState.documents[0].text).toBe('Changed')
  })

  test('resetConfirmed reconstructs defaults and returns to setup', () => {
    const session = buildSessionFromScenario(scenario1)
    session.query = 'edited query'
    session.documents[0].text = 'edited doc'
    session.activeStepId = 'tf-idf'

    const action = { type: 'resetConfirmed' as const, scenario: scenario1 }
    const nextState = simulationReducer(session, action)

    expect(nextState.query).toBe(scenario1.defaultQuery)
    expect(nextState.documents[0].text).toBe(scenario1.documents[0].text)
    expect(nextState.activeStepId).toBe('setup')
    expect(selectIsEdited(nextState, scenario1)).toBe(false)
  })

  test('navigation boundaries are respected', () => {
    expect(selectCanGoPrevious('setup')).toBe(false)
    expect(selectCanGoPrevious('tokenization')).toBe(false)
    expect(selectCanGoPrevious('matching')).toBe(true)

    expect(selectCanGoNext('setup')).toBe(true)
    expect(selectCanGoNext('final-comparison')).toBe(false)

    expect(selectProgress('setup')).toBe(0)
    expect(selectProgress('final-comparison')).toBe(100)
  })
})

describe('Phase 2 - Task 1: Tokenization and Session Factory', () => {
  test('tokenize lowercases and splits punctuation boundaries', () => {
    const tokens = tokenize("iPhone's latest-model!")
    expect(tokens).toEqual(['iphone', 's', 'latest', 'model'])
  })

  test('tokenize empty or punctuation-only yields empty array', () => {
    expect(tokenize('')).toEqual([])
    expect(tokenize('   ')).toEqual([])
    expect(tokenize('!!!')).toEqual([])
    expect(tokenize(" ' - ! ")).toEqual([])
  })

  test('uniqueTermsInOrder returns unique lowercase tokens in first-occurrence order', () => {
    const tokens = ['iphone', 'iphone', 'the', 'iphone', 'model', 'the']
    expect(uniqueTermsInOrder(tokens)).toEqual(['iphone', 'the', 'model'])
  })

  test('buildKeywordStepSession creates session at requested step with overrides', () => {
    const session = buildKeywordStepSession('term-frequency', { query: 'custom query' })
    expect(session.activeStepId).toBe('term-frequency')
    expect(session.query).toBe('custom query')
    expect(session.scenarioId).toBe(scenarios[0].id)
  })
})

describe('Phase 2 - Task 2: TF and IDF statistics', () => {
  test('getTermFrequency computes count / total document words', () => {
    const docTokens = ['the', 'iphone', 'is', 'cool', 'iphone']
    expect(getTermFrequency('iphone', docTokens)).toBe(0.4) // 2 / 5
    expect(getTermFrequency('the', docTokens)).toBe(0.2) // 1 / 5
    expect(getTermFrequency('missing', docTokens)).toBe(0)
    expect(getTermFrequency('iphone', [])).toBe(0) // empty doc
  })

  test('getDocumentFrequency counts documents containing term at least once', () => {
    const corpora = [
      ['iphone', 'cool'],
      ['android', 'cool'],
      ['iphone', 'iphone'],
    ]
    expect(getDocumentFrequency('iphone', corpora)).toBe(2)
    expect(getDocumentFrequency('cool', corpora)).toBe(2)
    expect(getDocumentFrequency('missing', corpora)).toBe(0)
    expect(getDocumentFrequency('iphone', [])).toBe(0)
  })

  test('getIdf computes natural-log ln(N/df) unsmoothed, guards df/N=0', () => {
    const corpora = [
      ['iphone'],
      ['android'],
    ]
    // N=2, df=1 => ln(2/1) = ln(2) ~ 0.6931471805599453
    expect(getIdf('iphone', corpora)).toBeCloseTo(0.693147, 5)
    // N=2, df=2 => ln(2/2) = ln(1) = 0
    const corpora2 = [['iphone'], ['iphone']]
    expect(getIdf('iphone', corpora2)).toBe(0)
    // df=0 => returns 0
    expect(getIdf('missing', corpora)).toBe(0)
    // empty N => returns 0
    expect(getIdf('iphone', [])).toBe(0)
  })
})

describe('Phase 2 - Task 3: TF-IDF, Ranking, and Snapshot Builder', () => {
  test('getTfidf computes tf * idf', () => {
    expect(getTfidf(0.5, 2.0)).toBe(1.0)
    expect(getTfidf(0, 5.0)).toBe(0)
  })

  test('getDocumentKeywordScore sums contributions', () => {
    const contribs = {
      iphone: { term: 'iphone', count: 1, totalWords: 2, tf: 0.5, idf: 2.0, tfidf: 1.0 },
      the: { term: 'the', count: 1, totalWords: 2, tf: 0.5, idf: 0, tfidf: 0 },
    }
    expect(getDocumentKeywordScore(contribs)).toBe(1.0)
  })

  test('formatThreeDecimals returns finite three-decimal strings, default 0.000', () => {
    expect(formatThreeDecimals(0.45)).toBe('0.450')
    expect(formatThreeDecimals(1 / 3)).toBe('0.333')
    expect(formatThreeDecimals(0)).toBe('0.000')
    expect(formatThreeDecimals(NaN)).toBe('0.000')
    expect(formatThreeDecimals(Infinity)).toBe('0.000')
    expect(formatThreeDecimals(-Infinity)).toBe('0.000')
  })

  test('rankByKeywordScore ranks descending by score, tie-breaks on original index', () => {
    const docs: KeywordDocumentSnapshot[] = [
      {
        id: 'doc-a',
        text: 'a',
        originalIndex: 0,
        tokens: ['a'],
        matchSummary: { matchedTerms: ['a'], missingTerms: [] },
        contributions: { a: { term: 'a', count: 1, totalWords: 1, tf: 1, idf: 0.3333, tfidf: 0.3333 } },
        score: 0.3333,
      },
      {
        id: 'doc-b',
        text: 'b',
        originalIndex: 1,
        tokens: ['b'],
        matchSummary: { matchedTerms: [], missingTerms: ['a'] },
        contributions: { a: { term: 'a', count: 0, totalWords: 1, tf: 0, idf: 0.3333, tfidf: 0.0000 } },
        score: 0.3331,
      },
      {
        id: 'doc-c',
        text: 'c',
        originalIndex: 2,
        tokens: ['c'],
        matchSummary: { matchedTerms: ['a'], missingTerms: [] },
        contributions: { a: { term: 'a', count: 1, totalWords: 1, tf: 1, idf: 0.3333, tfidf: 0.3333 } },
        score: 0.3333,
      },
    ]

    const ranked = rankByKeywordScore(docs)

    expect(ranked.length).toBe(3)
    // Rank 1: Doc A (score 0.3333, index 0)
    expect(ranked[0].id).toBe('doc-a')
    expect(ranked[0].rank).toBe(1)
    // Rank 2: Doc C (score 0.3333, index 2)
    expect(ranked[1].id).toBe('doc-c')
    expect(ranked[1].rank).toBe(2)
    // Rank 3: Doc B (score 0.3331, index 1)
    expect(ranked[2].id).toBe('doc-b')
    expect(ranked[2].rank).toBe(3)
  })

  test('explanations cite query terms in order and display rounded contributions', () => {
    const docs: KeywordDocumentSnapshot[] = [
      {
        id: 'doc-a',
        text: 'a b',
        originalIndex: 0,
        tokens: ['a', 'b'],
        matchSummary: { matchedTerms: ['a'], missingTerms: ['b'] },
        contributions: {
          iphone: { term: 'iphone', count: 1, totalWords: 2, tf: 0.5, idf: 0.9, tfidf: 0.45 },
          the: { term: 'the', count: 1, totalWords: 2, tf: 0.5, idf: 0, tfidf: 0 },
        },
        score: 0.45,
      },
    ]

    const ranked = rankByKeywordScore(docs)
    expect(ranked[0].explanation).toBe(
      "Score: 0.450. Term 'iphone' contributed 0.450, 'the' contributed 0.000."
    )
  })

  test('buildKeywordSnapshot creates full keyword snapshot from query and documents', () => {
    const query = 'the iphone'
    const docs = [
      { id: '1', title: 'Doc 1', text: 'the iphone' },
      { id: '2', title: 'Doc 2', text: 'iphone latest model' },
    ]

    const snapshot = buildKeywordSnapshot(query, docs)

    expect(snapshot.queryTokens).toEqual(['the', 'iphone'])
    expect(snapshot.queryTerms).toEqual(['the', 'iphone'])
    expect(snapshot.termStatistics.iphone.documentFrequency).toBe(2)
    expect(snapshot.termStatistics.the.documentFrequency).toBe(1)
    expect(snapshot.documents.length).toBe(2)
    expect(snapshot.rankedDocuments.length).toBe(2)
    expect(snapshot.maxScore).toBeGreaterThan(0)
    expect(snapshot.rankedDocuments[0].explanation).toContain('Score:')
  })
})

describe('Phase 3 - semantic vectors and Euclidean distance', () => {
  test('semantic: every scenario document has a matching vector in [0, 1] coordinates', () => {
    for (const scenario of scenarios) {
      const session = buildSessionFromScenario(scenario)
      expect(session.vectors.query[0]).toBeGreaterThanOrEqual(0)
      expect(session.vectors.query[0]).toBeLessThanOrEqual(1)
      expect(session.vectors.query[1]).toBeGreaterThanOrEqual(0)
      expect(session.vectors.query[1]).toBeLessThanOrEqual(1)

      for (const doc of scenario.documents) {
        const docVector = session.vectors.documents[doc.id]
        expect(docVector).toBeDefined()
        expect(docVector[0]).toBeGreaterThanOrEqual(0)
        expect(docVector[0]).toBeLessThanOrEqual(1)
        expect(docVector[1]).toBeGreaterThanOrEqual(0)
        expect(docVector[1]).toBeLessThanOrEqual(1)
      }
    }
  })

  test('semantic: editing query/document text leaves session.vectors equal to scenario defaults', () => {
    const scenario = scenarios[0]
    const session = buildSessionFromScenario(scenario)
    const initialQueryVector = [...session.vectors.query]
    const initialDocVectors = { ...session.vectors.documents }

    const nextStateQuery = simulationReducer(session, { type: 'queryChanged', value: 'new search text' })
    expect(nextStateQuery.vectors.query).toEqual(initialQueryVector)
    expect(nextStateQuery.vectors.documents).toEqual(initialDocVectors)

    const nextStateDoc = simulationReducer(session, {
      type: 'documentChanged',
      documentId: scenario.documents[0].id,
      value: 'new doc text'
    })
    expect(nextStateDoc.vectors.query).toEqual(initialQueryVector)
    expect(nextStateDoc.vectors.documents).toEqual(initialDocVectors)
  })

  test('euclidean: euclideanDistance computes correct distance and formatTwoDecimals format coords', () => {
    const dist = euclideanDistance([0.80, 0.70], [0.90, 0.80])
    expect(dist).toBeCloseTo(0.141421, 6)

    expect(formatThreeDecimals(dist)).toBe('0.141')

    expect(formatTwoDecimals(0.8)).toBe('0.80')
    expect(formatTwoDecimals(0.755)).toBe('0.76')
    expect(formatTwoDecimals(0)).toBe('0.00')
  })

  test('euclidean: rankByEuclideanDistance sorts by raw smallest distance and tie-breaks deterministically', () => {
    const queryPoint: [number, number] = [0.5, 0.5]
    const docs = [
      { id: 'doc-a', originalIndex: 0, vector: [0.6, 0.6] as [number, number] },
      { id: 'doc-b', originalIndex: 1, vector: [0.9, 0.9] as [number, number] },
      { id: 'doc-c', originalIndex: 2, vector: [0.6, 0.6] as [number, number] },
    ]

    const ranked = rankByEuclideanDistance(queryPoint, docs)
    expect(ranked.length).toBe(3)
    expect(ranked[0].id).toBe('doc-a')
    expect(ranked[0].rank).toBe(1)
    expect(ranked[1].id).toBe('doc-c')
    expect(ranked[1].rank).toBe(2)
    expect(ranked[2].id).toBe('doc-b')
    expect(ranked[2].rank).toBe(3)
  })

  test('euclidean: buildEuclideanBreakdown exposes formula, substitutions, calculations', () => {
    const breakdown = buildEuclideanBreakdown('Query', 'D1', [0.80, 0.70], [0.90, 0.80])
    expect(breakdown.formula).toBe('d = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}')
    expect(breakdown.substitution).toBe('d = \\sqrt{(Query_x - D1_x)^2 + (Query_y - D1_y)^2}')
    expect(breakdown.numericalSubstitution).toBe('d = \\sqrt{(0.80 - 0.90)^2 + (0.70 - 0.80)^2}')
    expect(breakdown.differenceCalculation).toBe('d = \\sqrt{(-0.10)^2 + (-0.10)^2}')
    expect(breakdown.squaredDifferences).toBe('d = \\sqrt{0.010 + 0.010}')
    expect(breakdown.sum).toBe('d = \\sqrt{0.020}')
    expect(breakdown.finalDistance).toBe('0.141')
  })

  test('semantic: buildSemanticSnapshot integrates all semantic data', () => {
    const scenario = scenarios[0]
    const session = buildSessionFromScenario(scenario)
    const keywordSnapshot = buildKeywordSnapshot(session.query, session.documents)
    const snapshot = buildSemanticSnapshot(session, keywordSnapshot)

    expect(snapshot.queryPoint.label).toBe('Query')
    expect(snapshot.queryPoint.coordinates).toEqual(session.vectors.query)
    expect(snapshot.documentPoints.length).toBe(session.documents.length)
    expect(snapshot.documentPoints[0].label).toBe('D1')
    expect(snapshot.rankedDocuments.length).toBe(session.documents.length)
    expect(snapshot.rankedDocuments[0].rank).toBe(1)
    expect(snapshot.rankedDocuments[0].distance).toBeGreaterThanOrEqual(0)
    expect(snapshot.defaultBreakdown).toBeDefined()
    expect(snapshot.defaultBreakdown.finalDistance).toBeDefined()
  })
})



