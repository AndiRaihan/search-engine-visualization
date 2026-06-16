import React from 'react'
import { AlertCircle } from 'lucide-react'
import type { SemanticSnapshot, KeywordSnapshot, SemanticRankedDocument, EuclideanBreakdown } from '@/domain/simulation'
import { formatThreeDecimals, formatTwoDecimals } from '@/domain/simulation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StaticVectorsNoticeProps {
  isEdited: boolean
}

export const StaticVectorsNotice: React.FC<StaticVectorsNoticeProps> = ({ isEdited }) => {
  if (!isEdited) return null

  return (
    <div className="bg-subtle-surface border border-border-custom rounded-[8px] p-md flex gap-sm items-start mb-md" data-testid="static-vectors-notice">
      <AlertCircle className="w-5 h-5 text-accent-fill shrink-0 mt-[2px]" aria-hidden="true" />
      <div>
        <h3 className="text-[16px] font-bold text-primary-text mb-[4px]">Static Vectors</h3>
        <p className="text-[14px] text-muted-text leading-[1.5]">
          Coordinates on the meaning map are preset teaching values and do not dynamically recalculate from edited text, because this simulator runs without an AI embedding backend.
        </p>
      </div>
    </div>
  )
}

interface StepProps {
  semanticSnapshot: SemanticSnapshot
  isEdited: boolean
}

export const MeaningVectorsStep: React.FC<StepProps> = ({ semanticSnapshot, isEdited }) => {
  return (
    <div className="flex flex-col gap-xl">
      <StaticVectorsNotice isEdited={isEdited} />
      <div className="flex flex-col lg:flex-row gap-lg items-start">
        <div className="w-full lg:w-1/2 flex justify-center">
          <MeaningMap semanticSnapshot={semanticSnapshot} />
        </div>
        <div className="w-full lg:w-1/2">
          <CoordinatesTable semanticSnapshot={semanticSnapshot} />
        </div>
      </div>
    </div>
  )
}

interface DistanceTableProps {
  rankedDocuments: SemanticRankedDocument[]
  selectedDocumentId: string
  onSelectDocument: (id: string) => void
}

export const DistanceTable: React.FC<DistanceTableProps> = ({
  rankedDocuments,
  selectedDocumentId,
  onSelectDocument,
}) => {
  return (
    <div className="overflow-x-auto border border-border-custom rounded-[8px] bg-secondary w-full">
      <table className="w-full text-left border-collapse text-body">
        <thead>
          <tr className="border-b border-border-custom text-label font-weight-bold text-primary-text bg-subtle-surface/30">
            <th className="py-sm px-md">Rank</th>
            <th className="py-sm px-md">Document</th>
            <th className="py-sm px-md text-right">Distance</th>
          </tr>
        </thead>
        <tbody>
          {rankedDocuments.map((doc, idx) => {
            const isSelected = doc.id === selectedDocumentId
            let rankLabel = `Rank ${doc.rank}`
            if (idx === 0) {
              rankLabel = `Rank 1 (Closest)`
            } else if (idx === rankedDocuments.length - 1) {
              rankLabel = `Rank ${doc.rank} (Furthest)`
            }
            return (
              <tr
                key={doc.id}
                onClick={() => onSelectDocument(doc.id)}
                className={cn(
                  "border-b border-border-custom last:border-0 cursor-pointer transition-colors",
                  isSelected
                    ? "bg-subtle-surface font-bold border-l-4 border-l-accent-fill text-primary-text"
                    : "hover:bg-subtle-surface/50 text-primary-text"
                )}
              >
                <td className="py-sm px-md">{rankLabel}</td>
                <td className="py-sm px-md">
                  D{doc.originalIndex + 1} ({doc.title || doc.id})
                </td>
                <td className="py-sm px-md text-right font-tabular">
                  {formatThreeDecimals(doc.distance)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

interface SemanticRankingListProps {
  rankedDocuments: SemanticRankedDocument[]
  selectedDocumentId: string
  onSelectDocument: (id: string) => void
}

export const SemanticRankingList: React.FC<SemanticRankingListProps> = ({
  rankedDocuments,
  selectedDocumentId,
  onSelectDocument,
}) => {
  return (
    <ul className="flex flex-col gap-sm w-full" role="list">
      {rankedDocuments.map((doc, idx) => {
        const isSelected = doc.id === selectedDocumentId
        
        let rankLabel = `Rank ${doc.rank}`
        if (idx === 0) {
          rankLabel = `Rank 1 (Closest)`
        } else if (idx === rankedDocuments.length - 1) {
          rankLabel = `Rank ${doc.rank} (Furthest)`
        }

        return (
          <li key={doc.id} className="w-full" role="listitem">
            <button
              data-testid={`rank-item-${doc.id}`}
              onClick={() => onSelectDocument(doc.id)}
              className={cn(
                "w-full text-left p-md rounded-[8px] border transition-all cursor-pointer min-h-[44px]",
                "focus:outline-none focus:ring-4 focus:ring-accent-fill/20",
                isSelected
                  ? "border-2 border-accent-fill bg-secondary ring-2 ring-accent-fill/20"
                  : "border-border-custom bg-secondary hover:bg-subtle-surface/50"
              )}
              aria-selected={isSelected}
            >
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-bold text-primary-text">{rankLabel}</span>
                <span className="text-[16px] text-primary-text font-tabular font-bold">
                  Distance: {formatThreeDecimals(doc.distance)}
                </span>
              </div>
              <div className="mt-xs text-[14px] text-muted-text">
                <span className="font-bold mr-xs">D{doc.originalIndex + 1}:</span>
                <span>{doc.title || doc.id}</span>
              </div>
              <p className="mt-xs text-[14px] text-muted-text italic line-clamp-1">{doc.text}</p>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

interface EuclideanBreakdownPanelProps {
  breakdown: EuclideanBreakdown
  documentLabel: string
  documentTitle?: string
}

export const EuclideanBreakdownPanel: React.FC<EuclideanBreakdownPanelProps> = ({
  breakdown,
  documentLabel,
  documentTitle,
}) => {
  const formatMath = (latexStr: string): string => {
    return latexStr
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\^2/g, '²')
      .replace(/_1/g, '₁')
      .replace(/_2/g, '₂')
      .replace(/_x/g, 'ₓ')
      .replace(/_y/g, 'ᵧ')
  }

  return (
    <Card className="border border-border-custom bg-secondary">
      <CardHeader>
        <CardTitle className="text-body font-weight-bold text-primary-text">
          Distance Calculation for {documentLabel} ({documentTitle || 'Untitled'})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-sm font-tabular text-body text-primary-text">
        <div className="grid grid-cols-[140px_1fr] gap-x-md gap-y-sm">
          <div className="text-muted-text font-bold">Formula:</div>
          <div className="font-mono bg-subtle-surface/50 px-sm py-xs rounded">{formatMath(breakdown.formula)}</div>

          <div className="text-muted-text font-bold">Substitution:</div>
          <div className="font-mono bg-subtle-surface/50 px-sm py-xs rounded">{formatMath(breakdown.substitution)}</div>

          <div className="text-muted-text font-bold">Values:</div>
          <div className="font-mono bg-subtle-surface/50 px-sm py-xs rounded">{formatMath(breakdown.numericalSubstitution)}</div>

          <div className="text-muted-text font-bold">Differences:</div>
          <div className="font-mono bg-subtle-surface/50 px-sm py-xs rounded">{formatMath(breakdown.differenceCalculation)}</div>

          <div className="text-muted-text font-bold">Squared:</div>
          <div className="font-mono bg-subtle-surface/50 px-sm py-xs rounded">{formatMath(breakdown.squaredDifferences)}</div>

          <div className="text-muted-text font-bold">Sum:</div>
          <div className="font-mono bg-subtle-surface/50 px-sm py-xs rounded">{formatMath(breakdown.sum)}</div>

          <div className="text-muted-text font-bold">Final Distance:</div>
          <div className="font-bold text-accent-fill font-mono bg-subtle-surface/50 px-sm py-xs rounded">d = {breakdown.finalDistance}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export const SemanticRankingStep: React.FC<StepProps> = ({ semanticSnapshot, isEdited }) => {
  const [selectedDocumentId, setSelectedDocumentId] = React.useState<string>(
    semanticSnapshot.rankedDocuments[0]?.id || ''
  )

  const selectedDoc = semanticSnapshot.rankedDocuments.find((d) => d.id === selectedDocumentId)
  
  const selectedDocIndex = semanticSnapshot.documentPoints.findIndex((p) => p.id === selectedDocumentId)
  const selectedDocLabel = selectedDocIndex !== -1 ? `D${selectedDocIndex + 1}` : 'Selected Document'

  return (
    <div className="flex flex-col gap-xl">
      <StaticVectorsNotice isEdited={isEdited} />
      
      <div className="flex flex-col lg:flex-row gap-lg items-start">
        <div className="w-full lg:w-1/2 flex justify-center">
          <MeaningMap
            semanticSnapshot={semanticSnapshot}
            showDistanceLines={true}
            selectedDocumentId={selectedDocumentId}
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-md">
          <h3 className="text-heading font-weight-bold text-primary-text">Semantic Ranking</h3>
          <SemanticRankingList
            rankedDocuments={semanticSnapshot.rankedDocuments}
            selectedDocumentId={selectedDocumentId}
            onSelectDocument={setSelectedDocumentId}
          />
        </div>
      </div>

      {selectedDoc && (
        <div className="w-full">
          <EuclideanBreakdownPanel
            breakdown={selectedDoc.breakdown}
            documentLabel={selectedDocLabel}
            documentTitle={selectedDoc.title}
          />
        </div>
      )}
    </div>
  )
}

interface MeaningMapProps {
  semanticSnapshot: SemanticSnapshot
  showDistanceLines?: boolean
  selectedDocumentId?: string
}

export const MeaningMap: React.FC<MeaningMapProps> = ({
  semanticSnapshot,
  showDistanceLines = false,
  selectedDocumentId,
}) => {
  const points = [
    semanticSnapshot.queryPoint,
    ...semanticSnapshot.documentPoints
  ]

  // Map coordinates in [0, 1] to SVG coordinates:
  // padding left: 60, padding right: 40, padding top: 40, padding bottom: 60
  // width: 400, height: 400
  // total viewbox size: 500x500
  const paddingLeft = 60
  const paddingTop = 40
  const chartWidth = 400
  const chartHeight = 400

  const toSvgX = (x: number) => paddingLeft + x * chartWidth
  const toSvgY = (y: number) => paddingTop + (1 - y) * chartHeight

  // Helper to generate a 5-point star path
  const getStarPath = (cx: number, cy: number, spikes = 5, outerRadius = 10, innerRadius = 4) => {
    let rot = (Math.PI / 2) * 3
    const step = Math.PI / spikes

    const pointsList = []
    for (let i = 0; i < spikes; i++) {
      pointsList.push(`${cx + Math.cos(rot) * outerRadius},${cy + Math.sin(rot) * outerRadius}`)
      rot += step

      pointsList.push(`${cx + Math.cos(rot) * innerRadius},${cy + Math.sin(rot) * innerRadius}`)
      rot += step
    }
    return `M ${pointsList.join(' L ')} Z`
  }

  // Grid ticks
  const ticks = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]

  return (
    <svg
      role="img"
      aria-labelledby="meaning-map-title meaning-map-desc"
      viewBox="0 0 500 500"
      className="w-full max-w-[500px] h-auto bg-secondary border border-border-custom rounded-[8px] p-md"
    >
      <title id="meaning-map-title">Meaning Map</title>
      <desc id="meaning-map-desc">
        A 2D scatter plot mapping the query and documents as vectors in a semantic space. The query is marked as a teal star and documents are marked as circles.
      </desc>

      {/* Grid Lines */}
      {ticks.map((tick) => {
        const x = toSvgX(tick)
        const y = toSvgY(tick)
        return (
          <React.Fragment key={`grid-${tick}`}>
            {/* Vertical line */}
            <line
              x1={x}
              y1={paddingTop}
              x2={x}
              y2={paddingTop + chartHeight}
              stroke="#AAB7BE"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            {/* Horizontal line */}
            <line
              x1={paddingLeft}
              y1={y}
              x2={paddingLeft + chartWidth}
              y2={y}
              stroke="#AAB7BE"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
          </React.Fragment>
        )
      })}

      {/* Solid Axis Lines */}
      <line
        x1={paddingLeft}
        y1={paddingTop + chartHeight}
        x2={paddingLeft + chartWidth}
        y2={paddingTop + chartHeight}
        stroke="#17212B"
        strokeWidth={2}
      />
      <line
        x1={paddingLeft}
        y1={paddingTop}
        x2={paddingLeft}
        y2={paddingTop + chartHeight}
        stroke="#17212B"
        strokeWidth={2}
      />

      {/* Tick Labels */}
      {ticks.map((tick) => {
        const x = toSvgX(tick)
        const y = toSvgY(tick)
        const tickStr = tick.toFixed(1)
        return (
          <React.Fragment key={`tick-label-${tick}`}>
            {/* X-axis tick label */}
            <text
              x={x}
              y={paddingTop + chartHeight + 20}
              textAnchor="middle"
              className="text-[12px] font-tabular fill-muted-text"
            >
              {tickStr}
            </text>
            {/* Y-axis tick label */}
            <text
              x={paddingLeft - 10}
              y={y + 4}
              textAnchor="end"
              className="text-[12px] font-tabular fill-muted-text"
            >
              {tickStr}
            </text>
          </React.Fragment>
        )
      })}

      {/* Axis Titles */}
      <text
        x={paddingLeft + chartWidth / 2}
        y={paddingTop + chartHeight + 45}
        textAnchor="middle"
        className="text-[14px] font-bold fill-primary-text"
      >
        Dimension 1
      </text>
      <text
        transform="rotate(-90 15 240)"
        x={15}
        y={240}
        textAnchor="middle"
        className="text-[14px] font-bold fill-primary-text"
      >
        Dimension 2
      </text>

      {/* Distance Lines (from query to documents, if requested) */}
      {showDistanceLines &&
        semanticSnapshot.documentPoints.map((docPoint) => {
          const [qx, qy] = semanticSnapshot.queryPoint.coordinates
          const [dx, dy] = docPoint.coordinates
          const qSvgX = toSvgX(qx)
          const qSvgY = toSvgY(qy)
          const dSvgX = toSvgX(dx)
          const dSvgY = toSvgY(dy)
          return (
            <line
              key={`line-${docPoint.id}`}
              x1={qSvgX}
              y1={qSvgY}
              x2={dSvgX}
              y2={dSvgY}
              className="stroke-accent-fill opacity-80"
              stroke="#087F8C"
              strokeWidth={1.5}
              strokeDasharray="4,4"
            />
          )
        })}

      {/* Points & Labels */}
      {points.map((pt) => {
        const [px, py] = pt.coordinates
        const svgX = toSvgX(px)
        const svgY = toSvgY(py)

        if (pt.id === 'query') {
          return (
            <g key={pt.id}>
              <path
                d={getStarPath(svgX, svgY, 5, 10, 4)}
                className="fill-accent-fill stroke-accent-fill"
                stroke="#087F8C"
                fill="#087F8C"
                strokeWidth={1.5}
              />
              <text
                x={svgX + 12}
                y={svgY + 4}
                textAnchor="start"
                className="text-[12px] font-bold fill-primary-text"
              >
                {pt.label}
              </text>
            </g>
          )
        } else {
          const isSelected = pt.id === selectedDocumentId
          return (
            <g key={pt.id}>
              <circle
                cx={svgX}
                cy={svgY}
                r={isSelected ? 8 : 6}
                className={cn(
                  "stroke-primary-text transition-all",
                  isSelected
                    ? "fill-accent-fill stroke-accent-fill"
                    : "fill-secondary"
                )}
                stroke={isSelected ? "#087F8C" : "#17212B"}
                fill={isSelected ? "#087F8C" : "#FFFFFF"}
                strokeWidth={2}
              />
              <text
                x={svgX + 10}
                y={svgY + 4}
                textAnchor="start"
                className={cn(
                  "text-[12px] font-bold transition-all",
                  isSelected ? "fill-accent-fill font-bold" : "fill-primary-text"
                )}
              >
                {pt.label}
              </text>
            </g>
          )
        }
      })}
    </svg>
  )
}

interface CoordinatesTableProps {
  semanticSnapshot: SemanticSnapshot
}

export const CoordinatesTable: React.FC<CoordinatesTableProps> = ({ semanticSnapshot }) => {
  const points = [
    semanticSnapshot.queryPoint,
    ...semanticSnapshot.documentPoints,
  ]

  return (
    <div className="overflow-x-auto border border-border-custom rounded-[8px] bg-secondary w-full">
      <table className="w-full text-left border-collapse text-body">
        <thead>
          <tr className="border-b border-border-custom text-label font-weight-bold text-primary-text bg-subtle-surface/30">
            <th className="py-sm px-md">Point</th>
            <th className="py-sm px-md text-right">Dimension 1 (X)</th>
            <th className="py-sm px-md text-right">Dimension 2 (Y)</th>
          </tr>
        </thead>
        <tbody>
          {points.map((pt) => {
            const [x, y] = pt.coordinates
            return (
              <tr key={pt.id} className="border-b border-border-custom last:border-0 hover:bg-subtle-surface/50">
                <td className="py-sm px-md text-primary-text font-weight-bold">{pt.label}</td>
                <td className="py-sm px-md text-right text-primary-text font-tabular">{formatTwoDecimals(x)}</td>
                <td className="py-sm px-md text-right text-primary-text font-tabular">{formatTwoDecimals(y)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

interface KeywordLimitationStepProps {
  activeScenarioId: string
  keywordSnapshot: KeywordSnapshot
  semanticSnapshot: SemanticSnapshot
  onSwitchToKeywordMissesMeaning: () => void
}

export const KeywordLimitationStep: React.FC<KeywordLimitationStepProps> = ({
  activeScenarioId,
  keywordSnapshot,
  semanticSnapshot,
  onSwitchToKeywordMissesMeaning,
}) => {
  const isQueryEmpty = keywordSnapshot.queryTokens.length === 0
  const isDocsEmpty = keywordSnapshot.documents.every((doc) => doc.tokens.length === 0)
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

  const showRecommendationCallout = activeScenarioId !== 'keyword-misses-meaning'

  return (
    <div className="flex flex-col gap-lg">
      {/* Scenario Recommendation Callout */}
      {showRecommendationCallout && (
        <div className="bg-subtle-surface border-2 border-accent-fill p-md rounded-[8px] flex flex-col gap-sm">
          <p className="text-body text-primary-text font-bold">
            Tip: Switch to the "Keyword Search Misses Meaning" scenario to see the best worked example of synonyms failing.
          </p>
          <Button
            onClick={onSwitchToKeywordMissesMeaning}
            className="w-fit bg-accent-fill text-accent-contrast font-bold h-11 px-md min-h-[44px]"
          >
            Switch Scenario
          </Button>
        </div>
      )}

      {/* Keyword Scores List */}
      <div className="flex flex-col gap-md">
        {keywordSnapshot.documents.map((doc) => {
          const missedDoc = semanticSnapshot.missedDocuments.find((m) => m.id === doc.id)
          const isMissed = !!missedDoc

          return (
            <Card
              key={doc.id}
              className={cn(
                "border bg-secondary",
                isMissed
                  ? "border-2 border-destructive-fill bg-destructive-surface"
                  : "border-border-custom bg-secondary"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-body font-weight-bold text-primary-text flex justify-between items-center">
                  <span>{doc.title || doc.id}</span>
                  <span className="text-body text-muted-text font-normal font-tabular">
                    Score: {formatThreeDecimals(doc.score)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-md">
                {/* Securely render text to avoid XSS execution */}
                <p className="text-body text-primary-text font-normal italic border-l-2 border-border-custom pl-md py-xs bg-subtle-surface/30">
                  {doc.text}
                </p>
                {isMissed && (
                  <div className="flex gap-sm items-center p-sm bg-secondary border border-destructive-fill rounded-[6px] text-destructive-fill font-weight-bold text-body">
                    <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>{missedDoc.explanation}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Conceptual Explanation Panel */}
      <Card className="border border-border-custom bg-secondary">
        <CardHeader>
          <CardTitle className="text-body font-weight-bold text-primary-text">Why does this happen?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body text-muted-text">
            Keyword search matches query terms exactly. If a query searches for "phone" and a document contains "iPhone", the search engine sees these as completely different terms. Because there are no matching words, the score is exactly 0.000—even though the student knows they mean the same thing.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
