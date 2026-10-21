import ts from "typescript";

/** Extract a curated composition and its lexical dependencies, not a second UI implementation. */
export function extractExample(program, filename, selection, name) {
  const file = program.getSourceFile(filename);
  if (!file) throw new Error(`Missing playground source: ${filename}`);
  const checker = program.getTypeChecker();
  const page = file.statements.find((node) => ts.isFunctionDeclaration(node) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword));
  const helper = selection.helper && file.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === selection.helper);
  let selected;
  function find(node) {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(file) === "Section") {
      const title = node.openingElement.attributes.properties.find((p) => ts.isJsxAttribute(p) && p.name.text === "title");
      if (title?.initializer && ts.isStringLiteral(title.initializer) && title.initializer.text === selection.section) selected = node;
    }
    ts.forEachChild(node, find);
  }
  if (!helper) find(page);
  if (!helper && !selected) throw new Error(`Missing curated selection ${JSON.stringify(selection)} in ${filename}`);
  // A section may contain several independent compositions (for example a
  // vertical menu and an editor toolbar). Curate one without duplicating code.
  if (selected && selection.item !== undefined) {
    let children = selected.children.filter((child) => ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) || ts.isJsxExpression(child));
    if (children.length === 1 && ts.isJsxElement(children[0]) && children[0].openingElement.tagName.getText(file) === "div") children = children[0].children.filter((child) => ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) || ts.isJsxExpression(child));
    selected = children[selection.item];
    if (!selected) throw new Error(`Missing item ${selection.item} in ${selection.section}`);
  }
  const root = helper ?? selected;
  const included = new Map();
  const local = new Map();
  const imports = new Map();
  const seen = new Set();
  const inside = (node, parent) => node.getSourceFile() === parent.getSourceFile() && node.pos >= parent.pos && node.end <= parent.end;
  function add(node) {
    if (!node || seen.has(node)) return;
    seen.add(node);
    ts.forEachChild(node, visit);
  }
  function visit(node) {
    if (ts.isIdentifier(node)) {
      const symbol = checker.getSymbolAtLocation(node);
      for (const decl of symbol?.declarations ?? []) {
        if (inside(decl, root) || [...included.keys(), ...local.keys()].some((parent) => inside(decl, parent))) continue;
        if (ts.isImportSpecifier(decl) || ts.isImportClause(decl) || ts.isNamespaceImport(decl)) {
          let statement = decl;
          while (statement && !ts.isImportDeclaration(statement)) statement = statement.parent;
          if (!statement) continue;
          const moduleName = statement.moduleSpecifier.text;
          if (moduleName.startsWith(".")) {
            const target = checker.getAliasedSymbol(symbol);
            target.declarations?.forEach(includeDeclaration);
          } else {
            const text = ts.isImportSpecifier(decl) ? decl.getText() : ts.isNamespaceImport(decl) ? `* as ${decl.name.text}` : decl.name?.text;
            if (text) { const list = imports.get(moduleName) ?? new Set(); list.add(text); imports.set(moduleName, list); }
          }
        } else includeDeclaration(decl);
      }
    }
    ts.forEachChild(node, visit);
  }
  function includeDeclaration(decl) {
    if (!decl.getSourceFile().fileName.replaceAll("\\", "/").includes("apps/playground/src/")) return;
    let current = decl;
    while (current.parent && !ts.isSourceFile(current.parent) && !ts.isVariableStatement(current) && !ts.isFunctionDeclaration(current) && !ts.isInterfaceDeclaration(current) && !ts.isTypeAliasDeclaration(current)) current = current.parent;
    if (current === page || inside(current, root) || [...included.keys(), ...local.keys()].some((parent) => inside(current, parent))) return;
    if (page && inside(current, page)) {
      if (ts.isVariableStatement(current) || ts.isFunctionDeclaration(current)) { local.set(current, current); add(current); }
    } else if (current.parent && ts.isSourceFile(current.parent)) { included.set(current, current); add(current); }
  }
  if (helper || selection.item !== undefined) add(root); else selected.children.forEach(add);
  const clean = (node) => ts.isFunctionDeclaration(node) && node.name?.text === "InPageLinkGuard"
    ? "function InPageLinkGuard({ children }: { children: ReactNode }) { return <>{children}</>; }"
    : node.getText().replace(/^export\s+(default\s+)?/, "");
  const statements = [...included.values()].sort((a, b) => a.getSourceFile().fileName.localeCompare(b.getSourceFile().fileName) || a.pos - b.pos).map(clean);
  const importLines = [...imports].map(([moduleName, names]) => {
    const values = [...names];
    const namespace = values.find((n) => n.startsWith("* as "));
    // Playground examples use named imports, except React namespaces.
    return namespace ? `import ${namespace} from ${JSON.stringify(moduleName)};` : `import { ${values.join(", ")} } from ${JSON.stringify(moduleName)};`;
  });
  if (helper) {
    // The helper is included whole, with its original hook scope.
    statements.push(clean(helper));
  }
  const body = helper ? `<${selection.helper} />` : selection.item !== undefined ? selected.getText(file) : `<>${selected.children.map((child) => child.getText(file)).join("\n")}</>`;
  const locals = [...local.values()].sort((a, b) => a.pos - b.pos).map(clean).join("\n");
  const source = `"use client";\n\n${importLines.join("\n")}\n\n${statements.join("\n\n")}\n\nexport function ${name}() {\n${locals}\nreturn (${body});\n}\n`;
  const parsed = ts.createSourceFile("example.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  if (parsed.parseDiagnostics.length) throw new Error(`Invalid extracted example ${filename}: ${ts.flattenDiagnosticMessageText(parsed.parseDiagnostics[0].messageText, " ")}`);
  return source;
}
