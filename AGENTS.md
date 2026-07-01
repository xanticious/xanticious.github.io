# AGENTS.md

Guidance for LLM coding agents working in this repository.

## What this project is

A personal, highly customizable browser "new tab" page (`xanticious.github.io`,
deployed via GitHub Pages). Static site: no build step, no bundler, no
package.json. Plain HTML5 + ES6 modules + CSS. Data (links, categories,
themes) lives in JSON files and is fetched at runtime via `fetch()`.

Two pages:
- `index.html` — the new-tab page itself (search box + categorized link grid).
- `settings.html` — lets the user pick Home/Work mode, a visual theme, and
  recent-items behavior. Settings persist in `localStorage` (see
  `src/utils/storage.js`).

## Running it locally

There is no build/install step. Because the app uses ES6 `import`/`export`,
it must be served over `http://`, not opened via `file://`:

```bash
python -m http.server 8000
# or use the VS Code "Live Server" extension on index.html
```

No test suite, linter, or CI config exists in this repo — verify changes by
loading the page in a browser and exercising the feature manually.

## Directory structure

```
index.html              Main new-tab page
settings.html           Settings page
data/
  categories.json        Ordered list of categories: { id, name, isWorkOnly }
  styles.json            Theme catalog shown in the settings dropdown
  urls/<category_id>.json  One file per category id: { category, urls: [...] }
  urls_original.json     Historical/unused snapshot — not loaded by any code, leave alone
images/                 Favicons for every link + theme background art (flat dir, no subfolders)
styles/                 One CSS file per theme, referenced by data/styles.json
src/
  app.js                Entry point for index.html
  settings-app.js       Entry point for settings.html
  modules/              settings-manager, google-search, link-search, link-renderer
  utils/                storage (localStorage), dom, url, data-service (fetch wrappers)
  README.md             More detail on the module architecture
```

## How the link data model works

Each category file at `data/urls/<id>.json` has the shape:

```json
{
  "category": "work_tools",
  "urls": [
    {
      "url": "https://example.com/",
      "name": "Display Name",
      "shortName": "unique_short_id",
      "faviconExtension": "svg",
      "faviconName": "optional_override"
    }
  ]
}
```

- `shortName` must be unique within its file; it's used as a dataset key and
  (if `faviconName` is absent) as the favicon filename stem.
- The favicon actually loaded is `images/${faviconName || shortName}.${faviconExtension}`
  (see `LinkRenderer.createFavicon` in `src/modules/link-renderer.js`).
- `excludeFromRecentInWorkMode: true` on a url entry hides it from the
  "Recent" category while Work mode is active (see `link-renderer.js`).
- Categories are registered in `data/categories.json` and gated by
  `isWorkOnly`. A category with no matching `data/urls/<id>.json` file, or an
  empty `urls` array, is simply skipped when rendering.
- Links within a category are always rendered sorted by `name`.

### Adding a new link

1. Pick (or create) the right `data/urls/<category>.json` file; if it's a new
   category, add an entry to `data/categories.json` too.
2. Add the url object with a unique `shortName`.
3. Get a favicon into `images/` under that `shortName` (or set `faviconName`
   to reuse an existing one, e.g. `sd_favicon.png` is shared by most internal
   SirsiDynix environment links). Prefer the site's real favicon at the
   highest resolution available (check `<link rel="icon">` tags; try
   `/favicon.svg` before `/favicon.ico`) over a generic placeholder.
4. For internal Jenkins-hosted "HTML Publisher" report pages
   (`jenkins.sirsidynix.com/job/.../job/main/<Report_Name>/`), the wrapper
   page itself has no favicon — check `<report-url>/favicon.svg` for a
   custom one; if that 404s, the app has no custom icon and falls back to
   Jenkins' own `https://jenkins.sirsidynix.com/favicon.ico`.

## Themes

`data/styles.json` groups theme options by category for the settings
dropdown; each entry's `value` maps to `styles/<value-lowercased-with-underscores>.css`,
loaded dynamically by `SettingsManager.loadStylesheet`. `implemented: false`
entries are listed in the UI but don't have a corresponding CSS file yet —
don't reference them from the site until the CSS exists.

## Conventions / gotchas

- No frameworks, no npm dependencies, no TypeScript — keep additions to
  vanilla JS ES6 modules consistent with the existing `src/` style.
- `images/` is a flat directory — don't introduce subfolders.
- `data/urls_original.json` is a historical backup, not part of the live
  data pipeline; don't edit it when updating live links, and don't treat it
  as a source of truth.
- Internal SirsiDynix URLs (`*.sirsidynix.com`, `*.sirsidynix.net`,
  `*.sirsi.pvt`) are only reachable on the corporate network/VPN.
