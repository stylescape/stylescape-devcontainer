# Colours

## Brand

| Swatch      | Hex       | Source                      |
| ----------- | --------- | --------------------------- |
| `$navy-900` | `#041b26` | README badges, `labelColor` |
| `$white`    | `#ffffff` | README badges, `logoColor`  |

## Navy ramp (hue 199)

| Step | Hex       | Used for                                      |
| ---- | --------- | --------------------------------------------- |
| 50   | `#f0f6f9` | accent wash, info ground (light)              |
| 100  | `#e1eef4` | highlight (light)                             |
| 200  | `#c4dde9` | accent highlight, hover (dark)                |
| 300  | `#90bfd5` | accent and links (dark) — 8.9:1 on the badge  |
| 400  | `#599fc0` | accent tertiary                               |
| 500  | `#2e7b9e` | accent highlight (light), gradient lit end    |
| 600  | `#1d5e7c` | links and info (light) — 7.1:1 on white       |
| 700  | `#11465f` | link hover (light)                            |
| 750  | `#0b374c` | fill (dark)                                   |
| 800  | `#082e40` | alternate ground (dark)                       |
| 850  | `#05212e` | surface (dark)                                |
| 900  | `#041b26` | BRAND: text and accent (light), ground (dark) |
| 950  | `#020d12` | backdrop (dark)                               |

## Ink (neutrals on the navy's hue)

`$ink-25` `#fbfbfc` through `$ink-900` `#14181a`; see `_brand.scss` for what
each step is for.

## Status

Low-chroma, so a status never shouts over the navy: `-deep` steps carry text
on white (`#2a6b4f`, `#8a5a0c`, `#a53440`), `-lit` steps on the dark ground
(`#86cbab`, `#e4b968`, `#f0959c`), `-wash` steps are the light grounds.

## Contrast

`tst/theme.test.mjs` measures every text token against the page, surface,
alternate surface and fill, in both themes, and every `on-*` colour on its
fill, at WCAG AA (4.5:1). White text is held to AA on every stop of
`--devcontainer-gradient`.
