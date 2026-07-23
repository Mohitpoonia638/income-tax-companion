# Legal Data Layer — JSON Schema Specifications

This directory contains the raw JSON datasets for the Income Tax Companion application.

## Registered Datasets

| File | Purpose | Entity Type |
|---|---|---|
| `acts.json` | Meta-data for Income Tax Acts (1961, 2025) | `Act` |
| `chapters.json` | Chapter structures per Act | `Chapter` |
| `sections.json` | Full legal section definitions | `Section` |
| `case-laws.json` | Supreme Court, High Court & ITAT judgments | `CaseLaw` |
| `amendments.json` | Finance Act amendments | `Amendment` |
| `circulars.json` | CBDT Circulars and instructions | `Circular` |
| `notifications.json` | CBDT Notifications | `Notification` |
| `rules.json` | Income Tax Rules 1962 | `Rule` |
| `forms.json` | Income Tax Forms (ITR, TDS, Audit, etc.) | `Form` |
| `section-mappings.json` | Parallel mapping between 1961 & 2025 Acts | `SectionMapping` |
| `search-index.json` | Pre-built search index export | `SearchIndex` |

## Section JSON Schema Example

```json
{
  "id": "sec-1961-80c",
  "actYear": "1961",
  "sectionNumber": "80C",
  "sectionTitle": "Deduction in respect of life insurance premia, deferred annuity, contributions to provident fund, etc.",
  "chapter": "Chapter VI-A",
  "keywords": ["80C", "deduction", "lic", "ppf", "elss", "tax saving"],
  "synonyms": ["life insurance", "provident fund", "tuition fees", "home loan principal"],
  "status": "active",
  "effectiveDate": "1962-04-01",
  "parallelSection": "72",
  "oldSection": "80C",
  "newSection": "72",
  "simpleMeaning": "Allows deduction up to ₹1,50,000 for specified investments and expenses.",
  "detailedMeaning": "Full explanation of eligible investments under Section 80C...",
  "bareAct": {
    "rawText": "In computing the total income of an assessee...",
    "subsections": []
  },
  "importantChanges": [],
  "exceptions": [],
  "limits": [
    {
      "title": "Maximum Overall Limit",
      "amount": 150000,
      "description": "Aggregate deduction under section 80C, 80CCC, and 80CCD(1) shall not exceed ₹1.5 Lakhs."
    }
  ],
  "penalties": [],
  "examples": [],
  "relatedSections": ["80CCC", "80CCD"],
  "relatedRules": ["Rule 2AB"],
  "relatedForms": ["Form 16"],
  "caseLawIds": [],
  "amendmentIds": [],
  "circularIds": [],
  "notificationIds": [],
  "revisionNotes": [],
  "examImportance": "high",
  "difficultyLevel": "medium",
  "lastUpdated": "2025-04-01",
  "source": "Income Tax Department"
}
```
