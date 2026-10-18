/*
 * Pimolu UI — Git hooks setup
 *
 * Points this clone's local `core.hooksPath` at the versioned `.githooks/`
 * directory so pre-commit / pre-push checks run without adding a dependency
 * (no husky). Runs automatically from the `prepare` script on `pnpm install`.
 *
 * Safe by design: if git is unavailable or this is not a git work tree, it
 * prints a notice and exits without failing the install.
 */

import { execFileSync } from "node:child_process";

function run(args) {
  return execFileSync("git", args, {
    stdio: ["ignore", "pipe", "ignore"],
  })
    .toString()
    .trim();
}

try {
  if (run(["rev-parse", "--is-inside-work-tree"]) !== "true") {
    console.log("[pimolu] not a git work tree — skipping hook setup.");
    process.exit(0);
  }

  execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
    stdio: ["ignore", "ignore", "inherit"],
  });

  console.log("[pimolu] git hooks enabled (.githooks).");
} catch {
  console.log("[pimolu] git unavailable — skipping hook setup.");
}
