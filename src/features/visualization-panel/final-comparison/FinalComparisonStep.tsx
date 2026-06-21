import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  formatThreeDecimals,
  formatTwoDecimals,
} from '@/domain/simulation'
import type {
  FinalComparisonSnapshot,
} from '@/domain/simulation'

const formatMath = (latexStr: string): string => {
  return latexStr
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\cdot/g, '•')
    .replace(/\\\|/g, '||')
    .replace(/\\times/g, '×')
    .replace(/\^2/g, '²')
    .replace(/_1/g, '₁')
    .replace(/_2/g, '₂')
    .replace(/_x/g, 'ₓ')
    .replace(/_y/g, 'ᵧ')
}

interface FinalComparisonStepProps {
  comparisonSnapshot: FinalComparisonSnapshot
}

export const FinalComparisonStep: React.FC<FinalComparisonStepProps> = ({
  comparisonSnapshot,
}) => {
  const { rows, metric } = comparisonSnapshot
  const [selectedDocId, setSelectedDocId] = useState<string | null>(() => {
    return rows.length > 0 ? rows[0].id : null
  })

  if (rows.length === 0) {
    return (
      <div className="border border-dashed border-border-custom rounded-[8px] p-2xl text-center bg-subtle-surface">
        <p className="text-body text-muted-text">
          No documents available. Go to the Setup step to add query and document text.
        </p>
      </div>
    )
  }

  const selectedRow = rows.find((r) => r.id === selectedDocId)

  // Sort rows for the left column (Keyword ranking: by keyword rank)
  const keywordSorted = [...rows].sort((a, b) => a.keywordRank - b.keywordRank)

  // Sort rows for the right column (Semantic ranking: by semantic rank)
  const semanticSorted = [...rows].sort((a, b) => a.semanticRank - b.semanticRank)

  const isCosine = metric === 'cosine'
  const semanticMetricName = isCosine ? 'Cosine Similarity' : 'Euclidean Distance'

  const handleRowClick = (docId: string) => {
    setSelectedDocId(docId)
  }

  const handleKeyDown = (e: React.KeyboardEvent, docId: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      setSelectedDocId(docId)
    }
  }

  return (
    <div className="flex flex-col gap-xl">
      {/* Side-by-Side Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {/* Left Column: Keyword Ranking */}
        <div className="flex flex-col gap-md">
          <h3 className="text-heading font-bold text-primary-text">
            Keyword ranking
          </h3>
          <div
            role="listbox"
            aria-label="Keyword ranking list"
            className="flex flex-col gap-sm w-full"
          >
            {keywordSorted.map((row) => {
              const isSelected = row.id === selectedDocId
              return (
                <div
                  key={row.id}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => handleRowClick(row.id)}
                  onKeyDown={(e) => handleKeyDown(e, row.id)}
                  className={cn(
                    "relative w-full text-left p-md rounded-[8px] border transition-all cursor-pointer min-h-[56px] flex flex-col justify-center",
                    "focus:outline-none focus:ring-4 focus:ring-accent-fill/20",
                    isSelected
                      ? "border-2 border-accent-fill bg-subtle-surface ring-2 ring-accent-fill/20 border-l-4 pl-[12px]"
                      : "border-border-custom bg-secondary hover:bg-subtle-surface/50"
                  )}
                >
                  {/* Selection vertical bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-accent-fill rounded-l-[4px]" />
                  )}
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-primary-text">
                      Rank {row.keywordRank} · D{row.originalIndex + 1}
                    </span>
                    <span className="text-muted-text font-tabular">
                      Score: {formatThreeDecimals(row.keywordScore)}
                    </span>
                  </div>
                  {row.title && (
                    <span className="text-xs text-muted-text mt-[2px] truncate max-w-[90%]">
                      {row.title}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Semantic Ranking */}
        <div className="flex flex-col gap-md">
          <h3 className="text-heading font-bold text-primary-text">
            Semantic ranking
          </h3>
          <div
            role="listbox"
            aria-label="Semantic ranking list"
            className="flex flex-col gap-sm w-full"
          >
            {semanticSorted.map((row) => {
              const isSelected = row.id === selectedDocId

              // Movement indicator styling
              let movementSymbol = '–'
              let movementColorClass = 'text-muted-text font-normal'
              if (row.movementDirection === 'up') {
                movementSymbol = '▲'
                movementColorClass = 'text-accent-fill font-bold'
              } else if (row.movementDirection === 'down') {
                movementSymbol = '▼'
                movementColorClass = 'text-primary font-bold'
              }

              return (
                <div
                  key={row.id}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => handleRowClick(row.id)}
                  onKeyDown={(e) => handleKeyDown(e, row.id)}
                  className={cn(
                    "relative w-full text-left p-md rounded-[8px] border transition-all cursor-pointer min-h-[56px] flex flex-col justify-center",
                    "focus:outline-none focus:ring-4 focus:ring-accent-fill/20",
                    isSelected
                      ? "border-2 border-accent-fill bg-subtle-surface ring-2 ring-accent-fill/20 border-l-4 pl-[12px]"
                      : "border-border-custom bg-secondary hover:bg-subtle-surface/50"
                  )}
                >
                  {/* Selection vertical bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-accent-fill rounded-l-[4px]" />
                  )}
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-md">
                      <span className="font-bold text-primary-text">
                        Rank {row.semanticRank} · D{row.originalIndex + 1}
                      </span>
                      <span className={cn("text-xs flex items-center gap-[4px]", movementColorClass)}>
                        <span>{movementSymbol}</span>
                        <span>{row.movementLabel}</span>
                      </span>
                    </div>
                    <span className="text-muted-text font-tabular">
                      {isCosine ? 'Similarity' : 'Distance'}: {formatThreeDecimals(row.semanticMetricValue)}
                    </span>
                  </div>
                  {row.title && (
                    <span className="text-xs text-muted-text mt-[2px] truncate max-w-[90%]">
                      {row.title}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detailed Mathematical Comparison Card */}
      {selectedRow ? (
        <Card className="border border-border-custom rounded-[12px] overflow-hidden">
          <CardHeader className="bg-subtle-surface/40 border-b border-border-custom py-md">
            <CardTitle role="heading" aria-level={4} className="text-heading font-bold text-primary-text">
              Detailed Comparison: D{selectedRow.originalIndex + 1} {selectedRow.title ? `(${selectedRow.title})` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {/* Left Column: Keyword Evidence */}
              <div className="flex flex-col gap-md">
                <h4 className="font-bold text-primary-text text-[16px] border-b border-border-custom pb-[4px]">
                  Keyword Evidence (TF-IDF Contribution)
                </h4>
                <div className="flex flex-col gap-sm">
                  {Object.keys(selectedRow.keywordContributions).length > 0 ? (
                    <div className="flex flex-col gap-xs">
                      {Object.values(selectedRow.keywordContributions).map((contrib) => {
                        const tfVal = formatThreeDecimals(contrib.tf)
                        const idfVal = formatThreeDecimals(contrib.idf)
                        const tfidfVal = formatThreeDecimals(contrib.tfidf)
                        return (
                          <div
                            key={contrib.term}
                            className="text-[14px] font-mono text-muted-text bg-subtle-surface/30 p-sm rounded-[4px] border border-border-custom/50"
                          >
                            Term: <span className="font-bold text-primary-text">'{contrib.term}'</span> | TF: {tfVal} × IDF: {idfVal} = {tfidfVal}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-[14px] text-muted-text italic">
                      No query terms matched.
                    </p>
                  )}
                  <div className="mt-md p-md bg-subtle-surface/50 border border-border-custom rounded-[6px]">
                    <span className="text-[14px] font-bold text-primary-text block">
                      Total Keyword Score: Sum(TF-IDF) = {formatThreeDecimals(selectedRow.keywordScore)}
                    </span>
                    <p className="text-[14px] text-muted-text mt-sm">
                      {selectedRow.keywordExplanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Semantic Evidence */}
              <div className="flex flex-col gap-md">
                <h4 className="font-bold text-primary-text text-[16px] border-b border-border-custom pb-[4px]">
                  Semantic Evidence ({semanticMetricName})
                </h4>
                <div className="flex flex-col gap-sm">
                  <div className="text-[14px] font-mono text-muted-text bg-subtle-surface/30 p-sm rounded-[4px] border border-border-custom/50">
                    Query coords: Q({formatTwoDecimals(selectedRow.semanticCoordinates[0])}, {formatTwoDecimals(selectedRow.semanticCoordinates[1])})
                    <br />
                    Doc coords: D{selectedRow.originalIndex + 1}({formatTwoDecimals(selectedRow.semanticCoordinates[0])}, {formatTwoDecimals(selectedRow.semanticCoordinates[1])})
                  </div>

                  {!isCosine ? (
                    // Euclidean Mode Details
                    <div className="flex flex-col gap-sm">
                      <div className="text-[14px] font-mono text-muted-text bg-subtle-surface/10 p-sm rounded-[4px]">
                        Formula: <code className="text-primary-text">d = √((x₁ - x₂)² + (y₁ - y₂)²)</code>
                        <br />
                        Substitution: <code className="text-primary-text">{formatMath(selectedRow.euclideanBreakdown.substitution)}</code>
                        <br />
                        Numerical: <code className="text-primary-text">{formatMath(selectedRow.euclideanBreakdown.numericalSubstitution)}</code>
                        <br />
                        Differences: <code className="text-primary-text">{formatMath(selectedRow.euclideanBreakdown.differenceCalculation)}</code>
                        <br />
                        Squared: <code className="text-primary-text">{formatMath(selectedRow.euclideanBreakdown.squaredDifferences)}</code>
                        <br />
                        Sum: <code className="text-primary-text">{formatMath(selectedRow.euclideanBreakdown.sum)}</code>
                      </div>
                      <div className="mt-md p-md bg-subtle-surface/50 border border-border-custom rounded-[6px]">
                        <span className="text-[14px] font-bold text-accent-fill block">
                          Euclidean Distance = {formatThreeDecimals(selectedRow.semanticMetricValue)}
                        </span>
                        <p className="text-[14px] text-muted-text mt-sm">
                          Documents are ranked by proximity (smallest distance is most relevant).
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Cosine Mode Details
                    <div className="flex flex-col gap-sm">
                      <div className="text-[14px] font-mono text-muted-text bg-subtle-surface/10 p-sm rounded-[4px]">
                        Formula: <code className="text-primary-text">sim = (q · d) / (‖q‖ × ‖d‖)</code>
                        {selectedRow.cosineBreakdown && (
                          <>
                            <br />
                            Dot Product: <code className="text-primary-text">{formatMath(selectedRow.cosineBreakdown.dotProduct)}</code>
                            <br />
                            Query Length: <code className="text-primary-text">{formatMath(selectedRow.cosineBreakdown.queryLength)}</code>
                            <br />
                            Doc Length: <code className="text-primary-text">{formatMath(selectedRow.cosineBreakdown.docLength)}</code>
                            <br />
                            Denominator: <code className="text-primary-text">{formatMath(selectedRow.cosineBreakdown.denominator)}</code>
                          </>
                        )}
                      </div>
                      <div className="mt-md p-md bg-subtle-surface/50 border border-border-custom rounded-[6px]">
                        <span className="text-[14px] font-bold text-accent-fill block">
                          Cosine Similarity = {formatThreeDecimals(selectedRow.semanticMetricValue)}
                        </span>
                        <p className="text-[14px] text-muted-text mt-sm">
                          Documents are ranked by direction alignment (highest similarity is most relevant).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-dashed border-border-custom rounded-[8px] p-xl text-center bg-subtle-surface">
          <p className="text-body text-muted-text">
            Select a document from the ranking columns above to inspect side-by-side mathematical and scoring evidence.
          </p>
        </div>
      )}
    </div>
  )
}
