#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const packages = [
  {
    path: "packages/design-tokens",
    required: ["dist/tokens.json", "dist/tokens.css"],
  },
  {
    path: "packages/themes",
    required: ["dist/styles.css", "dist/presets.js", "dist/visual.css", "style-presets.css"],
  },
  {
    path: "packages/core",
    required: ["dist/index.js", "dist/index.d.ts"],
  },
  {
    path: "registry/react",
    required: ["dist/index.js", "dist/index.d.ts"],
  },
  {
    path: "packages/web-styles",
    required: ["dist/pimolu.css", "dist/pimolu.min.css"],
  },
];

function readJson(file) {
  return JSON.parse(readFileSync(path.join(root, file), "utf8"));
}

function runPack(cwd) {
  const output = execSync("npm pack --dry-run --json", {
    cwd: path.join(root, cwd),
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const start = output.search(/\[\s*\{\s*"id"/);
  if (start < 0) throw new Error(`Could not parse npm pack output for ${cwd}`);
  return JSON.parse(output.slice(start))[0];
}

const rootManifest = readJson("package.json");
const siteManifest = readJson("apps/website/package.json");
const publishable = packages.map((entry) => readJson(path.join(entry.path, "package.json")));
const versions = new Set(publishable.map((entry) => entry.version));
const version = publishable[0]?.version;
const failures = [];

if (versions.size !== 1) failures.push(`Package versions differ: ${[...versions].join(", ")}`);
if (siteManifest.version !== version) failures.push(`Website version ${siteManifest.version} != ${version}`);
if (rootManifest.version !== version) failures.push(`Root version ${rootManifest.version} != ${version}`);

for (const entry of packages) {
  const manifest = readJson(path.join(entry.path, "package.json"));
  const label = manifest.name;
  if (manifest.private) failures.push(`${label} is still private`);
  for (const [dependency, spec] of Object.entries(manifest.dependencies ?? {})) {
    if (dependency.startsWith("@pimolu/") && spec !== version) {
      failures.push(`${label} dependency ${dependency} is ${spec}, expected ${version}`);
    }
  }
  for (const file of entry.required) {
    if (!existsSync(path.join(root, entry.path, file))) failures.push(`${label} is missing ${file}`);
  }

  try {
    const packed = runPack(entry.path);
    const files = packed.files.map((file) => file.path);
    if (packed.version !== version) failures.push(`${label} packed ${packed.version}, expected ${version}`);
    for (const file of entry.required) {
      if (!files.includes(file)) failures.push(`${label} tarball does not include ${file}`);
    }
    if (/^(design-tokens|core|react|web-styles)$/.test(entry.path.split("/").pop() ?? "")) {
      const tests = files.filter((file) => /\.(test|spec)\.[jt]sx?$/.test(file));
      if (tests.length) failures.push(`${label} ships test files: ${tests.slice(0, 3).join(", ")}`);
    }
    console.log(
      `- ${label}@${packed.version}: ${packed.entryCount} files, ${packed.size} B packed, ${packed.unpackedSize} B unpacked`
    );
  } catch (error) {
    failures.push(`${label} pack failed: ${error.message}`);
  }
}

console.log(`\nPACK CHECK ${failures.length ? "FAILED" : "OK"} (version ${version})`);
if (failures.length) {
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Every publishable package has the expected version, entry points and contents.");
  console.log("No npm publish was performed.");
}
