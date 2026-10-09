# Overview

`@stylescape/stylescape-devcontainer` is a theme for
[Stylescape](https://github.com/stylescape/stylescape): a set of `--ss-*`
token overrides that core's components read at runtime, plus a dark variant
and a self-hosted face.

## Where the values come from

The repository had no stylesheet, logo or palette when it became a theme.
What it had is the badge row at the top of the README, drawn in the
Stylescape organisation's colours:

- **`#041B26`**, a deep navy — `labelColor` and `color` on every badge;
- **`#FFFFFF`** — `logoColor` on every badge.

Those two are the brand and are marked `BRAND` in
`src/scss/tokens/_brand.scss`; `tst/brand.test.mjs` holds them to the
README. Every other swatch is derived from them: a navy ramp on the badge's
own hue (199), neutrals on that hue at low chroma, and quiet status colours.

The face is Manrope, which Stylescape's own documentation is set in. The
corners are near-square because the badges are `style=flat-square`.

## Layout

```
src/scss/index.scss     core + tokens + themes + the heading voice
src/scss/abstracts/     breakpoints, fade(), the dark mixin — no CSS
src/scss/tokens/        _brand (raw values), _light (the set), _css-vars
src/scss/themes/        _dark, _light — the data-theme stamps
src/scss/base/          _fonts, _typography — mixins only
src/font/               fonts.css + Manrope (variable woff2, OFL)
```

The container's files are untouched by the theme and the theme's are never
inside the image context (`src/devcontainer/`); `tst/package.test.mjs`
checks both.
