# Theming

## Light is the default

Bare `:root` carries the light set: the badge's navy on white. It does not
set `color-scheme` — at bare `:root` that repaints every unstyled form
control of a consumer that never asked for it.

## A dark page or a dark band

```html
<html data-theme="dark">
    …
</html>
<section data-theme="dark">…</section>
```

`[data-theme="dark"]` is the badge itself: white on `#041b26`. It applies to
any element, so a single band of a light page can be dark; the package root
gives a stamped element (other than `<html>`) its own ground and text
colour. `[data-theme="auto"]` takes the same dark set when the OS prefers
dark, as in stylescape core 0.5; without any attribute the page stays white
whatever the OS says.

## A light band in a dark page

`[data-theme="light"]` stamps the same set as `:root`, plus
`color-scheme: light`. The nearest stamp wins, however they nest.

## Faded colours

Tokens cannot be faded, so `./abstracts` has Sass swatches beside them
(`$navy`, `$white`, `$link`, `$night`), a `fade()` function and a `dark`
mixin that writes a rule's dark side next to its light one:

```scss
@use "pkg:@stylescape/stylescape-devcontainer/abstracts" as *;

.scrim {
    background: fade($white, 0.6);
    @include dark {
        background: fade($night, 0.6);
    }
}
```

## Retuning

Every raw value in `tokens/_brand.scss` is `!default`:

```scss
@use "pkg:@stylescape/stylescape-devcontainer/tokens" with (
    $navy-600: #1a5874
);
```
