import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import ts from "typescript";

test("every styled public export has typed named parts; headless exceptions stay explicit", () => {
  const entry = fileURLToPath(new URL("../../../registry/react/index.ts", import.meta.url));
  const program = ts.createProgram([entry], { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, skipLibCheck: true });
  const checker = program.getTypeChecker();
  const exported = checker.getExportsOfModule(checker.getSymbolAtLocation(program.getSourceFile(entry)));
  const headless = [], styled = [];
  for (const entry of exported) {
    if (!/^[A-Z]/.test(entry.name)) continue;
    const symbol = entry.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(entry) : entry;
    const declaration = symbol.valueDeclaration;
    if (!declaration) continue;
    const signature = checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures()[0];
    if (!signature?.parameters[0]) continue;
    const props = checker.getTypeOfSymbolAtLocation(signature.parameters[0], declaration);
    if (props.getProperty("className")) assert.ok(props.getProperty("classNames"), `${entry.name}: missing classNames`);
    if (props.getProperty("classNames")) styled.push(entry.name);
    else headless.push(entry.name);
  }
  assert.equal(styled.length, 236);
  assert.deepEqual(headless.sort(), ["Dialog", "DialogTrigger", "DialogClose", "FormControl", "AlertDialog", "AlertDialogTrigger", "AlertDialogAction", "AlertDialogCancel", "DropdownMenu", "DropdownMenuTrigger", "Drawer", "DrawerTrigger", "DrawerClose", "ContextMenu", "ContextMenuTrigger", "HoverCard", "HoverCardTrigger", "Portal"].sort());
});

test("every reference documents its part keys and has a standalone customization example", async () => {
  const api = JSON.parse(await readFile(new URL("../content/generated/api.json", import.meta.url), "utf8"));
  const examples = JSON.parse(await readFile(new URL("../content/generated/additional-examples.json", import.meta.url), "utf8"));
  assert.equal(Object.keys(api).length, 135);
  for (const [family, groups] of Object.entries(api)) {
    const props = groups.flatMap((group) => group.rows).filter((row) => row.name === "classNames");
    assert.ok(props.length, `${family}: missing named-part API`);
    assert.ok(props.every((row) => row.description.includes("Parts:")), `${family}: missing part documentation`);
    assert.equal(examples[family].filter((entry) => entry.title === "Named-part customization").length, 1, `${family}: missing or duplicated live customization example`);
  }
});

test("compound families have stable scopes even before customization is supplied", async () => {
  const directory = new URL("../../../registry/react/", import.meta.url);
  const compound = new Set();
  async function walk(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      if (["node_modules", "dist", "test", "internal"].includes(entry.name)) continue;
      const file = new URL(entry.name + (entry.isDirectory() ? "/" : ""), folder);
      if (entry.isDirectory()) await walk(file);
      else if (entry.name.endsWith(".tsx") && !entry.name.endsWith(".test.tsx")) {
        const source = await readFile(file, "utf8");
        for (const [, family] of source.matchAll(/usePartClasses\("([^"]+)",\s*[^,]+,\s*false\)/g)) compound.add(family);
      }
    }
  }
  await walk(directory);
  const hook = await readFile(new URL("internal/use-part-classes.tsx", directory), "utf8");
  const scopes = [...hook.matchAll(/new Set\(\[([\s\S]*?)\]\)/g)][0][1];
  const expected = [...compound].sort();
  const actual = [...scopes.matchAll(/"([^"]+)"/g)].map(([, family]) => family).sort();
  assert.deepEqual(actual, expected, "A new compound part must retain a stable Provider across map changes");
});

test("published part keys reach an implementation or an explicitly delegated primitive", async () => {
  const directory = new URL("../../../registry/react/", import.meta.url);
  const definitions = await readFile(new URL("customization/customization.types.ts", directory), "utf8");
  const ast = ts.createSourceFile("parts.ts", definitions, ts.ScriptTarget.Latest, true);
  const parts = ast.statements.find((node) => ts.isInterfaceDeclaration(node) && node.name.text === "PimoluComponentParts");
  const delegated = { "alert-dialog": "dialog", form: "button" };
  for (const family of parts.members) {
    const folder = new URL(`${family.name.text}/`, directory);
    const files = (await readdir(folder)).filter((name) => name.endsWith(".tsx") && !name.endsWith(".test.tsx"));
    let source = (await Promise.all(files.map((name) => readFile(new URL(name, folder), "utf8")))).join("\n");
    if (delegated[family.name.text]) {
      assert.ok(source.includes("classNames={forwardedParts}"), `${family.name.text}: missing delegation`);
      const parent = new URL(`${delegated[family.name.text]}/`, directory);
      const parentFiles = (await readdir(parent)).filter((name) => name.endsWith(".tsx") && !name.endsWith(".test.tsx"));
      source += (await Promise.all(parentFiles.map((name) => readFile(new URL(name, parent), "utf8")))).join("\n");
    }
    function check(node) {
      if (ts.isStringLiteral(node)) assert.ok(source.includes(`partClasses.${node.text}`) || source.includes(`classNames?.${node.text}`), `${family.name.text}.${node.text}: an accepted part has no target`);
      ts.forEachChild(node, check);
    }
    check(family.type);
  }
});
