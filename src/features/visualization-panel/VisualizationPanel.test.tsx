import { render, screen } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { VisualizationPanel } from './VisualizationPanel'
import { buildKeywordSnapshot } from '@/domain/simulation'

describe('VisualizationPanel - Tokenization and Matching Steps', () => {
  test('Tokenization step renders Query Tokens and Document Tokens', () => {
    const query = 'the phone phone'
    const documents = [
      { id: 'doc1', title: 'Document 1', text: 'the new cell phone' },
      { id: 'doc2', title: 'Document 2', text: 'empty' }
    ]
    const snapshot = buildKeywordSnapshot(query, documents)

    render(
      <VisualizationPanel
        activeStepId="tokenization"
        activeStepTitle="Tokenization"
        keywordSnapshot={snapshot}
      />
    )

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

    render(
      <VisualizationPanel
        activeStepId="tokenization"
        activeStepTitle="Tokenization"
        keywordSnapshot={snapshot}
      />
    )

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

    render(
      <VisualizationPanel
        activeStepId="matching"
        activeStepTitle="Word Matching"
        keywordSnapshot={snapshot}
      />
    )

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

    const { container } = render(
      <VisualizationPanel
        activeStepId="tokenization"
        activeStepTitle="Tokenization"
        keywordSnapshot={snapshot}
      />
    )

    // Ensure no actual script or img element got injected
    const scriptTag = container.querySelector('script')
    const imgTag = container.querySelector('img[onerror]')
    expect(scriptTag).toBeNull()
    expect(imgTag).toBeNull()
  })
})
