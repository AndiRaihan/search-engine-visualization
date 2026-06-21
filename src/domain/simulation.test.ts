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
  cosineSimilarity,
  rankByCosineSimilarity,
  buildCosineBreakdown,
  buildFinalComparisonSnapshot,
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

describe('Phase 4 - Cosine similarity and ranking', () => {
  test('cosine: cosineSimilarity computes dot product divided by vector magnitudes', () => {
    const sim = cosineSimilarity([0.8, 0.6], [0.8, 0.6]) // identical vectors -> similarity = 1
    expect(sim).toBeCloseTo(1.0, 5)

    const simOrthogonal = cosineSimilarity([1.0, 0.0], [0.0, 1.0]) // orthogonal vectors -> similarity = 0
    expect(simOrthogonal).toBe(0)

    const simOpposite = cosineSimilarity([1.0, 1.0], [-1.0, -1.0]) // opposite vectors -> similarity = -1
    expect(simOpposite).toBeCloseTo(-1.0, 5)

    const simAngle = cosineSimilarity([3.0, 4.0], [4.0, 3.0]) // dot product = 12 + 12 = 24. magnitudes = 5 and 5. sim = 24 / 25 = 0.96
    expect(simAngle).toBeCloseTo(0.96, 5)
  })

  test('cosine: zero vector returns finite raw similarity 0 and formats to 0.000', () => {
    const sim1 = cosineSimilarity([0.0, 0.0], [1.0, 1.0])
    expect(sim1).toBe(0)
    expect(formatThreeDecimals(sim1)).toBe('0.000')

    const sim2 = cosineSimilarity([1.0, 1.0], [0.0, 0.0])
    expect(sim2).toBe(0)
    expect(formatThreeDecimals(sim2)).toBe('0.000')

    const sim3 = cosineSimilarity([0.0, 0.0], [0.0, 0.0])
    expect(sim3).toBe(0)
    expect(formatThreeDecimals(sim3)).toBe('0.000')
  })

  test('cosine: deterministic ranking sorts by raw highest similarity and uses originalIndex for ties', () => {
    const queryPoint: [number, number] = [0.5, 0.5]
    const docs = [
      { id: 'doc-a', originalIndex: 0, vector: [0.6, 0.6] as [number, number] }, // sim = 1
      { id: 'doc-b', originalIndex: 1, vector: [0.1, 0.9] as [number, number] }, // sim = (0.05 + 0.45) / (sqrt(0.5) * sqrt(0.82)) = 0.5 / (0.7071 * 0.9055) ~ 0.7808
      { id: 'doc-c', originalIndex: 2, vector: [0.6, 0.6] as [number, number] }, // sim = 1
    ]

    const ranked = rankByCosineSimilarity(queryPoint, docs)
    expect(ranked.length).toBe(3)
    // Doc A should be rank 1 (sim = 1, originalIndex = 0)
    expect(ranked[0].id).toBe('doc-a')
    expect(ranked[0].rank).toBe(1)
    expect(ranked[0].similarity).toBeCloseTo(1.0, 5)

    // Doc C should be rank 2 (sim = 1, originalIndex = 2) - tie break by originalIndex
    expect(ranked[1].id).toBe('doc-c')
    expect(ranked[1].rank).toBe(2)
    expect(ranked[1].similarity).toBeCloseTo(1.0, 5)

    // Doc B should be rank 3 (sim ~ 0.78)
    expect(ranked[2].id).toBe('doc-b')
    expect(ranked[2].rank).toBe(3)
    expect(ranked[2].similarity).toBeCloseTo(0.780869, 5)
  })

  test('cosine: cosine breakdown exposes formula, dot product, query length, doc length, denominator, and final similarity', () => {
    const breakdown = buildCosineBreakdown([0.80, 0.60], [0.60, 0.80])
    
    // Formula check
    expect(breakdown.formula).toBe('\\text{sim}(\\mathbf{q}, \\mathbf{d}) = \\frac{\\mathbf{q} \\cdot \\mathbf{d}}{\\|\\mathbf{q}\\| \\|\\mathbf{d}\\|}')
    
    // Dot product substitution and evaluation: (0.80 * 0.60) + (0.60 * 0.80) = 0.48 + 0.48 = 0.96
    expect(breakdown.dotProduct).toContain('0.80')
    expect(breakdown.dotProduct).toContain('0.60')
    expect(breakdown.dotProduct).toContain('0.96')

    // Query length: \sqrt{qx^2 + qy^2} = val
    expect(breakdown.queryLength).toContain('1.00')

    // Doc length
    expect(breakdown.docLength).toContain('1.00')

    // Denominator: length q * length d = 1.00 * 1.00 = 1.00
    expect(breakdown.denominator).toContain('1.00')

    // Final similarity
    expect(breakdown.finalSimilarity).toBe('0.960')
  })

  test('cosine: domain engine coverage covers tokenization, TF, IDF, TF-IDF, Euclidean, Cosine, and rankings', () => {
    expect(tokenize('Hello world')).toEqual(['hello', 'world'])
    expect(getTermFrequency('hello', ['hello', 'world'])).toBe(0.5)
    expect(getDocumentFrequency('hello', [['hello', 'world']])).toBe(1)
    expect(getIdf('hello', [['hello', 'world']])).toBe(0)
    expect(getTfidf(0.5, 0.5)).toBe(0.25)
    expect(euclideanDistance([0, 0], [3, 4])).toBe(5)
    expect(cosineSimilarity([1, 0], [1, 0])).toBe(1)
    
    const kwRanked = rankByKeywordScore([
      {
        id: '1',
        text: 'hello',
        originalIndex: 0,
        tokens: ['hello'],
        matchSummary: { matchedTerms: ['hello'], missingTerms: [] },
        contributions: { hello: { term: 'hello', count: 1, totalWords: 1, tf: 1, idf: 1, tfidf: 1 } },
        score: 1,
      }
    ])
    expect(kwRanked[0].rank).toBe(1)

    const semRanked = rankByEuclideanDistance([0, 0], [
      { id: '1', originalIndex: 0, vector: [1, 1] }
    ])
    expect(semRanked[0].rank).toBe(1)
  })

  test('cosine: metricToggled toggles or sets metric without losing progress', () => {
    const session = buildSessionFromScenario(scenarios[0])
    expect(session.semanticMetric).toBe('euclidean')

    const setCosineState = simulationReducer(session, { type: 'metricToggled', metric: 'cosine' })
    expect(setCosineState.semanticMetric).toBe('cosine')
    expect(setCosineState.query).toBe(session.query)

    const setEuclideanState = simulationReducer(setCosineState, { type: 'metricToggled', metric: 'euclidean' })
    expect(setEuclideanState.semanticMetric).toBe('euclidean')

    const toggledState1 = simulationReducer(session, { type: 'metricToggled' })
    expect(toggledState1.semanticMetric).toBe('cosine')

    const toggledState2 = simulationReducer(toggledState1, { type: 'metricToggled' })
    expect(toggledState2.semanticMetric).toBe('euclidean')
  })

  describe('final comparison selector', () => {
    test('joins keyword and selected semantic rankings correctly', () => {
      const session = buildSessionFromScenario(scenarios[0])
      const kwSnapshot = buildKeywordSnapshot(session.query, session.documents)
      const semSnapshot = buildSemanticSnapshot(session, kwSnapshot)

      const finalSnapshot = buildFinalComparisonSnapshot(kwSnapshot, semSnapshot, 'euclidean')

      expect(finalSnapshot.metric).toBe('euclidean')
      expect(finalSnapshot.rows.length).toBe(session.documents.length)

      // Check row properties
      const firstRow = finalSnapshot.rows[0]
      expect(firstRow).toHaveProperty('id')
      expect(firstRow).toHaveProperty('documentLabel')
      expect(firstRow.documentLabel).toMatch(/^D\d+$/)
      expect(firstRow).toHaveProperty('keywordRank')
      expect(firstRow).toHaveProperty('semanticRank')
      expect(firstRow).toHaveProperty('rankDelta')
      expect(firstRow).toHaveProperty('movementDirection')
      expect(firstRow).toHaveProperty('movementLabel')
      expect(firstRow).toHaveProperty('keywordScore')
      expect(firstRow).toHaveProperty('semanticMetricLabel')
      expect(firstRow.semanticMetricLabel).toBe('Distance')
      expect(firstRow).toHaveProperty('semanticMetricValue')
      expect(firstRow).toHaveProperty('keywordExplanation')
      expect(firstRow).toHaveProperty('semanticExplanation')
      expect(firstRow).toHaveProperty('keywordContributions')
      expect(firstRow).toHaveProperty('semanticCoordinates')
      expect(firstRow).toHaveProperty('euclideanBreakdown')
    })

    test('rank movement uses keywordRank - semanticRank', () => {
      const fakeKwSnapshot = {
        queryTokens: [],
        queryTerms: [],
        termStatistics: {},
        documents: [
          { id: 'doc1', title: 'Doc 1', text: 'Text 1', originalIndex: 0, tokens: [], matchSummary: { matchedTerms: [], missingTerms: [] }, contributions: {}, score: 1 },
          { id: 'doc2', title: 'Doc 2', text: 'Text 2', originalIndex: 1, tokens: [], matchSummary: { matchedTerms: [], missingTerms: [] }, contributions: {}, score: 2 },
          { id: 'doc3', title: 'Doc 3', text: 'Text 3', originalIndex: 2, tokens: [], matchSummary: { matchedTerms: [], missingTerms: [] }, contributions: {}, score: 3 },
        ],
        rankedDocuments: [
          { id: 'doc3', title: 'Doc 3', text: 'Text 3', originalIndex: 2, score: 3, rank: 1, explanation: 'Rank 1' },
          { id: 'doc2', title: 'Doc 2', text: 'Text 2', originalIndex: 1, score: 2, rank: 2, explanation: 'Rank 2' },
          { id: 'doc1', title: 'Doc 1', text: 'Text 1', originalIndex: 0, score: 1, rank: 3, explanation: 'Rank 3' },
        ],
        maxScore: 3,
      } as any

      const fakeSemSnapshot = {
        queryPoint: { id: 'query', label: 'Query', coordinates: [0, 0] },
        documentPoints: [],
        rankedDocuments: [
          { id: 'doc1', title: 'Doc 1', text: 'Text 1', originalIndex: 0, distance: 0.1, rank: 1, coordinates: [1, 1], breakdown: {} },
          { id: 'doc2', title: 'Doc 2', text: 'Text 2', originalIndex: 1, distance: 0.2, rank: 2, coordinates: [2, 2], breakdown: {} },
          { id: 'doc3', title: 'Doc 3', text: 'Text 3', originalIndex: 2, distance: 0.3, rank: 3, coordinates: [3, 3], breakdown: {} },
        ],
        missedDocuments: [],
        defaultBreakdown: {},
        metric: 'euclidean',
      } as any

      const finalSnapshot = buildFinalComparisonSnapshot(fakeKwSnapshot, fakeSemSnapshot, 'euclidean')

      // doc1: kwRank 3, semRank 1. Delta: 3 - 1 = +2 (Moved up 2)
      const doc1Row = finalSnapshot.rows.find((r) => r.id === 'doc1')!
      expect(doc1Row.keywordRank).toBe(3)
      expect(doc1Row.semanticRank).toBe(1)
      expect(doc1Row.rankDelta).toBe(2)
      expect(doc1Row.movementDirection).toBe('up')
      expect(doc1Row.movementLabel).toBe('Moved up 2')

      // doc2: kwRank 2, semRank 2. Delta: 2 - 2 = 0 (No change)
      const doc2Row = finalSnapshot.rows.find((r) => r.id === 'doc2')!
      expect(doc2Row.keywordRank).toBe(2)
      expect(doc2Row.semanticRank).toBe(2)
      expect(doc2Row.rankDelta).toBe(0)
      expect(doc2Row.movementDirection).toBe('none')
      expect(doc2Row.movementLabel).toBe('No change')

      // doc3: kwRank 1, semRank 3. Delta: 1 - 3 = -2 (Moved down 2)
      const doc3Row = finalSnapshot.rows.find((r) => r.id === 'doc3')!
      expect(doc3Row.keywordRank).toBe(1)
      expect(doc3Row.semanticRank).toBe(3)
      expect(doc3Row.rankDelta).toBe(-2)
      expect(doc3Row.movementDirection).toBe('down')
      expect(doc3Row.movementLabel).toBe('Moved down 2')
    })

    test('explanations and labels adjust based on active metric (euclidean vs cosine)', () => {
      const session = buildSessionFromScenario(scenarios[0])
      const kwSnapshot = buildKeywordSnapshot(session.query, session.documents)

      // Test Euclidean
      const semSnapshotEuc = buildSemanticSnapshot({ ...session, semanticMetric: 'euclidean' }, kwSnapshot)
      const finalSnapshotEuc = buildFinalComparisonSnapshot(kwSnapshot, semSnapshotEuc, 'euclidean')
      expect(finalSnapshotEuc.rows[0].semanticMetricLabel).toBe('Distance')
      expect(finalSnapshotEuc.rows[0].semanticExplanation).toContain('Distance:')

      // Test Cosine
      const semSnapshotCos = buildSemanticSnapshot({ ...session, semanticMetric: 'cosine' }, kwSnapshot)
      const finalSnapshotCos = buildFinalComparisonSnapshot(kwSnapshot, semSnapshotCos, 'cosine')
      expect(finalSnapshotCos.rows[0].semanticMetricLabel).toBe('Similarity')
      expect(finalSnapshotCos.rows[0].semanticExplanation).toContain('Similarity:')
    })
  })
})



