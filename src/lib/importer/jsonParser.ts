// ─── JSON Parser Utility ────────────────────────────────────────────────────────

/**
 * Parse raw JSON string or object input into array of records
 */
export function parseJsonContent(content: string | unknown): Record<string, unknown>[] {
  if (!content) return [];

  let data: unknown = content;

  if (typeof content === 'string') {
    try {
      data = JSON.parse(content);
    } catch {
      return [];
    }
  }

  if (Array.isArray(data)) {
    return data.filter((item) => typeof item === 'object' && item !== null) as Record<string, unknown>[];
  }

  if (typeof data === 'object' && data !== null) {
    return [data as Record<string, unknown>];
  }

  return [];
}
