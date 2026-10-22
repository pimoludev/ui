import ts from "typescript";

export const examplePrintWidth = 88;
let currentSource = "", version = 0;
const service = ts.createLanguageService({
  getScriptFileNames: () => ["example.tsx"],
  getScriptVersion: () => String(version),
  getScriptSnapshot: () => ts.ScriptSnapshot.fromString(currentSource),
  getCurrentDirectory: () => ".",
  getCompilationSettings: () => ({ jsx: ts.JsxEmit.Preserve }),
  getDefaultLibFileName: () => "",
  fileExists: () => true,
  readFile: () => currentSource,
});

/** Syntax-aware wrapping, followed by TypeScript indentation. Never split a
 * string, template, comment or expression using a blind line-length regex. */
function formatPass(source) {
  const file = ts.createSourceFile("example.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = new Map();
  const add = (start, end, text) => edits.set(`${start}:${end}`, { start, end, text });
  const long = (node) => node.getText(file).includes("\n") || file.getLineAndCharacterOfPosition(node.getStart(file)).character + node.getWidth(file) > examplePrintWidth;
  function gap(start, end, newline = "\n") {
    const existing = source.slice(start, end);
    if (/^[\s,;]*$/.test(existing)) add(start, end, existing.replace(/\s/g, "") + newline);
  }
  function before(position) {
    let start = position;
    while (start > 0 && /\s/.test(source[start - 1])) start--;
    gap(start, position);
  }
  function list(nodes, open, close) {
    if (!nodes.length) return;
    gap(open, nodes[0].getStart(file));
    for (let i = 1; i < nodes.length; i++) gap(nodes[i - 1].end, nodes[i].getStart(file));
    gap(nodes.at(-1).end, close);
  }
  const inlineTags = new Set(["span", "a", "p", "label", "strong", "em", "code", "pre", "button", "kbd", "small", "b", "i", "h1", "h2", "h3", "h4"]);
  function visit(node) {
    if (ts.isConditionalExpression(node) && long(node)) {
      if (/^\s*\?\s*$/.test(source.slice(node.condition.end, node.whenTrue.getStart(file)))) add(node.condition.end, node.whenTrue.getStart(file), "\n? ");
      if (/^\s*:\s*$/.test(source.slice(node.whenTrue.end, node.whenFalse.getStart(file)))) add(node.whenTrue.end, node.whenFalse.getStart(file), "\n: ");
    }
    if (ts.isJsxExpression(node) && node.expression && !ts.isJsxAttribute(node.parent) && long(node)) {
      gap(node.getStart(file) + 1, node.expression.getStart(file));
      gap(node.expression.end, node.end - 1);
    }
    // Long prose and embedded assets are split as concatenations, preserving
    // their exact runtime value. Class tokens and module/type names stay atomic.
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && node.text.length > examplePrintWidth) {
      const parent = node.parent;
      const jsxAttribute = ts.isJsxAttribute(parent);
      const protectedLiteral = ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent) || ts.isLiteralTypeNode(parent) || (ts.isPropertyAssignment(parent) && parent.name === node) || (jsxAttribute && (/className$/i.test(parent.name.text) || node.text.includes("&")));
      if (!protectedLiteral) {
        const chunks = [];
        let rest = node.text;
        while (rest.length > 64) {
          let cut = Math.max(rest.lastIndexOf(" ", 63), rest.lastIndexOf(">", 63), rest.lastIndexOf(",", 63)) + 1;
          if (cut < 24) cut = 64;
          chunks.push(rest.slice(0, cut)); rest = rest.slice(cut);
        }
        if (rest) chunks.push(rest);
        const expression = `(\n${chunks.map((chunk) => JSON.stringify(chunk)).join(" +\n")}\n)`;
        add(node.getStart(file), node.end, jsxAttribute ? `{${expression}}` : expression);
      }
    }
    if (ts.isJsxText(node) && node.text.trim().length >= 48 && ts.isJsxElement(node.parent) && node.parent.children.length === 1 && !new Set(["pre", "code", "Code", "Kbd", "textarea", "script", "style"]).has(node.parent.openingElement.tagName.getText(file)) && long(node.parent)) {
      const lines = [];
      for (const word of node.text.trim().split(/\s+/)) {
        if (!lines.length || lines.at(-1).length + word.length + 1 > 64) lines.push(word);
        else lines[lines.length - 1] += ` ${word}`;
      }
      add(node.pos, node.end, `\n${lines.join("\n")}\n`);
    }
    if (ts.isImportDeclaration(node) && node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings) && long(node)) {
      const names = node.importClause.namedBindings;
      list(names.elements, names.getStart(file) + 1, names.end - 1);
    }
    if ((ts.isObjectLiteralExpression(node) || ts.isTypeLiteralNode(node)) && long(node)) list(node.properties ?? node.members, node.getStart(file) + 1, node.end - 1);
    if (ts.isArrayLiteralExpression(node) && node.elements.length > 1 && long(node)) list(node.elements, node.getStart(file) + 1, node.end - 1);
    if (ts.isObjectBindingPattern(node) && node.elements.length > 1 && long(node)) list(node.elements, node.getStart(file) + 1, node.end - 1);
    if (ts.isCallExpression(node) && node.arguments.length > 1 && long(node)) {
      before(node.arguments[0].getStart(file));
      for (let i = 1; i < node.arguments.length; i++) gap(node.arguments[i - 1].end, node.arguments[i].getStart(file));
      gap(node.arguments.at(-1).end, node.end - 1);
    }
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.attributes.properties.length && long(node)) {
      const attributes = node.attributes.properties;
      before(attributes[0].getStart(file));
      for (let i = 1; i < attributes.length; i++) gap(attributes[i - 1].end, attributes[i].getStart(file));
      gap(attributes.at(-1).end, node.end - (ts.isJsxSelfClosingElement(node) ? 2 : 1));
    }
    if (ts.isJsxElement(node) && !inlineTags.has(node.openingElement.tagName.getText(file))) {
      const children = node.children.filter((child) => !ts.isJsxText(child) || child.text.trim());
      if (children.length && children.every((child) => !ts.isJsxText(child))) list(children, node.openingElement.end, node.closingElement.getStart(file));
      if (children.length === 1 && ts.isJsxText(children[0]) && children[0].text.trim().length <= examplePrintWidth && long(node.openingElement)) add(children[0].pos, children[0].end, `\n${children[0].text.trim()}\n`);
    }
    if (ts.isJsxFragment(node)) {
      const children = node.children.filter((child) => !ts.isJsxText(child) || child.text.trim());
      if (children.length && children.every((child) => !ts.isJsxText(child))) list(children, node.openingFragment.end, node.closingFragment.getStart(file));
    }
    if (ts.isReturnStatement(node) && node.expression && (ts.isJsxElement(node.expression) || ts.isJsxFragment(node.expression) || ts.isJsxSelfClosingElement(node.expression))) {
      add(node.expression.getStart(file), node.expression.getStart(file), "(\n");
      add(node.expression.end, node.expression.end, "\n)");
    }
    if (ts.isReturnStatement(node) && node.expression && ts.isParenthesizedExpression(node.expression)) {
      const inner = node.expression.expression;
      if ((ts.isJsxElement(inner) || ts.isJsxFragment(inner) || ts.isJsxSelfClosingElement(inner)) && long(inner)) {
        gap(node.expression.getStart(file) + 1, inner.getStart(file));
        gap(inner.end, node.expression.end - 1);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  for (let i = 1; i < file.statements.length; i++) {
    const previous = file.statements[i - 1], next = file.statements[i];
    if ((ts.isExpressionStatement(previous) && ts.isStringLiteral(previous.expression)) || (ts.isImportDeclaration(previous) && !ts.isImportDeclaration(next)) || ts.isFunctionDeclaration(previous) || ts.isFunctionDeclaration(next)) gap(previous.end, next.getStart(file), "\n\n");
  }
  let result = source;
  for (const edit of [...edits.values()].sort((a, b) => b.start - a.start || b.end - a.end)) result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  const parsed = ts.createSourceFile("example.tsx", result, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  if (parsed.parseDiagnostics.length) throw new Error(`Invalid formatted example: ${ts.flattenDiagnosticMessageText(parsed.parseDiagnostics[0].messageText, " ")}`);
  currentSource = result; version++;
  const indentation = service.getFormattingEditsForDocument("example.tsx", {
    indentSize: 2, tabSize: 2, convertTabsToSpaces: true, newLineCharacter: "\n",
    indentStyle: ts.IndentStyle.Smart, insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
    insertSpaceAfterCommaDelimiter: true, insertSpaceBeforeAndAfterBinaryOperators: true,
  });
  for (const edit of indentation.sort((a, b) => b.span.start - a.span.start)) result = result.slice(0, edit.span.start) + edit.newText + result.slice(edit.span.start + edit.span.length);
  return result.replaceAll("\r\n", "\n").replace(/\n[ \t]*\n(?:[ \t]*\n)*/g, "\n\n").trim() + "\n";
}

export function formatExample(source) {
  let result = source;
  for (let pass = 0; pass < 6; pass++) {
    const next = formatPass(result);
    if (next === result) return result;
    result = next;
  }
  throw new Error("Example formatting did not stabilize");
}
