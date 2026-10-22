import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { extractExample } from "./extract-example.mjs";

const normalize = (source) => source.replaceAll('"/product.svg"', '"/demos/product.svg"').replaceAll('"/media/', '"/demos/media/').replaceAll('"/documents/', '"/demos/documents/').replaceAll('"/avatars/', '"/demos/avatars/').replace(/"#\/([a-z-]+)"/g, '"/components/$1"').replaceAll('"/components/overview"', '"/docs"').replaceAll('"/components/themes"', '"/docs/theming"');

/** Reuse real, independently mounted Playground compositions; never invent APIs. */
export async function buildAdditionalExamples({ catalog, extendedComponents, program, root, website, output, simplifyExample }) {
  const manifest = {};
  const sources = {};
  const loaders = [];
  const missing = [];
  const destination = path.join(output, "additional");
  await mkdir(destination, { recursive: true });
  for (const entry of catalog) {
    const filename = path.join(root, `apps/playground/src/pages/${entry.family}-page.tsx`);
    const file = program.getSourceFile(filename);
    const manualPrimary = await readFile(path.join(website, `components/docs/examples/${entry.family}.tsx`), "utf8").then(() => true).catch((error) => { if (error.code !== "ENOENT") throw error; return false; });
    const primary = extendedComponents.find((item) => item.family === entry.family)?.selection;
    const candidates = [];
    const parts = [];
    const aliases = [...entry.exports];
    for (const statement of file.statements) if (ts.isImportDeclaration(statement) && statement.moduleSpecifier.text === "@pimolu/react" && statement.importClause?.namedBindings && ts.isNamedImports(statement.importClause.namedBindings)) for (const specifier of statement.importClause.namedBindings.elements) if (entry.exports.includes((specifier.propertyName ?? specifier.name).text)) aliases.push(specifier.name.text);
    const includesFamily = (source) => aliases.some((name) => new RegExp(`<${name}(?:[\\s/>])`).test(source));
    function visit(node) {
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText(file) === "Section") {
        const attrs = Object.fromEntries(node.openingElement.attributes.properties.filter((p) => ts.isJsxAttribute(p) && p.initializer && ts.isStringLiteral(p.initializer)).map((p) => [p.name.text, p.initializer.text]));
        if (attrs.title && !/fullscreen|missing target/i.test(attrs.title)) {
          const selection = { section: attrs.title };
          const duplicate = !manualPrimary && (primary?.section === attrs.title || (primary?.helper && node.getText(file).includes(`<${primary.helper}`)));
          if (!duplicate) {
            const source = normalize(extractExample(program, filename, selection, "DemoExample"));
            if (includesFamily(source)) candidates.push({ title: attrs.title, description: attrs.hint ?? `Explore ${attrs.title.toLowerCase()} with ${entry.title}.`, source, selection });
          }
          // A section can group several genuinely different real-world cards.
          let children = node.children.filter((child) => ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) || ts.isJsxExpression(child));
          if (children.length === 1 && ts.isJsxElement(children[0]) && children[0].openingElement.tagName.getText(file) === "div") children = children[0].children.filter((child) => ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) || ts.isJsxExpression(child));
          if (children.length > 1) children.forEach((child, item) => {
            let title;
            function findTitle(n) { if (ts.isJsxElement(n) && n.openingElement.tagName.getText(file) === "CardTitle") title = n.children.map((c) => ts.isJsxText(c) ? c.text.trim() : "").join(" ").trim(); ts.forEachChild(n, findTitle); }
            findTitle(child);
            if (!title) return;
            const source = normalize(extractExample(program, filename, { section: attrs.title, item }, "DemoExample"));
            if (includesFamily(source)) parts.push({ title, description: `A ${title.toLowerCase()} composition using ${entry.title}.`, source, selection: { section: attrs.title, item } });
          });
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
    // Authored supplements take precedence for families with few independent demos.
    let overrides = [];
    try { overrides = JSON.parse(await readFile(path.join(website, `content/additional/${entry.family}.json`), "utf8")); } catch (error) { if (error.code !== "ENOENT") throw error; }
    const chosen = [];
    for (const override of overrides) {
      const source = normalize(await readFile(path.join(website, "components/docs/additional", override.file), "utf8"));
      chosen.push({ ...override, source });
    }
    for (const candidate of candidates) if (chosen.length < 3) chosen.push(candidate);
    for (const candidate of parts) if (chosen.length < 3 && !chosen.some((item) => item.selection?.section === candidate.selection.section)) chosen.push(candidate);
    // Split a gallery into named compositions if the page has few sections.
    if (chosen.length < 3) for (const candidate of [...chosen]) {
      const siblings = parts.filter((item) => item.selection.section === candidate.selection?.section);
      if (siblings.length > 1) chosen.splice(chosen.indexOf(candidate), 1, ...siblings.slice(0, 4 - chosen.length));
      if (chosen.length >= 3) break;
    }
    if (chosen.length < 3 && parts.length >= 3) chosen.splice(0, chosen.length, ...parts.slice(0, 3));
    if (chosen.length < 3) missing.push({ family: entry.family, count: chosen.length, sections: candidates.map((item) => item.title), parts: parts.map((item) => item.title) });
    manifest[entry.family] = chosen.map((item, index) => {
      const id = `example-${index + 2}`;
      const key = `${entry.family}/${id}`;
      sources[key] = simplifyExample(item.source);
      loaders.push(`  "${key}": dynamic(() => import("./additional/${entry.family}-${id}").then((module) => readyExample(module.DemoExample))),`);
      return { id, title: item.title, description: item.description, origin: item.file ? `apps/website/components/docs/additional/${item.file}` : `apps/playground/src/pages/${entry.family}-page.tsx`, selection: item.selection };
    });
    for (let i = 0; i < chosen.length; i++) await writeFile(path.join(destination, `${entry.family}-example-${i + 2}.tsx`), sources[`${entry.family}/example-${i + 2}`]);
  }
  await writeFile(path.join(output, "additional-examples.json"), JSON.stringify(manifest, null, 2));
  await writeFile(path.join(output, "additional-sources.json"), JSON.stringify(sources, null, 2));
  await writeFile(path.join(output, "additional-loaders.tsx"), `"use client";\nimport dynamic from "next/dynamic";\nimport { readyExample } from "../../components/docs/example-ready";\nexport const additionalExamples = {\n${loaders.join("\n")}\n};\n`);
  if (missing.length) throw new Error(`Additional compositions needed:\n${JSON.stringify(missing, null, 2)}`);
  console.log(`Additional examples: ${Object.keys(sources).length} compositions across ${catalog.length} families.`);
}
