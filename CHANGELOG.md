# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
  `color-scheme` is set under the stamps only, never at bare `:root`.
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
