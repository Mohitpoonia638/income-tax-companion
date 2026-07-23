// ─── Tax Domain Synonym Map ────────────────────────────────────────────────────
//
// Maps canonical search terms to their aliases and related terms.
// At search time, the engine expands the user's query with these synonyms
// so that "capital gain" also matches documents tagged "ltcg", "cg", etc.
//
// Format:
//   key   = canonical term (already normalized)
//   value = array of synonyms (already normalized)
//
// To add new synonyms: append to an existing entry or add a new key.

export const SYNONYM_MAP: Record<string, string[]> = {
  // ── Sections & Deductions ──────────────────────────────────────────────────
  '80c': ['section 80c', 'lic', 'ppf', 'elss', 'tax saving investment', 'nsc', 'nps', 'sukanya samriddhi', 'life insurance premium', 'provident fund', 'tuition fees', 'home loan principal', 'tax deduction 80c'],
  '80d': ['section 80d', 'health insurance', 'medical insurance', 'mediclaim', 'preventive health checkup'],
  '80e': ['section 80e', 'education loan interest', 'student loan'],
  '80g': ['section 80g', 'donation', 'charitable contribution', 'charity', 'ngo donation'],
  '80gg': ['section 80gg', 'rent paid', 'house rent deduction', 'hra not received'],
  '80tta': ['section 80tta', 'savings interest deduction', 'bank interest'],
  '80u': ['section 80u', 'disability deduction', 'physically handicapped'],
  '87a': ['rebate 87a', 'tax rebate', 'section 87a'],
  '54': ['section 54', 'capital gain exemption property', 'house sale exemption'],
  '54ec': ['section 54ec', 'capital gain bond', 'nhai bond', 'rec bond'],
  '54f': ['section 54f', 'long term capital gain residential property'],
  '10': ['section 10', 'exempt income', 'exemptions'],

  // ── Heads of Income ───────────────────────────────────────────────────────
  'salary': ['salaries', 'employment income', 'wages', 'pay', 'allowance', 'perquisite', 'perks', 'gratuity', 'leave encashment', 'pension'],
  'house property': ['house property income', 'rental income', 'let out property', 'self occupied', 'annual value', 'nal', 'standard deduction property'],
  'capital gain': ['capital gains', 'cg', 'ltcg', 'stcg', 'long term capital gain', 'short term capital gain', 'sale of property', 'sale of shares', 'sale of mutual fund'],
  'business income': ['business and profession', 'pgbp', 'profits gains business profession', 'self employed', 'professional income', 'freelancer'],
  'other sources': ['income from other sources', 'dividend', 'interest income', 'lottery winnings', 'gifts', 'winning'],

  // ── TDS Sections ──────────────────────────────────────────────────────────
  '194a': ['section 194a', 'tds on interest', 'tds bank interest', 'fd interest'],
  '194c': ['section 194c', 'tds contractor', 'tds work contract'],
  '194h': ['section 194h', 'tds commission', 'tds brokerage'],
  '194i': ['section 194i', 'tds rent', 'tds on rent'],
  '194j': ['section 194j', 'tds professional fees', 'tds technical services'],
  '194q': ['section 194q', 'tds on purchase of goods', 'buyer tds', 'tds purchase'],
  '195': ['section 195', 'tds non resident', 'tds nri payment'],
  'tds': ['tax deducted at source', 'withholding tax', 'tds return', 'form 26as', 'deduction at source'],
  'tcs': ['tax collected at source', 'seller collect tax'],

  // ── Returns & Compliance ──────────────────────────────────────────────────
  'itr': ['income tax return', 'return of income', 'filing return', 'e filing'],
  '139': ['section 139', 'due date filing', 'return filing', 'belated return', 'revised return'],
  '143': ['section 143', 'assessment', 'scrutiny', 'notice 143'],
  '148': ['section 148', 'reassessment notice', 'escapement income'],
  'advance tax': ['advance tax payment', 'prepaid tax', 'instalments tax', 'section 207', 'section 208'],
  'self assessment tax': ['section 140a', 'tax payable return'],

  // ── Penalties & Prosecution ───────────────────────────────────────────────
  'penalty': ['fine', 'penal', 'penalties', 'section 271', 'section 270a', 'late fee', 'concealment penalty'],
  'interest': ['section 234a', 'section 234b', 'section 234c', 'interest on late filing', 'interest on short payment'],
  'prosecution': ['section 276', 'criminal proceedings', 'imprisonment tax'],

  // ── Appeals ───────────────────────────────────────────────────────────────
  'appeal': ['appeals', 'cit appeals', 'appellate', 'itat', 'income tax appellate tribunal', 'section 246a', 'section 253'],

  // ── Exempt Income ─────────────────────────────────────────────────────────
  'agricultural income': ['farm income', 'agriculture', 'agricultural land', 'exempt agricultural'],
  'gift': ['gift tax', 'gifts received', 'section 56', 'deemed income gift'],
  'hra': ['house rent allowance', 'hra exemption', 'section 10 13a', 'rent allowance'],
  'lta': ['leave travel allowance', 'lta exemption', 'travel allowance'],

  // ── Entities ──────────────────────────────────────────────────────────────
  'company': ['corporate tax', 'domestic company', 'foreign company', 'mat', 'minimum alternate tax'],
  'partnership': ['partnership firm', 'llp', 'limited liability partnership', 'firm taxation'],
  'trust': ['charitable trust', 'religious trust', 'section 11', 'section 12a', 'section 80g'],
  'nri': ['non resident indian', 'non resident', 'rnor', 'resident but not ordinarily resident', 'foreign income'],

  // ── Depreciation & Assets ─────────────────────────────────────────────────
  'depreciation': ['section 32', 'wdv', 'written down value', 'slm', 'straight line method', 'block of assets'],

  // ── CBDT & Administration ─────────────────────────────────────────────────
  'cbdt': ['central board of direct taxes', 'board circular', 'tax authority'],
  'pan': ['permanent account number', 'pan card', 'pan application'],
  'form 16': ['salary certificate', 'tds certificate employer'],
  'form 26as': ['tax credit statement', 'annual information statement', 'ais'],
};

// ── Reverse Map: synonym → canonical ─────────────────────────────────────────
// Built at module load time for O(1) reverse lookups.

const REVERSE_MAP: Map<string, string> = new Map();
for (const [canonical, synonyms] of Object.entries(SYNONYM_MAP)) {
  for (const syn of synonyms) {
    REVERSE_MAP.set(syn, canonical);
  }
}

/**
 * Expand a normalized query string with synonym tokens.
 * Returns the original tokens PLUS any synonym matches.
 *
 * @example expandQuery("capital gain") → ["capital", "gain", "ltcg", "stcg", "cg", ...]
 */
export function expandQuery(normalizedQuery: string): string[] {
  const tokens = new Set<string>();

  // Add original tokens
  const rawTokens = normalizedQuery.split(' ').filter((t) => t.length > 1);
  for (const t of rawTokens) tokens.add(t);

  // Check full query against synonym map keys
  if (SYNONYM_MAP[normalizedQuery]) {
    for (const syn of SYNONYM_MAP[normalizedQuery]) {
      syn.split(' ').filter((t) => t.length > 1).forEach((t) => tokens.add(t));
    }
  }

  // Check individual tokens against synonym map
  for (const token of rawTokens) {
    if (SYNONYM_MAP[token]) {
      for (const syn of SYNONYM_MAP[token]) {
        syn.split(' ').filter((t) => t.length > 1).forEach((t) => tokens.add(t));
      }
    }
    // Check reverse map: if token is a synonym, also add its canonical
    const canonical = REVERSE_MAP.get(token);
    if (canonical) {
      canonical.split(' ').filter((t) => t.length > 1).forEach((t) => tokens.add(t));
    }
  }

  return Array.from(tokens);
}

/**
 * Get all synonym strings for a given canonical term (for display/suggestions).
 */
export function getSynonyms(term: string): string[] {
  return SYNONYM_MAP[term.toLowerCase()] ?? [];
}
