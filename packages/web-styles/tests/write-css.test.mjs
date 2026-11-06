import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rename, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeCss } from "../scripts/write-css.mjs";

test("CSS replacement retries a transient Windows lock without truncating the old file", async () => {
  const directory = await mkdtemp(join(tmpdir(), "pimolu-css-"));
  const file = join(directory, "badge.css");
  try {
    await writeFile(file, "old stylesheet");
    let attempts = 0;
    await writeCss(file, Buffer.from("new stylesheet"), {
      delay: async () => {},
      rename: async (from, to) => {
        assert.equal(await readFile(file, "utf8"), "old stylesheet");
        if (++attempts < 3) throw Object.assign(new Error("locked"), { code: "EPERM" });
        await rename(from, to);
      },
    });
    assert.equal(attempts, 3);
    assert.equal(await readFile(file, "utf8"), "new stylesheet");
    assert.deepEqual(await readdir(directory), ["badge.css"]);
    await writeCss(file, Buffer.from("new stylesheet"), {
      rename: async () => assert.fail("Unchanged CSS must not be replaced"),
    });
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test("permanent CSS locks fail after bounded retries and keep the previous output", async () => {
  const directory = await mkdtemp(join(tmpdir(), "pimolu-css-"));
  const file = join(directory, "badge.css");
  try {
    await writeFile(file, "old stylesheet");
    let attempts = 0;
    await assert.rejects(writeCss(file, Buffer.from("new stylesheet"), {
      delay: async () => {},
      rename: async () => { attempts++; throw Object.assign(new Error("locked"), { code: "EBUSY" }); },
    }), /previous stylesheet is preserved/);
    assert.equal(attempts, 8);
    assert.equal(await readFile(file, "utf8"), "old stylesheet");
    assert.deepEqual(await readdir(directory), ["badge.css"]);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
