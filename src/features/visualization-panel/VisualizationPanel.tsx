import React from 'react'
import type { StepId, KeywordSnapshot, SemanticSnapshot } from '@/domain/simulation'
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

interface VisualizationPanelProps {
  activeStepId: StepId
  activeStepTitle: string
  setupHeadingRef?: React.RefObject<HTMLHeadingElement | null>
  keywordSnapshot: KeywordSnapshot
  semanticSnapshot: SemanticSnapshot
  isEdited: boolean
  activeScenarioId?: string
  onSwitchToKeywordMissesMeaning?: () => void
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  activeStepId,
  activeStepTitle,
  setupHeadingRef,
  keywordSnapshot,
  semanticSnapshot,
  isEdited,
  activeScenarioId,
  onSwitchToKeywordMissesMeaning,
}) => {
  const isSetup = activeStepId === 'setup'

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
          <div className="flex flex-col gap-md">
            <h2 className="text-heading font-weight-bold text-primary-text">
              {activeStepTitle} is ready
            </h2>
            <p className="text-body text-muted-text">
              This lesson view will show what the search engine calculates at this step.
            </p>
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
            <SemanticRankingStep semanticSnapshot={semanticSnapshot} isEdited={isEdited} />
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

