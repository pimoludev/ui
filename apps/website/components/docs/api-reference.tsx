import { ApiTable, Badge, Code, DescriptionItem, DescriptionList, Link } from "@/components/ui";

export interface ApiGroup {
  name: string;
  source: string;
  rows: { name: string; type: string; required: boolean; description: string; default?: string }[];
}

export function ApiReference({ groups }: { groups: ApiGroup[] }) {
  return <>{groups.map((group) => <div key={group.name} className="docs-api-group">
    <div className="flex flex-wrap justify-between items-baseline gap-3"><h3>{group.name}</h3><Link href={`https://github.com/pimoludev/ui/blob/dev/${group.source}`} external className="text-sm">Type source</Link></div>
    <div className="docs-api-desktop"><ApiTable rows={group.rows} caption={`${group.name} public API`} /></div>
    <DescriptionList className="docs-api-mobile" layout="stacked" size="lg" aria-label={`${group.name} public API`}>
      {group.rows.map((row) => <DescriptionItem key={row.name}
        term={<span className="flex flex-wrap items-center gap-3"><Code>{row.name}</Code>{row.required && <Badge variant="primary" size="sm">Required</Badge>}</span>}
        details={<div className="space-y-3 mt-3"><p><Code className="docs-api-type">{row.type}</Code></p><p className="text-sm text-muted">{row.default !== undefined ? `Default: ${row.default}` : "No default extracted."}</p><p className="text-sm text-muted">{row.description}</p></div>}
      />)}
    </DescriptionList>
  </div>)}</>;
}
