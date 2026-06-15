import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import App from './App'

test('walking skeleton happy path', async () => {
  const user = userEvent.setup()
  render(<App />)

  // Verify elements are present on setup
  expect(screen.getByRole('heading', { name: /Search Engine Lab/i })).toBeDefined()
  expect(screen.getByText(/See how a query becomes a ranked list, one step at a time/i)).toBeDefined()
  
  // Verify three panels exist and are labeled
  expect(screen.getByLabelText(/Search inputs/i)).toBeDefined()
  expect(screen.getByLabelText(/Lesson steps/i)).toBeDefined()
  expect(screen.getByLabelText(/Visualization/i)).toBeDefined()

  // Verify setup workspace text is present
  expect(screen.getByRole('heading', { name: /Your search workspace/i })).toBeDefined()
  expect(screen.getByText(/Choose a scenario, review the query and documents, then start the search/i)).toBeDefined()

  // Click Start Search button
  const startButton = screen.getByRole('button', { name: /Start Search/i })
  await user.click(startButton)

  // Verify that the setup workspace text is replaced with "Tokenization is ready"
  expect(screen.getByRole('heading', { name: /Tokenization is ready/i })).toBeDefined()
})
