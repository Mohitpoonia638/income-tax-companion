# Data Directory — Schema Reference

This directory holds local JSON data files for Phase 1 development.
No legal text is hardcoded in the application source code.

---

## File Structure (to be populated in future steps)

```
lib/data/
  sections-1961.json     ← Income Tax Act 1961 sections
  sections-2025.json     ← Income Tax Act 2025 sections
  circulars.json         ← CBDT circulars
  notifications.json     ← CBDT notifications
  case-laws.json         ← Supreme Court / High Court judgments
  amendments.json        ← Amendment history
```

---

## Section Schema (`sections-1961.json`, `sections-2025.json`)

```json
[
  {
    "id": "1961-80c",
    "actId": "1961",
    "number": "80C",
    "title": "Deduction in respect of life insurance premia...",
    "chapterId": "VI-A",
    "parallelSectionId": "2025-80c",
    "tags": ["deduction", "investment", "savings", "chapter-vi-a"],
    "effectiveFrom": "2003-04-01",
    "amendedBy": ["Finance Act 2014", "Finance Act 2018"]
  }
]
```

## Circular Schema (`circulars.json`)

```json
[
  {
    "id": "circ-2025-01",
    "number": "1/2025",
    "type": "Circular",
    "title": "Clarification on TDS under section 194Q",
    "date": "2025-01-15",
    "subject": "...",
    "relatedSections": ["194Q"],
    "relatedActId": "1961"
  }
]
```

## Case Law Schema (`case-laws.json`)

```json
[
  {
    "id": "cl-2024-001",
    "title": "CIT v. XYZ Ltd.",
    "citation": "[2024] 168 ITD 101 (SC)",
    "court": "Supreme Court",
    "year": 2024,
    "relatedSections": ["80C", "139"],
    "relatedActId": "1961",
    "headnote": "...",
    "tags": ["deduction", "filing"]
  }
]
```
