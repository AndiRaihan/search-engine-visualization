import React, { useRef, useEffect } from 'react'
import type { Scenario, SimulationSession } from '@/domain/simulation'
import { scenarios } from '@/content/scenarios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface InputPanelProps {
  session: SimulationSession
  isEdited: boolean
  onScenarioChange: (scenario: Scenario) => void
  onQueryChange: (query: string) => void
  onDocumentChange: (docId: string, text: string) => void
  onResetClick: () => void
  resetButtonRef?: React.RefObject<HTMLButtonElement | null>
  queryInputRef?: React.RefObject<HTMLTextAreaElement | null>
}

// Helper component for auto-growing textarea
const AutoGrowingTextarea = React.forwardRef<
  HTMLTextAreaElement,
  {
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    id?: string
    ariaLabel?: string
  }
>(({ value, onChange, id, ariaLabel }, ref) => {
  const localRef = useRef<HTMLTextAreaElement | null>(null)

  // Combine forwarded ref and local ref
  const setRefs = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      localRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
      }
    },
    [ref]
  )

  const adjustHeight = () => {
    const textarea = localRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      // Clamp scrollHeight between 88px and 160px
      const newHeight = Math.max(88, Math.min(textarea.scrollHeight, 160))
      textarea.style.height = `${newHeight}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  return (
    <Textarea
      ref={setRefs}
      id={id}
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
      className="w-full text-body border-border-custom rounded-[4px] bg-secondary text-primary-text min-h-[88px] max-h-[160px] overflow-y-auto resize-none p-sm focus-visible:ring-4 focus-visible:ring-accent-fill focus-visible:ring-offset-4"
    />
  )
})

AutoGrowingTextarea.displayName = 'AutoGrowingTextarea'

export const InputPanel: React.FC<InputPanelProps> = ({
  session,
  isEdited,
  onScenarioChange,
  onQueryChange,
  onDocumentChange,
  onResetClick,
  resetButtonRef,
  queryInputRef,
}) => {
  const currentScenario = scenarios.find((s) => s.id === session.scenarioId)

  const handleScenarioSelect = (val: string) => {
    const selected = scenarios.find((s) => s.id === val)
    if (selected) {
      onScenarioChange(selected)
    }
  }

  return (
    <section
      aria-label="Search inputs"
      className="bg-secondary border border-border-custom rounded-[12px] p-lg flex flex-col gap-xl"
    >
      {/* Scenario Selector */}
      <div className="flex flex-col gap-sm">
        <Label htmlFor="scenario-select" className="text-label text-primary-text font-weight-bold">
          Scenario
        </Label>
        <Select value={session.scenarioId} onValueChange={handleScenarioSelect}>
          <SelectTrigger
            id="scenario-select"
            className="w-full min-h-[44px] bg-secondary border border-border-custom text-body text-primary-text rounded-[4px]"
          >
            <SelectValue placeholder="Select a scenario" />
          </SelectTrigger>
          <SelectContent className="bg-secondary border border-border-custom rounded-[4px]">
            {scenarios.map((s) => (
              <SelectItem
                key={s.id}
                value={s.id}
                className="text-body text-primary-text focus:bg-subtle-surface focus:text-primary-text cursor-pointer"
              >
                {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {currentScenario && (
          <p className="text-xs text-muted-text mt-xs italic leading-normal">
            Goal: {currentScenario.learningGoal}
          </p>
        )}
      </div>

      {/* Query Input */}
      <div className="flex flex-col gap-sm">
        <Label htmlFor="query-input" className="text-label text-primary-text font-weight-bold">
          Query
        </Label>
        <AutoGrowingTextarea
          ref={queryInputRef}
          id="query-input"
          value={session.query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      {/* Documents List */}
      <div className="flex flex-col gap-sm">
        <Label className="text-label text-primary-text font-weight-bold">
          Documents
        </Label>
        <div className="flex flex-col gap-sm">
          {session.documents.map((doc, index) => (
            <Card
              key={doc.id}
              className="border-border-custom bg-secondary shadow-none rounded-[8px]"
            >
              <CardHeader className="p-sm pb-xs">
                <CardTitle className="text-label text-primary-text font-weight-bold">
                  Document {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-sm pt-0">
                <AutoGrowingTextarea
                  ariaLabel={`Document ${index + 1} text`}
                  value={doc.text}
                  onChange={(e) => onDocumentChange(doc.id, e.target.value)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Panel-level status row with Reset button */}
      <div className="min-h-[44px] flex items-center justify-between border-t border-border-custom pt-md mt-xs gap-sm">
        <span className="text-xs text-muted-text">
          {isEdited ? 'Changes made to defaults' : 'Using scenario defaults'}
        </span>
        <div className="flex items-center gap-sm">
          {isEdited && (
            <Badge className="bg-accent-fill text-accent-contrast hover:bg-accent-fill shadow-none rounded-[4px] px-3 py-1 text-xs font-weight-bold h-auto">
              Edited
            </Badge>
          )}
          <Button
            ref={resetButtonRef}
            onClick={onResetClick}
            className="min-h-[44px] px-md font-weight-bold rounded-[4px] border border-border-custom bg-secondary text-primary-text hover:bg-subtle-surface cursor-pointer shadow-none text-body"
          >
            Reset scenario
          </Button>
        </div>
      </div>
    </section>
  )
}
