---
phase: 02
slug: keyword-search-journey
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-16
---

# Phase 02 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| User-edited text to keyword engine | Query and document textarea values are untrusted strings entering tokenization and arithmetic. | Raw edit strings from session state |
| Keyword engine to React views | Snapshot strings and numeric values cross into future DOM rendering. | Pre-computed `KeywordSnapshot` properties |
| Editable session to React DOM | Untrusted query and document text is rendered as tokens, card text, and summaries. | Recomputed token lists, summaries, and explanations |
| Keyword snapshot to visualization router | Derived numeric/string evidence selects and populates four teaching views. | Active step routing props and pre-calculated snapshots |
| Keyword snapshot to score UI | Raw numeric evidence and user-derived text become tables, result cards, explanations, and progress values. | Formatted contribution stats, ranking positions, and descriptions |
| Editable App inputs to ranking result | User changes trigger live recalculation and reordered DOM content. | Recalculated rank positions and scores |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-02-01 | Tampering | `tokenize`, snapshot text fields / `TokenizationStep`, `MatchingStep` / `KeywordRankingStep` explanations / document text | mitigate | Render user text/values/snapshot strings strictly as React plain text/elements; Prohibit `dangerouslySetInnerHTML`, string-built markup, dynamic event attributes, and unsafe URL contexts. Verified by `Sanitization regression test: HTML is not rendered as markup` in `src/features/visualization-panel/VisualizationPanel.test.tsx`. | closed |
| T-02-02 | Denial of Service | TF/IDF/TF-IDF snapshot calculation / `App`, all foundation steps / score tables and progress normalization | mitigate | Tokenize each input once per snapshot, use linear passes over the 5-10 document corpus, guard all zero denominators (such as documentTokens.length = 0, N = 0, df = 0, maxScore = 0), and clamp progress values to finite [0, 100]. Verified by unit tests in `src/domain/simulation.test.ts` (e.g. `getIdf computes natural-log ln(N/df) unsmoothed, guards df/N=0` and `formatThreeDecimals returns finite three-decimal strings, default 0.000`) and component tests. | closed |
| T-02-03 | Tampering | ranking and explanations | mitigate | Rank from immutable raw score records and generate explanations from the same contribution objects so display text cannot diverge from calculation evidence. Verified by `rankByKeywordScore ranks descending by score, tie-breaks on original index` and `explanations cite query terms in order and display rounded contributions` in `src/domain/simulation.test.ts`. | closed |
| T-02-04 | Information Disclosure | visible source text | accept | The app intentionally displays user-entered classroom text locally; it sends no data to a backend or third party (local static application). | closed |
| T-02-05 | Repudiation | ranking evidence | mitigate | Show the exact contribution breakdown and score used for every rank so the result can be reproduced from visible evidence. Verified by `KeywordRankingStep renders ranking cards in snapshot.rankedDocuments order, with progressbar and explanations` in `src/features/visualization-panel/VisualizationPanel.test.tsx`. | closed |
| T-02-SC | Tampering | npm supply chain | accept | This phase installs or upgrades no packages and uses the existing pinned React/Lucide/Tailwind dependencies. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

- **T-02-04 (Information Disclosure):** Since this is a classroom tool designed to run completely inside the local browser without any backend server or network API integrations, all inputs, documents, and query text remain entirely within the client-side state. The display of editable text is intentional and accepted.
- **T-02-SC (npm supply chain):** Dependencies are pinned in the package-lock.json and no new packages were added or upgraded during this phase.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-16 | 6 | 6 | 0 | Antigravity / Agent |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-16
