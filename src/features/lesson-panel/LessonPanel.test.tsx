import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LessonPanel } from './LessonPanel'

describe('LessonPanel Component', () => {
  test('renders Start Search when in setup step', async () => {
    const handleStart = vi.fn()
    const user = userEvent.setup()
    render(
      <LessonPanel
        activeStepId="setup"
        currentStepIndex={0}
        totalSteps={10}
        activeStepTitle="Setup"
        activeStepDescription="Setup desc"
        progress={0}
        canGoPrevious={false}
        canGoNext={true}
        onStartSearch={handleStart}
        onPreviousStep={vi.fn()}
        onNextStep={vi.fn()}
      />
    )

    expect(screen.getByRole('heading', { name: /Start your lesson/i })).toBeDefined()
    const startButton = screen.getByRole('button', { name: /Start Search/i })
    await user.click(startButton)
    expect(handleStart).toHaveBeenCalled()
  })

  test('renders steps navigation and progress indicators in lesson steps', async () => {
    const handleNext = vi.fn()
    const handlePrev = vi.fn()
    const user = userEvent.setup()

    render(
      <LessonPanel
        activeStepId="tokenization"
        currentStepIndex={1}
        totalSteps={10}
        activeStepTitle="Tokenization"
        activeStepDescription="Tokenization desc"
        progress={10}
        canGoPrevious={false}
        canGoNext={true}
        onStartSearch={vi.fn()}
        onPreviousStep={handlePrev}
        onNextStep={handleNext}
      />
    )

    expect(screen.getByText(/Step 1 of 10/i)).toBeDefined()
    expect(screen.getByRole('heading', { name: /Tokenization/i })).toBeDefined()

    const prevButton = screen.getByRole('button', { name: /Previous step/i })
    const nextButton = screen.getByRole('button', { name: /Next step/i })

    // Previous step should be disabled since canGoPrevious is false
    expect(prevButton.className).toContain('cursor-not-allowed')
    await user.click(prevButton)
    expect(handlePrev).not.toHaveBeenCalled()

    // Next step is enabled
    expect(nextButton.className).not.toContain('cursor-not-allowed')
    await user.click(nextButton)
    expect(handleNext).toHaveBeenCalled()
  })
})
