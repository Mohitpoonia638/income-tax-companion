// Barrel export — import all types from '@/types'
export type { ActId, ActMeta, Chapter, Section, Subsection } from './acts';
export type { Circular, CircularType, Notification, NotificationType } from './cbdt';
export type { CaseLaw, Court } from './caseLaws';
export type { Amendment, AmendmentType } from './amendments';
export type {
  SearchResultType,
  SearchFilter,
  SearchQuery,
  SearchResult,
  SearchResponse,
  SearchDatasetId,
  SearchStatus,
  SuggestionType,
  Suggestion,
  PopularSearch,
  SearchableDocument,
  DatasetConfig,
} from './search';
export type {
  MessageRole,
  Message,
  Conversation,
  AiQuery,
  AiResponse,
} from './ai';
export type { Bookmark, BookmarkCollection } from './bookmarks';

// Comprehensive legal types
export * from './legal';
