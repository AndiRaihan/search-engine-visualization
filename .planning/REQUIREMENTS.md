# Requirements: Interactive Search Engine Simulation

**Defined:** 2026-06-14
**Core Value:** Students can clearly see and explain how each search-processing step changes the ranking, especially the difference between keyword matching and meaning-based search.

## v1 Requirements

### Scenarios and Input

- [x] **SCEN-01**: User can select from built-in teaching scenarios with predefined queries, documents, vectors, and learning goals.
- [x] **SCEN-02**: User can edit the active query and see all keyword-derived calculations update.
- [x] **SCEN-03**: User can edit each document in the active scenario and see all keyword-derived calculations update.
- [x] **SCEN-04**: User can reset the selected scenario's query, documents, vectors, and current step to its defaults.
- [x] **SCEN-05**: User sees a clear notice that semantic vectors remain curated teaching coordinates after query or document text is edited.

### Guided Flow

- [x] **FLOW-01**: User can start the simulation from the query and document setup step.
- [x] **FLOW-02**: User can move to the next available simulation step.
- [x] **FLOW-03**: User can return to the previous simulation step.
- [x] **FLOW-04**: User can see the current step and overall progress through the simulation.
- [x] **FLOW-05**: User can use Run All to advance through the complete simulation sequence.
- [x] **FLOW-06**: User can operate Previous, Next, and Run All through documented keyboard controls.

### Keyword Search

- [x] **KEYW-01**: User can see the query and documents tokenized into lowercase words with basic punctuation removed.
- [x] **KEYW-02**: User can see which query tokens match each document and which query tokens are missing.
- [x] **KEYW-03**: User can inspect each query term's count, document word count, and term-frequency value rounded to three decimal places.
- [x] **KEYW-04**: User can inspect each query term's document frequency and inverse-document-frequency value.
- [x] **KEYW-05**: User can see common query terms visually weakened and rare query terms visually strengthened without relying on color alone.
- [x] **KEYW-06**: User can inspect each query-term/document TF-IDF value and the resulting document keyword score.
- [x] **KEYW-07**: User can see keyword results ranked by descending full-precision TF-IDF score with deterministic tie handling.
- [x] **KEYW-08**: User can read a result explanation generated from visible TF-IDF contributions, including after query or document edits.

### Semantic Search

- [x] **SEMA-01**: User can inspect a worked example where keyword scoring misses a semantically relevant document.
- [x] **SEMA-02**: User can see the query and documents represented by labeled, manually curated 2D teaching vectors.
- [x] **SEMA-03**: User can inspect a meaning map that plots the query and document vectors and identifies each point without relying on color alone.
- [x] **SEMA-04**: User can see lines from the query vector to document vectors when Euclidean distance is selected.
- [x] **SEMA-05**: User can inspect the Euclidean distance from the query to every document and see results ranked by smallest distance.
- [x] **SEMA-06**: User can inspect the cosine similarity between the query and every document and see results ranked by highest similarity.
- [x] **SEMA-07**: User can toggle semantic ranking between Euclidean distance and cosine similarity.
- [x] **SEMA-08**: User can read a semantic result explanation generated from the selected displayed metric and curated vectors.

### Final Comparison

- [x] **COMP-01**: User can compare keyword and selected semantic rankings side by side in the final step.
- [x] **COMP-02**: User can see each document's rank in both lists and identify rank changes without relying on color alone.
- [x] **COMP-03**: User can read deterministic explanations that cite visible keyword contributions or the selected semantic metric.

### Accessibility and Quality

- [x] **QUAL-01**: User can understand matches, importance, selection, and rank movement through labels, text, shape, or icons in addition to color.
- [x] **QUAL-02**: User can read content with sufficient text and interface contrast on the supported desktop viewport.
- [x] **QUAL-03**: User who prefers reduced motion can use the full simulation without nonessential animated movement.
- [x] **QUAL-04**: Core tokenization, TF, document frequency, IDF, TF-IDF, Euclidean distance, cosine similarity, and ranking functions are covered by unit tests.
- [x] **QUAL-05**: Automated browser smoke tests verify app loading, scenario selection, query editing, step navigation, reset, metric toggling, and final comparison.
- [x] **QUAL-06**: User can load and run the application as a static browser site without a backend.

## v2 Requirements

### Responsive Classroom Layout

- **RESP-01**: User can use the complete three-panel simulation on common tablet viewport sizes without losing controls or instructional content.
- **RESP-02**: User can use the simulation at browser zoom levels up to 200% without two-dimensional page scrolling.
- **RESP-03**: Instructor can use a layout optimized for varying classroom projector resolutions.

### Advanced Learning

- **ADVN-01**: User can inspect a dedicated cosine-angle visualization.
- **ADVN-02**: User can drag or manually edit document vectors using accessible controls.
- **ADVN-03**: Student can complete challenge scenarios designed around ranking manipulation.
- **ADVN-04**: Instructor can use a dedicated presentation mode.
- **ADVN-05**: Instructor can create, import, and export custom scenarios.
- **ADVN-06**: User can complete short quiz checkpoints between simulation steps.
- **ADVN-07**: User can select Indonesian-language teaching scenarios and interface copy.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real web crawling and indexing | The product uses a small local teaching dataset |
| Production search ranking | Production realism would obscure the instructional sequence |
| Real embeddings or BERT inference | Curated vectors keep semantic calculations visible and deterministic |
| Backend ML model serving | No runtime model is required for the teaching simulation |
| Authentication and user accounts | The MVP has no persistent per-user data |
| Database persistence | Scenario state is temporary and local to the browser session |
| Analytics dashboard | Not required to validate the classroom learning flow |
| Combined keyword/semantic score | Arbitrary weighting would hide the distinction the product teaches |
| Automatic semantic inference for edited text | The MVP cannot honestly derive meaning coordinates without a real embedding model |
| More than ten active documents | Larger collections reduce projector readability and are unnecessary for the lesson |

## Traceability

Traceability is populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCEN-01 | Phase 1 | Complete |
| SCEN-02 | Phase 1 | Complete |
| SCEN-03 | Phase 1 | Complete |
| SCEN-04 | Phase 1 | Complete |
| SCEN-05 | Phase 3 | Complete |
| FLOW-01 | Phase 1 | Complete |
| FLOW-02 | Phase 1 | Complete |
| FLOW-03 | Phase 1 | Complete |
| FLOW-04 | Phase 1 | Complete |
| FLOW-05 | Phase 5 | Complete |
| FLOW-06 | Phase 5 | Complete |
| KEYW-01 | Phase 2 | Complete |
| KEYW-02 | Phase 2 | Complete |
| KEYW-03 | Phase 2 | Complete |
| KEYW-04 | Phase 2 | Complete |
| KEYW-05 | Phase 2 | Complete |
| KEYW-06 | Phase 2 | Complete |
| KEYW-07 | Phase 2 | Complete |
| KEYW-08 | Phase 2 | Complete |
| SEMA-01 | Phase 3 | Complete |
| SEMA-02 | Phase 3 | Complete |
| SEMA-03 | Phase 3 | Complete |
| SEMA-04 | Phase 3 | Complete |
| SEMA-05 | Phase 3 | Complete |
| SEMA-06 | Phase 4 | Complete |
| SEMA-07 | Phase 4 | Complete |
| SEMA-08 | Phase 4 | Complete |
| COMP-01 | Phase 5 | Complete |
| COMP-02 | Phase 5 | Complete |
| COMP-03 | Phase 5 | Complete |
| QUAL-01 | Phase 5 | Complete |
| QUAL-02 | Phase 1 | Complete |
| QUAL-03 | Phase 5 | Complete |
| QUAL-04 | Phase 4 | Complete |
| QUAL-05 | Phase 5 | Complete |
| QUAL-06 | Phase 1 | Complete |

**Coverage:**

- v1 requirements: 36 total
- Mapped to phases: 36
- Unmapped: 0

---
*Requirements defined: 2026-06-14*
*Last updated: 2026-06-21 after Phase 5 UAT completion*
