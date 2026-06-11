# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

PDFEasy is a client/server-side PDF generator built on top of [PDFKit](https://pdfkit.org/). It is organized as a **pnpm monorepo** managed with **Lerna** and **Nx**.

### Packages

| Package | Name | Description |
|---|---|---|
| `packages/core` | `pdfeasy` | Core library — the main PDF generation engine |
| `packages/vue` | `vue-pdfeasy` | Vue 3 composable plugin (`usePDF`) |
| `packages/nuxt` | `nuxt-pdfeasy` | Nuxt module wrapping the core |
| `packages/playground` | — | Nuxt app for manual testing |

## Commands

All commands run from the **repo root** via Lerna unless stated otherwise.

```bash
# Install deps (pnpm required)
pnpm install

# Build all packages (dev mode)
pnpm build

# Build all packages (production, minified)
pnpm build:prod

# Run all tests (builds core first, then runs vitest)
pnpm test

# Format all packages
pnpm format

# Start playground dev server
pnpm play:dev

# Start demo (core package vite dev server, port 3000)
# Run from packages/core after building
pnpm demo
```

### Core package commands (run from `packages/core`)

```bash
# Build (dev)
pnpm build

# Build (prod)
pnpm build:prod

# Run tests with coverage (builds prod first)
pnpm test

# Run a single test file
pnpm vitest run test/<file>.test.ts

# Run node.js server-side script
pnpm node:script
```

The build uses a custom **ESBuild** script at `packages/core/scripts/build.js` — it produces four bundles: `client.cjs.js`, `client.esm.js`, `node.cjs.js`, `node.esm.js`. Type declarations are generated separately via `tsup`.

## Architecture

### Core (`packages/core/src`)

The `PDFEasy` class in [`runner.ts`](packages/core/src/runner.ts) is the central object. It is exported as a singleton default (`new PDFEasy()`).

Key public API methods: `new()` → `add()` → `run()`.

- **`new(options?)`** — Resets state and initializes a `PDFDocumentWithTables` (pdfkit-table) instance. If any plugin has `page` callbacks, `bufferPages: true` is set automatically on the PDFKit document.
- **`add(contents)`** — Pushes `Content[]` items into the pipeline queue.
- **`run(options?)`** — Executes the pipeline. Supports `type: 'client'` (browser, via blob-stream + file-saver) and `type: 'server'` (Node.js, writes to disk with `createWriteStream`).

Internal flow inside `run()`:
1. `setExternalFonts` — fetches and registers custom fonts via `vfs.ts`
2. `pipeline()` — iterates `contents`, calls `resolveContent()` per item
3. `pageHandler()` — after pipeline finishes, iterates buffered pages for plugin `page` callbacks
4. `pdfkit.end()` — finalises the PDF

### Content resolution (`resolvers.ts`)

`resolveContent()` dispatches on content type (text/paragraph, image, svg, lineBreak, pageBreak, checkbox, list, table, form/formulary, qrcode, stack). Each type has its own rendering logic using PDFKit primitives.

### Plugins (`plugins.ts`)

Plugins are objects with optional `cover`, `background`, `page[]`, `onBefore`, and `onAfter` hooks.

- `background` callback runs before each content item via `runPluginBackground()` and can inject a full-page image.
- `page[]` callbacks run after the full pipeline via `pageHandler()`, iterating buffered pages to add headers/footers/page numbers.

### Font handling (`vfs.ts`)

`setExternalFonts()` fetches remote `.ttf` files (or reads local ones) and registers them with PDFKit. When `advanced.fontsPurge` is `true` (default), only fonts actually referenced in `contents` are loaded.

### Color (`utils.ts`)

When `colorSchema: 'CMYK'` is passed to `run()`, all hex colors in content are converted to CMYK arrays before rendering.

### Vue wrapper (`packages/vue/src`)

Provides a `PDFPlugin` (Vue install) and `usePDF()` composable that wraps the singleton `pdfeasy` instance. Built with `tsup`.

### Nuxt wrapper (`packages/nuxt/src`)

A Nuxt module that injects the core as `$pdf` via `useNuxtApp()`.

## Dual Bundle (client vs. node)

The build produces separate client and node bundles because the browser requires polyfills (`path-browserify`, `crypto-browserify`, `stream-browserify`) defined in the `browser` field of `packages/core/package.json`. The `esbuild-plugin-*` plugins in the build script handle these substitutions.

## Testing

Tests live in `packages/core/test/`. The test environment is `happy-dom` (configured in `vitest.config.ts`). Tests require a production build to exist first — `pnpm test` handles this automatically via `pnpm build:prod && vitest run --coverage`.

Coverage is collected from `src/` only, excluding `dist/`, `examples/`, and `scripts/`.
