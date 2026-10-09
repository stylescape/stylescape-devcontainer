# Usage

## Install

```ini
# .npmrc
@stylescape:registry=https://npm.pkg.github.com
```

```sh
npm install -D @stylescape/stylescape-devcontainer stylescape sass
```

Or straight from the repository:

```json
"@stylescape/stylescape-devcontainer": "github:stylescape/stylescape-devcontainer#semver:^0.1.0"
```

## The entries

| Entry         | Emits                                                 | Needs core |
| ------------- | ----------------------------------------------------- | ---------- |
| `.`           | core, the tokens, both stamps, the heading voice      | yes        |
| `./tokens`    | the light token set at `:root`                        | no         |
| `./themes`    | `[data-theme="dark"]` and `[data-theme="light"]` sets | no         |
| `./abstracts` | nothing (Sass names only)                             | no         |
| `./base`      | nothing (mixins only)                                 | no         |

Vite needs the Sass package importer for `pkg:` URLs:

```ts
import { NodePackageImporter } from "sass";
export default {
    css: {
        preprocessorOptions: {
            scss: { importers: [new NodePackageImporter()] },
        },
    },
};
```

A site that already loads core can take the parts instead of the root:

```scss
@use "pkg:stylescape/scss";
@use "pkg:@stylescape/stylescape-devcontainer/tokens";
@use "pkg:@stylescape/stylescape-devcontainer/themes";
```

## Fonts

```ts
import "@stylescape/stylescape-devcontainer/font/fonts.css";
```

Preload `manrope/manrope-variable.woff2` (`$preload` in `base/_fonts.scss`)
if the first paint matters.

## Linting a consumer

```js
// stylelint.config.mjs
import theme from "@stylescape/stylescape-devcontainer/stylelint";
export default { ...theme };
```

## Building

`npm run build` writes `dist/css/ss.css` and `ss.min.css`, the compiled
root entry, for a consumer without Sass. `npm test` checks the token
contract; `npm run check` runs types, lint, formatting and tests.
