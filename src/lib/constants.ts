import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  GitCompare,
  Sparkles,
  Bookmark,
  Scale,
  Bell,
  FileText,
  Gavel,
} from 'lucide-react';

// ─── Navigation ────────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home',      href: '/',          icon: BookOpen  },
  { label: 'Search',    href: '/search',    icon: FileText  },
  { label: 'Compare',   href: '/compare',   icon: GitCompare },
  { label: 'AI Tutor',  href: '/ai-tutor',  icon: Sparkles  },
  { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark  },
  { label: 'About',     href: '/about',     icon: Scale     },
];

// ─── Example Searches (Authentic Tax Topics) ──────────────────────────────────

export interface ExampleSearch {
  label: string;
  query: string;
  category: 'deduction' | 'section' | 'head' | 'penalty' | 'tds';
}

export const EXAMPLE_SEARCHES: ExampleSearch[] = [
  { label: '80C',                query: '80C',                category: 'deduction' },
  { label: '80D',                query: '80D',                category: 'deduction' },
  { label: '80CCD',              query: '80CCD',              category: 'deduction' },
  { label: '80G',                query: '80G',                category: 'deduction' },
  { label: 'House Property',     query: 'House Property',     category: 'head'      },
  { label: 'Salary',             query: 'Salary',             category: 'head'      },
  { label: 'Capital Gain',       query: 'Capital Gain',       category: 'head'      },
  { label: 'Residential Status', query: 'Residential Status', category: 'section'   },
  { label: 'TDS',                query: 'TDS',                category: 'tds'       },
  { label: 'Clubbing of Income', query: 'Clubbing of Income', category: 'section'   },
];

// ─── Quick Action Cards ────────────────────────────────────────────────────────

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: 'blue' | 'violet' | 'amber' | 'emerald' | 'rose' | 'sky';
  badge?: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'study',
    title: 'Study Sections',
    description: 'Browse the Income Tax Act 1961 & 2025 section by section.',
    href: '/search',
    icon: BookOpen,
    color: 'blue',
  },
  {
    id: 'compare',
    title: 'Compare Acts',
    description: 'View ITA 1961 and ITA 2025 side-by-side with diff highlighting.',
    href: '/compare',
    icon: GitCompare,
    color: 'violet',
  },
  {
    id: 'ai',
    title: 'Ask AI',
    description: 'Get plain-English explanations, examples, and case summaries.',
    href: '/ai-tutor',
    icon: Sparkles,
    color: 'amber',
  },
  {
    id: 'bookmarks',
    title: 'Bookmarks',
    description: 'Save sections, circulars, and case laws to review later.',
    href: '/bookmarks',
    icon: Bookmark,
    color: 'emerald',
  },
];

// ─── App Meta ──────────────────────────────────────────────────────────────────

export const APP_NAME = 'Income Tax Companion';
export const APP_TAGLINE =
  'Search any section, keyword or topic from the Income Tax Act.';
export const APP_DESCRIPTION =
  'A comprehensive legal research tool for CA students and tax professionals.';
