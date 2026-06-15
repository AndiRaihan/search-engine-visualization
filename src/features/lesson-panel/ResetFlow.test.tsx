import { describe, test, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'

describe('Reset Scenario Flow', () => {
  test('immediate reset to setup for clean scenario, no dialog shown', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Verify setup heading is present
    expect(screen.getByRole('heading', { name: /Your search workspace/i })).toBeDefined()

    // 1. Click Start Search to move to step 1 (Tokenization)
    const startButton = screen.getByRole('button', { name: /Start Search/i })
    await user.click(startButton)

    // Verify we are on Tokenization step
    expect(screen.getByRole('heading', { name: /Tokenization is ready/i })).toBeDefined()

    // 2. Click Reset Scenario button while scenario is clean
    const resetButton = screen.getByRole('button', { name: /Reset scenario/i })
    await user.click(resetButton)

    // Verify it immediately resets back to setup step (since no edits were made)
    expect(screen.getByRole('heading', { name: /Your search workspace/i })).toBeDefined()
    expect(screen.queryByText(/Reset edited scenario\?/i)).toBeNull()
  })

  test('dialog opens on dirty scenario, cancel preserves edits and restores focus', async () => {
    const user = userEvent.setup()
    render(<App />)

    // 1. Edit the query to make scenario dirty
    const queryTextarea = screen.getByLabelText(/Query/i) as HTMLTextAreaElement
    await user.clear(queryTextarea)
    await user.type(queryTextarea, 'new query')

    // Verify Edited badge is present
    expect(screen.getByText('Edited')).toBeDefined()

    // 2. Click Reset Scenario button
    const resetButton = screen.getByRole('button', { name: /Reset scenario/i })
    await user.click(resetButton)

    // 3. Verify dialog is open
    expect(screen.getByRole('heading', { name: /Reset edited scenario\?/i })).toBeDefined()
    expect(screen.getByText(/This will discard your query and document edits and return to the setup step/i)).toBeDefined()

    // Verify Keep edits button is present and focused (initial focus)
    const keepEditsButton = screen.getByRole('button', { name: /Keep edits/i })
    expect(keepEditsButton).toBe(document.activeElement)

    // 4. Cancel the dialog
    await user.click(keepEditsButton)

    // Verify dialog closes
    await waitFor(() => {
      expect(screen.queryByText(/Reset edited scenario\?/i)).toBeNull()
    })

    // Verify query edits are preserved
    expect(queryTextarea.value).toBe('new query')

    // Verify focus is restored to the Reset scenario button
    expect(resetButton).toBe(document.activeElement)
  })

  test('confirming reset restores scenario defaults, setup step, focuses query, and announces reset', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Start search first
    const startButton = screen.getByRole('button', { name: /Start Search/i })
    await user.click(startButton)

    // Make edits to a document textarea
    const doc1Textarea = screen.getByLabelText(/Document 1 text/i) as HTMLTextAreaElement
    await user.clear(doc1Textarea)
    await user.type(doc1Textarea, 'edited doc text')

    // Verify Edited badge is present
    expect(screen.getByText('Edited')).toBeDefined()

    // Click Reset
    const resetButton = screen.getByRole('button', { name: /Reset scenario/i })
    await user.click(resetButton)

    // Dialog should be open
    expect(screen.getByRole('heading', { name: /Reset edited scenario\?/i })).toBeDefined()

    // Click "Reset scenario" confirm action
    const confirmButton = screen.getByRole('button', { name: 'Reset scenario' })
    await user.click(confirmButton)

    // Verify dialog closes
    await waitFor(() => {
      expect(screen.queryByText(/Reset edited scenario\?/i)).toBeNull()
    })

    // Verify active step is setup
    expect(screen.getByRole('heading', { name: /Your search workspace/i })).toBeDefined()

    // Verify document text is restored to original default
    const restoredDoc1Textarea = screen.getByLabelText(/Document 1 text/i) as HTMLTextAreaElement
    expect(restoredDoc1Textarea.value).not.toBe('edited doc text')
    expect(restoredDoc1Textarea.value).toBe('The latest iPhone with a titanium frame.')

    // Verify Edited badge is gone
    expect(screen.queryByText('Edited')).toBeNull()

    // Verify focus is redirected to the Query field
    const queryTextarea = screen.getByLabelText(/Query/i) as HTMLTextAreaElement
    expect(queryTextarea).toBe(document.activeElement)

    // Verify screen reader polite announcement is made
    const announcementRegion = screen.getByText('Scenario reset to its original values.')
    expect(announcementRegion).toBeDefined()
  })
})
