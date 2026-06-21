import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { FinalComparisonStep } from './FinalComparisonStep'
import {
  buildKeywordSnapshot,
  buildSemanticSnapshot,
  buildFinalComparisonSnapshot,
  buildSessionFromScenario,
} from '@/domain/simulation'
import { scenarios } from '@/content/scenarios'

describe('FinalComparisonStep Component', () => {
  const scenario = scenarios[0]

  function getSnapshots(metric: 'euclidean' | 'cosine') {
    const session = {
      ...buildSessionFromScenario(scenario),
      semanticMetric: metric,
    }
    const kwSnapshot = buildKeywordSnapshot(session.query, session.documents)
    const semSnapshot = buildSemanticSnapshot(session, kwSnapshot)
    const comparisonSnapshot = buildFinalComparisonSnapshot(kwSnapshot, semSnapshot, metric)
    return { comparisonSnapshot, session }
  }

  test('renders Keyword ranking and Semantic ranking side by side', () => {
    const { comparisonSnapshot } = getSnapshots('euclidean')
    render(<FinalComparisonStep comparisonSnapshot={comparisonSnapshot} />)

    // Verify headings
    expect(screen.getByRole('heading', { name: 'Keyword ranking' })).toBeDefined()
    expect(screen.getByRole('heading', { name: 'Semantic ranking' })).toBeDefined()
  })

  test('every document row exposes ranks, text-first movement, and non-color symbols', () => {
    // Let's create a custom snapshot where we control the rank movements to test all delta cases
    const fakeSnapshot = {
      metric: 'euclidean' as const,
      rows: [
        {
          id: 'doc1',
          title: 'Doc 1',
          text: 'Text 1',
          originalIndex: 0,
          documentLabel: 'D1',
          keywordRank: 3,
          semanticRank: 1,
          rankDelta: 2,
          movementDirection: 'up' as const,
          movementLabel: 'Moved up 2',
          keywordScore: 0.5,
          semanticMetricLabel: 'Distance',
          semanticMetricValue: 0.1,
          keywordExplanation: 'Term matches',
          semanticExplanation: 'Distance: 0.100',
          keywordContributions: {},
          semanticCoordinates: [0.5, 0.5] as [number, number],
          euclideanBreakdown: { formula: '', substitution: '', numericalSubstitution: '', differenceCalculation: '', squaredDifferences: '', sum: '', finalDistance: '' },
        },
        {
          id: 'doc2',
          title: 'Doc 2',
          text: 'Text 2',
          originalIndex: 1,
          documentLabel: 'D2',
          keywordRank: 2,
          semanticRank: 2,
          rankDelta: 0,
          movementDirection: 'none' as const,
          movementLabel: 'No change',
          keywordScore: 0.8,
          semanticMetricLabel: 'Distance',
          semanticMetricValue: 0.2,
          keywordExplanation: 'Term matches',
          semanticExplanation: 'Distance: 0.200',
          keywordContributions: {},
          semanticCoordinates: [0.6, 0.6] as [number, number],
          euclideanBreakdown: { formula: '', substitution: '', numericalSubstitution: '', differenceCalculation: '', squaredDifferences: '', sum: '', finalDistance: '' },
        },
        {
          id: 'doc3',
          title: 'Doc 3',
          text: 'Text 3',
          originalIndex: 2,
          documentLabel: 'D3',
          keywordRank: 1,
          semanticRank: 3,
          rankDelta: -2,
          movementDirection: 'down' as const,
          movementLabel: 'Moved down 2',
          keywordScore: 0.9,
          semanticMetricLabel: 'Distance',
          semanticMetricValue: 0.3,
          keywordExplanation: 'Term matches',
          semanticExplanation: 'Distance: 0.300',
          keywordContributions: {},
          semanticCoordinates: [0.7, 0.7] as [number, number],
          euclideanBreakdown: { formula: '', substitution: '', numericalSubstitution: '', differenceCalculation: '', squaredDifferences: '', sum: '', finalDistance: '' },
        },
      ]
    }

    render(<FinalComparisonStep comparisonSnapshot={fakeSnapshot} />)

    // Check rank values & titles in rows
    expect(screen.getAllByText(/Rank 1/)).toBeDefined()
    expect(screen.getAllByText(/Rank 2/)).toBeDefined()
    expect(screen.getAllByText(/Rank 3/)).toBeDefined()

    // Upward case (▲ Moved up 2)
    expect(screen.getByText('▲')).toBeDefined()
    expect(screen.getByText('Moved up 2')).toBeDefined()

    // No change case (– No change)
    expect(screen.getByText('–')).toBeDefined()
    expect(screen.getByText('No change')).toBeDefined()

    // Downward case (▼ Moved down 2)
    expect(screen.getByText('▼')).toBeDefined()
    expect(screen.getByText('Moved down 2')).toBeDefined()
  })

  test('clicking a document row highlights that document in both columns and shows detailed card', () => {
    const { comparisonSnapshot } = getSnapshots('euclidean')
    render(<FinalComparisonStep comparisonSnapshot={comparisonSnapshot} />)

    // By default, first document (D1) is selected
    expect(screen.getByRole('heading', { name: /Detailed Comparison: D1/ })).toBeDefined()

    // Find all option elements (list items)
    const options = screen.getAllByRole('option')
    
    // Find D2 options
    const d2Option = options.find((opt) => opt.textContent?.includes('D2'))
    expect(d2Option).toBeDefined()

    // Click D2 row
    fireEvent.click(d2Option!)

    // Now D2 should be selected, check detailed comparison heading
    expect(screen.getByRole('heading', { name: /Detailed Comparison: D2/ })).toBeDefined()
  })

  test('explanations cite visible keyword and active semantic metric evidence', () => {
    const { comparisonSnapshot: comparisonSnapshotEuc } = getSnapshots('euclidean')
    const { rerender } = render(<FinalComparisonStep comparisonSnapshot={comparisonSnapshotEuc} />)

    // Should render Euclidean formulas and Distance results
    expect(screen.getByText(/Semantic Evidence \(Euclidean Distance\)/)).toBeDefined()
    expect(screen.getByText(/Formula:/)).toBeDefined()
    expect(screen.getByText(/Euclidean Distance =/)).toBeDefined()

    // Rerender with Cosine Similarity
    const { comparisonSnapshot: comparisonSnapshotCos } = getSnapshots('cosine')
    rerender(<FinalComparisonStep comparisonSnapshot={comparisonSnapshotCos} />)

    // Should render Cosine formulas and Similarity results
    expect(screen.getByText(/Semantic Evidence \(Cosine Similarity\)/)).toBeDefined()
    expect(screen.getByText(/Formula:/)).toBeDefined()
    expect(screen.getByText(/Cosine Similarity =/)).toBeDefined()
  })
})
