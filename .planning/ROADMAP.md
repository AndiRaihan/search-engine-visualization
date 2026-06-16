# Roadmap: Interactive Search Engine Simulation

## Overview

Build the simulation as five vertical classroom slices. The first phase establishes a usable scenario-driven lesson shell, the next phases make keyword and semantic ranking independently teachable, and the final phase connects both pipelines into the approved comparison experience with accessibility, automation, and static release verification.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions marked `INSERTED`

- [ ] **Phase 1: Guided Classroom Shell** - Deliver a static, scenario-driven simulation that users can edit, reset, and navigate.
- [ ] **Phase 2: Keyword Search Journey** - Teach tokenization through deterministic TF-IDF ranking with visible evidence.
- [ ] **Phase 3: Euclidean Meaning Journey** - Bridge from keyword limitations to curated vectors and distance-based semantic ranking.
- [ ] **Phase 4: Cosine Comparison** - Add cosine similarity, metric switching, and trustworthy semantic explanations.
- [ ] **Phase 5: Final Comparison and Release Readiness** - Compare both ranking models and harden the complete classroom flow.

## Phase Details

### Phase 1: Guided Classroom Shell

**Goal:** As a high school student, I want to open a scenario-driven search lesson, edit its source material, navigate its steps, and reset safely, so that I can inspect how a search engine processes a query in class.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** SCEN-01, SCEN-02, SCEN-03, SCEN-04, FLOW-01, FLOW-02, FLOW-03, FLOW-04, QUAL-02, QUAL-06
**UI hint:** yes
**Success Criteria** (what must be TRUE):

  1. User can open the static application, select a built-in scenario, and see its query and documents in a readable fixed desktop/projector layout.
  2. User can edit the query or any document, start the simulation, and move forward or backward through placeholder-backed registered steps with visible progress.
  3. User can reset from any reached step and recover the selected scenario's original query, documents, vectors, and starting position.
  4. The application builds as a static site without backend services.

**Plans:** 3 plans

Plans:
**Wave 1**

- [ ] 01-01-PLAN.md — Scaffold the tested static React walking skeleton and classroom visual system.

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 01-02-PLAN.md — Deliver typed local scenarios and the reducer-backed editable workbench.

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 01-03-PLAN.md — Complete registered navigation, safe reset, accessibility, and phase verification.

### Phase 2: Keyword Search Journey

**Goal:** Users can follow a complete keyword-search lesson from tokenization to explained TF-IDF ranking.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** KEYW-01, KEYW-02, KEYW-03, KEYW-04, KEYW-05, KEYW-06, KEYW-07, KEYW-08
**UI hint:** yes
**Success Criteria** (what must be TRUE):

  1. User can inspect normalized tokens and matched or missing query terms for every editable document.
  2. User can trace visible term counts through TF, document frequency, IDF, and TF-IDF values rounded to three decimals for display.
  3. User can see common terms weakened and rare terms strengthened through labels and visual treatment that does not depend on color alone.
  4. User can view a deterministic keyword ranking whose explanation cites the visible TF-IDF contributions and updates after text edits.

**Plans:** 1/3 plans executed

Plans:

**Wave 1**

- [x] 02-01-PLAN.md — Implement the pure keyword calculation pipeline and canonical snapshot data.

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 02-02-PLAN.md — Build tokenization, matching, TF, and IDF teaching steps from one shared snapshot.

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 02-03-PLAN.md — Build TF-IDF scoring, score bars, deterministic ranking, and evidence-based explanations.

### Phase 3: Euclidean Meaning Journey

**Goal:** Users can see why keyword matching misses meaning and inspect semantic ranking through curated 2D vectors and Euclidean distance.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** SCEN-05, SEMA-01, SEMA-02, SEMA-03, SEMA-04, SEMA-05
**UI hint:** yes
**Success Criteria** (what must be TRUE):

  1. User can inspect a worked scenario where a relevant document receives a weak keyword result.
  2. User can see the query and documents as labeled curated teaching coordinates on a meaning map with a textual equivalent.
  3. User can inspect Euclidean lines and values from the query to every document and see the smallest-distance ranking.
  4. After editing text, user is clearly told that semantic positions remain curated teaching coordinates rather than newly inferred embeddings.

**Plans:** 3 plans

Plans:

- [ ] 03-01: Extend scenarios and snapshots with validated curated vectors and edit-state teaching notices.
- [ ] 03-02: Build the keyword-limitation bridge and accessible SVG meaning map.
- [ ] 03-03: Add Euclidean calculations, distance lines/table, semantic ranking, and explanations.

### Phase 4: Cosine Comparison

**Goal:** Users can switch the semantic model between Euclidean distance and cosine similarity and understand the selected ranking evidence.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** SEMA-06, SEMA-07, SEMA-08, QUAL-04
**UI hint:** yes
**Success Criteria** (what must be TRUE):

  1. User can inspect cosine similarity values for every document and see results ranked by highest similarity.
  2. User can toggle between Euclidean and cosine modes without changing the scenario or losing lesson progress.
  3. User can read semantic explanations that cite the currently displayed distance or similarity value.
  4. Automated unit tests verify tokenization, TF, document frequency, IDF, TF-IDF, Euclidean distance, cosine similarity, and deterministic rankings.

**Plans:** 2 plans

Plans:

- [ ] 04-01: Implement cosine similarity, stable cosine ranking, and complete domain-engine unit coverage.
- [ ] 04-02: Add the semantic metric toggle, cosine table/ranking, and selected-metric explanations.

### Phase 5: Final Comparison and Release Readiness

**Goal:** Users can complete the lesson, compare keyword and semantic rankings side by side, and rely on an accessible, tested static release.
**Mode:** mvp
**Depends on:** Phase 4
**Requirements:** FLOW-05, FLOW-06, COMP-01, COMP-02, COMP-03, QUAL-01, QUAL-03, QUAL-05
**UI hint:** yes
**Success Criteria** (what must be TRUE):

  1. User can run the full sequence and operate Previous, Next, and Run All through documented keyboard controls.
  2. User can compare keyword and selected semantic rankings side by side, identify every document's rank movement without color alone, and read explanations tied to visible evidence.
  3. User with reduced-motion preferences can complete the entire flow without nonessential animated movement.
  4. Browser smoke tests cover loading, scenario selection, query editing, navigation, reset, metric switching, and the final comparison.

**Plans:** 3 plans

Plans:

- [ ] 05-01: Build the side-by-side final comparison, rank movement cues, and cross-model explanations.
- [ ] 05-02: Complete Run All, keyboard controls, non-color semantics, focus behavior, and reduced-motion support.
- [ ] 05-03: Add critical-flow browser tests and verify the production static build.

## Progress

**Execution Order:** Phase 1 -> Phase 2 -> Phase 3 -> Phase 4 -> Phase 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Guided Classroom Shell | 0/3 | Not started | - |
| 2. Keyword Search Journey | 1/3 | In Progress|  |
| 3. Euclidean Meaning Journey | 0/3 | Not started | - |
| 4. Cosine Comparison | 0/2 | Not started | - |
| 5. Final Comparison and Release Readiness | 0/3 | Not started | - |
