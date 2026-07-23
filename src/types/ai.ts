// ─── AI Tutor Types ────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;      // ISO date string
  relatedSections?: string[]; // sections mentioned in AI response
  citations?: string[];   // case law / circular IDs cited
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  sectionContext?: string; // section the user started from
}

export interface AiQuery {
  conversationId?: string;
  question: string;
  sectionContext?: string;
  actId?: string;
}

export interface AiResponse {
  answer: string;
  relatedSections: string[];
  citations: string[];
  confidence?: number;
  disclaimer: string;
}
