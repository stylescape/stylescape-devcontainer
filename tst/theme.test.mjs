// =============================================================================
// tst/theme — the token contract
// =============================================================================
//
// Four things can break silently in a token theme, and each has a test here:
//
//   1. A theme block that never wins. The dark values have to reach any
//      element stamped `data-theme="dark"`, not only <html>, or a dark band
//      inside a light page paints with light tokens.
//   2. A one-sided token. A colour set in light and never in dark leaks the
//      light value into every dark band.
//   3. Unreadable text. Every colour pair text is set in is checked against
//      WCAG AA on the page, the surface AND the fill, rather than eyeballed.
//   4. The badge quietly changing. The navy and the white are the brand,
//      and pinning them makes changing them a deliberate act.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { compile, declarationsIn, contrast } from "./helpers.mjs";

const DARK = '[data-theme="dark"]';
const LIGHT = '[data-theme="light"]';

/** Every token that carries real text and therefore has to clear AA. */
const TEXT_TOKENS = [
    "--ss-color-foreground",
    "--ss-color-text",
    "--ss-color-text-secondary",
    "--ss-color-text-muted",
    "--ss-color-accent",
    "--ss-color-link",
    "--ss-color-success",
    "--ss-color-warning",
    "--ss-color-error",
    "--ss-color-info",
];

/** The grounds text actually lands on: page, panel, and a control. */
const GROUNDS = [
    "--ss-color-background",
    "--ss-color-surface",
    "--ss-color-surface-alt",
    "--ss-color-fill",
];

test("tokens/ emits the light identity, the default, unlayered at :root", () => {
    const css = compile("tokens/_index.scss");
    const root = declarationsIn(css, ":root");

    assert.equal(root["--ss-color-background"], "#ffffff", "the logo white");
    assert.equal(root["--ss-color-accent"], "#041b26", "the badge navy");
    assert.equal(root["--devcontainer-navy"], "#041b26");

    // Bare :root leaves color-scheme alone: setting it there repaints every
    // unstyled form control of a consumer that never asked for it.
    assert.equal(root["color-scheme"], undefined);

    // Emitted unlayered: a token inside `@layer` cannot override core's
    // unlayered defaults.
    assert.doesNotMatch(css, /@layer/, "tokens must not be in a layer");
});

test("tokens/ sets Manrope for both voices, and a mono stack", () => {
    const root = declarationsIn(compile("tokens/_index.scss"), ":root");

    // Sass drops the quotes when it interpolates a list; an unquoted family
    // name is still valid CSS, so the stacks are matched without them.
    for (const name of [
        "--ss-font-family-base",
        "--ss-font-family-sans",
        "--ss-font-family-heading",
        "--ss-font-family-display",
    ]) {
        assert.match(root[name], /^"?Manrope"?,/, name);
    }
    assert.match(root["--ss-font-family-mono"], /monospace$/);
});

test("themes/ applies the dark set to ANY stamped element", () => {
    const css = compile("themes/_index.scss");
    const dark = declarationsIn(css, DARK);

    assert.equal(dark["color-scheme"], "dark");
    assert.equal(dark["--ss-color-background"], "#041b26", "the badge");
    assert.equal(dark["--ss-color-text"], "#ffffff", "its white logo");

    // Not `:root[data-theme=dark]`: a <section data-theme="dark"> has to
    // flip too.
    assert.doesNotMatch(css, /:root\[data-theme/);
});

test("data-theme=auto takes the dark set only when the OS prefers dark", () => {
    const css = compile("themes/_index.scss");
    const dark = declarationsIn(css, DARK);
    const auto = declarationsIn(css, '[data-theme="auto"]');
    assert.deepEqual(auto, dark);

    // The only media query wraps `auto`: an unstamped page stays white
    // whatever the OS says.
    const queries = [
        ...css.matchAll(
            /@media \(prefers-color-scheme: dark\)\s*\{([^{}]*)\{/g,
        ),
    ].map((m) => m[1].trim());
    assert.deepEqual(queries, ['[data-theme="auto"]'.replace(/"/g, "")]);
});

test("input boundaries clear 3:1 on every ground (WCAG 1.4.11)", () => {
    for (const t of [
        declarationsIn(compile("tokens/_index.scss"), ":root"),
        declarationsIn(compile("themes/_index.scss"), DARK),
    ]) {
        const edge = t["--ss-color-border-strong"];
        assert.ok(edge, "--ss-color-border-strong is not set");
        for (const ground of GROUNDS) {
            const ratio = contrast(edge, t[ground]);
            assert.ok(
                ratio >= 3,
                `${edge} is ${ratio.toFixed(2)}:1 on ${ground} (${t[ground]})`,
            );
        }
    }
});

test("the light stamp is the :root set, plus color-scheme", () => {
    const root = declarationsIn(compile("tokens/_index.scss"), ":root");
    const light = declarationsIn(compile("themes/_index.scss"), LIGHT);

    assert.equal(light["color-scheme"], "light");
    for (const [name, value] of Object.entries(light)) {
        if (name === "color-scheme") continue;
        assert.equal(value, root[name], `${name} differs from :root`);
    }
});

test("every dark colour token has a light counterpart, and vice versa", () => {
    const light = declarationsIn(compile("tokens/_index.scss"), ":root");
    const dark = declarationsIn(compile("themes/_index.scss"), DARK);
    const themed = (n) => n.startsWith("--ss-color-");

    for (const name of Object.keys(light).filter(themed)) {
        assert.ok(name in dark, `${name} is set in light but never in dark`);
    }
    for (const name of Object.keys(dark).filter(themed)) {
        assert.ok(name in light, `${name} is set in dark but never in light`);
    }
});

test("white text reads on every stop of the brand gradient", () => {
    const root = declarationsIn(compile("tokens/_index.scss"), ":root");
    const stops = root["--devcontainer-gradient"].match(/#[0-9a-f]{6}/gi);
    assert.ok(stops && stops.length >= 2, root["--devcontainer-gradient"]);
    for (const stop of stops) {
        const ratio = contrast("#ffffff", stop);
        assert.ok(ratio >= 4.5, `white on ${stop} is ${ratio.toFixed(2)}:1`);
    }
});

test("the --devcontainer-* brand values are not themed", () => {
    // A badge does not change colour when the page goes dark.
    for (const selector of [DARK, LIGHT]) {
        const t = declarationsIn(compile("themes/_index.scss"), selector);
        for (const name of Object.keys(t)) {
            assert.ok(!name.startsWith("--devcontainer-"), `${name} themed`);
        }
    }
});

for (const [label, file, selector] of [
    ["light", "tokens/_index.scss", ":root"],
    ["dark", "themes/_index.scss", DARK],
]) {
    test(`the ${label} theme meets WCAG AA for text on every ground`, () => {
        const t = declarationsIn(compile(file), selector);

        for (const ground of GROUNDS) {
            const bg = t[ground];
            assert.ok(bg, `${label}: ${ground} is not set`);

            for (const name of TEXT_TOKENS) {
                const ratio = contrast(t[name], bg);
                assert.ok(
                    ratio >= 4.5,
                    `${label}: ${name} (${t[name]}) is ${ratio.toFixed(2)}:1 ` +
                        `on ${ground} (${bg})`,
                );
            }
        }
    });

    test(`the ${label} theme's on-colours read on their fills`, () => {
        const t = declarationsIn(compile(file), selector);
        for (const role of ["accent", "success", "warning", "error", "info"]) {
            const fill = t[`--ss-color-${role}`];
            const ink = t[`--ss-color-on-${role}`];
            const ratio = contrast(ink, fill);
            assert.ok(
                ratio >= 4.5,
                `${label}: on-${role} (${ink}) is ${ratio.toFixed(2)}:1 ` +
                    `on ${role} (${fill})`,
            );
        }
    });

    test(`the ${label} theme's code text reads on the code surface`, () => {
        const t = declarationsIn(compile(file), selector);
        const bg = t["--ss-color-code-bg"];
        for (const name of [
            "--ss-color-code-key",
            "--ss-color-code-foreground",
        ]) {
            const ratio = contrast(t[name], bg);
            assert.ok(
                ratio >= 4.5,
                `${label}: ${name} is ${ratio.toFixed(2)}:1 on the code bg`,
            );
        }
    });
}
