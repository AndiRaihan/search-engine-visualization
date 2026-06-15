import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { StepId } from '@/domain/simulation'

interface LessonPanelProps {
  activeStepId: StepId
  currentStepIndex: number
  totalSteps: number
  activeStepTitle: string
  activeStepDescription: string
  progress: number
  canGoPrevious: boolean
  canGoNext: boolean
  onStartSearch: () => void
  onPreviousStep: () => void
  onNextStep: () => void
  stepHeadingRef?: React.RefObject<HTMLHeadingElement | null>
}

export const LessonPanel: React.FC<LessonPanelProps> = ({
  activeStepId,
  currentStepIndex,
  totalSteps,
  activeStepTitle,
  activeStepDescription,
  progress,
  canGoPrevious,
  canGoNext,
  onStartSearch,
  onPreviousStep,
  onNextStep,
  stepHeadingRef,
}) => {
  if (activeStepId === 'setup') {
    return (
      <div className="flex flex-col gap-xl flex-grow justify-between">
        <div className="flex flex-col gap-md">
          <h2 className="text-heading font-weight-bold text-primary-text">Start your lesson</h2>
          <p className="text-body text-muted-text">
            Choose a scenario on the left, then click Start Search to begin.
          </p>
        </div>
        <Button
          onClick={onStartSearch}
          className="w-full min-h-[44px] bg-accent-fill hover:bg-accent-fill/90 text-accent-contrast font-weight-bold rounded-[4px] cursor-pointer"
        >
          Start Search
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-xl flex-grow justify-between">
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-xs">
          <div className="flex items-center justify-between">
            <span className="text-label text-muted-text font-tabular">
              Step {currentStepIndex} of {totalSteps}
            </span>
            <Badge className="bg-accent-fill text-accent-contrast hover:bg-accent-fill shadow-none rounded-[4px] px-3 py-1 text-xs font-weight-bold h-auto">
              Active
            </Badge>
          </div>
          <Progress
            value={progress}
            className="h-[8px] bg-subtle-surface"
            aria-label="Lesson progress"
            aria-valuenow={currentStepIndex}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          />
        </div>

        <h2
          ref={stepHeadingRef}
          tabIndex={-1}
          className="text-heading font-weight-bold text-primary-text focus:outline-none"
        >
          {activeStepTitle}
        </h2>

        <div className="flex flex-col gap-md">
          <div className="p-md bg-subtle-surface border border-border-custom rounded-[8px]">
            <h3 className="text-label text-primary-text font-weight-bold mb-xs">
              What did the search engine do?
            </h3>
            <p className="text-body text-muted-text">{activeStepDescription}</p>
          </div>
          <div className="p-md bg-subtle-surface border border-border-custom rounded-[8px]">
            <h3 className="text-label text-primary-text font-weight-bold mb-xs">
              Why does it matter?
            </h3>
            <p className="text-body text-muted-text">
              This helps students understand how the query matches documents at this step.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-sm">
        <Button
          disabled={!canGoPrevious}
          onClick={onPreviousStep}
          className={`flex-1 min-h-[44px] font-weight-bold rounded-[4px] cursor-pointer border border-border-custom shadow-none ${
            canGoPrevious
              ? 'bg-secondary text-primary-text hover:bg-subtle-surface'
              : 'bg-subtle-surface text-muted-text cursor-not-allowed opacity-50'
          }`}
        >
          Previous step
        </Button>
        <Button
          disabled={!canGoNext}
          onClick={onNextStep}
          className={`flex-1 min-h-[44px] font-weight-bold rounded-[4px] cursor-pointer border border-border-custom shadow-none ${
            canGoNext
              ? 'bg-secondary text-primary-text hover:bg-subtle-surface'
              : 'bg-subtle-surface text-muted-text cursor-not-allowed opacity-50'
          }`}
        >
          Next step
        </Button>
      </div>
    </div>
  )
}
