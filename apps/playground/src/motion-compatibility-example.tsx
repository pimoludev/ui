import { useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { MotionFooter, MotionSidebar, MotionAppShell, MotionDashboardLayout as MotionDashboard, MotionDocsLayout as MotionDocs } from "@pimolu/motion";
import { AppShell, Button, DashboardLayout, DocsLayout, Footer, Sidebar } from "@pimolu/react";
import { Section } from "./section";

export function MotionCompatibilityExample({ target }: { target: "Footer" | "Sidebar" | "AppShell" | "DashboardLayout" | "DocsLayout" }) {
  const [animated, setAnimated] = useState(false);
  const [shifted, setShifted] = useState(false);
  const reduced = useReducedMotion();
  const movement = { initial: false as const, animate: { x: shifted && !reduced ? 16 : 0 }, transition: { duration: reduced ? 0 : 0.2 } };
  const FooterSurface = animated ? MotionFooter : Footer;
  const SidebarSurface = animated ? MotionSidebar : Sidebar;
  const AppSurface = animated ? MotionAppShell : AppShell;
  const DashboardSurface = animated ? MotionDashboard : DashboardLayout;
  const DocsSurface = animated ? MotionDocs : DocsLayout;
  const props = animated ? movement : {};
  return <Section title="Optional Motion integration" hint="This application opts into @pimolu/motion. Plain Pimolu works without Motion; the same DOM root retains its styles and semantics.">
    <div className="pg-row">
      <Button appearance="outline" aria-pressed={animated} onClick={() => setAnimated(!animated)}>{animated ? "Use plain component" : "Enable Motion"}</Button>
      <Button disabled={!animated} onClick={() => setShifted(!shifted)}>Move surface</Button>
    </div>
    <MotionConfig reducedMotion="user">
      <div style={{ padding: 24, overflow: "hidden" }}>
        {target === "Footer" && <FooterSurface {...props} brand="Pimolu" columns={[]} description="A motion-ready footer." />}
        {target === "Sidebar" && <SidebarSurface {...props} aria-label="Motion sidebar">Workspace navigation</SidebarSurface>}
        {target === "AppShell" && <AppSurface {...props} style={{ minHeight: 220 }} header="Workspace">Your application content</AppSurface>}
        {target === "DashboardLayout" && <DashboardSurface {...props} style={{ minHeight: 220 }} sidebar="Navigation">Your dashboard content</DashboardSurface>}
        {target === "DocsLayout" && <DocsSurface {...props} style={{ minHeight: 220 }} sidebar="Guides">Your documentation content</DocsSurface>}
      </div>
    </MotionConfig>
  </Section>;
}
