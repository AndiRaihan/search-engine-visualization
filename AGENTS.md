<!-- GSD:project-start source:PROJECT.md -->

## Project

**Interactive Search Engine Simulation**

A browser-based, one-page interactive simulation that teaches high school students how a simple search engine transforms a query into ranked results. Students and instructors can inspect each stage visually, from tokenization and keyword scoring through toy meaning vectors and distance-based semantic ranking, using deterministic classroom examples rather than production search infrastructure.

The experience is designed for live classroom use alongside a slide deck. It should feel like students are debugging a search engine step by step, with every stage answering what the search engine did and why the ranking changed.

**Core Value:** Students can clearly see and explain how each search-processing step changes the ranking, especially the difference between keyword matching and meaning-based search.

### Constraints

- **Platform**: Browser-based static web application - deployment must not require a backend.
- **Data scale**: Five to ten local documents - all calculations should complete instantly in the browser.
- **Language**: English for MVP - Indonesian examples are deferred.
- **Search model**: Simplified TF-IDF plus selectable Euclidean distance or cosine similarity over manually assigned 2D vectors - calculations must be understandable and reproducible by students.
- **Interaction**: Three-panel experience targeting a supported fixed desktop/projector viewport - tablet responsiveness is deferred to v2.
- **Accessibility**: State cannot be communicated by color alone, text must remain legible on projectors, and keyboard navigation for step controls is preferred.
- **Testing**: Core search logic must be pure and unit tested; practical UI smoke coverage should verify the primary guided flow.
- **Scope**: No backend, persistence, authentication, production ML, or production search infrastructure - these do not support the MVP learning objective.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->

## Technology Stack

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2 | Interactive UI and state-driven views | Current stable React; well suited to a single-page simulation with reusable visual components |
| TypeScript | Current stable 5.x | Domain models and calculation contracts | Prevents mismatches between scenario data, statistics, vectors, and visualization props |
| Vite | 8.0.x | Development and static production build | Official React TypeScript template, fast local feedback, and optimized static output without server complexity |
| Tailwind CSS | 4.3.x | Layout, typography, responsive states, and design tokens | Official Vite plugin, zero-runtime output, and fast iteration on projector/tablet layouts |
| Native SVG | Browser standard | Meaning map, distance lines, axes, labels, and score graphics | Small fixed datasets do not justify a charting dependency; SVG remains crisp, scriptable, and DOM-accessible |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 4.x | Unit tests for pure search functions | Required for tokenization, TF, IDF, TF-IDF, distance, and deterministic ranking |
| React Testing Library | Current stable | User-facing component tests | Use for scenario selection, editing, navigation, reset, and accessible labels |
| Playwright | Current stable | Browser smoke tests | Keep to a few critical flows: load, navigate, edit, reset, and reach final comparison |
| lucide-react | Current stable | Consistent interface icons | Use only where an icon reinforces a text label; never as the sole state indicator |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Static analysis | Use the Vite React TypeScript baseline plus accessibility-conscious rules |
| Prettier | Stable formatting | Keep formatting separate from behavior |
| axe-core integration | Accessibility checks | Add through browser/component tests if practical; manual keyboard and projector checks remain necessary |

## Installation

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vite SPA | Next.js | Use Next.js only if later requirements add server rendering, server APIs, or route-heavy content |
| Native SVG | D3 | Use D3 if scenarios grow into dynamic scales, complex layouts, or advanced data interactions |
| Local React state | Zustand/Redux | Add a store only if state becomes shared across routes or undo/history becomes complex |
| Tailwind CSS | CSS Modules | CSS Modules are reasonable if the team prefers authored component styles over utility classes |
| Playwright smoke tests | Full cross-browser E2E suite | Expand only after the primary classroom flow stabilizes |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js for the MVP | Adds routing/server concepts without a product requirement | Vite React SPA |
| Canvas for the meaning map | Harder to make labels and data accessible; unnecessary for at most ten points | Native SVG plus a textual table |
| D3 or a chart suite immediately | Dependency and abstraction cost exceed the simple fixed visualization needs | React-rendered SVG |
| Redux or another global store immediately | The simulation is one page with a small state graph | `useReducer` plus derived selectors |
| Real embedding or NLP packages | Obscures the teaching model and harms deterministic behavior | Scenario-owned toy vectors |
| Heavy animation library | Risks distraction and motion accessibility issues | CSS transitions with reduced-motion support |

## Stack Patterns by Variant

- Use React, Vite, TypeScript, Tailwind, and native SVG.
- Keep scenario data and all calculations local.
- Prefer semantic HTML tables beside visual graphics.
- Add a route or display mode only after the core simulation is validated.
- Preserve the same domain engine and scenario schema.
- Keep SVG and add pointer/keyboard interaction deliberately.
- Introduce a visualization helper only after native code becomes difficult to maintain.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Vite 8 | Node 20.19+, 22.12+, or newer supported lines | Prefer Node 22/24 LTS |
| Vitest 4 | Vite 6+ and Node 20+ | Compatible with the recommended Vite baseline |
| Tailwind CSS 4.3 | `@tailwindcss/vite` | Use the official Vite plugin and CSS `@import` |
| React 19.2 | Current React Testing Library | Test DOM behavior, not component internals |

## Sources

- https://react.dev/versions - React 19.2 current stable documentation
- https://vite.dev/guide/ - Vite 8, React TypeScript template, Node requirements, and static build behavior
- https://tailwindcss.com/docs/installation/using-vite - Tailwind 4.3 and official Vite integration
- https://vitest.dev/guide/ - Vitest 4 line and Vite/Node compatibility
- https://playwright.dev/docs/intro - browser test capabilities and supported Node lines
- https://testing-library.com/docs/react-testing-library/intro/ - user-centered React testing guidance
- https://developer.mozilla.org/en-US/docs/Web/SVG - SVG capabilities and scaling behavior

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
