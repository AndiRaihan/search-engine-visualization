---
phase: 01
slug: guided-classroom-shell
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-15
---

# Phase 01 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| npm registry to local build | External package metadata and package contents enter the trusted project toolchain. | Dev dependencies & npm metadata |
| static bundle to browser | Generated assets execute in the classroom browser without a server-side control plane. | Compiled React build files |
| immutable content to editable session | Shipped defaults are copied into mutable browser-session state. | Preset lesson steps and default document parameters |
| user input to React rendering | Untrusted classroom text crosses from textareas into state and visible UI. | Edited search queries and custom document contents |
| modal to keyboard user | AlertDialog temporarily owns focus and must release it predictably. | Keyboard events & focus target |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-01-01 | Tampering / Elevation | InputPanel, App, VisualizationPanel | mitigate | Render query and document text via React plain text nodes, and avoid using raw HTML injection APIs (such as `dangerouslySetInnerHTML` or `innerHTML`). Verified by `renders text containing HTML markup as literal plain text` integration test. | closed |
| T-01-02 | Tampering | npm/shadcn dependency graph | mitigate | Restrict dependencies to audited packages. Checked `package.json` to verify that only standard/approved dependencies like react, lucide-react, radix-ui, tailwindcss, and devDependencies like vitest, eslint, etc. are used, matching the lockfile. | closed |
| T-01-03 | Denial of Service | ResetScenarioDialog | mitigate | Managed via Radix UI `AlertDialog` which locks focus in-dialog, restores focus to the reset button on cancel/close, and programmatically directs focus to the query textarea on confirmation. Verified by `dialog opens on dirty scenario, cancel preserves edits and restores focus` and `confirming reset restores scenario defaults, setup step, focuses query, and announces reset` tests in `src/features/lesson-panel/ResetFlow.test.tsx`. | closed |
| T-01-04 | Tampering | lessonSteps and reducer bounds | mitigate | Stable StepId registry, derived indexes, and tests for first/final boundaries prevent invalid navigation state. Verified by `navigation boundaries are respected` tests in `src/domain/simulation.test.ts`. | closed |
| T-01-SC | Tampering | npm package supply chain | mitigate | Research audit, preinstall metadata checks, official registry restriction, package-lock, and end-of-phase human identity review. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

No accepted risks.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-15 | 5 | 5 | 0 | Antigravity / Agent |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-15
