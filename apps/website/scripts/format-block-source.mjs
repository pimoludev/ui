import { format } from "prettier";
import ts from "typescript";

/** Keep copyable block source readable, including handlers and declarations. */
export async function formatBlockSource(source) {
  const ast = ts.createSourceFile("block.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  function visit(node) {
    if (ts.isVariableStatement(node) && node.declarationList.declarations.length > 1) {
      const keyword = node.declarationList.flags & ts.NodeFlags.Const ? "const" : node.declarationList.flags & ts.NodeFlags.Let ? "let" : "var";
      const modifiers = node.modifiers?.map(modifier => modifier.getText(ast)).join(" ");
      const prefix = modifiers ? `${modifiers} ${keyword}` : keyword;
      edits.push({ start: node.getStart(ast), end: node.end, text: node.declarationList.declarations.map(declaration => `${prefix} ${declaration.getText(ast)};`).join("\n") });
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  for (const edit of edits.sort((a, b) => b.start - a.start)) source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
  return format(source, { parser: "typescript", printWidth: 88, tabWidth: 2, trailingComma: "all", endOfLine: "lf" });
}
