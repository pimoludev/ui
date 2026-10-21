"use client";

import { useState } from "react";
import {
  AreaChart, Avatar, Badge, Button, Card, CardContent, CardHeader, CardTitle,
  Checkbox, CodeBlock, Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger, Input, PimoluProvider, Progress, Select, Stat,
  Sparkline, Switch, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsContent, TabsList, TabsTrigger,
  type PimoluRadius, type PimoluStylePreset,
} from "@pimolu/react";
import { presetNames } from "@/lib/preferences";

const initialProjects = [
  { id: "atlas", name: "Atlas website", category: "Website", status: "In progress" },
  { id: "studio", name: "Studio workspace", category: "Application", status: "In review" },
  { id: "identity", name: "Identity system", category: "Design system", status: "Complete" },
];
const initialTasks = [
  { label: "Define your visual identity", done: true },
  { label: "Build the first composition", done: true },
  { label: "Make it your own", done: false },
];

export function WorkspaceDemo() {
  const [period, setPeriod] = useState("month");
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const weekly = period === "week";
  const revenue = weekly ? [850, 1200, 980, 1480, 1100, 1370, 1260] : [3200, 4100, 3800, 5900, 6400, 9080];
  const completed = tasks.filter((task) => task.done).length;
  const filtered = projects.filter((project) =>
    `${project.name} ${project.category} ${project.status}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="home-workspace">
      <div className="home-workspace-bar flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3"><span className="home-mini-mark" aria-hidden="true">o</span><span className="font-semibold">Orbit <span className="font-normal text-muted">/ Workspace</span></span></div>
        <div className="flex items-center gap-3"><Badge variant="success">Live demo</Badge><Avatar name="Alex Morgan" size="sm" /></div>
      </div>
      <div className="home-workspace-body space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="home-eyebrow mb-2">A little more clarity, every day.</p><h3 className="text-2xl font-semibold tracking-tight">Your next chapter starts here.</h3></div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger><Button endIcon={<span>+</span>}>New project</Button></DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader><DialogTitle>A fresh start.</DialogTitle><DialogDescription>Create a project in this local demonstration. Nothing is sent to a server.</DialogDescription></DialogHeader>
              <form className="space-y-5 mt-6" onSubmit={(event) => {
                event.preventDefault();
                const title = name.trim();
                if (!title) return;
                setProjects((current) => [...current, { id: crypto.randomUUID(), name: title, category: "Application", status: "In progress" }]);
                setAnnouncement(`${title} created. Open Projects to see it.`);
                setName("");
                setOpen(false);
              }}>
                <Input label="Project name" placeholder="Something worth building" value={name} onChange={(event) => setName(event.target.value)} required maxLength={64} fullWidth />
                <Button type="submit" fullWidth disabled={!name.trim()}>Create project</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card size="lg"><CardContent><Stat label="Revenue" value={weekly ? "$8,240" : "$32,480"} delta={weekly ? "6.2%" : "12.8%"} trend="up" description={weekly ? "Compared with last week" : "Compared with last month"} /></CardContent></Card>
          <Card size="lg"><CardContent><Stat label="Projects" value={String(projects.length).padStart(2, "0")} description="Good ideas, taking shape" /></CardContent></Card>
          <Card size="lg"><CardContent><Stat label="Launch checklist" value={`${completed} / ${tasks.length}`} description={completed === tasks.length ? "You are ready for takeoff" : "One step closer to launch"} /></CardContent></Card>
        </div>
        <Tabs defaultValue="overview">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <TabsList aria-label="Workspace views"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger></TabsList>
            <Select aria-label="Reporting period" value={period} onValueChange={setPeriod} size="sm" containerClassName="w-40"><option value="month">Last 30 days</option><option value="week">Last 7 days</option></Select>
          </div>
          <TabsContent value="overview">
            <div className="grid gap-5 lg:grid-cols-[1.65fr_1fr]">
              <Card className="min-w-0">
                <CardHeader><div className="flex items-center justify-between gap-4"><CardTitle>Steady progress.</CardTitle><Badge variant="primary" appearance="soft">Revenue</Badge></div></CardHeader>
                <CardContent>
                  <div className="hidden sm:block"><AreaChart aria-label={`Revenue over the last ${weekly ? "7" : "30"} days`} series={[{ name: "Revenue", values: revenue }]} labels={weekly ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["01", "06", "11", "16", "21", "30"]} width={640} height={240} valueFormatter={(value) => `$${(value / 1000).toFixed(1)}k`} showLegend={false} showPoints /></div>
                  <div className="sm:hidden space-y-3">
                    <p className="text-sm text-muted">Revenue over the last {weekly ? "7" : "30"} days</p>
                    <Sparkline data={revenue} area width={280} height={110} aria-label="Revenue trend" valueFormatter={(value) => `$${value.toLocaleString("en-US")}`} />
                    <div className="flex justify-between gap-3 text-sm text-muted"><span>{weekly ? "Mon" : "Day 1"} · ${revenue[0].toLocaleString("en-US")}</span><span>{weekly ? "Sun" : "Day 30"} · ${revenue[revenue.length - 1].toLocaleString("en-US")}</span></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Ready when you are.</CardTitle><p className="text-sm text-muted mt-1">Small steps. Something great.</p></CardHeader>
                <CardContent className="space-y-5"><Progress label="Launch checklist" value={completed} max={tasks.length} showValue formatValue={(value, max) => `${value} of ${max}`} /><div className="flex flex-col gap-4">{tasks.map((task, index) => <Checkbox key={task.label} label={task.label} checked={task.done} onCheckedChange={(done) => setTasks((current) => current.map((item, i) => i === index ? { ...item, done } : item))} />)}</div></CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="projects">
            <Card size="lg"><CardContent className="space-y-5">
              <Input label="Find a project" placeholder="Search by name, type or status…" value={query} onChange={(event) => setQuery(event.target.value)} fullWidth />
              <Table containerClassName="hidden sm:block" caption={`${filtered.length} project${filtered.length === 1 ? "" : "s"} in this workspace`}>
                <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>{filtered.length ? filtered.map((project) => <TableRow key={project.id}><TableCell>{project.name}</TableCell><TableCell>{project.category}</TableCell><TableCell><Badge variant={project.status === "Complete" ? "success" : project.status === "In review" ? "warning" : "primary"}>{project.status}</Badge></TableCell></TableRow>) : <TableRow><TableCell colSpan={3}>No projects match “{query}”.</TableCell></TableRow>}</TableBody>
              </Table>
              <div className="sm:hidden space-y-4">
                {filtered.length ? <ul className="m-0 list-none p-0 space-y-5" aria-label="Projects">{filtered.map((project) => (
                  <li key={project.id} className="border-t border-border pt-4 space-y-2">
                    <h4 className="text-base font-medium break-words">{project.name}</h4>
                    <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm text-muted">{project.category}</span><Badge variant={project.status === "Complete" ? "success" : project.status === "In review" ? "warning" : "primary"}>{project.status}</Badge></div>
                  </li>
                ))}</ul> : <p>No projects match “{query}”.</p>}
                <p className="text-sm text-muted">{filtered.length} project{filtered.length === 1 ? "" : "s"} in this workspace</p>
              </div>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
        <p role="status" className="text-sm text-muted min-h-5">{announcement || "Sample data. Real components. Try the tabs, checklist or create a project."}</p>
      </div>
    </div>
  );
}

export function IdentityDemo() {
  const [preset, setPreset] = useState<PimoluStylePreset>("default");
  const [dark, setDark] = useState(false);
  const [radius, setRadius] = useState<PimoluRadius | undefined>();
  const [email, setEmail] = useState(true);
  const [saved, setSaved] = useState(false);
  const snippet = `import { Button, PimoluProvider } from "@pimolu/react";\n\nexport function Preview() {\n  return (\n    <PimoluProvider\n      stylePreset="${preset}"\n      theme="${dark ? "dark" : "light"}"${radius ? `\n      radius="${radius}"` : ""}\n    >\n      <Button>Make it yours</Button>\n    </PimoluProvider>\n  );\n}`;
  return (
    <div className="home-identity-grid grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select fullWidth label="Visual preset" value={preset} onValueChange={(value) => setPreset(value as PimoluStylePreset)}>{presetNames.map((value) => <option key={value} value={value}>{value}</option>)}</Select>
          <Select fullWidth label="Corners" value={radius ?? "preset"} onValueChange={(value) => setRadius(value === "preset" ? undefined : value as PimoluRadius)}><option value="preset">Preset default</option><option value="sharp">Sharp</option><option value="medium">Medium</option><option value="round">Round</option></Select>
        </div>
        <Switch label="Dark preview" checked={dark} onCheckedChange={setDark} />
        <p className="text-sm text-muted">These controls change only the preview below. Your site preferences stay yours.</p>
        <PimoluProvider theme={dark ? "dark" : "light"} stylePreset={preset} radius={radius} className="home-identity-preview">
          <Card fullWidth>
            <CardHeader><div className="flex items-start justify-between gap-4"><Avatar name="Morgan Lee" size="lg" /><Badge variant="success">Available</Badge></div><CardTitle className="mt-4">A space that feels like you.</CardTitle><p className="text-sm text-muted mt-2">A few considered details make all the difference.</p></CardHeader>
            <CardContent className="space-y-6"><Switch label="Email notifications" description="Just the updates that matter." checked={email} onCheckedChange={(value) => { setEmail(value); setSaved(false); }} /><Button fullWidth onClick={() => setSaved(true)}>Save preferences</Button><p role="status" className="text-sm text-muted min-h-5">{saved ? `Saved for this preview: email ${email ? "on" : "off"}.` : "Try a different preset. The structure stays familiar."}</p></CardContent>
          </Card>
        </PimoluProvider>
      </div>
      <div className="home-code-panel flex flex-col justify-center gap-6">
        <div><span className="home-eyebrow">One provider. A different perspective.</span><h3 className="text-2xl tracking-tight font-semibold mt-3">Your identity is a first-class feature.</h3><p className="text-muted mt-3">Colors, corners and visual character work together. Choose a starting point, then shape the details.</p></div>
        <CodeBlock code={snippet} language="tsx" filename="app/providers.tsx" wrap />
        <p className="text-sm text-muted">Live code updates with your choices. Copy it into your existing Pimolu integration.</p>
      </div>
    </div>
  );
}
