# Tokens

Names follow stylescape core's lexicon (`12-lexicon/_color-tokens.scss`,
`_radius.scss`, `_shadow.scss`, `_typescale.scss`). The theme invents only
`--ss-font-family-heading` (with `--ss-font-weight-heading`,
`--ss-tracking-heading`, `--ss-leading-heading`), which core does not
declare yet, and the `--devcontainer-*` block for values core has no name
for.

## Colour (themed)

Every `--ss-color-*` token is set in both the light set (`:root`,
`[data-theme="light"]`) and the dark set (`[data-theme="dark"]`);
`tst/theme.test.mjs` fails if one side is missing. Groups: surface and
background, text, lines and borders, brand and accent, links and states,
status (success, warning, error, info, each with `-bg`, `-soft`,
`-foreground`, `on-`), code and keyboard, and the shadow colours
`--ss-a-shadow-color{,-heavy}`.

## Shape and type (not themed)

| Token                      | Value                             |
| -------------------------- | --------------------------------- |
| `--ss-radius-xs … -3xl`    | 2, 3, 4, 6, 8, 12, 16px           |
| `--ss-radius-default`      | 4px                               |
| `--ss-radius-full`         | 999px                             |
| `--ss-font-family-base`    | Manrope, then the system stack    |
| `--ss-font-family-heading` | the same stack                    |
| `--ss-font-family-mono`    | `ui-monospace`, SF Mono, Menlo, … |
| `--ss-font-weight-heading` | 700                               |
| `--ss-tracking-heading`    | -0.02em                           |
| `--ss-leading-heading`     | 1.15                              |

## The brand's own

| Token                     | Value                                    |
| ------------------------- | ---------------------------------------- |
| `--devcontainer-navy`     | `#041b26` — the badge                    |
| `--devcontainer-white`    | `#ffffff` — its logo                     |
| `--devcontainer-paper`    | `#f4f5f6` — the alternate section ground |
| `--devcontainer-gradient` | navy-500 → navy-700 → navy-900, 90deg    |

## Legacy aliases

`--color_*` names that core's relocated surfaces still read are aliased to
the `--ss-*` tokens with `var()`, so they follow the dark stamp.
