import { useState, type CSSProperties } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DataTable,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormControl,
  FormField,
  Heading,
  Input,
  MultiSelect,
  Paragraph,
  Progress,
  Rating,
  Select,
  Stat,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type PimoluDataTableColumn,
  type PimoluMultiSelectOption,
  type PimoluStylePreset,
} from "@pimolu/react";

import { presets } from "../demo-data";
import { PageHeader } from "../section";

import "./design-lab-page.css";

type Direction = "neutral" | "adaptive";
type DirectionMode = "compare" | Direction;
type ThemeMode = "light" | "dark";
type ViewportMode = "desktop" | "tablet" | "mobile";
type Composition = "enterprise" | "gaming" | "commerce" | "creative";

const directions: Array<{
  id: Direction;
  number: string;
  name: string;
  note: string;
}> = [
  {
    id: "neutral",
    number: "A",
    name: "Neutral Premium",
    note: "Calm surfaces · precise rules · restrained depth",
  },
  {
    id: "adaptive",
    number: "B",
    name: "Adaptive Precision",
    note: "Indigo focus · teal detail · expressive interaction",
  },
];

const compositions: Array<{
  id: Composition;
  label: string;
  index: string;
}> = [
  { id: "enterprise", label: "Enterprise", index: "01" },
  { id: "gaming", label: "Gaming", index: "02" },
  { id: "commerce", label: "E-commerce", index: "03" },
  { id: "creative", label: "Creative", index: "04" },
];

const viewportModes: Array<{
  id: ViewportMode;
  label: string;
  width: string;
}> = [
  { id: "desktop", label: "Wide", width: "100%" },
  { id: "tablet", label: "Tablet · 768", width: "768px" },
  { id: "mobile", label: "Mobile · 390", width: "390px" },
];

interface WorkspaceRow {
  id: string;
  project: string;
  owner: string;
  status: "Live" | "Review" | "Draft";
  revenue: string;
}

const workspaceRows: WorkspaceRow[] = [
  { id: "atlas", project: "Atlas Cloud", owner: "Maya Chen", status: "Live", revenue: "$18.4k" },
  { id: "northstar", project: "Northstar", owner: "Noah Dubois", status: "Review", revenue: "$12.8k" },
  { id: "monogram", project: "Monogram", owner: "Alice Martin", status: "Live", revenue: "$9.6k" },
  { id: "fieldnotes", project: "Fieldnotes", owner: "Sofia Rossi", status: "Draft", revenue: "$4.2k" },
];

const workspaceColumns: PimoluDataTableColumn<WorkspaceRow>[] = [
  { id: "project", header: "Project", sortable: true, accessor: (row) => row.project },
  {
    id: "owner",
    header: "Owner",
    sortable: true,
    accessor: (row) => row.owner,
  },
  {
    id: "status",
    header: "Status",
    sortable: true,
    accessor: (row) => (
      <Badge
        variant={row.status === "Live" ? "success" : row.status === "Review" ? "warning" : "neutral"}
        appearance="soft"
        size="sm"
      >
        {row.status}
      </Badge>
    ),
    sortValue: (row) => row.status,
  },
  { id: "revenue", header: "Revenue", align: "end", sortable: true, accessor: (row) => row.revenue },
];

const categoryOptions: PimoluMultiSelectOption[] = [
  { value: "product", label: "Product" },
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "growth", label: "Growth" },
];

const formatViewportWidth = (viewport: ViewportMode) =>
  viewportModes.find((item) => item.id === viewport)?.width ?? "100%";

function SegmentedOptions<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="pdl-setting">
      <span className="pdl-setting__label">{label}</span>
      <div className="pdl-segment" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="pdl-segment__option"
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function InviteDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm">Invite teammate</Button>
      </DialogTrigger>
      <DialogContent className="pdl-dialog" size="sm">
        <DialogHeader>
          <DialogTitle>Invite to workspace</DialogTitle>
          <DialogDescription>
            Give a teammate access to the projects and reports in this workspace.
          </DialogDescription>
        </DialogHeader>
        <FormField label="Work email" helperText="They will receive a secure invitation link." required>
          <FormControl>
            <Input type="email" placeholder="name@company.com" />
          </FormControl>
        </FormField>
        <DialogFooter>
          <DialogClose>
            <Button appearance="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button>Send invitation</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EnterpriseComposition() {
  const [categories, setCategories] = useState<string[]>(["product", "design"]);

  return (
    <div className="pdl-enterprise">
      <div className="pdl-appbar">
        <div className="pdl-appbar__identity">
          <span className="pdl-monogram" aria-hidden="true">N</span>
          <span>Northstar</span>
          <span className="pdl-appbar__divider" aria-hidden="true">/</span>
          <span className="pdl-appbar__muted">Workspace</span>
        </div>
        <div className="pdl-appbar__actions">
          <Button size="sm" appearance="outline">Export</Button>
          <InviteDialog />
        </div>
      </div>

      <div className="pdl-scene-heading">
        <div>
          <span className="pdl-eyebrow">MONDAY, OCTOBER 20, 2026</span>
          <Heading level={2} className="pdl-scene-title">Good morning, Maya</Heading>
          <Paragraph className="pdl-scene-copy">Here is your workspace at a glance.</Paragraph>
        </div>
        <Badge variant="success" appearance="soft">All systems operational</Badge>
      </div>

      <div className="pdl-stat-grid">
        <Card className="pdl-stat-card">
          <CardContent>
            <Stat label="Monthly recurring revenue" value="$45,280" delta="8.2%" trend="up" description="Compared with September" />
          </CardContent>
        </Card>
        <Card className="pdl-stat-card">
          <CardContent>
            <Stat label="Active workspaces" value="128" delta="12" trend="up" description="Across 9 teams" />
          </CardContent>
        </Card>
        <Card className="pdl-stat-card">
          <CardContent>
            <Stat label="Open reviews" value="06" delta="2" trend="down" description="2 fewer this week" />
          </CardContent>
        </Card>
      </div>

      <Card className="pdl-table-card">
        <CardHeader>
          <div className="pdl-card-heading-row">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Track delivery and revenue across your portfolio.</CardDescription>
            </div>
            <Button size="sm" variant="neutral" appearance="outline">View reports</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="pdl-filter-row">
            <FormField label="Region">
              <FormControl>
                <Select defaultValue="all" aria-label="Region">
                  <option value="all">All regions</option>
                  <option value="europe">Europe</option>
                  <option value="north-america">North America</option>
                </Select>
              </FormControl>
            </FormField>
            <MultiSelect
              label="Categories"
              options={categoryOptions}
              value={categories}
              onValueChange={setCategories}
              placeholder="Filter categories"
              maxSelected={3}
              fullWidth
            />
          </div>
          <DataTable
            data={workspaceRows}
            columns={workspaceColumns}
            getRowId={(row) => row.id}
            caption="Workspace project summary"
            filterable
            pagination={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function GamingComposition() {
  return (
    <div className="pdl-game-scene" data-pimolu-theme="dark" data-pimolu-style="default">
      <div className="pdl-game-nav">
        <div className="pdl-game-brand"><span className="pdl-game-glyph">P</span> PIMOLU<span className="pdl-game-brand__sub">/ PLAY</span></div>
        <nav aria-label="Game sections" className="pdl-game-links">
          <a href="#design-lab" aria-current="page">Discover</a>
          <a href="#design-lab">Library</a>
          <a href="#design-lab">Community</a>
        </nav>
        <Button size="sm" appearance="outline">Profile · 12</Button>
      </div>

      <div className="pdl-game-hero">
        <div className="pdl-game-hero__art" aria-hidden="true">
          <span className="pdl-game-orbit pdl-game-orbit--one" />
          <span className="pdl-game-orbit pdl-game-orbit--two" />
          <span className="pdl-game-art-mark">08</span>
          <span className="pdl-game-art-caption">SEASON EIGHT</span>
        </div>
        <div className="pdl-game-hero__content">
          <Badge variant="primary" appearance="soft">Season 08 · Live now</Badge>
          <Heading level={2} className="pdl-game-title">Into the<br />unknown.</Heading>
          <Paragraph className="pdl-game-copy">A new frontier. New rivals. Your next story starts here.</Paragraph>
          <div className="pdl-game-actions">
            <Button>Play now <span aria-hidden="true">↗</span></Button>
            <Button appearance="outline">Watch trailer</Button>
          </div>
        </div>
      </div>

      <div className="pdl-game-lower">
        <Card className="pdl-game-card">
          <CardHeader>
            <CardDescription>YOUR SEASON PROGRESS</CardDescription>
            <CardTitle>Level 24 <span className="pdl-game-muted">/ 40</span></CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={62} max={100} label="Season progress" showValue />
            <p className="pdl-game-footnote">1,240 XP to the next reward</p>
          </CardContent>
        </Card>
        <Card className="pdl-game-card pdl-game-card--next">
          <div className="pdl-game-next-art" aria-hidden="true"><span>IX</span></div>
          <CardContent>
            <Badge variant="neutral" appearance="soft">Coming October 28</Badge>
            <CardTitle>Afterlight</CardTitle>
            <CardDescription>Wishlist the next chapter.</CardDescription>
            <Button size="sm" appearance="outline">Explore game</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const products = [
  { id: "arc", name: "Arc headphones", detail: "Studio sound · Graphite", price: "$249", rating: 5, badge: "Bestseller", art: "arc" },
  { id: "form", name: "Form speaker", detail: "Room-filling sound · Sand", price: "$189", rating: 5, badge: "New", art: "form" },
  { id: "wave", name: "Wave earbuds", detail: "Everyday audio · Cloud", price: "$129", rating: 4, badge: "Popular", art: "wave" },
];

function CommerceComposition() {
  const [sort, setSort] = useState("featured");

  return (
    <div className="pdl-commerce">
      <div className="pdl-commerce-banner">
        <span>OBJECTS FOR BETTER LISTENING</span>
        <span>Complimentary shipping over $100 <span aria-hidden="true">↗</span></span>
      </div>
      <div className="pdl-commerce-head">
        <div>
          <span className="pdl-eyebrow">THE SOUND COLLECTION</span>
          <Heading level={2} className="pdl-scene-title">Designed to move you.</Heading>
          <Paragraph className="pdl-scene-copy">Considered audio for every part of your day.</Paragraph>
        </div>
        <FormField label="Sort by">
          <FormControl>
            <Select value={sort} onValueChange={setSort} aria-label="Sort products">
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </Select>
          </FormControl>
        </FormField>
      </div>
      <div className="pdl-product-grid">
        {products.map((product) => (
          <Card key={product.id} className="pdl-product-card">
            <div className={`pdl-product-art pdl-product-art--${product.art}`} aria-label={`${product.name} product image`} role="img">
              <span className="pdl-product-art__object" />
              <Badge variant="neutral" appearance="soft" size="sm">{product.badge}</Badge>
            </div>
            <CardHeader>
              <div className="pdl-product-title-row">
                <CardTitle>{product.name}</CardTitle>
                <span className="pdl-product-price">{product.price}</span>
              </div>
              <CardDescription>{product.detail}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pdl-rating-row">
                <Rating value={product.rating} readOnly aria-label={`${product.rating} out of 5 stars`} />
                <span>{product.rating === 5 ? "4.9" : "4.7"} <span className="pdl-muted">(128)</span></span>
              </div>
              <Table density="sm" className="pdl-product-table">
                <TableHeader><TableRow><TableHead>Finish</TableHead><TableHead>Availability</TableHead></TableRow></TableHeader>
                <TableBody><TableRow><TableCell>Graphite</TableCell><TableCell>In stock</TableCell></TableRow></TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button fullWidth>Add to bag <span aria-hidden="true">↗</span></Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CreativeComposition() {
  return (
    <div className="pdl-creative">
      <div className="pdl-creative-nav">
        <span className="pdl-creative-wordmark">Forma<span>®</span></span>
        <nav aria-label="Studio navigation">
          <a href="#design-lab">Work</a>
          <a href="#design-lab">Studio</a>
          <a href="#design-lab">Journal</a>
        </nav>
        <Button size="sm" appearance="outline">Start a project</Button>
      </div>
      <Card className="pdl-creative-feature">
        <CardContent>
          <div className="pdl-creative-feature__copy">
            <span className="pdl-eyebrow">INDEPENDENT DESIGN PRACTICE · PARIS</span>
            <Heading level={1} className="pdl-creative-title">We make<br /><em>meaning</em><br />visible.</Heading>
            <Paragraph className="pdl-creative-lead">A small, multidisciplinary studio shaping useful things with a point of view.</Paragraph>
            <div className="pdl-creative-actions">
              <Button>Explore selected work <span aria-hidden="true">↗</span></Button>
              <Badge variant="neutral" appearance="outline">Available for Q1 2027</Badge>
            </div>
          </div>
          <div className="pdl-creative-art" aria-label="Abstract composition in orange, cream and lilac" role="img">
            <span className="pdl-creative-art__disc" />
            <span className="pdl-creative-art__bar" />
            <span className="pdl-creative-art__caption">FORM / 2026</span>
          </div>
        </CardContent>
      </Card>
      <div className="pdl-creative-footer">
        <span>SELECTED PROJECTS · 2022—2026</span>
        <span>Brand · Digital · Objects</span>
        <span>Paris / Everywhere</span>
      </div>
    </div>
  );
}

function CompositionContent({ composition }: { composition: Composition }) {
  switch (composition) {
    case "enterprise":
      return <EnterpriseComposition />;
    case "gaming":
      return <GamingComposition />;
    case "commerce":
      return <CommerceComposition />;
    case "creative":
      return <CreativeComposition />;
  }
}

function DirectionPreview({
  direction,
  composition,
  theme,
  viewport,
}: {
  direction: Direction;
  composition: Composition;
  theme: ThemeMode;
  viewport: ViewportMode;
}) {
  const definition = directions.find((item) => item.id === direction)!;
  const selectedTheme = composition === "gaming" ? "dark" : theme;
  const frameStyle = {
    "--pdl-frame-width": formatViewportWidth(viewport),
  } as CSSProperties;

  return (
    <article className={`pdl-direction pdl-direction--${direction}`}>
      <div className="pdl-direction__heading">
        <span className="pdl-direction__index">{definition.number}</span>
        <div>
          <Heading level={3} className="pdl-direction__title">{definition.name}</Heading>
          <p className="pdl-direction__note">{definition.note}</p>
        </div>
        <span className="pdl-direction__mode">{selectedTheme}</span>
      </div>
      <div
        className="pdl-preview"
        data-direction={direction}
        data-pimolu-theme={selectedTheme}
        data-pimolu-style="default"
        data-viewport={viewport}
        style={frameStyle}
      >
        <CompositionContent composition={composition} />
      </div>
    </article>
  );
}

function PresetGallery({ theme }: { theme: ThemeMode }) {
  return (
    <div className="pdl-presets">
      {presets.map((preset) => (
        <div
          className="pdl-preset"
          key={preset}
          data-pimolu-style={preset as PimoluStylePreset}
          data-pimolu-theme={theme}
        >
          <Card size="sm" appearance="outline">
            <CardHeader>
              <CardTitle>{preset}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="pdl-preset__buttons">
                <Button size="sm">Continue</Button>
                <Badge variant="primary" appearance="soft">Preview</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

export function DesignLabPage() {
  const [directionMode, setDirectionMode] = useState<DirectionMode>("compare");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [composition, setComposition] = useState<Composition>("enterprise");
  const visibleDirections: Direction[] =
    directionMode === "compare" ? ["neutral", "adaptive"] : [directionMode];

  return (
    <div className="pdl-lab">
      <PageHeader
        title="Pimolu Design Lab"
        hint="A controlled visual study for the future Default. Compare two independent art directions across four product contexts, with real Pimolu components. Nothing here changes the public design system."
      />

      <section className="pdl-lab-intro" aria-label="Design Lab overview">
        <div className="pdl-lab-intro__copy">
          <span className="pdl-kicker">PHASE B.2 · IDENTITY STUDY</span>
          <Heading level={2} className="pdl-lab-title">One system. Your identity.</Heading>
          <Paragraph className="pdl-lab-lead">
            Test how one coherent component set can feel considered in a boardroom, a storefront, a game world or a creative studio.
          </Paragraph>
        </div>
        <div className="pdl-lab-intro__index" aria-hidden="true">
          <span>2</span><i /> <span>4</span><i /> <span>7</span>
          <small>directions · contexts · presets</small>
        </div>
      </section>

      <section className="pdl-controls" aria-label="Design comparison controls">
        <SegmentedOptions
          label="Direction"
          value={directionMode}
          options={[
            { id: "compare", label: "Compare both" },
            { id: "neutral", label: "A · Neutral" },
            { id: "adaptive", label: "B · Adaptive" },
          ]}
          onChange={setDirectionMode}
        />
        <SegmentedOptions
          label="Color mode"
          value={theme}
          options={[{ id: "light", label: "Light" }, { id: "dark", label: "Dark" }]}
          onChange={setTheme}
        />
        <SegmentedOptions
          label="Presentation width"
          value={viewport}
          options={viewportModes.map(({ id, label }) => ({ id, label }))}
          onChange={setViewport}
        />
      </section>

      <section className="pdl-compositions" aria-label="Product compositions">
        <div className="pdl-section-heading">
          <div>
            <span className="pdl-kicker">SAME COMPONENTS · FOUR WORLDS</span>
            <Heading level={2} className="pdl-section-title">Choose a context</Heading>
          </div>
          <span className="pdl-section-count">01 — 04</span>
        </div>

        <Tabs value={composition} onValueChange={(value) => setComposition(value as Composition)}>
          <TabsList aria-label="Choose a product context" className="pdl-scenario-tabs">
            {compositions.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                <span className="pdl-tab-number">{item.index}</span>{item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {compositions.map((item) => (
            <TabsContent key={item.id} value={item.id} className="pdl-scenario-panel">
              <div className={`pdl-direction-grid ${visibleDirections.length === 1 ? "pdl-direction-grid--single" : ""}`}>
                {visibleDirections.map((direction) => (
                  <DirectionPreview
                    key={`${direction}-${item.id}`}
                    direction={direction}
                    composition={item.id}
                    theme={theme}
                    viewport={viewport}
                  />
                ))}
              </div>
              {item.id === "gaming" && (
                <p className="pdl-context-note">Gaming is intentionally shown in its native dark environment so its art direction remains legible in either comparison mode.</p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section className="pdl-preset-section" aria-labelledby="pdl-presets-title">
        <div className="pdl-section-heading">
          <div>
            <span className="pdl-kicker">CURRENT SYSTEM · UNCHANGED</span>
            <Heading level={2} className="pdl-section-title" id="pdl-presets-title">Existing style presets</Heading>
            <Paragraph className="pdl-scene-copy">A compact preview of every preset currently exported by the repository.</Paragraph>
          </div>
          <span className="pdl-section-count">{presets.length} PRESETS</span>
        </div>
        <PresetGallery theme={theme} />
      </section>

      <footer className="pdl-lab-footnote">
        <span>Experimental Playground surface</span>
        <span>Public React, token, preset and provider files are untouched.</span>
      </footer>
    </div>
  );
}

