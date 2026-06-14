# Interactive Search Engine Simulation

## What This Is

A browser-based, one-page interactive simulation that teaches high school students how a simple search engine transforms a query into ranked results. Students and instructors can inspect each stage visually, from tokenization and keyword scoring through toy meaning vectors and distance-based semantic ranking, using deterministic classroom examples rather than production search infrastructure.

The experience is designed for live classroom use alongside a slide deck. It should feel like students are debugging a search engine step by step, with every stage answering what the search engine did and why the ranking changed.

## Core Value

Students can clearly see and explain how each search-processing step changes the ranking, especially the difference between keyword matching and meaning-based search.

## Requirements

### Validated

(None yet - ship to validate)

### Active

- [ ] Students can select a built-in teaching scenario, edit its query and documents, and reset it to known defaults.
- [ ] Students can move forward and backward through a guided search simulation or run all steps.
- [ ] Each step pairs a concise, classroom-friendly explanation with a visual representation of the current calculation.
- [ ] Students can inspect tokenization, word matching, term frequency, inverse document frequency, TF-IDF, and keyword ranking.
- [ ] Students can inspect manually assigned 2D meaning vectors and compare Euclidean-distance and cosine-similarity semantic rankings.
- [ ] The final view compares keyword and semantic rankings side by side so students can observe why results changed.
- [ ] Search calculations are deterministic, visible, and implemented as testable pure functions.
- [ ] The interface is readable on the supported desktop/projector viewport and does not rely on color alone.
- [ ] The app can be deployed as a static site without a backend.

### Out of Scope

- Real web crawling or production-scale indexing - the product teaches concepts with a small local dataset.
- Google-like ranking or production search relevance - realism would obscure the intended learning sequence.
- Real embeddings, BERT inference, or backend ML serving - manually assigned vectors keep the semantic model visible and deterministic.
- Authentication, user accounts, database persistence, or analytics - classroom simulation state is local and temporary.
- Complex NLP pipelines - basic tokenization and toy examples are sufficient for the learning outcomes.
- Dedicated cosine-angle visualization, draggable or editable vectors, challenge mode, presentation mode, scenario import/export, quizzes, and Indonesian scenarios - deferred until after the MVP.
- Tablet-responsive and variable-projector layout optimization - MVP targets a supported fixed desktop/projector viewport.

## Context

- Primary users are high school students with limited mathematics and programming background; instructors are the secondary users demonstrating the process during live lessons.
- The MVP interface and instructional copy are in English.
- The default dataset contains five to seven short documents, with scenarios covering strict matching failures, noisy common words, TF-IDF ranking, keyword limitations, and a 2D meaning map.
- The canonical flow is query and documents, tokenization, simple matching, TF, IDF, TF-IDF, keyword ranking, keyword limitation, meaning vectors, selectable Euclidean distance or cosine similarity, and final comparison.
- The final results intentionally show keyword and semantic rankings side by side rather than collapsing them into an unexplained blended score.
- Calculations must update when editable query or document text changes. Semantic vectors remain deterministic scenario data for the MVP.
- Explanations should use simple language such as "Common words become weaker" and "Closer points usually mean more similar meaning," with formulas supported by visible intermediate values.
- The product should prioritize conceptual clarity and projector readability over technical completeness or data scale.

## Constraints

- **Platform**: Browser-based static web application - deployment must not require a backend.
- **Data scale**: Five to ten local documents - all calculations should complete instantly in the browser.
- **Language**: English for MVP - Indonesian examples are deferred.
- **Search model**: Simplified TF-IDF plus selectable Euclidean distance or cosine similarity over manually assigned 2D vectors - calculations must be understandable and reproducible by students.
- **Interaction**: Three-panel experience targeting a supported fixed desktop/projector viewport - tablet responsiveness is deferred to v2.
- **Accessibility**: State cannot be communicated by color alone, text must remain legible on projectors, and keyboard navigation for step controls is preferred.
- **Testing**: Core search logic must be pure and unit tested; practical UI smoke coverage should verify the primary guided flow.
- **Scope**: No backend, persistence, authentication, production ML, or production search infrastructure - these do not support the MVP learning objective.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use English for the MVP interface and teaching copy | Matches the supplied PRD and keeps localization outside the initial learning-flow implementation | - Pending |
| Compare keyword and semantic rankings side by side in the final view | Direct comparison makes the semantic-search learning gain observable without introducing an arbitrary blended score | - Pending |
| Use deterministic toy data and manually assigned 2D vectors | Keeps calculations inspectable, stable, and appropriate for first-time learners | - Pending |
| Build as a static frontend-only application | The small local dataset and teaching workflow require no server-side capabilities | - Pending |
| Include a Euclidean/cosine semantic metric toggle in v1 | Comparing distance and directional similarity adds a useful ranking lesson without requiring real embeddings | - Pending |
| Defer tablet-responsive and variable-projector layouts to v2 | The approved v1 scope targets a fixed desktop/projector viewport | - Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? Move to Out of Scope with reason
2. Requirements validated? Move to Validated with phase reference
3. New requirements emerged? Add to Active
4. Decisions to log? Add to Key Decisions
5. "What This Is" still accurate? Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-14 after v1 requirements definition*
