import { buildSessionFromScenario } from '../domain/simulation'
import type { SimulationSession, KeywordStepId } from '../domain/simulation'
import { scenarios } from '../content/scenarios'

export function buildKeywordStepSession(
  stepId: KeywordStepId,
  overrides?: Partial<Pick<SimulationSession, 'query' | 'documents'>>
): SimulationSession {
  const session = buildSessionFromScenario(scenarios[0])
  return {
    ...session,
    activeStepId: stepId,
    query: overrides?.query !== undefined ? overrides.query : session.query,
    documents: overrides?.documents !== undefined ? overrides.documents.map(d => ({ ...d })) : session.documents,
  }
}
