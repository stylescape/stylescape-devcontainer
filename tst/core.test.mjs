// =============================================================================
// tst/core — the package root, on top of stylescape core
// =============================================================================
//
// The root entry is core, then the tokens, then the themes, then the heading
// voice. Each step can be undone by an innocent edit to core or to
// `index.scss`, and none of them fails loudly in a browser: the page just
// looks a little off.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { compile, declarationsIn } from "./helpers.mjs";

const fixture = JSON.parse(
    readFileSync(new URL("./fixtures/tokens-0.1.0.json", import.meta.url)),
);

const css = compile("index.scss");

test("the scapepress parity layer is not in the package root", () => {
    assert.ok(
        !css.includes(".ss-c-card-item__arrow"),
        "parity selectors are back in the `.` entry",
    );
});

test("core 0.5's 0.3 class-name layer is not in the package root", () => {
    // Core 0.4 had no rules for the unprefixed 0.3 names; 0.5 styles them in
    // `@layer ss.compat` unless `$v03-compat: false`.
    for (const name of ["button", "card", "badge", "frame_main"]) {
        assert.doesNotMatch(
            css,
            new RegExp(`(^|[\\s,}])\\.${name}[\\s,:{.\\[]`, "m"),
            `.${name} is styled`,
        );
    }
});

test("the theme reaches core: tokens come after core's defaults", () => {
    // Core 0.5 declares its light defaults on `:root, [data-theme=light]`
    // inside `@layer ss.lexicon`; the theme's block is unlayered and later,
    // so the `:root` value must be the theme's.
    const root = declarationsIn(css, ":root");
    assert.equal(root["--ss-color-background"], "#ffffff");
    assert.equal(root["--ss-color-accent"], "#041b26");
    assert.equal(root["--ss-color-text"], "#041b26");
});

test("headings take the heading voice, at zero specificity", () => {
    const h = declarationsIn(css, ":where(h1, h2, h3, h4, h5, h6)");
    assert.equal(h["font-family"], "var(--ss-font-family-heading)");
    assert.equal(h["font-weight"], "var(--ss-font-weight-heading)");
    assert.equal(h["letter-spacing"], "var(--ss-tracking-heading)");
});

test("a stamped band paints its own ground", () => {
    const band = declarationsIn(
        css,
        ':is([data-theme="dark"], [data-theme="light"], [data-theme="auto"]):not(:root)',
    );
    assert.equal(band["background-color"], "var(--ss-color-background)");
    assert.equal(band.color, "var(--ss-color-text)");
});

test("the build renders every 0.1.0 token value (core 0.4.1 parity)", () => {
    // The theme's tokens, light and dark, as the 0.1.0 build on core 0.4.1
    // rendered them. Core 0.5 re-tuned its own defaults (status hues,
    // muted, line-secondary, ...); the theme sets every one of those, so
    // none of core's changes reaches a page built on it.
    const root = declarationsIn(css, ":root");
    const dark = declarationsIn(css, '[data-theme="dark"]');
    for (const [name, value] of Object.entries(fixture.light)) {
        assert.equal(root[name], value, `light ${name}`);
    }
    for (const [name, value] of Object.entries(fixture.dark)) {
        assert.equal(dark[name], value, `dark ${name}`);
    }
});
