# Podo Investigation Board

Podo Investigation Board is a frontend investigation UI built for the Jotform Frontend Hackathon scenario "Podo'nun Kaybi".  
It aggregates submissions from five Jotform forms, normalizes inconsistent answer structures, and helps investigators inspect timeline, people, and location relationships in one place.

## Tech Stack

- Vite + React + TypeScript (strict)
- React Router DOM
- TanStack Query
- Tailwind CSS
- Fuse.js (installed)
- Lucide React
- date-fns
- Leaflet + react-leaflet (map view)

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Required keys:

- `VITE_JOTFORM_API_KEY_1`
- `VITE_JOTFORM_API_KEY_2`
- `VITE_JOTFORM_API_KEY_3`
- `VITE_FORM_CHECKINS`
- `VITE_FORM_MESSAGES`
- `VITE_FORM_SIGHTINGS`
- `VITE_FORM_NOTES`
- `VITE_FORM_TIPS`

### 3) Run locally

```bash
npm run dev
```

If Vite cache becomes stale during rapid iteration:

```bash
npm run dev:force
```

### 4) Build for production

```bash
npm run build
```

## Current Feature Scope

- Fetches all five Jotform forms in parallel
- API key rotation in client and 429 retry
- Jotform answer normalization (`answers` object -> flat fields)
- Timeline page with:
  - chronological records
  - search across normalized fields
  - form-type filtering
  - loading/error/empty states
- People page:
  - canonicalized person entities
  - alias display
  - person detail with related records
- Locations page:
  - coordinate-based clustering
  - location detail with related records
- Dashboard:
  - "Last Seen Podo" hero card and "Persons of Interest" suspect ranking
  - secondary summary metrics
- Map (`/map`):
  - OpenStreetMap tiles; view auto-fits the route or all location pins
  - markers for each coordinate cluster with popups and links to location detail
  - optional Podo journey: thick route line + segment arrows for direction; numbered stops (green start, amber middle, red last seen)
  - on-map tooltips and page legend explaining chronological order (1 → N)
- Shell: collapsible sidebar on large screens (icon rail), responsive header
- Route-level error boundary

## Architecture Decisions

### TanStack Query for server-state

- Centralized loading/error/retry handling per screen
- Automatic caching for repeated navigation
- Clean separation between fetch logic and presentational components

### Feature-oriented structure

- `api/` for fetch + endpoint contracts
- `data/` for normalization, canonicalization, relations, dashboard selectors
- `hooks/` for query and derived state
- `components/` for reusable UI
- `pages/` for route-level composition

This keeps data transformation logic testable and avoids overloading page components.

### Data normalization first

Jotform returns answer payloads keyed by field id.  
`normalizeSubmission()` converts each submission into a stable flat field object by `name`, skipping non-data controls (`control_head`, `control_button`) and handling complex field values safely.

### Person canonicalization strategy

Names are normalized by:

- lowercasing
- Turkish character replacements
- punctuation cleanup
- trailing initial cleanup

This reduces obvious duplicates (`Kagan`, `Kagan A.`, `Kagan`) before relation building.

## Data Model Notes

- Unified record type: `InvestigationRecord`
- Person index: canonical name -> variants + related record ids
- Location index: coordinate key -> names + related record ids
- Timeline sorting uses parsed `timestamp` (`dd-MM-yyyy HH:mm`)

## Trade-offs Under Time Pressure

- Prioritized core investigation flows (timeline/people/locations/dashboard) over deeper visual polish
- Implemented pragmatic canonicalization and relation indexing first
- Deferred richer evidence graph rendering for faster delivery
- Used route-level boundary and reusable UI states instead of broad custom state framework

## Known Limitations

- API keys are in client-side env vars for assessment convenience (not production-safe)
- Browser cache/HMR occasionally served stale modules during rapid commits; `dev:force` mitigates this
- Person matching currently relies on deterministic canonicalization + grouping and does not yet apply score-based Fuse thresholding
- "Last Seen Podo" currently uses latest record mentioning Podo after normalization rules; it is a heuristic, not a hard forensic assertion

## Future Improvements

- Introduce weighted Fuse.js matching with explicit confidence score per person merge
- Add cross-record graph (person <-> person, person <-> location)
- Add unit tests for normalization/canonicalization/relation selectors
- Move Jotform API calls to backend proxy to protect keys and reduce client constraints
- Add list virtualization for larger datasets
