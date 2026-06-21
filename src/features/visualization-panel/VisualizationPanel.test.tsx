import { render, screen } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { VisualizationPanel } from './VisualizationPanel'
import { buildKeywordSnapshot, buildSemanticSnapshot } from '@/domain/simulation'

function renderPanel(activeStepId: any, activeStepTitle: string, snapshot: any, isEdited = false) {
  const session = {
    scenarioId: 'exact-match-fails',
    query: '',
    documents: snapshot.documents.map((d: any) => ({ id: d.id, text: d.text })),
    vectors: {
      query: [0.5, 0.5] as [number, number],
      documents: snapshot.documents.reduce((acc: any, doc: any) => ({ ...acc, [doc.id]: [0.5, 0.5] as [number, number] }), {}),
    },
    activeStepId,
    semanticMetric: 'euclidean' as const,
  }
  const semanticSnapshot = buildSemanticSnapshot(session, snapshot)
  return render(
    <VisualizationPanel
      activeStepId={activeStepId}
      activeStepTitle={activeStepTitle}
      keywordSnapshot={snapshot}
      semanticSnapshot={semanticSnapshot}
      isEdited={isEdited}
      semanticMetric="euclidean"
      onSemanticMetricChange={() => {}}
    />
  )
}

describe('VisualizationPanel - Tokenization and Matching Steps', () => {
  test('Tokenization step renders Query Tokens and Document Tokens', () => {
    const query = 'the phone phone'
    const documents = [
      { id: 'doc1', title: 'Document 1', text: 'the new cell phone' },
      { id: 'doc2', title: 'Document 2', text: 'empty' }
    ]
    const snapshot = buildKeywordSnapshot(query, documents)

    renderPanel('tokenization', 'Tokenization', snapshot)

    // Check headings
    expect(screen.getByRole('heading', { name: /Query Tokens/i })).toBeDefined()
    expect(screen.getByRole('heading', { name: /Document Tokens/i })).toBeDefined()

    // Query tokens: "the", "phone", "phone" should all be visible as pills (repeated tokens preserved)
    const queryPills = screen.getAllByText('phone')
    // We expect 2 "phone" pills in the query tokens section
    expect(queryPills.length).toBeGreaterThanOrEqual(2)

    // Check document tokens
    expect(screen.getByText(/Document 1/i)).toBeDefined()
    expect(screen.getByText('cell')).toBeDefined()
  })

  test('Tokenization step handles empty or punctuation-only inputs gracefully', () => {
    const query = '!!!'
    const documents = [
      { id: 'doc1', title: 'Document 1', text: '...' }
    ]
    const snapshot = buildKeywordSnapshot(query, documents)

    renderPanel('tokenization', 'Tokenization', snapshot)

    // Heading "No tokens found" should render
    const noTokensHeadings = screen.getAllByText(/No tokens found/i)
    expect(noTokensHeadings.length).toBeGreaterThanOrEqual(1)

    // Standard empty state copywriting should be present
    expect(
      screen.getByText(
        /Type some words in the query or documents to see search engine calculations./i
      )
    ).toBeDefined()
  })

  test('Matching step renders document cards with checkmarked matched terms and dashed missing terms', () => {
    const query = 'phone laptop'
    const documents = [
      { id: 'doc1', title: 'Document 1', text: 'this is a phone' }
    ]
    const snapshot = buildKeywordSnapshot(query, documents)

    renderPanel('matching', 'Word Matching', snapshot)

    expect(screen.getByText(/Document 1/i)).toBeDefined()

    // Check text summary
    expect(
      screen.getByText(/Matched 1 of 2 terms\. Missing: laptop\./i)
    ).toBeDefined()

    // Check existence of terms
    expect(screen.getByText('phone')).toBeDefined()
    expect(screen.getByText('laptop')).toBeDefined()
  })

  test('Sanitization regression test: HTML is not rendered as markup', () => {
    const query = '<script>alert("xss")</script>'
    const documents = [
      { id: 'doc1', title: 'Document 1', text: '<img src=x onerror=alert(1)>' }
    ]
    const snapshot = buildKeywordSnapshot(query, documents)

    const { container } = renderPanel('tokenization', 'Tokenization', snapshot)

    // Ensure no actual script or img element got injected
    const scriptTag = container.querySelector('script')
    const imgTag = container.querySelector('img[onerror]')
    expect(scriptTag).toBeNull()
    expect(imgTag).toBeNull()
  })

  test('TermFrequencyStep renders columns, counts, total words, and relative TF with 3 decimals', () => {
    const query = 'phone laptop'
    const documents = [
      { id: 'doc1', title: 'Document 1', text: 'phone phone cell' }
    ]
    const snapshot = buildKeywordSnapshot(query, documents)

    renderPanel('term-frequency', 'Term Frequency', snapshot)

    // Verify table headers
    expect(screen.getByText('Query Term')).toBeDefined()
    expect(screen.getByText('Count in Doc')).toBeDefined()
    expect(screen.getByText('Total Words in Doc')).toBeDefined()
    expect(screen.getByText('Relative TF')).toBeDefined()

    // For 'phone': count = 2, total words = 3, tf = 2/3 = 0.667
    expect(screen.getByText('2')).toBeDefined()
    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('0.667')).toBeDefined()

    // For 'laptop': count = 0, total words = 3, tf = 0.000
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('0.000')).toBeDefined()
  })

  test('InverseDocumentFrequencyStep renders df, N, ratio, idf, and importance labels', () => {
    const query = 'phone rareterm'
    const documents = [
      { id: 'doc1', title: 'Document 1', text: 'phone cell' },
      { id: 'doc2', title: 'Document 2', text: 'phone screen' }
    ]
    const snapshot = buildKeywordSnapshot(query, documents)

    renderPanel('inverse-document-frequency', 'Inverse Document Frequency', snapshot)

    // Verify headers
    expect(screen.getByText('Doc Frequency (df)')).toBeDefined()
    expect(screen.getByText('Total Docs (N)')).toBeDefined()
    expect(screen.getByText('Raw Ratio')).toBeDefined()
    expect(screen.getByText('IDF (ln(N/df))')).toBeDefined()
    expect(screen.getByText('Importance')).toBeDefined()

    // For 'phone': df = 2, N = 2, raw ratio = 1.000, idf = ln(2/2) = 0.000
    expect(screen.getByText('1.000')).toBeDefined()
    expect(screen.getAllByText('0.000').length).toBeGreaterThanOrEqual(1)
    // Common (Weak) since df (2) > Math.floor(N / 2) (1)
    expect(screen.getByText('Common (Weak)')).toBeDefined()

    // For 'rareterm': df = 0, N = 2, raw ratio = 0.000, idf = 0.000
    // Rare (Strong) since df (0) <= Math.floor(N / 2) (1)
    expect(screen.getByText('Rare (Strong)')).toBeDefined()
  })

  test('TfidfStep renders TF-IDF table and scores with exactly 3 decimals and single row for duplicate terms', () => {
    const query = 'phone phone'
    const documents = [
      { id: 'doc1', title: 'Document 1', text: 'phone cell' }
    ]
    const snapshot = buildKeywordSnapshot(query, documents)

    renderPanel('tf-idf', 'TF-IDF Calculation', snapshot)

    // Check document card and score
    expect(screen.getByText('Document 1')).toBeDefined()
    expect(screen.getByText(/Document Score: 0\.000/i)).toBeDefined()

    // Table headers
    expect(screen.getByRole('columnheader', { name: 'Query Term' })).toBeDefined()
    expect(screen.getByRole('columnheader', { name: 'TF (Relative)' })).toBeDefined()
    expect(screen.getByRole('columnheader', { name: 'IDF' })).toBeDefined()
    expect(screen.getByRole('columnheader', { name: 'TF-IDF (TF * IDF)' })).toBeDefined()

    // Verify row details for 'phone' - only one row should render for 'phone'
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBe(2) // 1 header row + 1 data row for 'phone'
  })

  test('TfidfStep handles empty state gracefully', () => {
    const query = ''
    const documents = [{ id: 'doc1', title: 'Document 1', text: '' }]
    const snapshot = buildKeywordSnapshot(query, documents)

    renderPanel('tf-idf', 'TF-IDF Calculation', snapshot)

    expect(screen.getAllByText(/No tokens found/i).length).toBeGreaterThanOrEqual(1)
  })

  test('KeywordRankingStep renders ranking cards in snapshot.rankedDocuments order, with progressbar and explanations', () => {
    const query = 'phone laptop'
    const documents = [
      { id: 'doc1', title: 'Document 1', text: 'laptop' },
      { id: 'doc2', title: 'Document 2', text: 'phone laptop' }
    ]
    const snapshot = buildKeywordSnapshot(query, documents)

    renderPanel('keyword-ranking', 'Keyword Ranking', snapshot)

    // Check ranks and order: Document 2 should be #1, Document 1 should be #2
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings[0].textContent).toContain('#1')
    expect(headings[0].textContent).toContain('Document 2')
    expect(headings[1].textContent).toContain('#2')
    expect(headings[1].textContent).toContain('Document 1')

    // Check progress bars exist and have correct accessible labels and values
    const progressBars = screen.getAllByRole('progressbar')
    expect(progressBars.length).toBe(2)
    expect(progressBars[0].getAttribute('aria-label')).toBe('Keyword score for Document 2')
    expect(progressBars[0].getAttribute('aria-valuenow')).toBe('100') // doc2 is max score

    // Check explanation
    expect(screen.getAllByText(/Term 'phone' contributed/).length).toBe(2)
  })

  test('KeywordRankingStep handles true tie order and zero scores safely', () => {
    const query = 'phone'
    const documents = [
      { id: 'doc1', title: 'Document 1', text: 'cell' },
      { id: 'doc2', title: 'Document 2', text: 'screen' }
    ]
    const snapshot = buildKeywordSnapshot(query, documents)

    renderPanel('keyword-ranking', 'Keyword Ranking', snapshot)

    // Both scores are 0.000. Renders original index order: Document 1 (#1) then Document 2 (#2)
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings[0].textContent).toContain('#1')
    expect(headings[0].textContent).toContain('Document 1')
    expect(headings[1].textContent).toContain('#2')
    expect(headings[1].textContent).toContain('Document 2')

    // Progress bar for all-zero scores should be 0
    const progressBars = screen.getAllByRole('progressbar')
    expect(progressBars[0].getAttribute('aria-valuenow')).toBe('0')
    expect(progressBars[1].getAttribute('aria-valuenow')).toBe('0')
  })
})

describe('VisualizationPanel - Semantic Metric Toggle', () => {
  test('metric toggle appears on semantic-ranking and final-comparison steps but not setup', () => {
    const query = 'phone'
    const documents = [
      { id: 'doc1', title: 'Document 1', text: 'cell' }
    ]
    const snapshot = buildKeywordSnapshot(query, documents)

    // 1. Setup step -> no toggle
    const { unmount: unmountSetup } = renderPanel('setup', 'Setup', snapshot)
    expect(screen.queryByRole('group', { name: /Semantic metric/i })).toBeNull()
    unmountSetup()

    // 2. Semantic Ranking step -> toggle is visible
    const { unmount: unmountSemantic } = renderPanel('semantic-ranking', 'Semantic Ranking', snapshot)
    expect(screen.getByRole('group', { name: /Semantic metric/i })).toBeDefined()
    unmountSemantic()

    // 3. Final Comparison step -> toggle is visible
    const { unmount: unmountFinal } = renderPanel('final-comparison', 'Final Comparison', snapshot)
    expect(screen.getByRole('group', { name: /Semantic metric/i })).toBeDefined()
    unmountFinal()
  })
})


