import { compile } from "@mdx-js/mdx";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function textOf(node) {
  return node.value ?? node.children?.map(textOf).join(" ").replace(/\s+/g, " ").trim() ?? "";
}

/** Read literal metadata from the MDX syntax tree without evaluating authored JS. */
function readMetadata(node) {
  if (node?.type !== "ObjectExpression") throw new Error("metadata must be an object literal");
  return Object.fromEntries(node.properties.map(property => {
    if (property.type !== "Property" || property.computed || property.value.type !== "Literal" || typeof property.value.value !== "string") {
      throw new Error("metadata fields must be literal strings");
    }
    return [property.key.name ?? property.key.value, property.value.value];
  }));
}

export async function compileRelease(source, slug) {
  let metadata;
  const sections = [];
  function collectContent() {
    return tree => {
      function visit(node) {
        if (node.type === "mdxjsEsm") {
          for (const statement of node.data.estree.body) {
            if (statement.type !== "ExportNamedDeclaration") continue;
            for (const declaration of statement.declaration?.declarations ?? []) {
              if (declaration.id.name === "metadata") {
                if (metadata) throw new Error("Duplicate metadata export");
                metadata = readMetadata(declaration.init);
              }
            }
          }
        }
        if (node.type === "mdxJsxFlowElement" && node.name === "ReleaseSection") {
          const attributes = Object.fromEntries(node.attributes.map(attribute => {
            if (attribute.type !== "mdxJsxAttribute" || typeof attribute.value !== "string") throw new Error("ReleaseSection attributes must be strings");
            return [attribute.name, attribute.value];
          }));
          const { id, title, label } = attributes;
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id ?? "") || !title || !label) throw new Error("ReleaseSection needs id, title and label");
          const items = node.children.flatMap(child => child.type === "list" ? child.children.map(textOf) : child.type === "paragraph" ? [textOf(child)] : []);
          sections.push({ id, title, label, items });
        }
        node.children?.forEach(visit);
      }
      visit(tree);
    };
  }
  const compiled = await compile({ value: source, path: `${slug}.mdx` }, { remarkPlugins: [collectContent] });
  for (const key of ["slug", "title", "status", "summary", "notice"]) {
    if (!metadata?.[key]?.trim()) throw new Error(`${slug}: missing metadata.${key}`);
  }
  if (metadata.slug !== slug || !/^[a-z0-9][a-z0-9.-]*$/.test(slug)) throw new Error(`${slug}: filename and metadata.slug must match`);
  if (!["Preview", "Development"].includes(metadata.status)) throw new Error(`${slug}: unknown release status`);
  if (metadata.date && (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date) || !Number.isFinite(Date.parse(metadata.date)) || new Date(metadata.date).toISOString().slice(0, 10) !== metadata.date)) throw new Error(`${slug}: invalid date`);
  if (!sections.length || new Set(sections.map(section => section.id)).size !== sections.length) throw new Error(`${slug}: missing or duplicate section anchors`);
  return { entry: { ...metadata, sections }, code: String(compiled) };
}

export async function buildReleases() {
  const directory = fileURLToPath(new URL("../content/releases/", import.meta.url));
  const output = fileURLToPath(new URL("../content/generated/releases/", import.meta.url));
  await mkdir(output, { recursive: true });
  const files = (await readdir(directory)).filter(file => file.endsWith(".mdx")).sort();
  if (!files.length) throw new Error("No MDX releases found");
  const entries = [];
  const imports = [];
  for (const [index, file] of files.entries()) {
    const slug = path.basename(file, ".mdx");
    const { entry, code } = await compileRelease(await readFile(path.join(directory, file), "utf8"), slug);
    await writeFile(path.join(output, `${slug}.mjs`), code);
    await writeFile(path.join(output, `${slug}.d.mts`), 'import type { ComponentType } from "react";\ndeclare const Content: ComponentType<{ components: Record<string, unknown> }>;\nexport default Content;\n');
    entries.push(entry);
    imports.push(`import Release${index} from "./${slug}.mjs";`);
  }
  entries.sort((a, b) => Number(a.status === "Development") - Number(b.status === "Development") || (b.date ?? "").localeCompare(a.date ?? "") || a.slug.localeCompare(b.slug));
  await writeFile(path.join(output, "index.json"), JSON.stringify(entries, null, 2) + "\n");
  await writeFile(path.join(output, "contents.ts"), `${imports.join("\n")}\n\nexport const releaseContents: Record<string, typeof Release0> = {\n${files.map((file, index) => `  "${path.basename(file, ".mdx")}": Release${index},`).join("\n")}\n};\n`);
  console.log(`Releases generated from ${files.length} MDX files.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildReleases();
