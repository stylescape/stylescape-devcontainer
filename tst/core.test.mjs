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
import { compile, declarationsIn } from "./helpers.mjs";

const css = compile("index.scss");

test("the scapepress parity layer is not in the package root", () => {
    assert.ok(
        !css.includes(".ss-c-card-item__arrow"),
        "parity selectors are back in the `.` entry",
    );
});

test("the theme reaches core: tokens come after core's defaults", () => {
    // Core's own defaults are emitted at `:root` too; source order is the
    // whole mechanism, so the last `:root` value must be the theme's.
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
        ':is([data-theme="dark"], [data-theme="light"]):not(:root)',
    );
    assert.equal(band["background-color"], "var(--ss-color-background)");
    assert.equal(band.color, "var(--ss-color-text)");
});
