# RailGo — TrainUI

A modern train ticket booking front end built with **Angular 22**. Search trains
between stations, view live seat availability across classes and quotas, and
preview a two-week availability outlook. Styled with Bootstrap 5, ng-bootstrap
and a custom design-token theme.

> The app talks to a separate backend search API. In development it can run
> fully on bundled mock JSON (see `src/environments/environment.ts`,
> `mock: true`), so no backend is required to explore the UI.

## Features

- **Search & live availability** — station autocomplete, 12+ trains per route
  with seat status across every class and quota.
- **Filter & sort results** — sort by departure, arrival, duration, price or
  best availability; filter by availability bucket (Available / RAC / Waitlist)
  and travel class.
- **2-week availability outlook** — per-class 14-day view with an inline SVG
  trend sparkline (Improving / Declining / Steady).
- **Dark mode** — one-click theme toggle that respects `prefers-color-scheme`
  and persists your choice across visits.
- **Installable PWA** — add to home screen and browse cached results offline
  (service worker via `@angular/service-worker`).
- **Polished UX** — skeleton loaders while fetching and toast notifications for
  search results and errors.

## Tech stack

- Angular 22 (standalone-ready, new `@if`/`@for` control flow, `inject()` DI)
- Bootstrap 5 (SCSS) + ng-bootstrap (modals)
- FontAwesome icons
- Karma + Jasmine for unit tests
- ESLint (flat config) via angular-eslint

## Prerequisites

- Node.js 22 LTS or newer is required (Angular 22 needs Node ^20.19 || ^22.12
  || >=24). The app uses the modern esbuild-based toolchain, so the old
  `NODE_OPTIONS=--openssl-legacy-provider` workaround is not required.
- Install dependencies:

  ```bash
  npm install --legacy-peer-deps
  ```

## Development server

```bash
npx ng serve
```

Navigate to `http://localhost:4200/`. The app reloads automatically on source
changes.

## Build

```bash
npx ng build
```

Build artifacts are emitted to `dist/`.

## Running unit tests

```bash
CHROME_BIN="$(which google-chrome || echo /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome)" \
npx ng test --watch=false --browsers=ChromeHeadless
```

## Configuration

Environment settings live in `src/environments/`:

- `environment.ts` — development (defaults to `mock: true`)
- `environment.prod.ts` — production build (via `fileReplacements`)

Set `mock: false` and point `apiUrl` at your backend to use live data.

## Further help

For more on the Angular CLI use `ng help` or see the
[Angular CLI Overview and Command Reference](https://angular.io/cli).
