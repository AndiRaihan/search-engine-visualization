import React from 'react'
import type { KeywordSnapshot } from '@/domain/simulation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatThreeDecimals } from '@/domain/simulation'
import { Progress } from '@/components/ui/progress'

interface StepProps {
  snapshot: KeywordSnapshot
}

export const TfidfStep: React.FC<StepProps> = ({ snapshot }) => {
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

  if (snapshot.queryTerms.length === 0) {
    return (
      <div className="flex flex-col gap-xl">
        <span className="text-body text-muted-text">No query terms to calculate TF-IDF.</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-xl">
      {snapshot.documents.map((doc) => (
        <Card key={doc.id} className="border border-border-custom bg-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-body font-weight-bold text-primary-text flex justify-between items-center">
              <span>{doc.title || doc.id}</span>
              <span className="text-body text-muted-text">
                Document Score: {formatThreeDecimals(doc.score)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-body">
                <thead>
                  <tr className="border-b border-border-custom text-label font-weight-bold text-primary-text">
                    <th className="py-sm pr-md">Query Term</th>
                    <th className="py-sm px-md text-right">TF (Relative)</th>
                    <th className="py-sm px-md text-right">IDF</th>
                    <th className="py-sm pl-md text-right">TF-IDF (TF * IDF)</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.queryTerms.map((term) => {
                    const contrib = doc.contributions[term]
                    const tf = contrib?.tf ?? 0
                    const idf = contrib?.idf ?? 0
                    const tfidf = contrib?.tfidf ?? 0

                    return (
                      <tr key={term} className="border-b border-border-custom last:border-0 hover:bg-subtle-surface/50">
                        <td className="py-sm pr-md text-primary-text font-normal">{term}</td>
                        <td className="py-sm px-md text-right text-primary-text font-normal tabular-nums">
                          {formatThreeDecimals(tf)}
                        </td>
                        <td className="py-sm px-md text-right text-primary-text font-normal tabular-nums">
                          {formatThreeDecimals(idf)}
                        </td>
                        <td className="py-sm pl-md text-right text-primary-text font-weight-bold tabular-nums">
                          {formatThreeDecimals(tfidf)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const KeywordRankingStep: React.FC<StepProps> = ({ snapshot }) => {
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

  const ranking = snapshot.rankedDocuments

  return (
    <div className="flex flex-col gap-lg">
      {ranking.map((doc) => {
        const percentage = snapshot.maxScore > 0 ? (doc.score / snapshot.maxScore) * 100 : 0
        const progressValue = isNaN(percentage) || !isFinite(percentage) ? 0 : Math.min(100, Math.max(0, percentage))

        return (
          <Card key={doc.id} className="border border-border-custom bg-secondary">
            <CardHeader className="pb-2">
              <CardTitle className="text-body font-weight-bold text-primary-text flex justify-between items-center">
                <h3 className="text-body font-weight-bold text-primary-text">
                  #{doc.rank} - {doc.title || doc.id}
                </h3>
                <span className="text-body text-muted-text font-normal">
                  Score: {formatThreeDecimals(doc.score)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-md">
              {/* Document Text */}
              <p className="text-body text-primary-text font-normal italic border-l-2 border-border-custom pl-md py-xs bg-subtle-surface/30">
                {doc.text}
              </p>

              {/* Progress/Score Bar */}
              <div className="flex flex-col gap-xs my-xs">
                <Progress
                  value={progressValue}
                  aria-valuenow={progressValue}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Keyword score for ${doc.title || doc.id}`}
                />
              </div>

              {/* D-09 Explanation */}
              <div className="bg-subtle-surface border border-border-custom rounded-[6px] p-sm text-body text-primary-text">
                {doc.explanation}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
