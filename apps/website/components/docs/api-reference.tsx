import { ApiTable, Badge, Code, DescriptionItem, DescriptionList, Link } from "@/components/ui";

export interface ApiGroup {
  name: string;
  source: string;
  rows: { name: string; type: string; required: boolean; description: string; default?: string }[];
}

// Optionality is already shown by the Required badge and the generated table.
// Keeping `| undefined` at the end only splits the type across lines.
function displayType(row: ApiGroup["rows"][number]) {
  return row.required ? row.type : row.type.replace(/\s*\|\s*undefined$/, "");
}

export function ApiReference({ groups }: { groups: ApiGroup[] }) {
  return <>{groups.map((group) => <div key={group.name} className="docs-api-group">
    <div className="flex flex-wrap justify-between items-baseline gap-3"><h3>{group.name}</h3><Link href={`https://github.com/pimoludev/ui/blob/dev/${group.source}`} external className="text-sm">Type source</Link></div>
    <div className="docs-api-desktop"><ApiTable rows={group.rows.map((row) => ({ ...row, type: displayType(row) }))} caption={`${group.name} public API`} /></div>
    <DescriptionList className="docs-api-mobile" layout="stacked" size="lg" aria-label={`${group.name} public API`}>
      {group.rows.map((row) => <DescriptionItem key={row.name}
        term={<span className="flex flex-wrap items-center gap-3"><Code>{row.name}</Code>{row.required && <Badge variant="primary" size="sm">Required</Badge>}</span>}
        details={<div className="space-y-3 mt-3"><p><Code className="docs-api-type">{displayType(row)}</Code></p><p className="text-sm text-muted">{row.default !== undefined ? `Default: ${row.default}` : "No default extracted."}</p><p className="text-sm text-muted">{row.description}</p></div>}
      />)}
    </DescriptionList>
  </div>)}</>;
}
