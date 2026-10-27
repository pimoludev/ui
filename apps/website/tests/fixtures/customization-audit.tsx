import { createRoot } from "react-dom/client";
import type { CSSProperties } from "react";
import {
  Button, Card, CardContent, Dialog, DialogContent, DialogTitle,
  DialogTrigger, Input, PimoluProvider, Select, Slider,
  Combobox, MultiSelect, Drawer, DrawerTrigger, DrawerContent, DrawerTitle,
  type PimoluStylePreset, type PimoluTheme,
} from "@pimolu/react";

const query = new URLSearchParams(location.search);
const preset = (query.get("preset") ?? "default") as PimoluStylePreset;
const theme = (query.get("theme") ?? "light") as PimoluTheme;
const contract = query.get("contract") === "1";
const icon = <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12M8 2v12" stroke="currentColor" /></svg>;
const variables = (values: Record<string, string>) => values as CSSProperties;

function ScopeDialog({ isolated = false }: { isolated?: boolean }) {
  const content = (
    <Dialog>
      <DialogTrigger><Button>Open {isolated ? "isolated" : "local"} dialog</Button></DialogTrigger>
      <DialogContent
        className="audit-dialog"
        classNames={contract ? { content: !isolated ? "audit-hook-dialog" : undefined, overlay: "audit-hook-overlay", closeButton: "audit-hook-close" } : undefined}
        style={contract ? { padding: 27 } : undefined}
      >
        <DialogTitle className="audit-dialog-title">Custom dialog</DialogTitle>
        <Button className="audit-dialog-token">Scoped button</Button>
      </DialogContent>
    </Dialog>
  );
  return isolated
    ? <PimoluProvider persist={false} className="audit-provider-scope" brandColor="#126b43">{content}</PimoluProvider>
    : <div className="audit-local-scope">{content}</div>;
}

function ScopeSelect({ isolated = false }: { isolated?: boolean }) {
  const content = (
    <Select
      label={isolated ? "Isolated choice" : "Local choice"}
      className="audit-select-control"
      defaultValue="one"
      classNames={contract && !isolated ? { listbox: "audit-hook-select", option: "audit-hook-option" } : undefined}
    >
      <option value="one">First option</option>
      <option value="two">Second option</option>
    </Select>
  );
  return isolated
    ? <PimoluProvider persist={false} className="audit-provider-scope">{content}</PimoluProvider>
    : <div className="audit-local-scope">{content}</div>;
}

createRoot(document.getElementById("root")!).render(
  <PimoluProvider theme={theme} stylePreset={preset} persist={false}>
    <main>
      <h1>Pimolu customization audit</h1>
      <section className="audit-grid">
        <PimoluProvider persist={false} brandColor="#126b43"><Button id="brand">Provider brand</Button></PimoluProvider>
        <div style={variables({ "--pimolu-primary": "#126b43" })}><Button id="token">Local semantic token</Button></div>
        <Button id="radius" className="audit-radius">Custom radius</Button>
        <Button id="hover" className="audit-hover">Simple hover</Button>
        <Button id="safe-hover" className="audit-safe-hover">Guarded hover</Button>
        <Button id="icon" className="audit-icon" classNames={contract ? { startIcon: "audit-hook-icon", label: "audit-hook-label" } : undefined} startIcon={icon}>Custom icon gap</Button>
        <Button id="inline" style={{ background: "#126b43", borderRadius: 14 }}>Inline style</Button>
        <Button id="tw-radius" className="rounded-[14px]">Tailwind radius</Button>
        <Button id="tw-hover" className="hover:bg-[#b45309]">Tailwind hover</Button>
        <Button id="tw-icon" className="gap-[18px]" startIcon={icon}>Tailwind icon gap</Button>
        <Button id="disabled" className="audit-safe-hover" disabled>Disabled</Button>
        <Input id="field" label="Custom field" className="audit-input-control" containerClassName="audit-input-container" />
        <Card className="audit-card"><CardContent className="audit-card-content">Custom card</CardContent></Card>
        <Slider label="Custom thumb" defaultValue={35} style={variables({ "--pimolu-slider-thumb-size": "26px" })} />
        <ScopeSelect />
        <ScopeSelect isolated />
        <ScopeDialog />
        <ScopeDialog isolated />
        {contract && <>
          <Combobox label="Hook combobox" options={[{ value: "one", label: "First" }, { value: "two", label: "Unavailable", disabled: true }]} classNames={{ listbox: "audit-hook-combo", option: "audit-hook-option" }} />
          <MultiSelect label="Hook multi" options={[{ value: "one", label: "First" }, { value: "two", label: "Unavailable", disabled: true }]} classNames={{ listbox: "audit-hook-multi", option: "audit-hook-option", tag: "audit-hook-tag" }} />
          <Drawer><DrawerTrigger><Button>Open hook drawer</Button></DrawerTrigger><DrawerContent classNames={{ content: "audit-hook-drawer", overlay: "audit-hook-overlay", closeButton: "audit-hook-close" }} style={{ padding: 27 }}><DrawerTitle>Preferences</DrawerTitle><Button>Drawer action</Button></DrawerContent></Drawer>
        </>}
      </section>
    </main>
  </PimoluProvider>,
);
