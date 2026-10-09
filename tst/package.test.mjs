// =============================================================================
// tst/package — the published surface, and the container beside it
// =============================================================================
//
// An `exports` entry pointing at a file that isn't there fails only for the
// consumer, at install time, in a repo that isn't this one. And this repo is
// a devcontainer first: the theme must not have pushed its files aside.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const pkg = JSON.parse(read("package.json"));
const exists = (path) => existsSync(fileURLToPath(new URL(path, root)));

/** Every concrete (non-pattern) target in the exports map. */
function targets(node, out = []) {
    if (typeof node === "string") {
        if (!node.includes("*")) out.push(node);
    } else if (node && typeof node === "object") {
        for (const v of Object.values(node)) targets(v, out);
    }
    return out;
}

test("every export resolves to a file on disk", () => {
    for (const target of new Set(targets(pkg.exports))) {
        // dist/ is build output; it is listed in `files` but not committed.
        if (target.startsWith("./dist/")) continue;
        assert.ok(exists(target), `exports → ${target} does not exist`);
    }
});

test("the version matches VERSION, CITATION.cff and codemeta.json", () => {
    assert.equal(pkg.version, read("VERSION").trim());
    assert.match(
        read("CITATION.cff"),
        new RegExp(`^version: ${pkg.version}$`, "m"),
    );
    assert.equal(JSON.parse(read("codemeta.json")).version, pkg.version);
});

test("the exported stylelint config guards the brand's namespaces", async () => {
    const { default: config } = await import("../stylelint.config.mjs");

    assert.ok(config.rules["color-no-hex"], "a hex in consumer code");
    const [names] = config.rules["property-disallowed-list"];
    assert.deepEqual(names, ["/^--ss-/", "/^--devcontainer-/"]);
});

test("the self-hosted font resolves, ships, and carries its licence", () => {
    // `fonts.css` is plain CSS with relative url()s: a renamed woff2 is a
    // 404 in the consumer's network tab and nothing at all here.
    const css = read("src/font/fonts.css");
    const urls = [...css.matchAll(/url\("\.\/([^"]+)"\)/g)].map((m) => m[1]);
    assert.equal(urls.length, 1, `declared: ${urls.join(", ")}`);
    for (const url of urls) {
        assert.ok(exists(`src/font/${url}`), `fonts.css -> ${url} is missing`);
    }

    const families = [...css.matchAll(/font-family: "([^"]+)"/g)].map(
        (m) => m[1],
    );
    assert.deepEqual([...new Set(families)], ["Manrope"]);

    assert.ok(exists("src/font/manrope/OFL.txt"), "Manrope's OFL");
    assert.ok(pkg.exports["./font/*"], "consumers import ./font/fonts.css");
    assert.ok(
        pkg.files.some((f) => f.startsWith("src/font/")),
        "the font files have to be in the tarball",
    );
});

test("the preload list names files that exist", () => {
    const scss = read("src/scss/base/_fonts.scss");
    const list = scss.match(/\$preload: \(([^)]*)\)/)[1];
    for (const [, file] of list.matchAll(/"([^"]+)"/g)) {
        assert.ok(exists(`src/font/${file}`), `$preload -> ${file}`);
    }
});

test("the devcontainer files are still where Docker looks for them", () => {
    for (const path of [
        ".devcontainer/devcontainer.json",
        ".devcontainer/Dockerfile",
        ".devcontainer/docker-compose.yml",
        "src/.devcontainer/devcontainer.json",
        "src/devcontainer/Dockerfile",
        "bin/docker-bake.hcl",
        "bin/docker-compose.yml",
    ]) {
        assert.ok(exists(path), `${path} is gone`);
    }
    // The bake file builds `./src/${IMAGE_NAME}/`; the theme's own folders
    // under src/ must not shadow an image name.
    assert.match(read("bin/docker-bake.hcl"), /\.\/src\/\$\{IMAGE_NAME\}\//);
});

test("the image context does not ship the theme's toolchain", () => {
    // Docker builds src/devcontainer/ as its context; the theme lives in
    // src/scss, src/font and src/ts beside it and never inside it.
    for (const path of [
        "src/devcontainer/package-lock.json",
        "src/devcontainer/node_modules",
        "src/devcontainer/scss",
    ]) {
        assert.ok(!exists(path), `${path} leaked into the image context`);
    }
});
