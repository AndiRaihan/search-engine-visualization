# Phase 3: Euclidean Meaning Journey - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-16
**Phase:** 3-Euclidean Meaning Journey
**Areas discussed:** Meaning Map Visualization, Euclidean Distance Display, Static Vector Edit Notice, Keyword-Limitation Guidance

---

## Meaning Map Visualization

### Axis Labeling
| Option | Description | Selected |
|--------|-------------|----------|
| Extend scenario schema | Extend scenario schema with custom axis labels (e.g., X: 'Fruit vs. Technology', Y: 'Food vs. Device') so each scenario has intuitive semantic dimensions. | |
| Stick with Option 2 (Generic) | Stick with Option 2 (Generic 'Dimension 1' and 'Dimension 2') universally to prevent confusion when text is edited. | ✓ |
| Use no axes labels | Use no axes labels, only numeric coordinates (0.0 to 1.0) to keep the map abstract. | |

**User's choice:** Stick with Option 2 (Generic 'Dimension 1' and 'Dimension 2') universally to prevent confusion.
**Notes:** User verified that custom inputs will stay pinned to preset scenario vector coordinates (as semantic vectors do not dynamically update in the MVP), and agreed that generic labels are best to prevent confusion if text is edited.

### Point Styling
| Option | Description | Selected |
|--------|-------------|----------|
| Distinct shapes | Distinct shapes: Use a Star symbol for the Query and Circle symbols for Documents, both with text labels (e.g. 'Query', 'D1', 'D2') embedded or adjacent. | ✓ |
| Same shapes, distinct border styles | Use circles for all points, but Query has a dashed/double border and Documents have solid borders, both with text labels. | |
| Same shapes, distinct size | Use circles for all points, but Query has a crosshair/target style and is slightly larger than the Document circles. | |

**User's choice:** Distinct shapes: Use a Star symbol for the Query and Circle symbols for Documents, both with text labels.
**Notes:** Distinct shapes ensure accessibility so color is not the sole indicator of query vs document points.

### Coordinate Grid Structure
| Option | Description | Selected |
|--------|-------------|----------|
| Major grid lines | Major grid lines every 0.2 units (0.0, 0.2, 0.4, 0.6, 0.8, 1.0) with tick labels on both axes, helping students read coordinates easily. | ✓ |
| Minimalist border only | Draw axes lines on the bottom and left with labels for 0.0 and 1.0 only, and no grid lines. | |
| Fine grid | Major grid lines every 0.2 units and minor grid lines every 0.1 units to make it highly precise. | |

**User's choice:** Major grid lines every 0.2 units (0.0, 0.2, 0.4, 0.6, 0.8, 1.0) with tick labels on both axes.
**Notes:** Helps students manually read coordinates directly from the SVG.

---

## Euclidean Distance Display

### Distance Lines
| Option | Description | Selected |
|--------|-------------|----------|
| Dashed lines to all, no labels on map | Draw dashed lines to all documents, but do NOT put distance text labels on the map itself (display distances in the side table instead) to keep the map clean and prevent overlapping text. | ✓ |
| Lines to all with labels | Draw lines to all documents and display the numeric distance value directly on the map next to each line. | |
| Line only to selected doc | Draw a dashed line only to the currently selected/focused document, showing the numeric distance value for that document only. | |

**User's choice:** Draw dashed lines to all documents, but do NOT put distance text labels on the map itself (display distances in the side table instead).
**Notes:** Keeping text labels off the map avoids overlap issues.

### Math Breakdown
| Option | Description | Selected |
|--------|-------------|----------|
| Detailed substitution breakdown | Detailed substitution breakdown: For each document, show the math step-by-step (e.g. `d = √((x1 - x2)² + (y1 - y2)²) = ...`) when the document is inspected or selected. | ✓ |
| Summary table | Show a summary table with: Document | Query Coords | Doc Coords | Delta X | Delta Y | Final Distance (rounded to 3 decimals). | |
| Final distance only | Show only the final distance value (e.g. 'Distance: 0.141') in the document lists, with a single static example of the formula at the top of the panel. | |

**User's choice:** Detailed substitution breakdown step-by-step for each document when selected.
**Notes:** Allows students to easily inspect and replicate calculations.

### Proximity Ranking
| Option | Description | Selected |
|--------|-------------|----------|
| Explicit proximity labels | Explicitly label the ranks with proximity descriptors, e.g., 'Rank 1 (Closest)' at the top, and 'Rank 7 (Furthest)' at the bottom, alongside the distance. | ✓ |
| Standard rank numbers only | Standard rank numbers (1-7) only, relying on the step explanation to state that smaller distance is closer. | |
| Distance categories | Group documents into 'Near (Rank 1-3)' and 'Far (Rank 4-7)' sections in the list. | |

**User's choice:** Explicitly label the ranks with proximity descriptors like 'Rank 1 (Closest)' and 'Rank 7 (Furthest)'.
**Notes:** Clarifies that smaller Euclidean distance represents higher relevance.

---

## Static Vector Edit Notice

### Notice Location
| Option | Description | Selected |
|--------|-------------|----------|
| Friendly inline alert in Vis Panel | Friendly inline alert in the Visualization Panel: Show a noticeable alert box explaining that vectors remain static because there is no live AI/embedding backend. | ✓ |
| Persistent indicator in Input Panel | Display the notice directly in the Input Panel when edits are detected. | |
| Notice on the Meaning Map itself | Render a text banner or a warning icon directly inside the SVG container. | |

**User's choice:** Friendly inline alert in the Visualization Panel.
**Notes:** Alerts are focused near the coordinates visualization.

### Notice Visibility
| Option | Description | Selected |
|--------|-------------|----------|
| Conditional visibility | Conditional visibility: Display the notice ONLY when the scenario has been edited (isEdited is true). | ✓ |
| Always visible with state changes | Show a quiet, neutral educational disclaimer at all times, but transition it into a highlighted warning state when the user makes edits. | |
| Always visible disclaimer | Show the disclaimer permanently in a neutral style on these steps. | |

**User's choice:** Conditional visibility: Display the notice ONLY when the scenario has been edited (isEdited is true).
**Notes:** Keeps the default interface clean and focuses the alert on user action.

---

## Keyword-Limitation Guidance

### Scenario Alignment
| Option | Description | Selected |
|--------|-------------|----------|
| Dynamic guidance + recommendation | Dynamic guidance + recommendation: Show a clear explanation based on the active scenario. If they are not on the 'Keyword Search Misses Meaning' scenario, show a friendly tip suggesting they switch. | ✓ |
| Auto-switch scenario | Automatically switch the active scenario to 'Keyword Search Misses Meaning' when the user enters this step. | |
| Generic explanation only | Show a general explanation card about synonyms and homonyms without referencing specific documents. | |

**User's choice:** Dynamic guidance + recommendation.
**Notes:** Respects the user's current scenario state while nudging them to the best teaching example.

### Visual Highlight Style
| Option | Description | Selected |
|--------|-------------|----------|
| Highlight missed documents in list | Highlight missed documents in the list: Show a list of documents where documents with a keyword score of 0 (but high semantic relevance) are highlighted with a border/warning icon and text explanation. | ✓ |
| Venn Diagram style | Render a visual overlap of query terms vs document terms. | |
| Focus on single worked example | Render a large 'Case Study' card for the top missed document, explaining in detail why the keyword matching failed. | |

**User's choice:** Highlight missed documents in the list with a warning icon and synonym explanation.
**Notes:** Integrates nicely into the document list layout.

---

## the agent's Discretion

- Styling details of SVG markers, SVG colors, and alert styles.

## Deferred Ideas

- None.
