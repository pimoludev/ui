import { compile } from "@mdx-js/mdx";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readMetadata, textOf } from "./build-releases.mjs";

export async function compileJournalPost(source, slug) {
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
        if (node.type === "mdxJsxFlowElement" && node.name === "JournalSection") {
          const attributes = Object.fromEntries(node.attributes.map(attribute => {
            if (attribute.type !== "mdxJsxAttribute" || typeof attribute.value !== "string") throw new Error("JournalSection attributes must be strings");
            return [attribute.name, attribute.value];
          }));
          const { id, title } = attributes;
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id ?? "") || !title?.trim()) throw new Error("JournalSection needs id and title");
          const paragraphs = node.children.map(textOf).filter(Boolean);
          if (!paragraphs.length) throw new Error(`${slug}: empty section ${id}`);
          sections.push({ id, title, paragraphs });
        }
        node.children?.forEach(visit);
      }
      visit(tree);
    };
  }
  const compiled = await compile({ value: source, path: `${slug}.mdx` }, { remarkPlugins: [collectContent] });
  for (const key of ["slug", "title", "description", "category", "date", "artwork"]) {
    if (!metadata?.[key]?.trim()) throw new Error(`${slug}: missing metadata.${key}`);
  }
  if (metadata.slug !== slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`${slug}: filename and metadata.slug must match`);
  if (!["Engineering", "Design system", "Accessibility"].includes(metadata.category)) throw new Error(`${slug}: unknown category`);
  if (!["system", "palette", "interaction"].includes(metadata.artwork)) throw new Error(`${slug}: unknown artwork`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date) || !Number.isFinite(Date.parse(metadata.date)) || new Date(metadata.date).toISOString().slice(0, 10) !== metadata.date) throw new Error(`${slug}: invalid date`);
  if (metadata.order !== undefined && !/^\d+$/.test(metadata.order)) throw new Error(`${slug}: order must be a non-negative integer string`);
  if (!sections.length || new Set(sections.map(section => section.id)).size !== sections.length) throw new Error(`${slug}: missing or duplicate section anchors`);
  return { entry: { ...metadata, sections }, code: String(compiled) };
}

export async function buildBlog() {
  const directory = fileURLToPath(new URL("../content/blog/", import.meta.url));
  const output = fileURLToPath(new URL("../content/generated/blog/", import.meta.url));
  await mkdir(output, { recursive: true });
  const files = (await readdir(directory)).filter(file => file.endsWith(".mdx")).sort();
  if (!files.length) throw new Error("No MDX blog articles found");
  const entries = [];
  const imports = [];
  for (const [index, file] of files.entries()) {
    const slug = path.basename(file, ".mdx");
    const { entry, code } = await compileJournalPost(await readFile(path.join(directory, file), "utf8"), slug);
    await writeFile(path.join(output, `${slug}.mjs`), code);
    await writeFile(path.join(output, `${slug}.d.mts`), 'import type { ComponentType } from "react";\ndeclare const Content: ComponentType<{ components: Record<string, unknown> }>;\nexport default Content;\n');
    entries.push(entry);
    imports.push(`import Post${index} from "./${slug}.mjs";`);
  }
  entries.sort((a, b) => b.date.localeCompare(a.date) || (Number(a.order ?? Number.MAX_SAFE_INTEGER) - Number(b.order ?? Number.MAX_SAFE_INTEGER)) || a.slug.localeCompare(b.slug));
  await writeFile(path.join(output, "index.json"), JSON.stringify(entries, null, 2) + "\n");
  await writeFile(path.join(output, "contents.ts"), `${imports.join("\n")}\n\nexport const journalContents: Record<string, typeof Post0> = {\n${files.map((file, index) => `  "${path.basename(file, ".mdx")}": Post${index},`).join("\n")}\n};\n`);
  console.log(`Blog generated from ${files.length} MDX files.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildBlog();
