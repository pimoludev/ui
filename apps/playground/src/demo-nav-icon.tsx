import type { ReactNode } from "react";

type DemoNavIconName = "overview" | "projects" | "people" | "analytics" | "billing" | "settings";

const paths: Record<DemoNavIconName, ReactNode> = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  projects: <><rect x="3" y="6" width="18" height="15" rx="2" /><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" /></>,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M17 5a3 3 0 0 1 0 6m2.5 9v-2a5.5 5.5 0 0 0-3-5" /></>,
  analytics: <><path d="M4 20V12m5 8V7m5 13v-5m5 5V4" strokeLinecap="round" /><path d="M2 21h20" /></>,
  billing: <><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 9.5h19M6 15h4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" strokeLinecap="round" /></>,
};

export function DemoNavIcon({ name }: { name: DemoNavIconName }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
