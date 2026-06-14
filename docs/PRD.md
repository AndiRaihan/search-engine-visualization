# PRD: Interactive Search Engine Simulation for High School Students

## 1. Product Overview

Build a browser-based interactive simulation that teaches students how a simple search engine works step by step.

The app should let students enter a query, inspect a small collection of documents/products, and walk through the search process visually:

1. Query input
2. Tokenization
3. Simple word matching
4. Term importance / TF-IDF
5. Keyword-based ranking
6. Meaning-based vectors
7. Similarity scoring by distance
8. Final ranked search results

The simulation should be designed for classroom use alongside a slide deck. It should prioritize clarity, visual explanation, and step-by-step interaction over technical completeness.

## 2. Target Users

### Primary User: High School Student

Students are learning search engines for the first time. They may have limited math and programming background. The app should make abstract concepts visual and interactive.

### Secondary User: Instructor

The instructor uses the app during a live lesson to demonstrate how search engines transform text into ranked results.

## 3. Product Goals

### Main Goals

* Help students understand that search engines do not simply “find words.”
* Show how a query is processed step by step.
* Demonstrate why exact matching is limited.
* Demonstrate how TF-IDF helps reduce the importance of common words.
* Demonstrate why meaning-based search needs vectors and similarity scoring.
* Make similarity scoring feel intuitive before introducing formulas.

### Learning Outcomes

After using the simulation, students should be able to explain:

* Why exact phrase matching can fail.
* Why common words like “the” should matter less.
* Why rare words can be more useful for search.
* How a document can receive a search score.
* How ranked results are produced.
* Why semantic similarity is different from keyword matching.
* Why search engines need a numeric similarity score.

## 4. Non-Goals

This product is not intended to be a production search engine.

Do not build:

* Real web crawling
* Real Google-like ranking
* Authentication
* Database persistence
* Real BERT inference
* Backend ML model serving
* User accounts
* Analytics dashboard
* Complex natural language processing pipelines

Use deterministic, hard-coded, toy examples where needed. The purpose is teaching, not realism.

## 5. Platform Requirements

### Target Platform

* Browser-based web app
* Desktop-first layout for classroom projector use
* Should also work reasonably on tablets

### Recommended Stack

Codex may choose the final stack, but recommended default:

* React or Next.js
* TypeScript
* Tailwind CSS
* SVG or Canvas for vector visualizations
* No backend required for MVP
* All demo data stored locally in the frontend code

### Deployment Target

* Static deployment should be possible
* Recommended: Vercel, Netlify, or GitHub Pages

## 6. Core User Flow

### Flow A: Guided Step-by-Step Search

1. Student enters a query.
2. Student sees the document collection.
3. Student clicks “Start Search.”
4. App shows Step 1: Tokenization.
5. Student clicks “Next.”
6. App shows Step 2: Simple word matching.
7. Student clicks “Next.”
8. App shows Step 3: TF-IDF scoring.
9. Student clicks “Next.”
10. App shows Step 4: Keyword ranking.
11. Student clicks “Next.”
12. App shows Step 5: Meaning vectors.
13. Student clicks “Next.”
14. App shows Step 6: Similarity by distance.
15. Student clicks “Next.”
16. App shows final ranked results.

There should also be:

* Previous button
* Next button
* Reset button
* Run all button

## 7. Default Demo Dataset

Use a small fixed dataset of 5 to 7 documents.

Default query:

`the iphone`

Default documents:

1. `The latest iPhone with a titanium frame.`
2. `The battery on this phone is great.`
3. `An Apple device that fits in the pocket.`
4. `This iPhone is the best iPhone for photos.`
5. `Samsung Galaxy: the ultimate Android phone.`
6. Optional semantic example: `A mobile device made by Apple.`
7. Optional unrelated example: `Fresh apple pie recipe with cinnamon.`

The instructor should be able to switch between built-in scenarios.

## 8. Built-In Scenarios

### Scenario 1: Naive Exact Match Fails

Query:

`the iphone`

Documents include phrases that contain either “the” or “iphone,” but not necessarily the exact phrase.

Teaching point:

Exact phrase matching is too strict.

### Scenario 2: Common Words Are Noisy

Query:

`the iphone`

Teaching point:

“The” appears everywhere and should not dominate the results.

### Scenario 3: TF-IDF Ranking

Query:

`the iphone`

Teaching point:

Documents with more meaningful rare terms should rank higher.

### Scenario 4: Keyword Search Misses Meaning

Query:

`apple phone`

Relevant document:

`A mobile device made by Apple.`

Teaching point:

A document can be relevant even if it does not share the exact same words.

### Scenario 5: Meaning Map / Distance

Query:

`apple phone`

Documents are represented as points on a simple 2D meaning map.

Teaching point:

Once text becomes vectors, search can be understood as measuring closeness.

## 9. Main Interface Layout

The app should use a three-panel layout.

### Left Panel: Input and Documents

Contains:

* Query input box
* Scenario selector
* Editable list of documents
* Reset documents button

### Center Panel: Step Explanation

Contains:

* Current step title
* Short explanation
* “What the search engine is doing” explanation
* Previous / Next / Run All controls

### Right Panel: Visualization

Changes depending on the current step:

* Token chips
* Highlighted word matches
* TF-IDF table
* Score bars
* Meaning map
* Distance lines
* Final search result cards

## 10. Step-by-Step Requirements

### Step 0: Query and Documents

Show:

* Query input
* Document list
* Current selected scenario

User actions:

* Edit query
* Edit documents
* Select scenario
* Start simulation

Acceptance criteria:

* User can type a query.
* User can see all documents.
* User can select a scenario.
* Reset restores default scenario data.

---

### Step 1: Tokenization

Show query split into word tokens.

Example:

`the iphone` → `[the] [iphone]`

Also show each document split into tokens.

Visual style:

* Each token should appear as a pill/chip.
* Query tokens and document tokens should be visually distinct.

Acceptance criteria:

* Tokens are lowercased.
* Basic punctuation is removed.
* Tokenization result updates when query/documents change.

---

### Step 2: Simple Word Matching

Highlight tokens in documents that appear in the query.

Example:
Query tokens: `[the] [iphone]`

In each document:

* Highlight `the`
* Highlight `iphone`

Show a simple binary match indicator:

* Matched query words
* Missing query words

Acceptance criteria:

* Matching words are highlighted.
* App shows that common words can create many matches.
* App can show that simple matching may return too many results.

---

### Step 3: Term Frequency

Show how often each query word appears in each document.

For each document, calculate:

`TF(word, document) = count(word in document) / total words in document`

Show table:

| Document | Word | Count | Total Words | TF |
| -------- | ---- | ----: | ----------: | -: |

Acceptance criteria:

* TF calculation is visible.
* Students can see that repeated words increase TF.
* Values should be rounded to 3 decimal places.

---

### Step 4: Inverse Document Frequency

Show how rare each query word is across all documents.

Use a simplified IDF formula:

`IDF(word) = log(total_documents / document_frequency)`

For classroom simplicity, it is acceptable to use base-10 log or natural log, but the UI should not overemphasize the base.

Show table:

| Word | Documents Containing Word | Total Documents | IDF |
| ---- | ------------------------: | --------------: | --: |

Teaching copy:

* Common words get low scores.
* Rare words get higher scores.
* If a word appears in every document, its IDF becomes 0.

Acceptance criteria:

* IDF values update based on documents.
* Common words visually appear weaker.
* Rare words visually appear stronger.

---

### Step 5: TF-IDF Score

For each query word in each document, calculate:

`TF-IDF = TF × IDF`

Show table:

| Document | Word | TF | IDF | TF-IDF |
| -------- | ---- | -: | --: | -----: |

Then show document score:

`Document Score = sum of TF-IDF scores for query words`

Visual:

* Use progress bars for document scores.
* Higher score means higher rank.

Acceptance criteria:

* TF-IDF table is visible.
* Document score is calculated correctly from visible values.
* Ranking updates based on score.

---

### Step 6: Keyword Ranking

Show search results ranked by TF-IDF score.

Each result card should contain:

* Rank number
* Document text
* Score
* Short explanation

Example explanation:

`This document ranked high because it contains "iphone", which is more important than "the".`

Acceptance criteria:

* Results are sorted descending by score.
* Ties are handled deterministically.
* Score explanation is shown per result.

---

### Step 7: Keyword Search Limitation

Show a scenario where keyword search misses meaning.

Example:
Query:

`apple phone`

Document:

`A mobile device made by Apple.`

Explain:

The document may be relevant even if it does not match all query words exactly.

Visual:

* Show low keyword score.
* Add warning label: `Keyword search may miss meaning.`

Acceptance criteria:

* The app demonstrates that exact words are not always enough.
* This step should bridge into embeddings / meaning vectors.

---

### Step 8: Meaning Vectors

Show text being represented as simple 2D vectors.

Use manually assigned vectors for teaching.

Example:

| Text             | Vector     |
| ---------------- | ---------- |
| apple phone      | [0.8, 0.7] |
| iPhone review    | [0.9, 0.8] |
| Samsung phone    | [0.6, 0.7] |
| apple pie recipe | [0.7, 0.1] |
| laptop review    | [0.2, 0.6] |

The exact numbers can be adjusted to make the visualization intuitive.

Visual:

* 2D meaning map
* Query shown as a star or special marker
* Documents shown as dots
* Similar documents placed near the query
* Unrelated documents placed far away

Acceptance criteria:

* Query and documents appear on a 2D plot.
* Points are labeled.
* Similar texts are visually closer.
* This step should not require real embeddings.

---

### Step 9: Similarity by Distance

Calculate distance from query vector to each document vector.

Use Euclidean distance for the first version:

`distance = sqrt((x2 - x1)^2 + (y2 - y1)^2)`

Show:

* Distance line from query to each document
* Distance table
* Ranking by smallest distance

Teaching copy:

`Closer distance = more similar`

Acceptance criteria:

* Distance is calculated from displayed vectors.
* Smaller distance ranks higher.
* Lines are drawn from query to documents.
* Ranking updates if vector values are changed in code or scenario data.

---

### Step 10: Final Results

Show final search result cards.

Each result should contain:

* Rank
* Document text
* Keyword score if available
* Distance score if available
* Short explanation

Example:

`Rank 1: This iPhone is the best iPhone for photos.`
`Why? It contains an important query word and is close to the query on the meaning map.`

Acceptance criteria:

* Final ranking is clear.
* Result cards are readable.
* Explanations use student-friendly language.

## 11. Optional Advanced Mode

Advanced mode is not required for MVP, but the architecture should allow it later.

Potential advanced features:

* Toggle between keyword search and semantic search.
* Toggle between Euclidean distance and cosine similarity.
* Show cosine angle visualization.
* Let students drag points on the meaning map.
* Let students edit document vectors manually.
* Add “challenge mode”: students try to make a bad result rank first.
* Add instructor notes or presentation mode.
* Export current scenario as JSON.

## 12. Data Model

Recommended TypeScript interfaces:

```ts
type Scenario = {
  id: string;
  title: string;
  description: string;
  defaultQuery: string;
  documents: SearchDocument[];
  vectors?: Record<string, Vector2D>;
};

type SearchDocument = {
  id: string;
  title?: string;
  text: string;
};

type Vector2D = {
  x: number;
  y: number;
};

type TokenizedText = {
  originalText: string;
  tokens: string[];
};

type TermStats = {
  word: string;
  documentId: string;
  count: number;
  totalWords: number;
  tf: number;
  documentFrequency: number;
  idf: number;
  tfidf: number;
};

type DocumentScore = {
  documentId: string;
  keywordScore: number;
  distance?: number;
  rank: number;
  explanation: string;
};
```

## 13. Core Functions

Implement search logic as pure functions so it is easy to test.

Required functions:

```ts
tokenize(text: string): string[]

getTermFrequency(word: string, documentTokens: string[]): number

getDocumentFrequency(word: string, allDocumentTokens: string[][]): number

getIdf(word: string, allDocumentTokens: string[][]): number

getTfidf(word: string, documentTokens: string[], allDocumentTokens: string[][]): number

getDocumentKeywordScore(queryTokens: string[], documentTokens: string[], allDocumentTokens: string[][]): number

euclideanDistance(a: Vector2D, b: Vector2D): number

rankByKeywordScore(scores: DocumentScore[]): DocumentScore[]

rankByDistance(scores: DocumentScore[]): DocumentScore[]
```

## 14. UX Requirements

### Tone

Use simple classroom-friendly language.

Avoid overly technical explanations unless they are visually supported.

Preferred phrasing:

* “The search engine splits the sentence into words.”
* “Common words become weaker.”
* “Rare words become stronger.”
* “Now we turn meaning into a point on a map.”
* “Closer points usually mean more similar meaning.”

Avoid:

* Dense formulas without explanation
* Long paragraphs
* Overly realistic search engine claims

### Visual Style

* Bright, clean, student-friendly
* Large readable text for projector use
* Color-coded tokens and scores
* Minimal clutter
* Animations should be helpful but not distracting

### Accessibility

* Do not rely only on color to communicate state.
* Use labels/icons in addition to color.
* Text should remain readable on classroom projectors.
* Keyboard navigation for Next / Previous is preferred.

## 15. State Management

The app should track:

* Selected scenario
* Query text
* Document texts
* Current step index
* Tokenized query
* Tokenized documents
* Term statistics
* TF-IDF scores
* Meaning vectors
* Distance scores
* Final ranking

For MVP, local React state is sufficient.

No backend persistence is required.

## 16. Performance Requirements

The app only handles a small number of documents, so performance is not a major concern.

Expected document count:

* Minimum: 5
* Maximum for MVP: 10

All calculations should run instantly in the browser.

## 17. Testing Requirements

Add unit tests for core pure functions:

* Tokenization
* Term frequency
* Document frequency
* IDF
* TF-IDF
* Euclidean distance
* Ranking

Add UI smoke tests if practical:

* App loads
* Scenario selector works
* Next / Previous buttons work
* Query editing updates results
* Final ranking appears

## 18. MVP Scope

The MVP should include:

1. One-page browser app
2. Scenario selector
3. Editable query
4. Fixed editable document list
5. Step-by-step mode
6. Tokenization visualization
7. Word matching visualization
8. TF calculation
9. IDF calculation
10. TF-IDF calculation
11. Keyword ranking
12. Meaning map with toy 2D vectors
13. Euclidean distance visualization
14. Final ranking page
15. Reset button

## 19. Post-MVP Features

After MVP, consider:

1. Cosine similarity mode
2. Angle visualization
3. Drag-and-drop vectors
4. Student challenge mode
5. Teacher presentation mode
6. Scenario editor
7. Export/import scenario JSON
8. Indonesian language example scenarios
9. Mobile layout improvements
10. Short quiz checkpoints after each step

## 20. Acceptance Criteria for MVP

The MVP is complete when:

* A user can open the app in a browser.
* A user can select a built-in scenario.
* A user can enter or edit a query.
* A user can move through the search engine process step by step.
* Each step shows both visual output and a short explanation.
* TF-IDF scores are calculated correctly for the toy dataset.
* Search results are ranked by TF-IDF in the keyword ranking step.
* Meaning vectors are shown on a simple 2D map.
* Distance from query to each document is visualized.
* Final ranking is shown clearly.
* The app can be deployed as a static web app.

## 21. Suggested Implementation Roadmap

### Phase 1: Project Setup

* Create React/Next.js TypeScript app.
* Add Tailwind CSS.
* Define scenario data model.
* Implement base layout.

### Phase 2: Core Search Logic

* Implement tokenization.
* Implement TF, IDF, TF-IDF.
* Implement keyword ranking.
* Add unit tests for search logic.

### Phase 3: Step-by-Step UI

* Add step navigation.
* Add query and document panel.
* Add explanation panel.
* Add visualization panel.

### Phase 4: Keyword Search Visualizations

* Token chips.
* Word matching highlights.
* TF table.
* IDF table.
* TF-IDF table.
* Score bars.
* Keyword ranking cards.

### Phase 5: Semantic Search Visualizations

* Add 2D meaning map.
* Add toy vectors.
* Add distance calculation.
* Draw distance lines.
* Add distance-based ranking.

### Phase 6: Polish

* Improve copywriting.
* Add animations.
* Improve projector readability.
* Add reset behavior.
* Add responsive layout.
* Add final QA.

## 22. Key Design Principle

The app should feel like students are debugging a search engine, not reading a textbook.

Every step should answer:

`What did the search engine do?`

and

`Why did that change the ranking?`
