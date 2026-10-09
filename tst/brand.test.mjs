// =============================================================================
// tst/brand — every BRAND swatch is a colour the README badges are drawn in
// =============================================================================
//
// `tokens/_brand.scss` marks the steps it took from the badges with `BRAND`.
// The badges are the shields.io row at the top of README.md, and their
// colours are in their URLs (`labelColor=%23041B26`, `logoColor=%23FFFFFF`).
// If the badges are redrawn in a new navy and the palette is not, or a
// swatch is retuned and keeps its BRAND mark, this goes red.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

/** `#FFF` → `#ffffff`, lower case, so the two files compare as written. */
const expand = (hex) => {
    const h = hex.toLowerCase().replace("#", "");
    return `#${h.length === 3 ? [...h].map((c) => c + c).join("") : h}`;
};

const badges = new Set(
    [
        ...read("README.md").matchAll(
            /(?:labelColor|logoColor|color)=%23([0-9a-f]{6}|[0-9a-f]{3})\b/gi,
        ),
    ].map((m) => expand(m[1])),
);

const marked = [
    ...read("src/scss/tokens/_brand.scss").matchAll(
        /^\$([\w-]+):\s*(#[0-9a-f]{3,6}) !default;\s*\/\/ BRAND/gim,
    ),
].map((m) => ({ name: m[1], hex: expand(m[2]) }));

test("the README badges still declare their colours where this reads them", () => {
    assert.ok(badges.has("#041b26"), `found ${[...badges]} in README.md`);
    assert.ok(badges.has("#ffffff"), `found ${[...badges]} in README.md`);
});

test("there is at least a navy and a white marked BRAND", () => {
    const names = marked.map((m) => m.name);
    assert.ok(names.includes("navy-900"), names.join(", "));
    assert.ok(names.includes("white"), names.join(", "));
});

for (const { name, hex } of marked) {
    test(`$${name} (${hex}) is drawn on the badges`, () => {
        assert.ok(badges.has(hex), `README.md has ${[...badges].join(", ")}`);
    });
}
