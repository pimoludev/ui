import ts from "typescript";
import { formatExample } from "./format-example.mjs";

// Documentation is compiled from the real demo. Readers get explicit public
// props, not the Playground's enumeration machinery or private layout classes.
const layouts = {
  "pg-stack": "grid gap-5 min-w-0", "pg-row": "flex flex-wrap items-center gap-3 min-w-0",
  "pg-row--between": "justify-between", "pg-grid": "grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0",
  "pg-grid--two": "", "pg-grid--start": "items-start", "pg-meta": "text-sm text-muted leading-relaxed",
  "pg-muted": "text-sm text-muted", "pg-copy": "max-w-prose leading-relaxed",
  "pg-panel": "min-w-0 rounded-lg border border-border p-6", "pg-demo-item": "grid gap-3 min-w-0",
  "pg-section": "mt-8", "pg-section__title": "mb-2 text-lg", "pg-section__hint": "mb-5 text-muted",
  "pg-grow": "flex-1 min-w-0", "pg-example-actions": "flex flex-wrap items-end justify-between gap-6",
  "pg-media": "block w-full max-h-64 object-contain rounded-md bg-surface", "pg-price": "text-2xl font-medium",
  "pg-popover-title": "mb-2 font-medium", "pg-popover-hint": "text-sm text-muted", "pg-popover-copy": "max-w-prose leading-relaxed",
  "pg-brand": "flex items-center gap-3 no-underline text-inherit", "pg-brand__mark": "grid place-items-center size-9 rounded-md bg-primary text-[var(--pimolu-primary-foreground)]",
  "pg-brand__name": "block", "pg-brand__tag": "text-xs text-muted", "pg-separator-row": "flex items-center gap-4",
  "pg-surface-demo": "p-6 bg-surface border border-border rounded-md", "pg-box-surface-demo": "p-6 bg-surface border border-border rounded-md",
  "pg-member-cell": "flex items-center gap-3", "pg-member-cell__text": "grid gap-1", "pg-member-cell__email": "text-xs text-muted",
  "pg-data-table-member": "flex items-center gap-3", "pg-data-table-member__text": "grid gap-1", "pg-data-table-member__email": "text-xs text-muted",
  "pg-metric": "grid gap-2", "pg-metric__value": "text-2xl", "pg-metrics": "grid gap-4 sm:grid-cols-3",
  "pg-panel__name": "text-sm text-muted", "pg-navbar-preview": "grid gap-3", "pg-navbar-preview__label": "text-sm text-muted",
  "pg-navbar-preview__frame": "min-w-0 rounded-lg border border-border", "pg-navbar-preview-grid": "grid gap-6",
  "pg-sidebar-demo": "min-h-[420px]", "pg-box-scale-demo": "grid gap-4", "pg-avatar": "size-10 rounded-full",
  "pg-scroll-horizontal-demo": "min-w-0", "pg-scroll-horizontal": "flex w-max gap-4", "pg-scroll-table": "min-w-[640px]",
  "pg-scroll-table__row": "grid grid-cols-4 gap-4 p-3 border-b border-border", "pg-dialog-accent": "text-primary",
  "pg-popover-trigger": "inline-flex", "pg-scroll-demo": "grid gap-4",
};

const unknown = Symbol("dynamic");
const unwrap = (n) => ts.isAsExpression(n) || ts.isParenthesizedExpression(n) || ts.isSatisfiesExpression(n) ? unwrap(n.expression) : n;

export function createExampleSimplifier(program) {
  const maps = new Map();
  function literal(node) {
    const n = unwrap(node);
    if (ts.isStringLiteral(n) || ts.isNumericLiteral(n)) return n.text;
    if (ts.isObjectLiteralExpression(n)) return Object.fromEntries(n.properties.filter(ts.isPropertyAssignment).map((p) => [p.name.text, literal(p.initializer)]));
    return unknown;
  }
  for (const file of program.getSourceFiles()) if (file.fileName.endsWith(".variants.ts")) {
    for (const statement of file.statements) if (ts.isVariableStatement(statement)) for (const decl of statement.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.name.text.endsWith("VariantMap") && decl.initializer) maps.set(decl.name.text, literal(decl.initializer));
    }
  }

  return function simplifyExample(source) {
    const file = ts.createSourceFile("example.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const definitions = new Map();
    function collect(n) { if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) definitions.set(n.name.text, n.initializer); ts.forEachChild(n, collect); }
    collect(file);

    function evaluate(node, env = new Map(), seen = new Set()) {
      if (!node) return unknown;
      const n = unwrap(node);
      if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
      if (ts.isNumericLiteral(n)) return Number(n.text);
      if (n.kind === ts.SyntaxKind.TrueKeyword) return true;
      if (n.kind === ts.SyntaxKind.FalseKeyword) return false;
      if (ts.isIdentifier(n)) {
        if (env.has(n.text)) return env.get(n.text);
        if (maps.has(n.text)) return maps.get(n.text);
        if (seen.has(n.text) || !definitions.has(n.text)) return unknown;
        return evaluate(definitions.get(n.text), env, new Set([...seen, n.text]));
      }
      if (ts.isArrayLiteralExpression(n)) { const values = n.elements.map((e) => evaluate(e, env, seen)); return values.includes(unknown) ? unknown : values; }
      if (ts.isPropertyAccessExpression(n)) { const parent = evaluate(n.expression, env, seen); return parent !== unknown && parent != null && Object.hasOwn(parent, n.name.text) ? parent[n.name.text] : unknown; }
      if (ts.isTemplateExpression(n)) {
        let result = n.head.text;
        for (const span of n.templateSpans) { const value = evaluate(span.expression, env, seen); if (value === unknown) return unknown; result += value + span.literal.text; }
        return result;
      }
      if (ts.isBinaryExpression(n)) {
        const a = evaluate(n.left, env, seen), b = evaluate(n.right, env, seen);
        if (a === unknown || b === unknown) return unknown;
        switch (n.operatorToken.kind) {
          case ts.SyntaxKind.EqualsEqualsEqualsToken: return a === b;
          case ts.SyntaxKind.ExclamationEqualsEqualsToken: return a !== b;
          case ts.SyntaxKind.PlusToken: return a + b;
          case ts.SyntaxKind.AmpersandAmpersandToken: return a && b;
          case ts.SyntaxKind.BarBarToken: return a || b;
        }
      }
      if (ts.isConditionalExpression(n)) {
        const condition = evaluate(n.condition, env, seen);
        if (condition !== unknown) return evaluate(condition ? n.whenTrue : n.whenFalse, env, seen);
      }
      if (ts.isCallExpression(n)) {
        const target = n.expression;
        const arg = evaluate(n.arguments[0], env, seen);
        if (ts.isIdentifier(target) && target.text === "optionsOf" && arg !== unknown) return Object.keys(arg);
        if (ts.isPropertyAccessExpression(target)) {
          if (ts.isIdentifier(target.expression) && target.expression.text === "Object" && arg !== unknown) {
            if (target.name.text === "keys") return Object.keys(arg);
            if (target.name.text === "values") return Object.values(arg);
            if (target.name.text === "entries") return Object.entries(arg);
          }
          const value = evaluate(target.expression, env, seen);
          if (value !== unknown && typeof value === "string") {
            if (target.name.text === "toUpperCase") return value.toUpperCase();
            if (target.name.text === "toLowerCase") return value.toLowerCase();
          }
          if (Array.isArray(value) && target.name.text === "slice") {
            const args = n.arguments.map((a) => evaluate(a, env, seen));
            if (!args.includes(unknown)) return value.slice(...args);
          }
          if (Array.isArray(value) && target.name.text === "filter" && n.arguments[0] && ts.isArrowFunction(n.arguments[0])) {
            const callback = n.arguments[0];
            if (callback.parameters.length === 1 && ts.isIdentifier(callback.parameters[0].name)) {
              const decisions = value.map((item) => evaluate(callback.body, new Map([...env, [callback.parameters[0].name.text, item]]), seen));
              if (!decisions.includes(unknown)) return value.filter((_, index) => decisions[index]);
            }
          }
        }
      }
      return unknown;
    }
    function usesMap(n, seen = new Set()) {
      let yes = false;
      function visit(node) {
        if (ts.isIdentifier(node)) {
          if (maps.has(node.text)) yes = true;
          else if (definitions.has(node.text) && !seen.has(node.text)) { seen.add(node.text); visit(definitions.get(node.text)); }
        }
        ts.forEachChild(node, visit);
      }
      visit(n); return yes;
    }
    const transformed = ts.transform(file, [(context) => {
      const f = context.factory;
      const toNode = (v) => typeof v === "string" ? f.createStringLiteral(v) : typeof v === "boolean" ? (v ? f.createTrue() : f.createFalse()) : f.createNumericLiteral(v);
      function portableClasses(value) {
        const result = value.split(/\s+/).map((name) => layouts[name] ?? name).filter(Boolean).join(" ");
        if (/\bpg-/.test(result)) throw new Error(`Add a portable layout for ${result}`);
        return result;
      }
      function classValue(node, env) {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return f.createStringLiteral(portableClasses(node.text));
        if (ts.isConditionalExpression(node)) return f.updateConditionalExpression(node, visit(node.condition, env), node.questionToken, classValue(node.whenTrue, env), node.colonToken, classValue(node.whenFalse, env));
        if (ts.isParenthesizedExpression(node)) return f.updateParenthesizedExpression(node, classValue(node.expression, env));
        if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) return f.updateBinaryExpression(node, visit(node.left, env), node.operatorToken, classValue(node.right, env));
        return ts.visitEachChild(node, (child) => classValue(child, env), context);
      }
      function visit(node, env = new Map()) {
        if (ts.isShorthandPropertyAssignment(node) && env.has(node.name.text) && env.get(node.name.text) !== unknown) {
          return f.createPropertyAssignment(node.name, toNode(env.get(node.name.text)));
        }
        if (ts.isConditionalExpression(node) && env.size) {
          const condition = evaluate(node.condition, env);
          if (condition !== unknown) return visit(unwrap(condition ? node.whenTrue : node.whenFalse), env);
        }
        if (ts.isTypeOperatorNode(node) && node.operator === ts.SyntaxKind.KeyOfKeyword && ts.isTypeQueryNode(node.type)) {
          const query = node.type.exprName.getText(file).split(".");
          let value = maps.get(query.shift());
          for (const key of query) value = value && value[key];
          if (value && value !== unknown) return f.createUnionTypeNode(Object.keys(value).map((v) => f.createLiteralTypeNode(f.createStringLiteral(v))));
        }
        if (ts.isJsxExpression(node) && node.expression && ts.isCallExpression(unwrap(node.expression))) {
          const call = unwrap(node.expression);
          if (ts.isPropertyAccessExpression(call.expression) && call.expression.name.text === "map" && usesMap(call.expression.expression)) {
            const values = evaluate(call.expression.expression, env);
            const callback = call.arguments[0];
            if (Array.isArray(values) && callback && ts.isArrowFunction(callback) && callback.parameters.every((p) => ts.isIdentifier(p.name))) {
              const children = [];
              for (const [i, value] of values.entries()) {
                const scope = new Map(env);
                callback.parameters.forEach((p, index) => scope.set(p.name.text, index === 0 ? value : i));
                let body = callback.body;
                if (ts.isBlock(body)) {
                  for (const s of body.statements) if (ts.isVariableStatement(s)) for (const d of s.declarationList.declarations) if (ts.isIdentifier(d.name)) scope.set(d.name.text, evaluate(d.initializer, scope));
                  body = body.statements.find(ts.isReturnStatement)?.expression;
                }
                if (!body) throw new Error("Variant example callback must return JSX");
                const child = visit(unwrap(body), scope);
                children.push(f.createJsxText("\n"), child);
              }
              return children;
            }
          }
        }
        if (ts.isJsxAttribute(node) && node.name.text === "key" && env.size) return undefined;
        if (ts.isJsxAttribute(node) && node.initializer && ts.isJsxExpression(node.initializer) && env.size) {
          const value = evaluate(node.initializer.expression, env);
          if (typeof value === "string") return f.updateJsxAttribute(node, node.name, f.createStringLiteral(value));
        }
        if (ts.isJsxAttribute(node) && /className$/i.test(node.name.text) && node.initializer) {
          return f.updateJsxAttribute(node, node.name, classValue(node.initializer, env));
        }
        if (ts.isJsxExpression(node) && node.expression && env.size) {
          const value = evaluate(node.expression, env);
          if (typeof value === "string" && !/[<>&{}\n]/.test(value) && ts.isJsxElement(node.parent)) return f.createJsxText(value);
          if (value !== unknown && ["string", "boolean", "number"].includes(typeof value)) return f.updateJsxExpression(node, toNode(value));
        }
        if (env.size && (ts.isBinaryExpression(node) || ts.isConditionalExpression(node) || ts.isTemplateExpression(node))) {
          const value = evaluate(node, env);
          if (value !== unknown && ["string", "boolean", "number"].includes(typeof value)) return toNode(value);
        }
        if ((ts.isAsExpression(node) || ts.isParenthesizedExpression(node)) && env.size) {
          const value = evaluate(node, env);
          if (value !== unknown && ["string", "boolean", "number"].includes(typeof value)) return toNode(value);
        }
        if (ts.isIdentifier(node) && env.has(node.text) && env.get(node.text) !== unknown) {
          if (ts.isPropertyAccessExpression(node.parent) && node.parent.name === node) return node;
          if (ts.isPropertyAssignment(node.parent) && node.parent.name === node) return node;
          if (ts.isJsxAttribute(node.parent) && node.parent.name === node) return node;
          return toNode(env.get(node.text));
        }
        // Extracted sections used fragments: siblings then lost their section gap.
        if (ts.isReturnStatement(node) && node.expression && ts.isJsxFragment(unwrap(node.expression)) && ts.isBlock(node.parent) && ts.isFunctionDeclaration(node.parent.parent) && node.parent.parent.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
          const fragment = unwrap(node.expression);
          const children = fragment.children.filter((c) => !ts.isJsxText(c) || c.text.trim());
          const content = children.length === 1 && !ts.isJsxExpression(children[0]) ? children[0] : f.createJsxElement(f.createJsxOpeningElement(f.createIdentifier("div"), undefined, f.createJsxAttributes([f.createJsxAttribute(f.createIdentifier("className"), f.createStringLiteral("grid gap-6"))])), fragment.children, f.createJsxClosingElement(f.createIdentifier("div")));
          return f.updateReturnStatement(node, ts.visitNode(content, (n) => visit(n, env)));
        }
        const result = ts.visitEachChild(node, (n) => visit(n, env), context);
        if (ts.isJsxElement(result)) {
          const meaningful = result.children.filter((c) => !ts.isJsxText(c) || c.text.trim());
          if (meaningful.length === 1 && ts.isJsxText(meaningful[0])) return f.updateJsxElement(result, result.openingElement, [f.createJsxText(meaningful[0].text.trim().replace(/\s+/g, " "))], result.closingElement);
        }
        return result;
      }
      return (root) => ts.visitNode(root, visit);
    }]);
    let result = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: false }).printFile(transformed.transformed[0]);
    transformed.dispose();
    // Remove enumeration helpers/imports after expansion, preserving real hooks,
    // data arrays and callbacks. Iterate because removing one helper frees others.
    for (let pass = 0; pass < 5; pass++) {
      const ast = ts.createSourceFile("example.tsx", result, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const refs = new Map();
      function count(n) { if (ts.isIdentifier(n)) refs.set(n.text, (refs.get(n.text) ?? 0) + 1); ts.forEachChild(n, count); }
      ast.statements.filter((s) => !ts.isImportDeclaration(s)).forEach(count);
      const edits = [];
      for (const statement of ast.statements) {
        if (ts.isFunctionDeclaration(statement) && !statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) && statement.name && refs.get(statement.name.text) === 1) edits.push([statement.getStart(ast), statement.end, ""]);
        if (ts.isImportDeclaration(statement) && statement.importClause?.namedBindings && ts.isNamedImports(statement.importClause.namedBindings)) {
          const names = statement.importClause.namedBindings.elements.filter((s) => refs.has(s.name.text));
          if (names.length !== statement.importClause.namedBindings.elements.length) {
            const replacement = names.length ? `import ${statement.importClause.isTypeOnly ? "type " : ""}{ ${names.map((s) => s.getText(ast)).join(", ")} } from ${statement.moduleSpecifier.getText(ast)};` : "";
            edits.push([statement.getStart(ast), statement.end, replacement]);
          }
        }
      }
      function removeEnumeration(n) {
        if (ts.isVariableStatement(n) && n.declarationList.declarations.every((d) => ts.isIdentifier(d.name) && refs.get(d.name.text) === 1 && d.initializer && usesMap(d.initializer))) edits.push([n.getStart(ast), n.end, ""]);
        else ts.forEachChild(n, removeEnumeration);
      }
      removeEnumeration(ast);
      if (!edits.length) break;
      for (const [start, end, text] of edits.sort((a, b) => b[0] - a[0])) result = result.slice(0, start) + text + result.slice(end);
    }
    const parsed = ts.createSourceFile("example.tsx", result, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    if (parsed.parseDiagnostics.length) throw new Error(`Invalid readable example: ${ts.flattenDiagnosticMessageText(parsed.parseDiagnostics[0].messageText, " ")}`);
    return formatExample(result);
  };
}
