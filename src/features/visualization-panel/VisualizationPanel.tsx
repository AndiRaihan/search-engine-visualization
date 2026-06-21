import React from 'react'
import type { StepId, KeywordSnapshot, SemanticSnapshot, FinalComparisonSnapshot } from '@/domain/simulation'
import {
  TokenizationStep,
  MatchingStep,
  TermFrequencyStep,
  InverseDocumentFrequencyStep,
} from './keyword-steps/KeywordFoundationsSteps'
import {
  TfidfStep,
  KeywordRankingStep,
} from './keyword-steps/KeywordScoringSteps'
import {
  MeaningVectorsStep,
  SemanticRankingStep,
  KeywordLimitationStep,
} from './semantic-steps/SemanticVisualizationSteps'
import { FinalComparisonStep } from './final-comparison/FinalComparisonStep'
import { buildFinalComparisonSnapshot } from '@/domain/simulation'

interface SemanticMetricToggleProps {
  metric: 'euclidean' | 'cosine'
  onChange: (metric: 'euclidean' | 'cosine') => void
}

export const SemanticMetricToggle: React.FC<SemanticMetricToggleProps> = ({ metric, onChange }) => {
  const euclideanRef = React.useRef<HTMLButtonElement>(null)
  const cosineRef = React.useRef<HTMLButtonElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      if (metric === 'euclidean') {
        cosineRef.current?.focus()
      } else {
        euclideanRef.current?.focus()
      }
    }
  }

  return (
    <div
      role="group"
      aria-label="Semantic metric"
      className="flex bg-subtle-surface border border-border-custom rounded-md p-[4px] gap-[4px] shrink-0"
      onKeyDown={handleKeyDown}
    >
      <button
        ref={euclideanRef}
        type="button"
        tabIndex={metric === 'euclidean' ? 0 : -1}
        aria-pressed={metric === 'euclidean'}
        className={`px-sm py-[4px] rounded-sm text-xs font-weight-bold transition-all cursor-pointer ${
          metric === 'euclidean'
            ? 'bg-secondary text-primary-text shadow-sm'
            : 'text-muted-text hover:text-primary-text'
        }`}
        onClick={() => onChange('euclidean')}
      >
        Euclidean distance
      </button>
      <button
        ref={cosineRef}
        type="button"
        tabIndex={metric === 'cosine' ? 0 : -1}
        aria-pressed={metric === 'cosine'}
        className={`px-sm py-[4px] rounded-sm text-xs font-weight-bold transition-all cursor-pointer ${
          metric === 'cosine'
            ? 'bg-secondary text-primary-text shadow-sm'
            : 'text-muted-text hover:text-primary-text'
        }`}
        onClick={() => onChange('cosine')}
      >
        Cosine similarity
      </button>
    </div>
  )
}

interface VisualizationPanelProps {
  activeStepId: StepId
  activeStepTitle: string
  setupHeadingRef?: React.RefObject<HTMLHeadingElement | null>
  keywordSnapshot: KeywordSnapshot
  semanticSnapshot: SemanticSnapshot
  comparisonSnapshot?: FinalComparisonSnapshot
  isEdited: boolean
  activeScenarioId?: string
  onSwitchToKeywordMissesMeaning?: () => void
  semanticMetric: 'euclidean' | 'cosine'
  onSemanticMetricChange: (metric: 'euclidean' | 'cosine') => void
  onAnnounce?: (message: string) => void
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  activeStepId,
  activeStepTitle,
  setupHeadingRef,
  keywordSnapshot,
  semanticSnapshot,
  comparisonSnapshot,
  isEdited,
  activeScenarioId,
  onSwitchToKeywordMissesMeaning,
  semanticMetric,
  onSemanticMetricChange,
  onAnnounce,
}) => {
  const isSetup = activeStepId === 'setup'

  const resolvedComparisonSnapshot = React.useMemo(() => {
    if (comparisonSnapshot) return comparisonSnapshot
    return buildFinalComparisonSnapshot(keywordSnapshot, semanticSnapshot, semanticMetric)
  }, [comparisonSnapshot, keywordSnapshot, semanticSnapshot, semanticMetric])

  return (
    <section
      aria-label="Visualization"
      className="bg-secondary border border-border-custom rounded-[12px] p-lg border-t-2 border-t-accent-fill flex flex-col gap-xl min-h-[300px]"
    >
      {isSetup ? (
        <div className="flex flex-col gap-md transition-opacity duration-150 ease-in-out motion-reduce:transition-none">
          <h2
            ref={setupHeadingRef}
            tabIndex={-1}
            className="text-heading font-weight-bold text-primary-text focus:outline-none"
          >
            Your search workspace
          </h2>
          <p className="text-body text-muted-text">
            Choose a scenario, review the query and documents, then start the search.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-xl transition-opacity duration-150 ease-in-out motion-reduce:transition-none">
          <div className="flex flex-row justify-between items-start gap-md">
            <div className="flex flex-col gap-md">
              <h2 className="text-heading font-weight-bold text-primary-text">
                {activeStepTitle} is ready
              </h2>
              <p className="text-body text-muted-text">
                This lesson view will show what the search engine calculates at this step.
              </p>
            </div>
            {(activeStepId === 'semantic-ranking' || activeStepId === 'final-comparison') && (
              <SemanticMetricToggle
                metric={semanticMetric}
                onChange={onSemanticMetricChange}
              />
            )}
          </div>

          {/* Step content or Labeled Diagram Frame Placeholder */}
          {activeStepId === 'tokenization' ? (
            <TokenizationStep snapshot={keywordSnapshot} />
          ) : activeStepId === 'matching' ? (
            <MatchingStep snapshot={keywordSnapshot} />
          ) : activeStepId === 'term-frequency' ? (
            <TermFrequencyStep snapshot={keywordSnapshot} />
          ) : activeStepId === 'inverse-document-frequency' ? (
            <InverseDocumentFrequencyStep snapshot={keywordSnapshot} />
          ) : activeStepId === 'tf-idf' ? (
            <TfidfStep snapshot={keywordSnapshot} />
          ) : activeStepId === 'keyword-ranking' ? (
            <KeywordRankingStep snapshot={keywordSnapshot} />
          ) : activeStepId === 'keyword-limitation' ? (
            <KeywordLimitationStep
              activeScenarioId={activeScenarioId || 'exact-match-fails'}
              keywordSnapshot={keywordSnapshot}
              semanticSnapshot={semanticSnapshot}
              onSwitchToKeywordMissesMeaning={onSwitchToKeywordMissesMeaning || (() => {})}
            />
          ) : activeStepId === 'meaning-vectors' ? (
            <MeaningVectorsStep semanticSnapshot={semanticSnapshot} isEdited={isEdited} />
          ) : activeStepId === 'semantic-ranking' ? (
            <SemanticRankingStep semanticSnapshot={semanticSnapshot} isEdited={isEdited} onAnnounce={onAnnounce} />
          ) : activeStepId === 'final-comparison' ? (
            <FinalComparisonStep comparisonSnapshot={resolvedComparisonSnapshot} />
          ) : (
            <div className="border border-dashed border-border-custom rounded-[8px] p-2xl flex items-center justify-center bg-subtle-surface">
              <span className="text-label text-muted-text uppercase tracking-wider">
                [ {activeStepTitle} Visuals Placeholder ]
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

