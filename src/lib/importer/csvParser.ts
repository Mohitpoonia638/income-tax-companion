// ─── CSV Parser Utility ─────────────────────────────────────────────────────────

/**
 * Parse CSV raw text string into array of object records
 */
export function parseCsvContent(csvText: string): Record<string, unknown>[] {
  const lines = splitCsvLines(csvText.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvRow(lines[0]).map((h) => h.trim());
  const records: Record<string, unknown>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCsvRow(line);
    const rowObj: Record<string, unknown> = {};

    headers.forEach((header, idx) => {
      const val = values[idx] !== undefined ? values[idx].trim() : '';
      rowObj[header] = processCsvValue(val);
    });

    records.push(rowObj);
  }

  return records;
}

/**
 * Split CSV content respecting quoted multi-line fields
 */
function splitCsvLines(csvText: string): string[] {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && csvText[i + 1] === '\n') {
        i++; // skip \n in \r\n
      }
      if (currentLine.trim()) lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += char;
    }
  }

  if (currentLine.trim()) lines.push(currentLine);
  return lines;
}

/**
 * Parse a single CSV row into cell strings, handling quotes and escaped quotes
 */
function parseCsvRow(row: string): string[] {
  const cells: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(currentCell);
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  cells.push(currentCell);
  return cells;
}

/**
 * Auto-convert array strings, numbers, booleans or JSON embedded strings in CSV cells
 */
function processCsvValue(value: string): unknown {
  if (!value) return '';

  // Check array string e.g. "deduction,lic,ppf" or "[\"a\",\"b\"]"
  if (value.startsWith('[') && value.endsWith(']')) {
    try {
      return JSON.parse(value);
    } catch {
      /* ignore */
    }
  }

  if (value.includes(';') || value.includes('|')) {
    const delimiter = value.includes(';') ? ';' : '|';
    return value.split(delimiter).map((s) => s.trim()).filter(Boolean);
  }

  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  return value;
}
