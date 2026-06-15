import { describe, test, expect } from 'vitest'
import {
  buildSessionFromScenario,
  simulationReducer,
  selectIsEdited,
  selectCanGoNext,
  selectCanGoPrevious,
  selectProgress,
} from './simulation'
import type { Scenario } from './simulation'
import { scenarios } from '@/content/scenarios'

describe('Simulation Domain Model and Reducer', () => {
  const scenario1 = scenarios[0]
  const scenario2 = scenarios[1]

  test('buildSessionFromScenario creates independent deep clones', () => {
    const session1 = buildSessionFromScenario(scenario1)
    const session2 = buildSessionFromScenario(scenario1)

    // Verify independent arrays
    expect(session1.documents).not.toBe(scenario1.documents)
    expect(session1.documents).not.toBe(session2.documents)
    
    // Verify editing document in session1 doesn't affect scenario or session2
    session1.documents[0].text = 'Modified Text'
    expect(scenario1.documents[0].text).not.toBe('Modified Text')
    expect(session2.documents[0].text).not.toBe('Modified Text')

    // Verify independent vectors
    expect(session1.vectors).not.toBe(scenario1.vectors)
    expect(session1.vectors.query).not.toBe(scenario1.vectors.query)
    expect(session1.vectors.documents).not.toBe(scenario1.vectors.documents)
  })

  test('scenarioSelected switches scenario and resets step to setup', () => {
    const initialState = buildSessionFromScenario(scenario1)
    initialState.activeStepId = 'tokenization'

    const action = { type: 'scenarioSelected' as const, scenario: scenario2 }
    const nextState = simulationReducer(initialState, action)

    expect(nextState.scenarioId).toBe(scenario2.id)
    expect(nextState.activeStepId).toBe('setup')
    expect(nextState.query).toBe(scenario2.defaultQuery)
  })

  test('queryChanged changes query and marks session as edited', () => {
    const session = buildSessionFromScenario(scenario1)
    expect(selectIsEdited(session, scenario1)).toBe(false)

    const action = { type: 'queryChanged' as const, value: 'new query' }
    const nextState = simulationReducer(session, action)

    expect(nextState.query).toBe('new query')
    expect(selectIsEdited(nextState, scenario1)).toBe(true)

    // Reverting query back makes it unedited
    const revertAction = { type: 'queryChanged' as const, value: scenario1.defaultQuery }
    const revertedState = simulationReducer(nextState, revertAction)
    expect(selectIsEdited(revertedState, scenario1)).toBe(false)
  })

  test('documentChanged changes document text by stable ID', () => {
    const session = buildSessionFromScenario(scenario1)
    const targetDocId = 'doc-4'
    const targetDoc = session.documents.find(d => d.id === targetDocId)!
    const originalText = targetDoc.text

    const action = { type: 'documentChanged' as const, documentId: targetDocId, value: 'new doc text' }
    const nextState = simulationReducer(session, action)

    const nextTargetDoc = nextState.documents.find(d => d.id === targetDocId)!
    expect(nextTargetDoc.text).toBe('new doc text')
    expect(selectIsEdited(nextState, scenario1)).toBe(true)

    // Verify other docs are unchanged
    const otherDoc = nextState.documents.find(d => d.id === 'doc-1')!
    expect(otherDoc.text).toBe(session.documents.find(d => d.id === 'doc-1')!.text)

    // Revert doc text back to default
    const revertAction = { type: 'documentChanged' as const, documentId: targetDocId, value: originalText }
    const revertedState = simulationReducer(nextState, revertAction)
    expect(selectIsEdited(revertedState, scenario1)).toBe(false)
  })

  test('accepts scenarios with arbitrary document counts', () => {
    const customScenario: Scenario = {
      id: 'custom',
      title: 'Custom',
      description: 'Custom',
      learningGoal: 'Custom',
      defaultQuery: 'test',
      documents: [
        { id: 'custom-1', text: 'One doc' }
      ],
      vectors: {
        query: [0, 0],
        documents: {
          'custom-1': [1, 1]
        }
      }
    }

    const session = buildSessionFromScenario(customScenario)
    expect(session.documents.length).toBe(1)
    expect(session.documents[0].id).toBe('custom-1')

    const action = { type: 'documentChanged' as const, documentId: 'custom-1', value: 'Changed' }
    const nextState = simulationReducer(session, action)
    expect(nextState.documents[0].text).toBe('Changed')
  })

  test('resetConfirmed reconstructs defaults and returns to setup', () => {
    const session = buildSessionFromScenario(scenario1)
    session.query = 'edited query'
    session.documents[0].text = 'edited doc'
    session.activeStepId = 'tf-idf'

    const action = { type: 'resetConfirmed' as const, scenario: scenario1 }
    const nextState = simulationReducer(session, action)

    expect(nextState.query).toBe(scenario1.defaultQuery)
    expect(nextState.documents[0].text).toBe(scenario1.documents[0].text)
    expect(nextState.activeStepId).toBe('setup')
    expect(selectIsEdited(nextState, scenario1)).toBe(false)
  })

  test('navigation boundaries are respected', () => {
    expect(selectCanGoPrevious('setup')).toBe(false)
    expect(selectCanGoPrevious('tokenization')).toBe(false)
    expect(selectCanGoPrevious('matching')).toBe(true)

    expect(selectCanGoNext('setup')).toBe(true)
    expect(selectCanGoNext('final-comparison')).toBe(false)

    expect(selectProgress('setup')).toBe(0)
    expect(selectProgress('final-comparison')).toBe(100)
  })
})
