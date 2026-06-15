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
