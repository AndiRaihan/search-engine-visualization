import React from 'react'
import type { KeywordSnapshot } from '@/domain/simulation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Check, Star, ArrowDown } from 'lucide-react'
import { formatThreeDecimals } from '@/domain/simulation'

interface StepProps {
  snapshot: KeywordSnapshot
}

export const TokenizationStep: React.FC<StepProps> = ({ snapshot }) => {
  const isQueryEmpty = snapshot.queryTokens.length === 0
  const isDocsEmpty = snapshot.documents.every((doc) => doc.tokens.length === 0)
  const isAllEmpty = isQueryEmpty && isDocsEmpty

  if (isAllEmpty) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-xl bg-subtle-surface border border-border-custom rounded-[8px] min-h-[150px]">
        <h3 className="text-heading font-weight-bold text-primary-text mb-sm">No tokens found</h3>
        <p className="text-body text-muted-text max-w-[400px]">
          Type some words in the query or documents to see search engine calculations.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-xl">
      {/* Query Tokens Section */}
      <div className="flex flex-col gap-sm">
        <h3 className="text-label text-primary-text font-weight-bold">Query Tokens</h3>
        <div className="bg-subtle-surface border border-border-custom rounded-[8px] p-md min-h-[60px] flex flex-wrap gap-xs items-center">
          {isQueryEmpty ? (
            <span className="text-body text-muted-text">No tokens found</span>
          ) : (
            snapshot.queryTokens.map((token, idx) => (
              <span
                key={idx}
                className="bg-secondary border border-border-custom rounded-full px-sm py-xs text-body text-primary-text font-normal inline-flex items-center"
              >
                {token}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Document Tokens Section */}
      <div className="flex flex-col gap-sm">
        <h3 className="text-label text-primary-text font-weight-bold">Document Tokens</h3>
        <div className="flex flex-col gap-md">
          {snapshot.documents.map((doc) => (
            <Card key={doc.id} className="border border-border-custom bg-secondary">
              <CardHeader className="pb-2">
                <CardTitle className="text-body font-weight-bold text-primary-text">
                  {doc.title || doc.id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-xs items-center">
                  {doc.tokens.length === 0 ? (
                    <span className="text-body text-muted-text">No tokens found</span>
                  ) : (
                    doc.tokens.map((token, idx) => (
                      <span
                        key={idx}
                        className="bg-subtle-surface border border-border-custom rounded-full px-sm py-xs text-body text-primary-text font-normal inline-flex items-center"
                      >
                        {token}
                      </span>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export const MatchingStep: React.FC<StepProps> = ({ snapshot }) => {
  return (
    <div className="flex flex-col gap-md">
      {snapshot.documents.map((doc) => {
        const matched = doc.matchSummary.matchedTerms
        const missing = doc.matchSummary.missingTerms
        const total = snapshot.queryTerms.length

        const summary = total > 0
          ? `Matched ${matched.length} of ${total} terms.${missing.length > 0 ? ` Missing: ${missing.join(', ')}.` : ''}`
          : 'No query terms to match.'

        return (
          <Card key={doc.id} className="border border-border-custom bg-secondary">
            <CardHeader className="pb-2">
              <CardTitle className="text-body font-weight-bold text-primary-text">
                {doc.title || doc.id}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-md">
              {/* Match Pill Group */}
              <div className="flex flex-wrap gap-xs items-center">
                {total === 0 ? (
                  <span className="text-body text-muted-text">No terms to match</span>
                ) : (
                  <>
                    {matched.map((term, idx) => (
                      <span
                        key={`matched-${idx}`}
                        className="bg-secondary border border-border-custom rounded-full px-sm py-xs text-body text-primary-text font-normal inline-flex items-center gap-xs"
                      >
                        <Check className="w-3.5 h-3.5 shrink-0 text-accent-fill" aria-hidden="true" />
                        {term}
                      </span>
                    ))}
                    {missing.map((term, idx) => (
                      <span
                        key={`missing-${idx}`}
                        className="bg-secondary border border-dashed border-border-custom rounded-full px-sm py-xs text-body text-muted-text font-normal inline-flex items-center"
                      >
                        {term}
                      </span>
                    ))}
                  </>
                )}
              </div>

              {/* Textual Summary Card */}
              <div className="bg-subtle-surface border border-border-custom rounded-[6px] p-sm text-body text-primary-text">
                {summary}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export const TermFrequencyStep: React.FC<StepProps> = ({ snapshot }) => {
  return (
    <div className="flex flex-col gap-xl">
      {snapshot.documents.map((doc) => (
        <Card key={doc.id} className="border border-border-custom bg-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-body font-weight-bold text-primary-text">
              {doc.title || doc.id}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {snapshot.queryTerms.length === 0 ? (
              <span className="text-body text-muted-text">No query terms to calculate Term Frequency.</span>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-body">
                  <thead>
                    <tr className="border-b border-border-custom text-label font-weight-bold text-primary-text">
                      <th className="py-sm pr-md">Query Term</th>
                      <th className="py-sm px-md text-right">Count in Doc</th>
                      <th className="py-sm px-md text-right">Total Words in Doc</th>
                      <th className="py-sm pl-md text-right">Relative TF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.queryTerms.map((term) => {
                      const contrib = doc.contributions[term]
                      const count = contrib?.count ?? 0
                      const totalWords = contrib?.totalWords ?? 0
                      const tf = contrib?.tf ?? 0

                      return (
                        <tr key={term} className="border-b border-border-custom last:border-0 hover:bg-subtle-surface/50">
                          <td className="py-sm pr-md text-primary-text font-normal">{term}</td>
                          <td className="py-sm px-md text-right text-primary-text font-normal tabular-nums">{count}</td>
                          <td className="py-sm px-md text-right text-primary-text font-normal tabular-nums">{totalWords}</td>
                          <td className="py-sm pl-md text-right text-primary-text font-weight-bold tabular-nums">
                            {formatThreeDecimals(tf)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const InverseDocumentFrequencyStep: React.FC<StepProps> = ({ snapshot }) => {
  return (
    <Card className="border border-border-custom bg-secondary">
      <CardContent className="pt-4">
        {snapshot.queryTerms.length === 0 ? (
          <span className="text-body text-muted-text">No query terms to calculate Inverse Document Frequency.</span>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-body">
              <thead>
                <tr className="border-b border-border-custom text-label font-weight-bold text-primary-text">
                  <th className="py-sm pr-md">Query Term</th>
                  <th className="py-sm px-md text-right">Doc Frequency (df)</th>
                  <th className="py-sm px-md text-right">Total Docs (N)</th>
                  <th className="py-sm px-md text-right">Raw Ratio</th>
                  <th className="py-sm px-md text-right">IDF (ln(N/df))</th>
                  <th className="py-sm pl-md text-right">Importance</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.queryTerms.map((term) => {
                  const stat = snapshot.termStatistics[term]
                  const df = stat?.documentFrequency ?? 0
                  const N = stat?.totalDocuments ?? 0
                  const rawRatio = stat?.rawRatio ?? 0
                  const idf = stat?.idf ?? 0
                  const isRare = stat?.importance === 'rare'

                  return (
                    <tr key={term} className="border-b border-border-custom last:border-0 hover:bg-subtle-surface/50">
                      <td className="py-sm pr-md text-primary-text font-normal">{term}</td>
                      <td className="py-sm px-md text-right text-primary-text font-normal tabular-nums">{df}</td>
                      <td className="py-sm px-md text-right text-primary-text font-normal tabular-nums">{N}</td>
                      <td className="py-sm px-md text-right text-primary-text font-normal tabular-nums">
                        {formatThreeDecimals(rawRatio)}
                      </td>
                      <td className="py-sm px-md text-right text-primary-text font-weight-bold tabular-nums">
                        {formatThreeDecimals(idf)}
                      </td>
                      <td className="py-sm pl-md text-right">
                        {isRare ? (
                          <span className="inline-flex items-center gap-xs px-sm py-xs bg-secondary border-2 border-accent-fill text-primary-text rounded-md font-weight-bold text-xs uppercase tracking-wider">
                            <Star className="w-3.5 h-3.5 text-accent-fill fill-accent-fill" aria-hidden="true" />
                            Rare (Strong)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-xs px-sm py-xs bg-subtle-surface border border-dashed border-border-custom text-muted-text rounded-md font-normal text-xs uppercase tracking-wider">
                            <ArrowDown className="w-3.5 h-3.5 text-muted-text" aria-hidden="true" />
                            Common (Weak)
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
