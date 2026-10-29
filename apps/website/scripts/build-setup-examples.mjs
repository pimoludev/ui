import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { componentSetups, setupExampleId } from "../content/component-setups.ts";

/** Compile trusted, authored modules at build time. Previews never evaluate source strings. */
export async function buildSetupExamples(output) {
  const destination = path.join(output, "setup");
  await mkdir(destination, { recursive: true });
  const manifest = {};
  const sources = {};
  const loaders = [];
  for (const [family, setup] of Object.entries(componentSetups)) {
    manifest[family] = [];
    for (const example of setup.examples) {
      const id = setupExampleId(example.filename);
      const key = `${family}/${id}`;
      if (Object.hasOwn(sources, key)) throw new Error(`Duplicate setup example: ${key}`);
      const ast = ts.createSourceFile(example.filename, example.code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const exported = ast.statements.filter((node) => ts.isFunctionDeclaration(node)
        && node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
      if (ast.parseDiagnostics.length || exported.length !== 1 || !exported[0].name) {
        throw new Error(`Setup example needs one valid exported function: ${key}`);
      }
      const name = exported[0].name.text;
      let adapter = `export { ${name} as SetupExample };`;
      // Only surrounding application wiring is added to these isolated samples.
      if (family === "toast" && example.filename === "app/providers.tsx") {
        adapter = `import { Button as SetupButton, toast as setupToast } from "@pimolu/react";
export function SetupExample() {
  return <${name}><SetupButton onClick={() => setupToast({ title: "Your application Toaster is ready", variant: "success" })}>Show notification</SetupButton></${name}>;
}`;
      } else if (family === "toast" && example.filename === "confirmation-button.tsx") {
        adapter = `import { Toaster as SetupToaster } from "@pimolu/react";
export function SetupExample() { return <><${name} /><SetupToaster position="bottom-right" /></>; }`;
      } else if (exported[0].parameters.some((parameter) => !parameter.questionToken && !parameter.initializer)) {
        throw new Error(`Setup example requires an explicit preview adapter: ${key}`);
      }
      sources[key] = example.code;
      manifest[family].push({ id, filename: example.filename, title: example.title ?? setup.title });
      await writeFile(path.join(destination, `${family}-${id}.tsx`), `${example.code}\n${adapter}\n`);
      loaders.push(`  ${JSON.stringify(key)}: dynamic(() => import("./setup/${family}-${id}").then((module) => readyExample(module.SetupExample))),`);
    }
  }
  await writeFile(path.join(output, "setup-examples.json"), JSON.stringify(manifest, null, 2) + "\n");
  await writeFile(path.join(output, "setup-sources.json"), JSON.stringify(sources, null, 2) + "\n");
  await writeFile(path.join(output, "setup-loaders.tsx"), `"use client";\nimport dynamic from "next/dynamic";\nimport { readyExample } from "../../components/docs/example-ready";\nexport const setupExamples = {\n${loaders.join("\n")}\n};\n`);
  console.log(`Setup examples: ${Object.keys(sources).length} interactive modules across ${Object.keys(manifest).length} references.`);
}
