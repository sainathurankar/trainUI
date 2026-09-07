# RailGo — TrainUI

A modern train ticket booking front end built with **Angular 16**. Search trains
between stations, view live seat availability across classes and quotas, and
preview a two-week availability outlook. Styled with Bootstrap 5, ng-bootstrap
and a custom design-token theme.

> The app talks to a separate backend search API. In development it can run
> fully on bundled mock JSON (see `src/environments/environment.ts`,
> `mock: true`), so no backend is required to explore the UI.

## Tech stack

- Angular 16
- Bootstrap 5 (SCSS) + ng-bootstrap (modals)
- FontAwesome icons
- Karma + Jasmine for unit tests

## Prerequisites

- Node.js 18 LTS is recommended. (Angular 16 uses the modern esbuild-based
  toolchain, so the old `NODE_OPTIONS=--openssl-legacy-provider` workaround is
  no longer required.)
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
