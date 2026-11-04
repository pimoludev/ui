import { useRef, useState, type CSSProperties } from "react";
import {
  Alert, Badge, Button, Card, CardContent, Checkbox, Form, FormError,
  FormSubmit, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem,
  NavbarMenu, NavbarToggle, PimoluProvider, SegmentedControl, Select,
  Stat, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsContent, TabsList, TabsTrigger, useForm,
  type PimoluDensity, type PimoluStylePreset,
} from "@pimolu/react";
import { presets } from "../demo-data";
import baseline from "./ink-signal-baseline.json";
import "../../../website/app/fonts.css";
import "./ink-signal-demo.css";

type Surface = "marketing" | "form" | "dashboard";
type Mode = "light" | "dark";

function MarketingSurface() {
  const [message, setMessage] = useState("");
  return (
    <>
      <Navbar collapsible appearance="transparent" bordered>
        <NavbarBrand>pimolu / create</NavbarBrand>
        <NavbarToggle />
        <NavbarMenu label="Pilot navigation">
          <NavbarContent aria-label="Pilot navigation">
            <NavbarItem href="#review" onClick={(event) => { event.preventDefault(); setMessage("Explore the live form and dashboard using the tabs above."); }}>Components</NavbarItem>
            <NavbarItem href="#review" onClick={(event) => { event.preventDefault(); setMessage("These compositions use the real Pimolu components."); }}>Blocks</NavbarItem>
          </NavbarContent>
        </NavbarMenu>
      </Navbar>
      <div className="ink-pilot-marketing">
        <p className="ink-pilot-eyebrow">One system. Your identity.</p>
        <h2 className="ink-pilot-display">Beautiful by default.<br /><em>Yours by design.</em></h2>
        <p>Thoughtful components, free to become what you imagine. Build with clarity. Keep your character.</p>
        <div className="ink-pilot-actions">
          <Button onClick={() => setMessage("Choose the Form tab to try validation and submission.")}>Explore components</Button>
          <Button appearance="outline" onClick={() => setMessage("Choose the Dashboard tab to filter real local data.")}>Try the dashboard</Button>
        </div>
        {message && <p role="status" className="ink-pilot-feedback">{message}</p>}
        <div className="ink-pilot-features">
          {[
            ["Thoughtfully crafted", "Precise details and a quiet visual hierarchy."],
            ["Make it yours", "Customize through shared tokens and typed parts."],
            ["Ready to build", "One foundation for your website and application."],
          ].map(([title, description]) => (
            <Card key={title}><CardContent><h3>{title}</h3><p>{description}</p></CardContent></Card>
          ))}
        </div>
      </div>
    </>
  );
}

function FormSurface() {
  const region = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const form = useForm({
    defaultValues: { email: "", password: "", remember: false },
    validate: (values) => ({
      ...(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? { email: "Enter a valid email address." } : {}),
      ...(values.password.length < 8 ? { password: "Use at least eight characters." } : {}),
    }),
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 450));
      setSubmitted(true);
    },
  });
  return (
    <div className="ink-pilot-form" ref={region}>
      <div><h2>Welcome back.</h2><p>A familiar place for your next idea.</p></div>
      <Card><CardContent>
        <Form form={{ ...form, handleSubmit: async (event) => {
          const valid = await form.handleSubmit(event);
          if (!valid) requestAnimationFrame(() => region.current?.querySelector<HTMLInputElement>("[aria-invalid='true']")?.focus());
          return valid;
        } }} autoComplete="off">
          <Input label="Email address" type="email" placeholder="you@example.com" fullWidth {...form.register("email")} />
          <FormError name="email" />
          <Input label="Password" type="password" placeholder="At least eight characters" fullWidth {...form.register("password")} />
          <FormError name="password" />
          <Checkbox label="Remember this device" checked={form.values.remember} onChange={(event) => form.setValue("remember", event.target.checked)} />
          <FormSubmit fullWidth>Sign in</FormSubmit>
          <p>Local preview. Use fictional credentials.</p>
        </Form>
        {submitted && <Alert variant="success" title="You’re all set">The local form was validated. No credentials were sent.</Alert>}
      </CardContent></Card>
    </div>
  );
}

const initialProjects = [
  ["Atlas workspace", "Camille M.", "Active", "2026-11-01"],
  ["Northstar", "Alex R.", "In review", "2026-10-30"],
  ["Horizon CRM", "Inès L.", "Active", "2026-10-28"],
  ["Form Studio", "Robin T.", "Active", "2026-10-25"],
  ["Paper Notes", "Manon B.", "In review", "2026-10-24"],
  ["Orbit Portal", "Sam K.", "Active", "2026-10-23"],
  ["Compass", "Eva P.", "In review", "2026-10-20"],
  ["Acorn Lab", "Yann D.", "Active", "2026-10-19"],
];

function DashboardSurface() {
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const filtered = projects.filter((project) => project.join(" ").toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="ink-pilot-dashboard">
      <header><div><h2>Overview</h2><p>Your workspace at a glance.</p></div>
        <Button onClick={() => setProjects((previous) => [...previous, [`Project ${previous.length + 1}`, "You", "Draft", "2026-11-04"]])}>New project</Button>
      </header>
      <div className="ink-pilot-stats">
        <Card><CardContent><Stat label="Revenue" value="€24,580" description="+8.2% this month" /></CardContent></Card>
        <Card><CardContent><Stat label="Active projects" value={String(projects.length)} description="Across your workspace" /></CardContent></Card>
        <Card><CardContent><Stat label="Team members" value="12" description="+2 this week" /></CardContent></Card>
      </div>
      <Card><CardContent>
        <Input label="Find a project" placeholder="Search projects or owners…" value={query} onChange={(event) => setQuery(event.target.value)} fullWidth />
        <div
          className="ink-pilot-table"
          role="region"
          tabIndex={0}
          aria-label="Recent projects table, scroll horizontally"
        ><Table aria-label="Recent projects">
          <TableHeader><TableRow>{["Project", "Owner", "Status", "Updated"].map((heading) => <TableHead key={heading}>{heading}</TableHead>)}</TableRow></TableHeader>
          <TableBody>{filtered.map(([name, owner, status, date]) => (
            <TableRow key={name}><TableCell>{name}</TableCell><TableCell>{owner}</TableCell><TableCell><Badge variant={status === "Active" ? "primary" : "neutral"} appearance="soft">{status}</Badge></TableCell><TableCell><time dateTime={date}>{date}</time></TableCell></TableRow>
          ))}</TableBody>
        </Table></div>
        <p role="status">{filtered.length} projects</p>
      </CardContent></Card>
    </div>
  );
}

function ReferenceSurface({ surface }: { surface: Surface }) {
  return surface === "marketing" ? <MarketingSurface /> : surface === "form" ? <FormSurface /> : <DashboardSurface />;
}

export function InkSignalDemo() {
  const [theme, setTheme] = useState<Mode>("light");
  const [density, setDensity] = useState<PimoluDensity>("comfortable");
  const [preset, setPreset] = useState<PimoluStylePreset>("default");
  const [surface, setSurface] = useState<Surface>("marketing");
  const [compare, setCompare] = useState(false);
  const oldVariables = Object.fromEntries([
    ...Object.entries(baseline.themes[theme]).map(([key, value]) => [`--pimolu-${key}`, value]),
    ...Object.entries({ ...baseline.visuals.light, ...(theme === "dark" ? baseline.visuals.dark : {}) }).map(([key, value]) => [`--pimolu-${key}`, value]),
    ["--pimolu-control-border", baseline.themes[theme].border],
    ["--pimolu-radius-sm", "6px"], ["--pimolu-radius-md", "10px"], ["--pimolu-radius-lg", "14px"],
    ["--pimolu-font-body", "Inter, system-ui, sans-serif"],
    ["--pimolu-font-display", "system-ui, sans-serif"],
    ["--pimolu-font-mono", "ui-monospace, monospace"],
  ]) as CSSProperties;

  return (
    <section className="ink-pilot" aria-label="Ink and Signal live review">
      <div className="ink-pilot-controls">
        <SegmentedControl aria-label="Review color mode" value={theme} onValueChange={(value) => setTheme(value as Mode)} options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
        <Select label="Review density" value={density} onValueChange={(value) => setDensity(value as PimoluDensity)}>
          <option value="comfortable">Comfortable</option><option value="compact">Compact</option><option value="spacious">Spacious</option>
        </Select>
        <Select label="Review preset" value={preset} onValueChange={(value) => setPreset(value as PimoluStylePreset)}>
          {presets.map((value) => <option key={value} value={value}>{value}</option>)}
        </Select>
        <Checkbox label="Compare with beta.6 Default" checked={compare} onChange={(event) => setCompare(event.target.checked)} />
      </div>
      <Tabs value={surface} onValueChange={(value) => setSurface(value as Surface)}>
        <TabsList aria-label="Review surface">
          <TabsTrigger value="marketing">01 · Marketing</TabsTrigger>
          <TabsTrigger value="form">02 · Form</TabsTrigger>
          <TabsTrigger value="dashboard">03 · Dashboard</TabsTrigger>
        </TabsList>
        {(["marketing", "form", "dashboard"] as const).map((value) => (
          <TabsContent key={value} value={value}>
            <div className={`ink-pilot-comparison${compare ? " ink-pilot-comparison--pair" : ""}`}>
              {compare && <PimoluProvider theme={theme} stylePreset="default" density={density} className="ink-pilot-provider">
                <div className="ink-pilot-reference" style={oldVariables}>
                  <p className="ink-pilot-caption">Slate / Indigo · beta.6 reference</p>
                  <ReferenceSurface surface={value} />
                </div>
              </PimoluProvider>}
              <PimoluProvider theme={theme} stylePreset={preset} density={density} className="ink-pilot-provider">
                <div className="ink-pilot-reference" data-review-current>
                  <p className="ink-pilot-caption">{preset === "default" ? "Slate / Indigo · current design" : `${preset} · preset review`}</p>
                  <ReferenceSurface surface={value} />
                </div>
              </PimoluProvider>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
