# Phase 2: Keyword Search Journey - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-15
**Phase:** 2-Keyword Search Journey
**Areas discussed:** TF-IDF Math Formulations, Tokenization & Punctuation Rules, Visual Cues for Common/Rare Terms, Tie-Breaker and Ranking Details

---

## TF-IDF Math Formulations

| Option | Description | Selected |
|--------|-------------|----------|
| Relative Frequency | count(word) / total_words_in_doc (Scales with document length, standard in PRD) | ✓ |
| Raw Word Count | count(word) (Simplest to count manually, but does not adjust for longer documents) | |
| You decide | Defer to agent default | |

| Option | Description | Selected |
|--------|-------------|----------|
| Base-10 Logarithm | log10(N / df) (Most intuitive for high schoolers; easy to calculate on standard calculators) | |
| Natural Logarithm | ln(N / df) (Standard in computer science, but less intuitive for basic algebra students) | ✓ |
| Base-2 Logarithm | log2(N / df) (Common in information theory, but less standard in classroom math) | |
| You decide | Defer to agent default | |

| Option | Description | Selected |
|--------|-------------|----------|
| Unsmoothed | ln(N / df) with df = 0 yielding IDF = 0 (Keeps the N/df ratio clean and results in exactly 0 for words in every document) | ✓ |
| Smoothed IDF | ln(1 + N / (1 + df)) or similar (Avoids division by zero naturally, but the math is less clean to calculate by hand) | |
| You decide | Defer to agent default | |

**User's choice:** Selected Relative Frequency, Natural Logarithm, and Unsmoothed IDF.
**Notes:** Natural logarithm is standard in CS. We will handle the df = 0 case by returning 0 to avoid division by zero.

---

## Tokenization & Punctuation Rules

| Option | Description | Selected |
|--------|-------------|----------|
| Split punctuation and keep letters | e.g. "iPhone's" -> ["iphone", "s"] (Easiest to implement and verify, highly standard) | ✓ |
| Strip punctuation completely | e.g. "iPhone's" -> ["iphones"] (Keeps the word root intact, but is slightly more complex) | |
| You decide | Defer to agent default | |

| Option | Description | Selected |
|--------|-------------|----------|
| Graceful Empty State | Return empty token list, scores are 0, and show a helpful placeholder (e.g., "No tokens found") without crashing or blocking typing. | ✓ |
| Input Validation | Show a red warning border and block calculations until valid text is entered. | |
| You decide | Defer to agent default | |

**User's choice:** Selected split punctuation for contractions and graceful empty state for no valid tokens.
**Notes:** Normalization should lowercase and remove punctuation before splitting.

---

## Visual Cues for Common/Rare Terms

| Option | Description | Selected |
|--------|-------------|----------|
| Descriptive badges and font treatment | Rare words get a bold weight and a "★ Rare (Strong)" badge; common words get normal/muted weight and a "⬇ Common (Weak)" badge (Screen-reader friendly, clearly readable on low-contrast projectors) | ✓ |
| Relative sizing | Increase the font size of rare words and reduce the size of common words (Visually striking, but might break layout/alignment of lists) | |
| You decide | Defer to agent default | |

| Option | Description | Selected |
|--------|-------------|----------|
| Pill highlighting and icon badges | Show matching tokens as distinct pills with solid borders and a checkmark icon, and list matching/missing words in a textual summary card (Excellent accessibility, clear details) | ✓ |
| Classic inline text highlighting | Highlight the matches directly inside the original document text with colored backgrounds (Familiar search behavior, but harder to handle with custom token split visuals) | |
| You decide | Defer to agent default | |

**User's choice:** Selected descriptive badges/font treatment for term strength, and pill highlighting/icon badges for query matching.
**Notes:** These visual designs ensure compliance with projector readability and accessibility without relying purely on color.

---

## Tie-Breaker and Ranking Details

| Option | Description | Selected |
|--------|-------------|----------|
| Original Document Index | Keep the original scenario order (e.g. Doc 1 always ranks higher than Doc 2 if their scores tie). (Very clean, predictable, and easy to trace) | ✓ |
| Alphabetical sorting of document text | Sort alphabetically when scores are equal (More dynamic, but harder for students to trace manually) | |
| You decide | Defer to agent default | |

| Option | Description | Selected |
|--------|-------------|----------|
| Detailed TF-IDF contribution breakdown | Show the individual sum of terms (e.g. "Score is 0.450: 'iphone' contributed 0.450, 'the' contributed 0.000"). (Matches the success criteria of showing the evidence) | ✓ |
| Qualitative summary | Show a simpler text explanation (e.g. "This document matches 'iphone' which is a rare, high-weight term, and 'the' which is common"). (More conversational but lacks exact math audit trail) | |
| You decide | Defer to agent default | |

**User's choice:** Selected Original Document Index for tie resolution, and Detailed TF-IDF contribution breakdown for result explanations.
**Notes:** Provides a highly transparent mathematical audit trail for students.

---

## the agent's Discretion
- Visual spacing, badge layout details, and exact wording of the explanation text.

---

## Deferred Ideas
- None.
