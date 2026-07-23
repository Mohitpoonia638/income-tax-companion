import type { PopularSearch } from '@/types/search';

// ─── Popular Searches ─────────────────────────────────────────────────────────
//
// Displayed in the search dropdown when the user hasn't typed anything.
// Ordered by expected usage frequency for CA students.
// These are STATIC — future versions can make them dynamic via API.

export const POPULAR_SEARCHES: PopularSearch[] = [
  // Deductions (most searched by CA students)
  { id: 'ps-80c',   query: '80C',              label: '80C',              category: 'deduction' },
  { id: 'ps-80d',   query: '80D',              label: '80D',              category: 'deduction' },
  { id: 'ps-80g',   query: '80G',              label: '80G',              category: 'deduction' },
  { id: 'ps-87a',   query: '87A Rebate',       label: '87A Rebate',       category: 'deduction' },

  // Heads of income
  { id: 'ps-sal',   query: 'Salary',           label: 'Salary',           category: 'head'      },
  { id: 'ps-hp',    query: 'House Property',   label: 'House Property',   category: 'head'      },
  { id: 'ps-cg',    query: 'Capital Gain',     label: 'Capital Gain',     category: 'head'      },
  { id: 'ps-os',    query: 'Other Sources',    label: 'Other Sources',    category: 'head'      },

  // TDS
  { id: 'ps-194q',  query: '194Q',             label: '194Q',             category: 'tds'       },
  { id: 'ps-194j',  query: '194J',             label: '194J',             category: 'tds'       },
  { id: 'ps-194c',  query: '194C',             label: '194C',             category: 'tds'       },
  { id: 'ps-tds',   query: 'TDS',              label: 'TDS',              category: 'tds'       },

  // Exemptions
  { id: 'ps-54',    query: '54',               label: 'Section 54',       category: 'exemption' },
  { id: 'ps-agri',  query: 'Agricultural Income', label: 'Agricultural Income', category: 'exemption' },
  { id: 'ps-gift',  query: 'Gift',             label: 'Gift / Section 56', category: 'misc'     },
  { id: 'ps-hra',   query: 'HRA',              label: 'HRA',              category: 'exemption' },

  // Penalties & Compliance
  { id: 'ps-pen',   query: 'Penalty',          label: 'Penalty',          category: 'penalty'   },
  { id: 'ps-int',   query: 'Interest 234',     label: 'Interest 234',     category: 'penalty'   },

  // Appeals
  { id: 'ps-app',   query: 'Appeal',           label: 'Appeal',           category: 'appeal'    },
  { id: 'ps-itat',  query: 'ITAT',             label: 'ITAT',             category: 'appeal'    },
];

// Category display config for UI rendering
export const POPULAR_CATEGORY_STYLES: Record<PopularSearch['category'], string> = {
  deduction: 'hover:bg-emerald-500/15 hover:text-emerald-300 hover:border-emerald-500/30',
  section:   'hover:bg-blue-500/15    hover:text-blue-300    hover:border-blue-500/30',
  head:      'hover:bg-violet-500/15  hover:text-violet-300  hover:border-violet-500/30',
  penalty:   'hover:bg-red-500/15     hover:text-red-300     hover:border-red-500/30',
  tds:       'hover:bg-amber-500/15   hover:text-amber-300   hover:border-amber-500/30',
  exemption: 'hover:bg-sky-500/15     hover:text-sky-300     hover:border-sky-500/30',
  appeal:    'hover:bg-rose-500/15    hover:text-rose-300    hover:border-rose-500/30',
  misc:      'hover:bg-white/10       hover:text-foreground  hover:border-white/20',
};
