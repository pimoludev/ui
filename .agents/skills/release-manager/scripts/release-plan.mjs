#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const json = process.argv.includes("--json");

const packagePaths = [
  "packages/design-tokens",
  "packages/themes",
  "packages/core",
  "registry/react",
  "packages/web-styles",
  "apps/website",
];

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function readJson(file) {
  return JSON.parse(readFileSync(path.join(root, file), "utf8"));
}

function bump(version, level) {
  const [core] = version.split("-");
  const [major, minor, patch] = core.split(".").map(Number);
  if (level === "major") return `${major + 1}.0.0`;
  if (level === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function changeLevel(commits) {
  if (commits.some((commit) => /^[a-z]+(?:\([^)]*\))?!:/.test(commit) || /BREAKING CHANGE:/i.test(commit))) {
    return "major";
  }
  if (commits.some((commit) => /^feat(?:\([^)]*\))?:/.test(commit))) return "minor";
  if (commits.some((commit) => /^(fix|perf)(?:\([^)]*\))?:/.test(commit))) return "patch";
  return "patch";
}

function nextVersion({ lastTag, commits, qaIncomplete }) {
  if (!lastTag) {
    const base = "0.1.0";
    return {
      base,
      version: qaIncomplete ? `${base}-beta.1` : base,
      stage: qaIncomplete ? "preview" : "stable",
      reason: "first release; no v* tag exists",
    };
  }

  const lastVersion = lastTag.replace(/^v/, "");
  if (lastVersion.includes("-")) {
    const base = lastVersion.split("-")[0];
    return {
      base,
      version: qaIncomplete ? `${base}-beta.${Number(lastVersion.match(/-beta\.(\d+)$/)?.[1] ?? 0) + 1}` : base,
      stage: qaIncomplete ? "preview" : "stable",
      reason: "previous release is a beta; finish the current base version",
    };
  }

  const level = changeLevel(commits);
  const base = bump(lastVersion, level);
  return {
    base,
    version: qaIncomplete ? `${base}-beta.1` : base,
    stage: qaIncomplete ? "preview" : "stable",
    reason: `${level} change since ${lastTag}`,
  };
}

const dirty = git(["status", "--porcelain"]).length > 0;
const tags = git(["tag", "--list", "v*", "--sort=-v:refname"]).split("\n").filter(Boolean);
const lastTag = tags[0] ?? null;
const range = lastTag ? `${lastTag}..HEAD` : "first release (no tag)";
const commits = git(["log", "--format=%s", ...(lastTag ? [`${lastTag}..HEAD`] : [])])
  .split("\n")
  .filter(Boolean);

const qaPath = "docs/ai/QUALITY_AUDIT.md";
const qa = existsSync(path.join(root, qaPath)) ? readFileSync(path.join(root, qaPath), "utf8") : "";
const qaIncomplete = /does not mark[\s\S]{0,80}complete|in progress|still need|remaining|next work, in order/i.test(qa);
const plan = nextVersion({ lastTag, commits, qaIncomplete });
const tag = `v${plan.version}`;

const packages = packagePaths.map((packagePath) => {
  const manifest = readJson(path.join(packagePath, "package.json"));
  return {
    path: packagePath,
    name: manifest.name,
    current: manifest.version,
    private: manifest.private === true,
  };
});
const site = packages.find((entry) => entry.name === "@pimolu/website");
const packageVersions = new Set(packages.filter((entry) => entry.name !== "@pimolu/website").map((entry) => entry.current));
const synchronized = packageVersions.size === 1 && packages.filter((entry) => entry.name !== "@pimolu/website").every((entry) => entry.current === plan.version) && site?.current === plan.version;

const result = {
  range,
  head: git(["rev-parse", "--short", "HEAD"]),
  branch: git(["branch", "--show-current"]),
  dirty,
  lastTag,
  commits: commits.length,
  changeLevel: changeLevel(commits),
  qaIncomplete,
  stage: plan.stage,
  base: plan.base,
  version: plan.version,
  tag,
  reason: plan.reason,
  packages,
  synchronized,
  publish: plan.stage === "stable" ? "npm public release possible after pack checks" : "preview only; npm publish is not recommended",
};

if (json) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else {
  console.log("PIMOLU RELEASE PLAN");
  console.log(`- branch: ${result.branch} @ ${result.head}`);
  console.log(`- range: ${result.range} (${result.commits} commit(s))`);
  console.log(`- last tag: ${lastTag ?? "none"}`);
  console.log(`- change level: ${result.changeLevel}`);
  console.log(`- quality audit complete: ${qaIncomplete ? "no" : "yes"}`);
  console.log(`- working tree clean: ${dirty ? "no" : "yes"}`);
  console.log(`- decision: ${result.version} (${result.stage})`);
  console.log(`- reason: ${result.reason}`);
  console.log(`- tag: ${result.tag}`);
  console.log("- packages:");
  for (const entry of packages) {
    console.log(`  - ${entry.name}: ${entry.current}${entry.private ? " (private)" : ""}`);
  }
  console.log(`- versions synchronized: ${synchronized ? "yes" : "no"}`);
  console.log(`- publish: ${result.publish}`);
  if (dirty) console.log("- block: commit or stash pending changes before tagging");
  if (result.stage === "preview") console.log("- block: full visual/accessibility gates are still open; do not publish a stable npm release");
}

process.exitCode = dirty ? 2 : 0;
