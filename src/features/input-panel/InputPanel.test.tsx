import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputPanel } from './InputPanel'
import { buildSessionFromScenario } from '@/domain/simulation'
import { scenarios } from '@/content/scenarios'

describe('InputPanel Component', () => {
  const scenario = scenarios[0]
  const session = buildSessionFromScenario(scenario)

  test('renders scenario selector, query, and document list', () => {
    render(
      <InputPanel
        session={session}
        isEdited={false}
        onScenarioChange={vi.fn()}
        onQueryChange={vi.fn()}
        onDocumentChange={vi.fn()}
        onResetClick={vi.fn()}
      />
    )

    expect(screen.getByLabelText(/Scenario/i)).toBeDefined()
    expect(screen.getByLabelText(/Query/i)).toBeDefined()
    expect(screen.getByText(/Document 1/i)).toBeDefined()
    expect(screen.getByText(/Document 7/i)).toBeDefined()
  })

  test('shows Edited badge when isEdited is true', () => {
    const { rerender } = render(
      <InputPanel
        session={session}
        isEdited={false}
        onScenarioChange={vi.fn()}
        onQueryChange={vi.fn()}
        onDocumentChange={vi.fn()}
        onResetClick={vi.fn()}
      />
    )

    expect(screen.queryByText(/Edited/i)).toBeNull()

    rerender(
      <InputPanel
        session={session}
        isEdited={true}
        onScenarioChange={vi.fn()}
        onQueryChange={vi.fn()}
        onDocumentChange={vi.fn()}
        onResetClick={vi.fn()}
      />
    )

    expect(screen.getByText(/Edited/i)).toBeDefined()
  })

  test('triggers callback on query editing', () => {
    const handleQueryChange = vi.fn()
    render(
      <InputPanel
        session={session}
        isEdited={false}
        onScenarioChange={vi.fn()}
        onQueryChange={handleQueryChange}
        onDocumentChange={vi.fn()}
        onResetClick={vi.fn()}
      />
    )

    const queryInput = screen.getByLabelText(/Query/i)
    fireEvent.change(queryInput, { target: { value: 'iphone 13' } })

    expect(handleQueryChange).toHaveBeenCalledWith('iphone 13')
  })

  test('triggers callback on document editing', () => {
    const handleDocumentChange = vi.fn()
    render(
      <InputPanel
        session={session}
        isEdited={false}
        onScenarioChange={vi.fn()}
        onQueryChange={vi.fn()}
        onDocumentChange={handleDocumentChange}
        onResetClick={vi.fn()}
      />
    )

    const docInput = screen.getByLabelText(/Document 1 text/i)
    fireEvent.change(docInput, { target: { value: 'changed text' } })

    expect(handleDocumentChange).toHaveBeenCalledWith('doc-1', 'changed text')
  })

  test('renders text containing HTML markup as literal plain text', () => {
    const xssSession = {
      ...session,
      query: '<script>alert(1)</script>',
      documents: [
        { id: 'doc-1', text: '<div>test</div>' }
      ]
    }

    render(
      <InputPanel
        session={xssSession}
        isEdited={false}
        onScenarioChange={vi.fn()}
        onQueryChange={vi.fn()}
        onDocumentChange={vi.fn()}
        onResetClick={vi.fn()}
      />
    )

    const queryInput = screen.getByLabelText(/Query/i) as HTMLTextAreaElement
    expect(queryInput.value).toBe('<script>alert(1)</script>')

    const docInput = screen.getByLabelText(/Document 1 text/i) as HTMLTextAreaElement
    expect(docInput.value).toBe('<div>test</div>')
  })

  test('triggers callback on reset button click', async () => {
    const handleResetClick = vi.fn()
    const user = userEvent.setup()
    render(
      <InputPanel
        session={session}
        isEdited={false}
        onScenarioChange={vi.fn()}
        onQueryChange={vi.fn()}
        onDocumentChange={vi.fn()}
        onResetClick={handleResetClick}
      />
    )

    const resetButton = screen.getByRole('button', { name: /Reset scenario/i })
    await user.click(resetButton)
    expect(handleResetClick).toHaveBeenCalled()
  })
})
