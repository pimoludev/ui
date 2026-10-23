import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { motion } from "motion/react";
import { AppShell } from "./app-shell/app-shell";
import { DashboardLayout } from "./dashboard-layout/dashboard-layout";
import { DocsLayout } from "./docs-layout/docs-layout";
import { Footer } from "./footer/footer";
import { Sidebar } from "./sidebar/sidebar";
import { Box } from "./box/box";
import { Button } from "./button/button";
import { Card } from "./card/card";

const MotionFooter = motion.create(Footer);
const MotionSidebar = motion.create(Sidebar);
const MotionAppShell = motion.create(AppShell);
const MotionDashboard = motion.create(DashboardLayout);
const MotionDocs = motion.create(DocsLayout);
const MotionBox = motion.create(Box);
const MotionButton = motion.create(Button);
const MotionCard = motion.create(Card);

describe("optional Motion DOM contract", () => {
  it("forwards refs on all five layouts without loading an animation adapter", () => {
    const footer = createRef<HTMLElement>();
    const sidebar = createRef<HTMLElement>();
    const app = createRef<HTMLDivElement>();
    const dashboard = createRef<HTMLDivElement>();
    const docs = createRef<HTMLDivElement>();
    render(<><Footer ref={footer} columns={[]} /><Sidebar ref={sidebar}>Navigation</Sidebar><AppShell ref={app} header="Header">App</AppShell><DashboardLayout ref={dashboard} sidebar="Side">Dashboard</DashboardLayout><DocsLayout ref={docs} sidebar="Docs">Guide</DocsLayout></>);
    expect(footer.current?.tagName).toBe("FOOTER");
    expect(sidebar.current?.tagName).toBe("ASIDE");
    for (const ref of [app, dashboard, docs]) expect(ref.current?.tagName).toBe("DIV");
  });

  it("applies Motion styles to the same DOM root as the ref and Pimolu classes", () => {
    const props = { initial: { x: 12, opacity: 0.7 }, animate: { x: 12, opacity: 0.7 } };
    render(<><MotionFooter {...props} columns={[]} data-testid="footer" /><MotionSidebar {...props} data-testid="sidebar" /><MotionAppShell {...props} header="Header" data-testid="app" /><MotionDashboard {...props} sidebar="Side" data-testid="dashboard" /><MotionDocs {...props} sidebar="Docs" data-testid="docs" /><MotionBox {...props} p={4} data-testid="box" /><MotionButton {...props} loading data-testid="button">Save</MotionButton><MotionCard {...props} data-testid="card">Card</MotionCard></>);
    for (const name of ["footer", "sidebar", "app", "dashboard", "docs", "box", "button", "card"]) {
      const node = screen.getByTestId(name);
      expect(node.style.transform).toContain("12px");
      expect(node.style.opacity).toBe("0.7");
      expect(node.className).toContain("pimolu-");
      expect(node).not.toHaveAttribute("animate");
    }
    expect(screen.getByTestId("button")).toBeDisabled();
    expect(screen.getByTestId("button")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("box").style.getPropertyValue("--pimolu-box-padding")).not.toBe("");
  });
});
