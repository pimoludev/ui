import type { ReactNode } from "react";
import "@pimolu/web-styles/styles.css";

import { cookies } from "next/headers";

import { pimoluPresets } from "@pimolu/themes/presets";

import type {
  PimoluThemeMode,
  PimoluStylePreset,
} from "@pimolu/react";

import { PimoluThemeClient } from "./pimolu-theme-client";

import "./globals.css";

export const metadata = {
  title: "Pimolu UI · Next.js example",
  description:
    "A Next.js App Router example using Pimolu UI components, themes and style presets.",
};

function parseTheme(value?: string): PimoluThemeMode {
  if (
    value === "light" ||
    value === "dark" ||
    value === "system"
  ) {
    return value;
  }

  return "system";
}

function parseStyle(
  value?: string
): PimoluStylePreset {
  if (
    value === "default" ||
    (
      typeof value === "string" &&
      Object.prototype.hasOwnProperty.call(
        pimoluPresets,
        value
      )
    )
  ) {
    return value as PimoluStylePreset;
  }

  return "default";
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();

  const initialTheme = parseTheme(
    cookieStore.get("pimolu-theme")?.value
  );

  const initialStylePreset = parseStyle(
    cookieStore.get("pimolu-style")?.value
  );

  return (
    <html lang="en">
      <body>
        <PimoluThemeClient
          initialTheme={initialTheme}
          initialStylePreset={initialStylePreset}
        >
          {children}
        </PimoluThemeClient>
      </body>
    </html>
  );
}
