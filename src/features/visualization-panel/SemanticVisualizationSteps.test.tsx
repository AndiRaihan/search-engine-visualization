import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import {
  MeaningVectorsStep,
  SemanticRankingStep,
  KeywordLimitationStep,
  MeaningMap,
  CoordinatesTable,
} from './semantic-steps/SemanticVisualizationSteps'
import { buildKeywordSnapshot, buildSemanticSnapshot, buildSessionFromScenario } from '@/domain/simulation'
import { scenarios } from '@/content/scenarios'

describe('static vectors notice', () => {
  const scenario = scenarios[0]
  const session = buildSessionFromScenario(scenario)
  const keywordSnapshot = buildKeywordSnapshot(session.query, session.documents)
  const semanticSnapshot = buildSemanticSnapshot(session, keywordSnapshot)

  test('MeaningVectorsStep shows notice when isEdited is true and hides when false', () => {
    const { rerender } = render(
      <MeaningVectorsStep
        semanticSnapshot={semanticSnapshot}
        isEdited={false}
      />
    )
    expect(screen.queryByText('Static Vectors')).toBeNull()

    rerender(
      <MeaningVectorsStep
        semanticSnapshot={semanticSnapshot}
        isEdited={true}
      />
    )
    expect(screen.getByText('Static Vectors')).toBeDefined()
    expect(screen.getByText(/Coordinates on the meaning map are preset teaching values/i)).toBeDefined()
  })

  test('SemanticRankingStep shows notice when isEdited is true and hides when false', () => {
    const { rerender } = render(
      <SemanticRankingStep
        semanticSnapshot={semanticSnapshot}
        isEdited={false}
      />
    )
    expect(screen.queryByText('Static Vectors')).toBeNull()

    rerender(
      <SemanticRankingStep
        semanticSnapshot={semanticSnapshot}
        isEdited={true}
      />
    )
    expect(screen.getByText('Static Vectors')).toBeDefined()
    expect(screen.getByText(/Coordinates on the meaning map are preset teaching values/i)).toBeDefined()
  })
})

describe('keyword misses meaning', () => {
  const scenario = scenarios[0]
  const session = buildSessionFromScenario(scenario)
  const keywordSnapshot = buildKeywordSnapshot(session.query, session.documents)
  const semanticSnapshot = buildSemanticSnapshot(session, keywordSnapshot)

  test('keyword misses meaning renders the D-09 tip and Switch Scenario button when active scenario is not keyword-misses-meaning', () => {
    const onSwitch = vi.fn()
    render(
      <KeywordLimitationStep
        activeScenarioId="exact-match-fails"
        keywordSnapshot={keywordSnapshot}
        semanticSnapshot={semanticSnapshot}
        onSwitchToKeywordMissesMeaning={onSwitch}
      />
    )
    expect(screen.getByText(/Tip: Switch to the "Keyword Search Misses Meaning" scenario to see the best worked example of synonyms failing./i)).toBeDefined()
    const btn = screen.getByRole('button', { name: /Switch Scenario/i })
    expect(btn).toBeDefined()
    btn.click()
    expect(onSwitch).toHaveBeenCalledTimes(1)
  })

  test('keyword misses meaning highlights zero-keyword/high-proximity documents with warning icon plus explanatory text', () => {
    const keywordMissScenario = scenarios.find(s => s.id === 'keyword-misses-meaning')!
    const missSession = buildSessionFromScenario(keywordMissScenario)
    const missKeywordSnapshot = buildKeywordSnapshot(missSession.query, missSession.documents)
    const missSemanticSnapshot = buildSemanticSnapshot(missSession, missKeywordSnapshot)

    render(
      <KeywordLimitationStep
        activeScenarioId="keyword-misses-meaning"
        keywordSnapshot={missKeywordSnapshot}
        semanticSnapshot={missSemanticSnapshot}
        onSwitchToKeywordMissesMeaning={() => {}}
      />
    )

    // D-10: Highlight missed documents explanation is visible
    expect(screen.getAllByText(/Score: 0.000 \(Missed synonym: iPhone vs phone\)/i).length).toBeGreaterThanOrEqual(1)

    // Test XSS safety: inject hostile HTML into a document's text and ensure it renders as literal text
    const modifiedSession = {
      ...missSession,
      documents: missSession.documents.map((doc, idx) =>
        idx === 0
          ? { ...doc, text: 'The latest <span data-testid="evil-tag">iPhone</span> with a titanium frame.' }
          : doc
      )
    }
    const xssKeywordSnapshot = buildKeywordSnapshot(modifiedSession.query, modifiedSession.documents)
    const xssSemanticSnapshot = buildSemanticSnapshot(modifiedSession, xssKeywordSnapshot)

    render(
      <KeywordLimitationStep
        activeScenarioId="keyword-misses-meaning"
        keywordSnapshot={xssKeywordSnapshot}
        semanticSnapshot={xssSemanticSnapshot}
        onSwitchToKeywordMissesMeaning={() => {}}
      />
    )

    // Ensure the hostile HTML is rendered as plain text and not parsed, i.e., no element with data-testid="evil-tag"
    expect(screen.queryByTestId('evil-tag')).toBeNull()
    expect(screen.getByText(/The latest <span data-testid="evil-tag">iPhone<\/span> with a titanium frame/i)).toBeDefined()
  })
})

describe('coordinates table', () => {
  const scenario = scenarios[0]
  const session = buildSessionFromScenario(scenario)
  const keywordSnapshot = buildKeywordSnapshot(session.query, session.documents)
  const semanticSnapshot = buildSemanticSnapshot(session, keywordSnapshot)

  test('coordinates table renders columns and rounded values', () => {
    render(<CoordinatesTable semanticSnapshot={semanticSnapshot} />)
    expect(screen.getByRole('columnheader', { name: /Point/i })).toBeDefined()
    expect(screen.getByRole('columnheader', { name: /Dimension 1 \(X\)/i })).toBeDefined()
    expect(screen.getByRole('columnheader', { name: /Dimension 2 \(Y\)/i })).toBeDefined()

    // Check Query point and D1 coordinates
    expect(screen.getByText('Query')).toBeDefined()
    expect(screen.getByText('D1')).toBeDefined()

    // Coordinates are [0.88, 0.78] for Query and [0.90, 0.80] for D1 (from first scenario)
    // rounded to two decimal places
    expect(screen.getAllByText('0.88').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('0.78')).toBeDefined()
    expect(screen.getByText('0.90')).toBeDefined()
    expect(screen.getByText('0.80')).toBeDefined()
  })
})

describe('point labels', () => {
  const scenario = scenarios[0]
  const session = buildSessionFromScenario(scenario)
  const keywordSnapshot = buildKeywordSnapshot(session.query, session.documents)
  const semanticSnapshot = buildSemanticSnapshot(session, keywordSnapshot)

  test('point labels verifies SVG accessibility and axis/point labels', () => {
    render(<MeaningMap semanticSnapshot={semanticSnapshot} />)
    const svg = screen.getByRole('img')
    expect(svg).toBeDefined()

    // Verify SVG accessibility name/description
    expect(svg.querySelector('title')).toBeDefined()
    expect(svg.querySelector('desc')).toBeDefined()

    // Verify axis labels
    expect(screen.getByText('Dimension 1')).toBeDefined()
    expect(screen.getByText('Dimension 2')).toBeDefined()

    // Verify tick labels 0.0 to 1.0 (0.0, 0.2, 0.4, 0.6, 0.8, 1.0)
    expect(screen.getAllByText('0.0').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('0.2').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('0.4').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('0.6').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('0.8').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('1.0').length).toBeGreaterThanOrEqual(2)

    // Verify marker labels
    expect(screen.getByText('Query')).toBeDefined()
    expect(screen.getByText('D1')).toBeDefined()
    expect(screen.getByText('D7')).toBeDefined()
  })
})

describe('semantic ranking step', () => {
  const scenario = scenarios[0]
  const session = buildSessionFromScenario(scenario)
  const keywordSnapshot = buildKeywordSnapshot(session.query, session.documents)
  const semanticSnapshot = buildSemanticSnapshot(session, keywordSnapshot)

  test('distance lines renders one dashed query-to-document line per document and no distance text in SVG', () => {
    const { container } = render(
      <SemanticRankingStep
        semanticSnapshot={semanticSnapshot}
        isEdited={false}
      />
    )

    // Check MeaningMap renders within SemanticRankingStep
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()

    // There should be a dashed line from the query to every document point.
    const dashedLines = Array.from(container.querySelectorAll('svg line')).filter(
      (line) => line.getAttribute('stroke-dasharray') === '4,4'
    )
    expect(dashedLines.length).toBe(semanticSnapshot.documentPoints.length)

    // No distance value text labels are drawn on the map/SVG (D-04)
    const svgTextElements = svg ? Array.from(svg.querySelectorAll('text')) : []
    svgTextElements.forEach((txt) => {
      // It should not contain any decimals with 3 digits (which would be a distance like 0.141)
      expect(txt.textContent).not.toMatch(/\b\d\.\d{3}\b/)
    })
  })

  test('semantic ranking renders documents sorted by smallest Euclidean distance with Closest/Furthest descriptors', () => {
    render(
      <SemanticRankingStep
        semanticSnapshot={semanticSnapshot}
        isEdited={false}
      />
    )

    // Verification of list elements
    const rankedListItems = screen.getAllByRole('listitem')
    expect(rankedListItems.length).toBe(semanticSnapshot.rankedDocuments.length)

    // Rank 1 (Closest) for the first item
    expect(screen.getByText(/Rank 1 \(Closest\)/i)).toBeDefined()

    // Rank N (Furthest) for the last item
    const lastRankLabel = `Rank ${semanticSnapshot.rankedDocuments.length} (Furthest)`
    expect(screen.getByText(lastRankLabel)).toBeDefined()

    // Mid ranks should have correct labels, like "Rank 2"
    expect(screen.getByText(/Rank 2/i)).toBeDefined()

    // Verify distance values use exactly three decimals
    semanticSnapshot.rankedDocuments.forEach((doc) => {
      const distStr = doc.distance.toFixed(3)
      expect(screen.getAllByText(new RegExp(distStr, 'i')).length).toBeGreaterThanOrEqual(1)
    })
  })

  test('euclidean breakdown displays formula, numerical substitution, difference, square, sum, and final distance', () => {
    render(
      <SemanticRankingStep
        semanticSnapshot={semanticSnapshot}
        isEdited={false}
      />
    )

    // The breakdown panel is visible, initially defaulting to the closest document (Rank 1)
    // formula: d = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}
    expect(screen.getByText(/Formula:/i)).toBeDefined()
    expect(screen.getByText(/Substitution:/i)).toBeDefined()
    expect(screen.getByText(/Values:/i)).toBeDefined()
    expect(screen.getByText(/Differences:/i)).toBeDefined()
    expect(screen.getByText(/Squared:/i)).toBeDefined()
    expect(screen.getByText(/Sum:/i)).toBeDefined()
    expect(screen.getByText(/Final Distance:/i)).toBeDefined()

    // First document's final distance is shown (formatted as 0.141 for the first scenario's closest)
    const firstDoc = semanticSnapshot.rankedDocuments[0]
    const firstDocBreakdown = firstDoc.breakdown
    expect(screen.getAllByText(new RegExp(firstDocBreakdown.finalDistance, 'i')).length).toBeGreaterThanOrEqual(1)

    // Click on another document (e.g. D7, the last one) and verify breakdown updates
    const lastDoc = semanticSnapshot.rankedDocuments[semanticSnapshot.rankedDocuments.length - 1]
    const lastDocBtn = screen.getByTestId(`rank-item-${lastDoc.id}`)

    fireEvent.click(lastDocBtn)

    // Verify that the breakdown updates to show the last document's final distance
    const lastDocBreakdown = lastDoc.breakdown
    expect(screen.getAllByText(new RegExp(lastDocBreakdown.finalDistance, 'i')).length).toBeGreaterThanOrEqual(1)
  })
})
