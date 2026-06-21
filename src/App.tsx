import { useReducer, useState, useEffect, useRef, useMemo } from 'react'
import {
  simulationReducer,
  buildSessionFromScenario,
  selectIsEdited,
  selectCanGoNext,
  selectCanGoPrevious,
  selectProgress,
  buildKeywordSnapshot,
  buildSemanticSnapshot,
} from '@/domain/simulation'
import { scenarios, getScenarioById } from '@/content/scenarios'
import { lessonSteps } from '@/content/lessonSteps'
import { InputPanel } from '@/features/input-panel/InputPanel'
import { LessonPanel } from '@/features/lesson-panel/LessonPanel'
import { VisualizationPanel } from '@/features/visualization-panel/VisualizationPanel'
import { ResetScenarioDialog } from '@/features/lesson-panel/ResetScenarioDialog'

export default function App() {
  const defaultScenario = scenarios[0]
  const [session, dispatch] = useReducer(
    simulationReducer,
    defaultScenario,
    buildSessionFromScenario
  )

  const [announcement, setAnnouncement] = useState('')
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [wasResetConfirmed, setWasResetConfirmed] = useState(false)

  const setupHeadingRef = useRef<HTMLHeadingElement>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const resetButtonRef = useRef<HTMLButtonElement>(null)
  const queryInputRef = useRef<HTMLTextAreaElement>(null)
  const isFirstMount = useRef(true)

  const currentScenario = getScenarioById(session.scenarioId) || defaultScenario
  const isEdited = selectIsEdited(session, currentScenario)

  const activeStep = lessonSteps.find((s) => s.id === session.activeStepId) || lessonSteps[0]
  const currentStepIndex = lessonSteps.findIndex((s) => s.id === session.activeStepId)

  const keywordSnapshot = useMemo(() => {
    return buildKeywordSnapshot(session.query, session.documents)
  }, [session.query, session.documents])

  const semanticSnapshot = useMemo(() => {
    return buildSemanticSnapshot(session, keywordSnapshot)
  }, [session, session.semanticMetric, keywordSnapshot])

  const prevMetricRef = useRef(session.semanticMetric)
  useEffect(() => {
    if (prevMetricRef.current !== session.semanticMetric) {
      if (session.semanticMetric === 'cosine') {
        setAnnouncement('Switched to Cosine similarity metric. Documents ranked by highest similarity.')
      } else {
        setAnnouncement('Switched to Euclidean distance metric. Documents ranked by smallest distance.')
      }
      prevMetricRef.current = session.semanticMetric
    }
  }, [session.semanticMetric])

  // Focus redirection and live announcement when scenario changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    setAnnouncement(`${currentScenario.title} loaded. Query and documents restored.`)

    // Focus the appropriate heading
    if (session.activeStepId === 'setup') {
      setTimeout(() => {
        setupHeadingRef.current?.focus()
      }, 0)
    } else {
      setTimeout(() => {
        stepHeadingRef.current?.focus()
      }, 0)
    }
  }, [session.scenarioId])

  // Focus redirection when step changes (except scenario switch)
  useEffect(() => {
    if (session.activeStepId !== 'setup') {
      stepHeadingRef.current?.focus()
    }
  }, [session.activeStepId])

  // Dialogue close focus restoration
  const prevOpenRef = useRef(false)
  useEffect(() => {
    if (prevOpenRef.current && !isResetDialogOpen) {
      if (!wasResetConfirmed) {
        resetButtonRef.current?.focus()
      }
    }
    prevOpenRef.current = isResetDialogOpen
  }, [isResetDialogOpen, wasResetConfirmed])

  const handleResetClick = () => {
    if (isEdited) {
      setWasResetConfirmed(false)
      setIsResetDialogOpen(true)
    } else {
      dispatch({ type: 'resetConfirmed', scenario: currentScenario })
      setTimeout(() => {
        queryInputRef.current?.focus()
      }, 0)
      setAnnouncement('Scenario reset to its original values.')
    }
  }

  const handleConfirmReset = () => {
    setWasResetConfirmed(true)
    dispatch({ type: 'resetConfirmed', scenario: currentScenario })
    setIsResetDialogOpen(false)
    setTimeout(() => {
      queryInputRef.current?.focus()
    }, 0)
    setAnnouncement('Scenario reset to its original values.')
  }

  const handleSwitchToKeywordMissesMeaning = () => {
    const targetScenario = getScenarioById('keyword-misses-meaning')
    if (targetScenario) {
      dispatch({ type: 'scenarioSelected', scenario: targetScenario })
    }
  }

  return (
    <div className="mx-auto max-w-[1600px] px-lg py-2xl bg-dominant min-h-screen flex flex-col">
      {/* Polite Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {/* Header */}
      <header className="mb-2xl">
        <h1 className="text-title font-weight-bold text-primary-text leading-tight">
          Search Engine Lab
        </h1>
        <p className="text-body text-muted-text mt-xs">
          See how a query becomes a ranked list, one step at a time.
        </p>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-[minmax(300px,28fr)_minmax(280px,24fr)_minmax(480px,48fr)] gap-md items-start flex-grow">
        {/* Left Panel: Search inputs */}
        <InputPanel
          session={session}
          isEdited={isEdited}
          onScenarioChange={(scenario) => dispatch({ type: 'scenarioSelected', scenario })}
          onQueryChange={(value) => dispatch({ type: 'queryChanged', value })}
          onDocumentChange={(documentId, value) => dispatch({ type: 'documentChanged', documentId, value })}
          onResetClick={handleResetClick}
          resetButtonRef={resetButtonRef}
          queryInputRef={queryInputRef}
        />

        {/* Center Panel: Lesson steps */}
        <section
          aria-label="Lesson steps"
          className="bg-secondary border border-border-custom rounded-[12px] p-lg flex flex-col gap-xl min-h-[300px]"
        >
          <LessonPanel
            activeStepId={session.activeStepId}
            currentStepIndex={currentStepIndex}
            totalSteps={lessonSteps.length - 1}
            activeStepTitle={activeStep.title}
            activeStepDescription={
              session.activeStepId === 'semantic-ranking' && session.semanticMetric === 'cosine'
                ? 'This step measures the direction alignment (cosine similarity) between the query and documents on the meaning map to rank them.'
                : activeStep.description
            }
            progress={selectProgress(session.activeStepId)}
            canGoPrevious={selectCanGoPrevious(session.activeStepId)}
            canGoNext={selectCanGoNext(session.activeStepId)}
            onStartSearch={() => dispatch({ type: 'started' })}
            onPreviousStep={() => dispatch({ type: 'previousStep' })}
            onNextStep={() => dispatch({ type: 'nextStep' })}
            stepHeadingRef={stepHeadingRef}
          />
        </section>
 
        {/* Right Panel: Visualization */}
        <VisualizationPanel
          activeStepId={session.activeStepId}
          activeStepTitle={activeStep.title}
          setupHeadingRef={setupHeadingRef}
          keywordSnapshot={keywordSnapshot}
          semanticSnapshot={semanticSnapshot}
          isEdited={isEdited}
          activeScenarioId={session.scenarioId}
          onSwitchToKeywordMissesMeaning={handleSwitchToKeywordMissesMeaning}
          semanticMetric={session.semanticMetric}
          onSemanticMetricChange={(metric) => dispatch({ type: 'metricToggled', metric })}
        />
      </main>

      {/* Reset Confirmation Dialog */}
      <ResetScenarioDialog
        isOpen={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
        onConfirm={handleConfirmReset}
      />
    </div>
  )
}
