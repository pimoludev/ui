#!/usr/bin/env node
import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = process.cwd();
const json = process.argv.includes("--json");
const gitOptions = {
  cwd: root,
  encoding: "utf8",
  windowsHide: true,
  maxBuffer: 4 * 1024 * 1024,
};

const packagePaths = [
  "packages/design-tokens",
  "packages/themes",
  "packages/core",
  "registry/react",
  "packages/web-styles",
  "apps/website",
];

async function git(args) {
  const { stdout } = await run("git", args, gitOptions);
  return stdout.trim();
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

function nextVersion({ lastTag, qaIncomplete, level }) {
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
  const [base, prerelease] = lastVersion.split("-", 2);
  if (prerelease) {
    // beta.3.1 is a sub-preview of beta.3; the next preview is beta.4, never beta.1.
    const beta = prerelease.match(/^beta\.(\d+)(?:\.\d+)*$/);
    const nextBeta = beta ? Number(beta[1]) + 1 : 1;
    return {
      base,
      version: qaIncomplete ? `${base}-beta.${nextBeta}` : base,
      stage: qaIncomplete ? "preview" : "stable",
      reason: "previous release is a beta; finish the current base version",
    };
  }

  const nextBase = bump(lastVersion, level);
  return {
    base: nextBase,
    version: qaIncomplete ? `${nextBase}-beta.1` : nextBase,
    stage: qaIncomplete ? "preview" : "stable",
    reason: `${level} change since ${lastTag}`,
  };
}

/** One status call also supplies the branch and commit, avoiding extra git processes. */
function parseStatus(output) {
  const lines = output.split(/\r?\n/).filter(Boolean);
  const branchLine = lines.find((line) => line.startsWith("# branch.head "));
  const oidLine = lines.find((line) => line.startsWith("# branch.oid "));
  const oid = oidLine?.slice("# branch.oid ".length) ?? "";
  return {
    dirty: lines.some((line) => !line.startsWith("#")),
    branch: branchLine?.slice("# branch.head ".length) ?? "",
    head: oid && !oid.startsWith("(") ? oid.slice(0, 7) : "unknown",
  };
}

const [status, tagOutput] = await Promise.all([
  git(["status", "--porcelain=v2", "--branch"]),
  git(["tag", "--list", "v*", "--sort=-v:refname"]),
]);
const { dirty, branch, head } = parseStatus(status);
const tags = tagOutput.split(/\r?\n/).filter(Boolean);
const lastTag = tags[0] ?? null;
const range = lastTag ? `${lastTag}..HEAD` : "first release (no tag)";
const commitOutput = await git([
  "log",
  "--format=%s",
  ...(lastTag ? [`${lastTag}..HEAD`] : []),
]);
const commits = commitOutput.split(/\r?\n/).filter(Boolean);
const level = changeLevel(commits);

const qaPath = "docs/ai/QUALITY_AUDIT.md";
const qa = existsSync(path.join(root, qaPath)) ? readFileSync(path.join(root, qaPath), "utf8") : "";
const qaIncomplete = /does not mark[\s\S]{0,80}complete|in progress|still need|remaining|next work, in order/i.test(qa);
const plan = nextVersion({ lastTag, qaIncomplete, level });
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
const packageVersions = new Set(
  packages.filter((entry) => entry.name !== "@pimolu/website").map((entry) => entry.current)
);
const synchronized =
  packageVersions.size === 1 &&
  packages
    .filter((entry) => entry.name !== "@pimolu/website")
    .every((entry) => entry.current === plan.version) &&
  site?.current === plan.version;

const result = {
  range,
  head,
  branch,
  dirty,
  lastTag,
  commits: commits.length,
  changeLevel: level,
  qaIncomplete,
  stage: plan.stage,
  base: plan.base,
  version: plan.version,
  tag,
  reason: plan.reason,
  packages,
  synchronized,
  publish:
    plan.stage === "stable"
      ? "npm public release possible after pack checks"
      : "preview only; npm publish is not recommended",
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
  if (result.stage === "preview") {
    console.log("- block: full visual/accessibility gates are still open; do not publish a stable npm release");
  }
}

process.exitCode = dirty ? 2 : 0;
