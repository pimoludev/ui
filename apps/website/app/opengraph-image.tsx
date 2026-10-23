import { ImageResponse } from "next/og";
import themes from "@pimolu/themes/themes.json";

export const alt = "Pimolu UI. One system. Your identity. React components, shared tokens and customizable visual presets.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const theme = themes.light;
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "64px 72px", background: theme.background, color: theme.foreground, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28 }}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, border: `2px solid ${theme.primary}`, borderRadius: 16, fontSize: 42, color: theme.primary }}>p</span><span>Pimolu UI</span></div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 94, letterSpacing: "-5px", lineHeight: 1.08 }}><span>One system.</span><span style={{ color: theme.primary }}>Your identity.</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 24, borderTop: `1px solid ${theme.border}`, color: theme["muted-foreground"], fontSize: 24 }}><span>React components. Shared design tokens.</span><span>pimolu.com</span></div>
    </div>, size,
  );
}
