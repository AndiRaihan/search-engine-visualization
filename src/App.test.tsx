import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import App from './App'

test('full guided classroom flow regression test', async () => {
  const user = userEvent.setup()
  render(<App />)

  // Verify elements are present on setup
  expect(screen.getByRole('heading', { name: /Search Engine Lab/i })).toBeDefined()
  expect(screen.getByText(/See how a query becomes a ranked list, one step at a time/i)).toBeDefined()

  // Verify setup workspace text is present
  expect(screen.getByRole('heading', { name: /Your search workspace/i })).toBeDefined()

  // Verify Edited badge is NOT present initially
  expect(screen.queryByText(/Edited/i)).toBeNull()

  // Click Start Search button
  const startButton = screen.getByRole('button', { name: /Start Search/i })
  await user.click(startButton)

  // Verify that the setup workspace text is replaced with "Tokenization is ready"
  expect(screen.getByRole('heading', { name: /Tokenization is ready/i })).toBeDefined()

  // Click Next step button to go to Word Matching
  const nextButton = screen.getByRole('button', { name: /Next step/i })
  // Previous step should be disabled on step 1 (Tokenization)
  const prevButton = screen.getByRole('button', { name: /Previous step/i })
  expect(prevButton.className).toContain('cursor-not-allowed')

  await user.click(nextButton)
  expect(screen.getByRole('heading', { name: /Word Matching is ready/i })).toBeDefined()
  
  // Previous step should be enabled now on step 2
  expect(prevButton.className).not.toContain('cursor-not-allowed')
})

test('editing source query and documents triggers panel Edited status', async () => {
  render(<App />)

  // Initially not edited
  expect(screen.queryByText(/Edited/i)).toBeNull()

  // Edit query
  const queryInput = screen.getByLabelText(/Query/i)
  fireEvent.change(queryInput, { target: { value: 'iphone review' } })

  // Should show Edited badge
  expect(screen.getByText(/Edited/i)).toBeDefined()

  // Edit query back to default
  fireEvent.change(queryInput, { target: { value: 'the iphone' } })
  // Edited badge should disappear
  expect(screen.queryByText(/Edited/i)).toBeNull()
})

test('keyword ranking integration test: navigate to Keyword Ranking, edit query and document, and verify evidence updates', async () => {
  const user = userEvent.setup()
  render(<App />)

  // Start the search
  const startButton = screen.getByRole('button', { name: /Start Search/i })
  await user.click(startButton)

  // Navigate to Keyword Ranking step (5 clicks from Tokenization)
  const nextButton = screen.getByRole('button', { name: /Next step/i })
  for (let i = 0; i < 5; i++) {
    await user.click(nextButton)
  }

  // Verify we are on Keyword Ranking
  expect(screen.getByRole('heading', { name: /Keyword Ranking is ready/i })).toBeDefined()

  // Verify initial top-ranked document is doc-4 (since it has "iphone" twice)
  const headingsBefore = screen.getAllByRole('heading', { level: 3 }).filter(h => h.textContent?.includes('#'))
  expect(headingsBefore[0].textContent).toContain('#1')
  expect(headingsBefore[0].textContent).toContain('doc-4')

  // Edit query to "cinnamon"
  const queryInput = screen.getByLabelText(/Query/i)
  await user.clear(queryInput)
  await user.type(queryInput, 'cinnamon')

  // Verify that doc-7 (which contains "cinnamon") is now #1
  const headingsAfterQuery = screen.getAllByRole('heading', { level: 3 }).filter(h => h.textContent?.includes('#'))
  expect(headingsAfterQuery[0].textContent).toContain('#1')
  expect(headingsAfterQuery[0].textContent).toContain('doc-7')

  // Verify the explanation cites cinnamon
  expect(screen.getAllByText(/Term 'cinnamon' contributed/).length).toBeGreaterThanOrEqual(1)

  // Edit Document 1 text to also contain cinnamon
  const doc1Input = screen.getByLabelText(/Document 1 text/i)
  await user.clear(doc1Input)
  await user.type(doc1Input, 'cinnamon latest model')

  // Verify that doc-1 and doc-7 both now contain cinnamon calculations and update
  expect(screen.getAllByText(/Term 'cinnamon' contributed/).length).toBeGreaterThanOrEqual(2)
})

