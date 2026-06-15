import type { LessonStep } from '@/domain/simulation'

export const lessonSteps: LessonStep[] = [
  {
    id: 'setup',
    title: 'Setup',
    description: 'Choose a scenario, review the query and documents, then start the search.',
    kind: 'setup',
  },
  {
    id: 'tokenization',
    title: 'Tokenization',
    description: 'This step splits the search query and each document into individual words (tokens) and converts them to lowercase.',
    kind: 'preview',
  },
  {
    id: 'matching',
    title: 'Word Matching',
    description: 'This step identifies which documents contain the words from the search query.',
    kind: 'preview',
  },
  {
    id: 'term-frequency',
    title: 'Term Frequency',
    description: 'This step counts how many times each search word appears in each document.',
    kind: 'preview',
  },
  {
    id: 'inverse-document-frequency',
    title: 'Inverse Document Frequency',
    description: 'This step calculates how unique each query word is across all documents, penalizing extremely common words.',
    kind: 'preview',
  },
  {
    id: 'tf-idf',
    title: 'TF-IDF',
    description: 'This step combines word counts and uniqueness weights to calculate a final relevance score for each term.',
    kind: 'preview',
  },
  {
    id: 'keyword-ranking',
    title: 'Keyword Ranking',
    description: 'This step sums TF-IDF scores for matching words and ranks the documents from highest to lowest relevance.',
    kind: 'preview',
  },
  {
    id: 'keyword-limitation',
    title: 'Keyword Limitation',
    description: 'This step highlights why keyword search fails when synonyms are used, setting up the need for meaning-based search.',
    kind: 'preview',
  },
  {
    id: 'meaning-vectors',
    title: 'Meaning Vectors',
    description: 'This step maps the query and documents to coordinates on a 2D meaning map based on their conceptual alignment.',
    kind: 'preview',
  },
  {
    id: 'semantic-ranking',
    title: 'Semantic Ranking',
    description: 'This step measures the straight-line distance between the query and documents on the meaning map to rank them.',
    kind: 'preview',
  },
  {
    id: 'final-comparison',
    title: 'Final Comparison',
    description: 'This step compares the keyword and semantic rankings side-by-side to highlight their key differences.',
    kind: 'preview',
  },
]

export const firstLessonStepId = 'tokenization'
