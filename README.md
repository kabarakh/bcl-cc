# Boulder Tracker

A local-first web app for logging bouldering sessions: gyms ("Hallen") contain areas, areas contain walls, walls contain routes, and routes collect individual attempts (success/fail, notes, media links). Everything is stored offline in the browser via IndexedDB — no backend, no account, no sync.

## What is this for?

Keeping track of which routes you've tried, sent, or want to go back to across multiple gyms and areas gets messy fast with notes apps or memory alone. Boulder Tracker gives each gym a simple drill-down hierarchy (Halle → Bereich → Wand → Route → Versuch) with counts at every level, so you can see at a glance how many walls a given area has, how many routes are set on a wall, and your success rate and flash count per route.

## A note on how this was built

This entire codebase is fully AI-generated — no line of code was manually written or edited by hand. Unlike other AI-built projects in this collection, the point here wasn't to learn Vue or TypeScript. It was an exercise in spec-driven development: how far you can get by writing a thorough implementation plan up front and having Claude execute against it, phase by phase, rather than prompting feature-by-feature.

### How it came together

1. A implementation plan (`Implementierungsplan_Boulder_Tracker.md`, later revised as `_v2.md`) was written up front, covering the tech stack, the layered architecture (Views/Components → Pinia stores → Repositories → Dexie → IndexedDB, with strict rules on which layer may import which), the full data model, and a phase-by-phase build order with acceptance criteria per phase.
2. Claude implemented the plan phase by phase, with each phase tested (type-checking, unit tests against `fake-indexeddb`) before moving to the next.
3. After the initial build, the codebase was reviewed and iterated on conversationally — bug fixes (e.g. child-count props silently defaulting to 0 or being omitted entirely) and architectural clean-up (removing prop-drilled derived data and callback-prop wiring in favor of components reading Pinia stores directly and using the router/URL as the source of truth for UI state) were done as follow-up passes rather than being in the original spec.

## Tech stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vue Router](https://router.vuejs.org/) for client-side routing
- [Pinia](https://pinia.vuejs.org/) as the single state/data-access layer
- [Dexie](https://dexie.org/) as a wrapper around IndexedDB (schema, versioning, queries)
- [Tailwind CSS](https://tailwindcss.com/) + [Flowbite](https://flowbite.com/) / [Flowbite Vue](https://flowbite-vue.com/) for styling and UI building blocks
- [Luxon](https://moment.github.io/luxon/) for date/time handling
- [Vite](https://vite.dev/) for dev server and build
- TypeScript throughout (`strict: true`)
- [Vitest](https://vitest.dev/) + [fake-indexeddb](https://github.com/dumbmatter/fakeIndexedDB) for unit tests against repositories and stores
- ESLint + Prettier for linting/formatting

## Running the app

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`

### Install and run

```bash
npm install
npm run dev
```

### Other commands

```bash
npm run build        # type-check (vue-tsc) + production build
npm run preview       # preview the production build locally
npm run test          # run the Vitest suite once
npm run test:watch    # run the Vitest suite in watch mode
npm run lint          # eslint --fix
npm run format        # prettier --write src/
```

The app is entirely client-side and offline — `npm run build` produces a static bundle that can be served from any static host with no server-side component.
