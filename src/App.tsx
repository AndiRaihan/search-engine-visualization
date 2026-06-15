import { useReducer, useState, useEffect, useRef } from 'react'
import {
  simulationReducer,
  buildSessionFromScenario,
  selectIsEdited,
  selectCanGoNext,
  selectCanGoPrevious,
  selectProgress,
} from '@/domain/simulation'
import { scenarios, getScenarioById } from '@/content/scenarios'
import { lessonSteps } from '@/content/lessonSteps'
import { InputPanel } from '@/features/input-panel/InputPanel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function App() {
  const defaultScenario = scenarios[0]
  const [session, dispatch] = useReducer(
    simulationReducer,
    defaultScenario,
    buildSessionFromScenario
  )

  const [announcement, setAnnouncement] = useState('')
  const setupHeadingRef = useRef<HTMLHeadingElement>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const isFirstMount = useRef(true)

  const currentScenario = getScenarioById(session.scenarioId) || defaultScenario
  const isEdited = selectIsEdited(session, currentScenario)

  const activeStep = lessonSteps.find((s) => s.id === session.activeStepId) || lessonSteps[0]
  const currentStepIndex = lessonSteps.findIndex((s) => s.id === session.activeStepId)

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
        />

        {/* Center Panel: Lesson steps */}
        <section 
          aria-label="Lesson steps" 
          className="bg-secondary border border-border-custom rounded-[12px] p-lg flex flex-col gap-xl min-h-[300px]"
        >
          {session.activeStepId === 'setup' ? (
            <div className="flex flex-col gap-xl flex-grow justify-between">
              <div className="flex flex-col gap-md">
                <h2 className="text-heading font-weight-bold text-primary-text">Start your lesson</h2>
                <p className="text-body text-muted-text">
                  Choose a scenario on the left, then click Start Search to begin.
                </p>
              </div>
              <Button 
                onClick={() => dispatch({ type: 'started' })}
                className="w-full min-h-[44px] bg-accent-fill hover:bg-accent-fill/90 text-accent-contrast font-weight-bold rounded-[4px] cursor-pointer"
              >
                Start Search
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-xl flex-grow justify-between">
              <div className="flex flex-col gap-md">
                <div className="flex flex-col gap-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-label text-muted-text font-tabular">
                      Step {currentStepIndex} of {lessonSteps.length - 1}
                    </span>
                    <Badge className="bg-accent-fill text-accent-contrast hover:bg-accent-fill shadow-none rounded-[4px] px-sm py-xs text-xs font-weight-bold">
                      Active
                    </Badge>
                  </div>
                  <Progress 
                    value={selectProgress(session.activeStepId)} 
                    className="h-[8px] bg-subtle-surface"
                    aria-label="Lesson progress"
                    aria-valuenow={currentStepIndex}
                    aria-valuemin={1}
                    aria-valuemax={lessonSteps.length - 1}
                  />
                </div>
                
                <h2 
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="text-heading font-weight-bold text-primary-text focus:outline-none"
                >
                  {activeStep.title}
                </h2>

                <div className="flex flex-col gap-md">
                  <div className="p-md bg-subtle-surface border border-border-custom rounded-[8px]">
                    <h3 className="text-label text-primary-text font-weight-bold mb-xs">What did the search engine do?</h3>
                    <p className="text-body text-muted-text">
                      {activeStep.description}
                    </p>
                  </div>
                  <div className="p-md bg-subtle-surface border border-border-custom rounded-[8px]">
                    <h3 className="text-label text-primary-text font-weight-bold mb-xs">Why does it matter?</h3>
                    <p className="text-body text-muted-text">
                      This helps students understand how the query matches documents at this step.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-sm">
                <Button 
                  disabled={!selectCanGoPrevious(session.activeStepId)}
                  onClick={() => dispatch({ type: 'previousStep' })}
                  className={`flex-1 min-h-[44px] font-weight-bold rounded-[4px] cursor-pointer border border-border-custom shadow-none ${
                    selectCanGoPrevious(session.activeStepId)
                      ? 'bg-secondary text-primary-text hover:bg-subtle-surface'
                      : 'bg-subtle-surface text-muted-text cursor-not-allowed opacity-50'
                  }`}
                >
                  Previous step
                </Button>
                <Button 
                  disabled={!selectCanGoNext(session.activeStepId)}
                  onClick={() => dispatch({ type: 'nextStep' })}
                  className={`flex-1 min-h-[44px] font-weight-bold rounded-[4px] cursor-pointer border border-border-custom shadow-none ${
                    selectCanGoNext(session.activeStepId)
                      ? 'bg-secondary text-primary-text hover:bg-subtle-surface'
                      : 'bg-subtle-surface text-muted-text cursor-not-allowed opacity-50'
                  }`}
                >
                  Next step
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Right Panel: Visualization */}
        <section 
          aria-label="Visualization" 
          className="bg-secondary border border-border-custom rounded-[12px] p-lg border-t-2 border-t-accent-fill flex flex-col gap-xl min-h-[300px]"
        >
          {session.activeStepId === 'setup' ? (
            <div className="flex flex-col gap-md">
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
            <div className="flex flex-col gap-md">
              <h2 className="text-heading font-weight-bold text-primary-text">
                {activeStep.title} is ready
              </h2>
              <p className="text-body text-muted-text">
                This lesson view will show what the search engine calculates at this step.
              </p>
            </div>
          )}
        </section>

      </main>
    </div>
  )
}
