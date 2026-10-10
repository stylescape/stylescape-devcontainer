# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] — 2026-10-10

The first tagged release of the Stylescape devContainer theme: 0.1.0 (the
Stylescape theme layout on stylescape core 0.5.1, with every npm dependency
at its latest) plus the repository work since. Every `--ss-*` and
`--devcontainer-*` value is unchanged.

### Added

- **Storybook** (`npm run storybook`, `npm run build-storybook`): the shared
  web-components + Vite setup of the stylescape-* themes, in `.storybook/`
  with the theme stories in `src/stories/theme.stories.ts`, and the
  Storybook addons as devDependencies.

### Changed

- **Grouped Dependabot config** targeting `dev`: npm, github-actions,
  docker and devcontainers only; stylescape, dev-tooling and production
  minor/patch updates grouped, majors as single PRs.
- `VERSION`, `CITATION.cff` and `codemeta.json` move to 0.1.1.

### Fixed

- Storybook build warnings: the obsolete `mixed-decls` deprecation silence
  and the `src/**/*.mdx` stories glob that matched no files.

## [0.1.0] — 2026-10-09

The repository becomes a Stylescape theme as well as a devcontainer, in the
layout of `stylescape-mesmera`. Every devcontainer file stays where it was:
`.devcontainer/`, `src/.devcontainer/`, `src/devcontainer/` and the
bake/compose files in `bin/`.

### Added

- **The token set.** `tokens/_brand.scss` holds the palette: the badge navy
  `#041b26` and white (marked `BRAND`, held to the README badges by
  `tst/brand.test.mjs`) and the ramps derived from them.
  `tokens/_light.scss` and `tokens/_css-vars.scss` emit every `--ss-*`
  colour, radius, depth and type token core reads, plus
  `--devcontainer-navy`, `--devcontainer-white`, `--devcontainer-paper` and
  `--devcontainer-gradient`.
- **A dark theme** (`themes/_dark.scss`) under `[data-theme="dark"]` on any
  element — white on the badge navy — and a light stamp
  (`themes/_light.scss`) for a light band inside a dark page.
  `[data-theme="auto"]` takes the dark set under
  `prefers-color-scheme: dark` (core 0.5's theme entry points); the band
  ground rule and the `dark` mixin cover it too. `color-scheme` is set
  under the stamps only, never at bare `:root`.
- **Built on stylescape core 0.5.1** (devDependency `^0.5.1`, peer range
  `stylescape >=0.5.1`). The package root builds core with
  `$scapepress-parity: false` and `$v03-compat: false` (0.5's styling of
  the unprefixed 0.3 class names, which 0.4 never had). Every `--ss-*` and
  `--devcontainer-*` value equals what the theme rendered on core 0.4.1:
  the theme already set every colour core 0.5 re-tuned (status hues,
  muted, line-secondary), and `tst/fixtures/tokens-0.1.0.json` pins both
  themes. Core 0.5's new `--ss-color-border-strong` (input boundaries,
  WCAG 1.4.11) comes from the ink ramp: `ink-500` light, `ink-400` dark,
  tested at 3:1 or more on every ground. Core 0.5's own readability
  defaults (body line-height 1.5, paragraph spacing) are left as core sets
  them.
- **Manrope**, self-hosted in `src/font/` (`fonts.css`, the variable woff2
  from Stylescape's own docs, OFL). The package root sets h1-h6 in the
  heading voice at zero specificity.
- **Subpath entries** `./tokens`, `./themes`, `./abstracts` (breakpoints,
  `fade()`, the `dark` mixin), `./base` (heading/body/code/eyebrow mixins),
  `./font/*`, `./css`, `./stylelint`.
- **Tests** (`node --test`): the token contract and WCAG AA on every ground
  in both themes, brand provenance, the root entry over core, the published
  surface, and the devcontainer files still in place. ESLint, Prettier, tsc,
  a Vite build and a CI workflow.
- `package.json`, `codemeta.json`, `NOTICE`, `doc/`.

### Changed

- `VERSION` and `CITATION.cff` move to 0.1.0.

## [0.0.2]

The devcontainer only.
