# Search Engine Lab 🔍📊

An interactive, browser-based static web application designed to teach high school students how search engines process queries and rank results. Through a step-by-step guided journey, students and instructors can inspect the calculations and visual mechanics behind keyword-based ranking (TF-IDF) and vector-based semantic ranking.

Designed for live classroom use alongside slide decks, this simulation operates entirely in the browser with local datasets, making every stage of the pipeline transparent, reproducible, and easy to debug.

---

## 🎯 Educational Value & Learning Objectives

The primary goal of the Search Engine Lab is to help students clearly explain how processing steps change document rankings, and understand the difference between keyword matching and meaning-based search.

*   **Tokenization & Normalization:** Understand how raw sentences are split into lowercase clean tokens.
*   **Keyword Scoring (TF-IDF):** Witness how term frequency (TF) and inverse document frequency (IDF) scale the importance of search terms (e.g., how noisy, common words are weakened, and rare keywords are strengthened).
*   **Synonym & Context Failures:** Experience first-hand how keyword-matching fails to return relevant documents when different words are used (e.g., searching for "pet" and missing a document about "dog").
*   **Vector Space & Meaning Map:** Visualize queries and documents as coordinates in a 2D space, demonstrating how a search engine maps conceptual meaning.
*   **Semantic Metrics:** Compare the ranking outcomes of **Euclidean Distance** (distance-based) and **Cosine Similarity** (directional alignment) on the 2D meaning map.
*   **Side-by-Side Comparison:** Contrast keyword and semantic search results side-by-side, analyzing rank movements and learning why semantic search is a powerful paradigm.

---

## 🛠️ Technology Stack

The project is built as a zero-dependency static web application using a modern frontend stack:

*   **Core Framework:** [React 19.2](https://react.dev/) (UI shell and state orchestration)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) (Domain types and math contracts)
*   **Tooling & Dev Server:** [Vite 8.0.x](https://vite.dev/) (Instant HMR and optimized static production builds)
*   **Styling:** [Tailwind CSS 4.3.x](https://tailwindcss.com/) (Layouts, typography, dark mode tokens, and custom UI components)
*   **Visualizations:** Native browser **SVG** (Meaning Map scatter plot, vector lines, pan, zoom, and interactive overlays)
*   **Icons:** [Lucide React](https://lucide.dev/) (Interface context icons)
*   **Testing:** [Vitest 4.x](https://vitest.dev/) (Fast unit tests for pure search algorithms) & [Playwright](https://playwright.dev/) (E2E browser smoke tests)

---

## 📂 Project Structure

The codebase strictly separates the pure mathematical domain engine from React's state management and presentation layers:

```text
search_engine_visualization/
├── .planning/           # Pedagogy roadmap, requirement tracking, and design specs
├── docs/                # Product Requirement Document (PRD)
├── public/              # Static assets and site icons
├── src/
│   ├── main.tsx         # App entry point
│   ├── App.tsx          # Main layout, keyboard shortcuts, and state manager
│   ├── index.css        # Tailwind design system configuration
│   ├── components/      # Shared ui elements (buttons, dialogues, layout cards)
│   ├── content/         # Pedagogical scenarios and lesson step descriptions
│   ├── domain/          # Pure search engine engine (TF-IDF, Euclidean, Cosine, Snapshots)
│   │   ├── simulation.ts      # Core mathematical calculations and reducer logic
│   │   └── simulation.test.ts # Unit tests covering mathematical correctness
│   ├── features/        # High-level UI panels
│   │   ├── input-panel/          # Scenario selector and editable inputs
│   │   ├── lesson-panel/         # Navigation controls, progress bar, explanations
│   │   └── visualization-panel/  # Step-by-step visual calculations & SVG Meaning Map
│   └── lib/             # Utility styling helpers
├── tests/
│   └── smoke/           # Playwright classroom flow integration tests
├── package.json         # Scripts and project dependencies
└── playwright.config.ts # E2E test runner configuration
```

---

## 🚀 Getting Started

Follow these instructions to run the application locally on your machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v20+ recommended)
*   npm (comes packaged with Node.js)

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/AndiRaihan/search-engine-visualization
   cd search_engine_visualization
   ```

2. Install the package dependencies:
   ```bash
   npm install
   ```

### Development Scripts

*   **Start Local Development Server:**
   ```bash
   npm run dev
   ```
   *Opens the development server at `http://localhost:5173/`.*

*   **Build Static Production Assets:**
   ```bash
   npm run build
   ```
   *Builds the production-ready static assets in the `dist/` directory, which can be hosted on GitHub Pages, Netlify, or any static provider.*

*   **Preview Production Build Locally:**
   ```bash
   npm run preview
   ```
   *Serves the compiled build from `dist/` for local preview.*

---

## 🧪 Testing and Verification

To ensure calculations remain robust and rankings do not drift between code updates, the workspace includes test coverage:

*   **Run Unit Tests (Vitest):**
   ```bash
   npm run test
   ```
   *Runs tests on domain functions (tokenization, term frequency, inverse document frequency, Euclidean distance, Cosine similarity, and deterministic rank ordering).*

*   **Run End-to-End Smoke Tests (Playwright):**
   ```bash
   # Make sure Playwright browsers are installed first (if running for the first time)
   npx playwright install
   
   npm run test:smoke
   ```
   *Launches headless browser smoke tests verifying scenario selection, interactive query edits, step navigation, reset flows, metric switching, and final comparisons.*

*   **Run Linter (ESLint):**
   ```bash
   npm run lint
   ```

---

## ♿ Classroom Design & Accessibility Features

Because the application is tailored for projector-based presentation to classroom audiences, it follows strict accessibility conventions:

1.  **Projector Readability:** Uses high-contrast typography, premium color themes, and distinct font weights to prevent washouts on low-quality school projectors.
2.  **State Representation:** Ranking movements and changes are never communicated by color alone (always supported by text labels, rank difference badges, and visual icons).
3.  **Keyboard Controls:** Seamless step navigation using standard keyboard controls for presenter convenience:
    *   `Alt + ArrowLeft`: Previous step.
    *   `Alt + ArrowRight`: Next step.
    *   `Alt + Shift + ArrowRight`: Trigger or cancel "Run All" (autoplay journey).
4.  **Autoplay ("Run All"):** Instructors can trigger a guided sequence playback. It automatically pauses on completion, respects `prefers-reduced-motion` settings (which skips directly to the final comparison to avoid triggering motion sensitivity), and can be canceled at any point.
5.  **Screen Readers:** Integrated polite ARIA live announcements for state updates, scenario swaps, and metric changes.
