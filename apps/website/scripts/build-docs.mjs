import { readFile, writeFile, mkdir, readdir, cp } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { components, guides, docNavigation } from "../content/docs.ts";
import { extendedComponents } from "../content/extended-components.ts";
import { extractExample } from "./extract-example.mjs";
import { buildAdditionalExamples } from "./build-additional-examples.mjs";
import { pimoluPresets } from "@pimolu/themes/presets";

const website = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(website, "../..");
const output = path.join(website, "content/generated");
const providerPath = path.join(root, "registry/react/provider/pimolu-provider.tsx");
const provider = ts.createSourceFile(providerPath, await readFile(providerPath, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function unionValues(name) {
  const declaration = provider.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === name);
  if (!declaration || !ts.isUnionTypeNode(declaration.type)) throw new Error(`Missing provider axis ${name}`);
  return declaration.type.types.map((type) => { if (!ts.isLiteralTypeNode(type) || !ts.isStringLiteral(type.literal)) throw new Error(`Non-literal axis ${name}`); return type.literal.text; });
}
const previewOptions = { presets: ["default", ...Object.keys(pimoluPresets)], radii: unionValues("PimoluRadius"), densities: unionValues("PimoluDensity") };
const registryPath = path.join(root, "registry/react/index.ts");
const registry = ts.createSourceFile(registryPath, await readFile(registryPath, "utf8"), ts.ScriptTarget.Latest, true);
const exportedFamilies = new Map();
const publicTypes = new Set();
for (const declaration of registry.statements) {
  if (!ts.isExportDeclaration(declaration) || !declaration.moduleSpecifier || !declaration.exportClause || !ts.isNamedExports(declaration.exportClause)) continue;
  const family = declaration.moduleSpecifier.text.split("/")[1];
  const names = declaration.exportClause.elements;
  names.forEach((name) => publicTypes.add((name.propertyName ?? name.name).text));
  if (declaration.isTypeOnly) continue;
  const values = names.filter((name) => !name.isTypeOnly).map((name) => name.name.text);
  exportedFamilies.set(family, [...(exportedFamilies.get(family) ?? []), ...values]);
}
const routerPath = path.join(root, "apps/playground/src/router.ts");
const router = ts.createSourceFile(routerPath, await readFile(routerPath, "utf8"), ts.ScriptTarget.Latest, true);
const inventory = await readFile(path.join(root, "docs/ai/COMPONENT_INVENTORY.md"), "utf8");
const catalog = [];
function readPages(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const data = Object.fromEntries(node.properties.filter((prop) => ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.initializer)).map((prop) => [prop.name.getText(router), prop.initializer.text]));
    if (data.id && data.label && data.group && !["overview", "design-lab"].includes(data.id)) {
      const exports = [...new Set(exportedFamilies.get(data.id) ?? [])];
      if (!exports.length) throw new Error(`Playground family has no public export: ${data.id}`);
      const documented = components.find((component) => component.family === data.id);
      if (!documented) throw new Error(`Add an authored website guide/example for the new family ${data.id}`);
      const role = inventory.split("\n").find((line) => line.includes(`\`registry/react/${data.id}/\``))?.split("|")[3]?.trim();
      catalog.push({ family: data.id, title: data.label, group: data.group, description: documented?.description ?? role ?? `${data.label} primitives for ${data.group.toLowerCase()}.`, exports, source: `registry/react/${data.id}`, stylesheet: `packages/web-styles/src/${data.id}.css`, documented: Boolean(documented), href: `/components/${data.id}` });
    }
  }
  ts.forEachChild(node, readPages);
}
readPages(router);
if (new Set(catalog.map((entry) => entry.family)).size !== catalog.length) throw new Error("Duplicate catalog family");
const sourceFiles = [];
for (const component of catalog) {
  const directory = path.join(root, "registry/react", component.family);
  for (const name of await readdir(directory)) {
    if (/\.(tsx?|mts)$/.test(name) && !name.includes(".test.")) sourceFiles.push(path.join(directory, name));
  }
}
const demoFiles = catalog.map((entry) => path.join(root, `apps/playground/src/pages/${entry.family}-page.tsx`));
const demoProgram = ts.createProgram(demoFiles, { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX, strict: true });
const demoOutput = path.join(output, "demos");
await mkdir(demoOutput, { recursive: true });
await buildAdditionalExamples({ catalog, extendedComponents, program: demoProgram, root, website, output });
const extendedSources = new Map();
for (const entry of extendedComponents) {
  const filename = path.join(root, `apps/playground/src/pages/${entry.family}-page.tsx`);
  const source = (await readFile(path.join(website, `components/docs/examples/${entry.family}.tsx`), "utf8").catch((error) => { if (error.code !== "ENOENT") throw error; return null; })) ?? extractExample(demoProgram, filename, entry.selection, "DemoExample").replaceAll('"/product.svg"', '"/demos/product.svg"').replaceAll('"/media/', '"/demos/media/').replaceAll('"/documents/', '"/demos/documents/').replaceAll('"/avatars/', '"/demos/avatars/').replace(/"#\/([a-z-]+)"/g, '"/components/$1"').replaceAll('"/components/overview"', '"/docs"');
  extendedSources.set(entry.family, source);
  await writeFile(path.join(demoOutput, `${entry.family}.tsx`), source);
}
const loaders = extendedComponents.map(({ family }) => `  "${family}": dynamic(() => import("./demos/${family}").then((module) => readyExample(module.DemoExample))),`).join("\n");
await writeFile(path.join(output, "example-loaders.tsx"), `"use client";\nimport dynamic from "next/dynamic";\nimport { readyExample } from "../../components/docs/example-ready";\nexport const extendedExamples = {\n${loaders}\n};\n`);
// Only local demo assets already present in the repository are copied.
for (const asset of ["product.svg", "avatars", "documents", "media"]) await cp(path.join(root, "apps/playground/public", asset), path.join(website, "public/demos", asset), { recursive: true });
const config = ts.readConfigFile(path.join(website, "tsconfig.json"), ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, website);
const program = ts.createProgram(sourceFiles, parsed.options);
const checker = program.getTypeChecker();
const nativeProps = new Set(["children", "className", "style", "disabled", "required", "name", "type", "value", "defaultValue", "onChange", "onClick", "aria-label"]);
const api = {};
const catalogApi = {};
const examples = {};
const index = [];
const descriptions = {
  variant: "Variant exposed by this component.", appearance: "Visual treatment of the control or surface.",
  size: "Component size.", radius: "Corner-radius treatment.",
  loading: "Show the busy state and prevent activation.", fullWidth: "Use the available width of the parent.",
  startIcon: "Decorative content before the label or input.", endIcon: "Decorative content after the label or input.",
  iconOnly: "Render an icon-only action. Provide an accessible name with aria-label.",
  helperText: "Supporting text below the field.", errorMessage: "Error feedback replacing helper text and marking the field invalid.",
  invalid: "Explicit invalid state.", as: "Underlying element or component.",
  label: "Visible label associated with the control.",
};

function literal(node) {
  return node && (ts.isStringLiteral(node) || ts.isNumericLiteral(node) || ts.isArrayLiteralExpression(node) || node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword || node.kind === ts.SyntaxKind.NullKeyword);
}

for (const component of catalog) {
  const prefix = path.join(root, "registry/react", component.family).replaceAll("\\", "/") + "/";
  const files = program.getSourceFiles().filter((file) => file.fileName.replaceAll("\\", "/").startsWith(prefix));
  const defaults = new Map();
  const ambiguous = new Set();
  function collect(node) {
    if (ts.isBindingElement(node) && literal(node.initializer)) {
      const name = (node.propertyName ?? node.name).getText();
      const value = node.initializer.getText();
      if (defaults.has(name) && defaults.get(name) !== value) ambiguous.add(name);
      else defaults.set(name, value);
    }
    if (ts.isPropertyAssignment(node) && node.name.getText() === "defaultVariants" && ts.isObjectLiteralExpression(node.initializer)) {
      for (const prop of node.initializer.properties) {
        if (ts.isPropertyAssignment(prop) && literal(prop.initializer)) defaults.set(prop.name.getText(), prop.initializer.getText());
      }
    }
    ts.forEachChild(node, collect);
  }
  files.forEach((file) => collect(file));
  const groups = [];
  for (const file of files) {
    for (const declaration of file.statements) {
      if ((!ts.isInterfaceDeclaration(declaration) && !ts.isTypeAliasDeclaration(declaration)) || !publicTypes.has(declaration.name.text) || !declaration.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
      const type = checker.getTypeAtLocation(declaration);
      const rows = [];
      for (const property of type.getProperties()) {
        const name = property.getName();
        const local = property.declarations?.some((node) => node.getSourceFile().fileName.replaceAll("\\", "/").startsWith(path.join(root, "registry/react").replaceAll("\\", "/") + "/"));
        if (!local && !nativeProps.has(name)) continue;
        const description = ts.displayPartsToString(property.getDocumentationComment(checker)).replace(/\s+/g, " ").trim();
        const declaredDefault = description.match(/Defaults? to (.+?)\.(?:\s|$)/i)?.[1];
        const valueType = checker.getTypeOfSymbolAtLocation(property, declaration);
        rows.push({
          name,
          type: checker.typeToString(valueType, declaration, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope),
          required: !(property.flags & ts.SymbolFlags.Optional),
          description: description || descriptions[name] || (local ? "Public Pimolu prop; see the source declaration for details." : "Standard React/HTML attribute."),
          ...(declaredDefault || (!ambiguous.has(name) && defaults.has(name)) ? { default: declaredDefault ?? defaults.get(name) } : {}),
        });
      }
      if (rows.length) groups.push({ name: declaration.name.text, source: path.relative(root, file.fileName).replaceAll(path.sep, "/"), rows });
    }
  }
  catalogApi[component.family] = groups;
  if (!component.documented) continue;
  if (!groups.length) throw new Error(`No public API found for ${component.family}`);
  api[component.family] = groups;

  if (extendedSources.has(component.family)) { examples[component.family] = extendedSources.get(component.family); continue; }
  const exampleName = components.find((entry) => entry.family === component.family).example;
  const examplePath = path.join(website, `components/docs/examples/${component.family}.tsx`);
  const exampleSource = ts.createSourceFile(examplePath, await readFile(examplePath, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fn = exampleSource.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === exampleName);
  if (!fn) throw new Error(`Missing example ${exampleName}`);
  const identifiers = new Set();
  function visit(node) { if (ts.isIdentifier(node)) identifiers.add(node.text); ts.forEachChild(node, visit); }
  visit(fn);
  const imports = [];
  for (const statement of exampleSource.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause?.namedBindings || !ts.isNamedImports(statement.importClause.namedBindings)) continue;
    const names = statement.importClause.namedBindings.elements.filter((item) => identifiers.has(item.name.text)).map((item) => item.getText());
    if (names.length) imports.push(`import { ${names.join(", ")} } from ${statement.moduleSpecifier.getText()};`);
  }
  examples[component.family] = `"use client";\n\n${imports.join("\n")}\n\n${fn.getText(exampleSource)}\n`;
}

for (const component of catalog) {
  try { await readFile(path.join(root, component.stylesheet), "utf8"); }
  catch (error) { if (error.code === "ENOENT") component.stylesheet = null; else throw error; }
  const files = await readdir(path.join(root, component.source));
  component.tests = files.filter((name) => name.includes(".test.")).map((name) => `${component.source}/${name}`);
}

for (const entry of docNavigation) {
  const component = components.find((item) => `components/${item.family}` === entry.slug);
  const guide = guides.find((item) => item.slug === entry.slug);
  index.push({
    ...entry, href: entry.slug.startsWith("components/") ? `/${entry.slug}` : entry.slug ? `/docs/${entry.slug}` : "/docs",
    keywords: component
      ? [...component.usage, ...component.accessibility, ...api[component.family].flatMap((group) => group.rows.map((row) => `${row.name} ${row.description}`))]
      : guide.sections.flatMap((section) => [section.title, ...section.paragraphs]),
  });
}

for (const entry of catalog.filter((entry) => !entry.documented)) {
  index.push({ slug: `catalog/${entry.family}`, href: entry.href, title: entry.title, description: entry.description, group: "Source references", keywords: [...entry.exports, ...catalogApi[entry.family].flatMap((group) => group.rows.map((row) => row.name))] });
}

await mkdir(output, { recursive: true });
for (const [filename, content] of Object.entries({ "api.json": api, "catalog-api.json": catalogApi, "catalog.json": catalog, "preview-options.json": previewOptions, "navigation.json": docNavigation, "examples.json": examples, "search.json": index, "layout-styles.json": (await readFile(path.join(website, "components/docs/demo-compositions.css"), "utf8")).replaceAll(":is(.docs-preview, .demo-composition) ", "") })) {
  const target = path.join(output, filename);
  const data = JSON.stringify(content, null, 2) + "\n";
  let previous;
  try { previous = await readFile(target, "utf8"); } catch { /* First generation. */ }
  if (previous !== data) await writeFile(target, data);
}
console.log(`Docs generated: ${catalog.length} catalog families, ${Object.keys(examples).length} live examples, ${index.length} searchable references.`);
