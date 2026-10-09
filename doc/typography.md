# Typography

## The face

Manrope, the face Stylescape's own documentation is set in, ships with the
package as one variable woff2 (weights 200-800, SIL OFL 1.1) from
`stylescape/doc/assets/font/manrope/`, unchanged.

```ts
import "@stylescape/stylescape-devcontainer/font/fonts.css";
```

## Two voices, one face

| Voice   | Setting                                       | Mixin     |
| ------- | --------------------------------------------- | --------- |
| heading | Manrope 700, -0.02em, leading 1.15, balanced  | `heading` |
| body    | Manrope 400, leading 1.6                      | `body`    |
| code    | the mono stack at 0.9em on the code ground    | `code`    |
| eyebrow | Manrope 600, 0.75rem, tracked capitals, muted | `eyebrow` |

The package root applies `heading` to h1-h6 at zero specificity
(`:where(…)`), unlayered: it beats core's layered rules and loses to any
class a consumer writes. The mixins come from `./base`:

```scss
@use "pkg:@stylescape/stylescape-devcontainer/base" as base;

.headline {
    @include base.heading;
}
```

## Mono

A devcontainer's pages are mostly commands, so `--ss-font-family-mono` is a
system stack (`ui-monospace`, SF Mono, Menlo, Consolas) rather than a
shipped face: it is the one the reader's terminal already uses.
