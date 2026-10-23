import fs from "node:fs";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const directory = path.join(root, "packages/web-styles/src");
const files = fs.readdirSync(directory).filter(name => name.endsWith(".css"));
const entries = files.flatMap(file => {
  const css = fs.readFileSync(path.join(directory, file), "utf8");
  return [...css.matchAll(/\b(animation|transition|will-change)\s*:\s*([^;{}]+);/g)].map(match => ({
    file, line: css.slice(0, match.index).split("\n").length,
    kind: match[1], value: match[2].replace(/\s+/g, " ").trim(),
    layout: match[1] === "transition" && /\b(all|width|height|left|right|top|bottom|margin|padding)\b/.test(match[2]),
  }));
});
console.log(JSON.stringify({ stylesheets: files.length, declarations: entries.length,
  missingReducedMotion: files.filter(file => { const css=fs.readFileSync(path.join(directory,file),"utf8"); return /\b(?:transition|animation)\s*:/.test(css) && !css.includes("prefers-reduced-motion"); }),
  layoutTransitions: entries.filter(entry => entry.layout),
  persistentHints: entries.filter(entry => entry.kind === "will-change"), entries }, null, 2));
