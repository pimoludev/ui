import { useEffect, useState } from "react";

/**
 * Minimal hash router: no dependency, addressable pages
 * (#/overview, #/button, #/input) that can be shared or reloaded.
 *
 * Adding a component page = one entry here + one file in pages/.
 * `group` decides where the page appears in the sidebar.
 */
export const pages = [
  { id: "motion-integration", label: "Motion integration", group: "Getting started" },
  { id: "overview", label: "Overview", group: "Getting started" },
  { id: "design-lab", label: "Design Lab", group: "Getting started" },
  { id: "theme-builder", label: "ThemeBuilder", group: "Getting started" },

  { id: "button", label: "Button", group: "Actions" },
  { id: "button-group", label: "ButtonGroup", group: "Actions" },
  { id: "split-button", label: "SplitButton", group: "Actions" },
  { id: "toggle", label: "Toggle", group: "Actions" },
  { id: "toggle-group", label: "ToggleGroup", group: "Actions" },
  { id: "toolbar", label: "Toolbar", group: "Actions" },
  { id: "popconfirm", label: "Popconfirm", group: "Actions" },

  { id: "tabs", label: "Tabs", group: "Navigation" },
  { id: "segmented-control", label: "SegmentedControl", group: "Navigation" },
  { id: "link", label: "Link", group: "Navigation" },
  { id: "accordion", label: "Accordion", group: "Navigation" },
  { id: "breadcrumbs", label: "Breadcrumbs", group: "Navigation" },
  { id: "pagination", label: "Pagination", group: "Navigation" },
  { id: "stepper", label: "Stepper", group: "Navigation" },
  { id: "navigation-menu", label: "NavigationMenu", group: "Navigation" },
  { id: "menubar", label: "Menubar", group: "Navigation" },
  { id: "table-of-contents", label: "TableOfContents", group: "Navigation" },

  { id: "checkbox", label: "Checkbox", group: "Forms" },
  { id: "combobox", label: "Combobox", group: "Forms" },
  { id: "form-field", label: "FormField", group: "Forms" },
  { id: "input", label: "Input", group: "Forms" },
  { id: "label", label: "Label", group: "Forms" },
  { id: "multi-select", label: "MultiSelect", group: "Forms" },
  { id: "radio", label: "Radio", group: "Forms" },
  { id: "range-slider", label: "RangeSlider", group: "Forms" },
  { id: "select", label: "Select", group: "Forms" },
  { id: "slider", label: "Slider", group: "Forms" },
  { id: "switch", label: "Switch", group: "Forms" },
  { id: "textarea", label: "Textarea", group: "Forms" },
  { id: "number-input", label: "NumberInput", group: "Forms" },
  { id: "pin-input", label: "PinInput", group: "Forms" },
  { id: "tags-input", label: "TagsInput", group: "Forms" },
  { id: "time-picker", label: "TimePicker", group: "Forms" },
  { id: "calendar", label: "Calendar", group: "Forms" },
  { id: "date-picker", label: "DatePicker", group: "Forms" },
  { id: "date-range-picker", label: "DateRangePicker", group: "Forms" },
  { id: "file-upload", label: "FileUpload", group: "Forms" },
  { id: "dropzone", label: "Dropzone", group: "Forms" },
  { id: "color-picker", label: "ColorPicker", group: "Forms" },
  { id: "search-input", label: "SearchInput", group: "Forms" },
  { id: "password-input", label: "PasswordInput", group: "Forms" },
  { id: "input-group", label: "InputGroup", group: "Forms" },
  { id: "tree-select", label: "TreeSelect", group: "Forms" },
  { id: "signature", label: "Signature", group: "Forms" },
  { id: "form", label: "Form", group: "Forms" },
  { id: "masked-input", label: "MaskedInput", group: "Forms" },
  { id: "currency-input", label: "CurrencyInput", group: "Forms" },
  { id: "phone-input", label: "PhoneInput", group: "Forms" },
  { id: "mentions", label: "Mentions", group: "Forms" },
  { id: "cascader", label: "Cascader", group: "Forms" },
  { id: "transfer", label: "Transfer", group: "Forms" },

  { id: "avatar", label: "Avatar", group: "Data display" },
  { id: "badge", label: "Badge", group: "Data display" },
  { id: "card", label: "Card", group: "Data display" },
  { id: "list", label: "List", group: "Data display" },
  { id: "description-list", label: "DescriptionList", group: "Data display" },
  { id: "table", label: "Table", group: "Data display" },
  { id: "data-table", label: "DataTable", group: "Data display" },
  { id: "data-grid", label: "DataGrid", group: "Data display" },
  { id: "tree-table", label: "TreeTable", group: "Data display" },
  { id: "chart", label: "Charts", group: "Data display" },
  { id: "api-table", label: "ApiTable", group: "Data display" },
  { id: "stat", label: "Stat", group: "Data display" },
  { id: "timeline", label: "Timeline", group: "Data display" },
  { id: "rating", label: "Rating", group: "Data display" },
  { id: "image", label: "Image", group: "Data display" },
  { id: "carousel", label: "Carousel", group: "Data display" },
  { id: "virtual-list", label: "VirtualList", group: "Data display" },
  { id: "tree-view", label: "TreeView", group: "Data display" },

  { id: "kanban", label: "Kanban", group: "Complex" },
  { id: "scheduler", label: "Scheduler", group: "Complex" },
  { id: "gantt", label: "Gantt", group: "Complex" },
  { id: "chat", label: "Chat", group: "Complex" },
  { id: "file-manager", label: "FileManager", group: "Complex" },

  { id: "video-player", label: "VideoPlayer", group: "Media" },
  { id: "audio-player", label: "AudioPlayer", group: "Media" },
  { id: "pdf-viewer", label: "PDFViewer", group: "Media" },
  { id: "lightbox", label: "Lightbox", group: "Media" },
  { id: "image-cropper", label: "ImageCropper", group: "Media" },
  { id: "qr-code", label: "QRCode", group: "Media" },

  { id: "typography", label: "Typography", group: "Typography" },
  { id: "prose", label: "Prose", group: "Typography" },
  { id: "anchor", label: "Anchor", group: "Typography" },
  { id: "code-block", label: "CodeBlock", group: "Typography" },
  { id: "code", label: "Code & Kbd", group: "Typography" },

  { id: "navbar", label: "Navbar", group: "Layout" },
  { id: "sidebar", label: "Sidebar", group: "Layout" },
  { id: "dashboard-layout", label: "DashboardLayout", group: "Layout" },
  { id: "app-shell", label: "AppShell", group: "Layout" },
  { id: "page-header", label: "PageHeader", group: "Layout" },
  { id: "hero", label: "Hero", group: "Layout" },
  { id: "footer", label: "Footer", group: "Layout" },
  { id: "docs-layout", label: "DocsLayout", group: "Layout" },
  { id: "watermark", label: "Watermark", group: "Layout" },
  { id: "box", label: "Box", group: "Layout" },
  { id: "stack", label: "Stack", group: "Layout" },
  { id: "flex", label: "Flex", group: "Layout" },
  { id: "grid", label: "Grid", group: "Layout" },
  { id: "container", label: "Container", group: "Layout" },
  { id: "center", label: "Center", group: "Layout" },
  { id: "spacer", label: "Spacer", group: "Layout" },
  { id: "aspect-ratio", label: "AspectRatio", group: "Layout" },
  { id: "visually-hidden", label: "VisuallyHidden", group: "Layout" },
  { id: "focus-scope", label: "FocusScope", group: "Layout" },
  { id: "resizable", label: "Resizable", group: "Layout" },
  { id: "scroll-area", label: "ScrollArea", group: "Layout" },
  { id: "separator", label: "Separator", group: "Layout" },

  { id: "circular-progress", label: "CircularProgress", group: "Feedback" },
  { id: "dialog", label: "Dialog", group: "Feedback" },
  { id: "alert", label: "Alert", group: "Feedback" },
  { id: "banner", label: "Banner", group: "Feedback" },
  { id: "empty-state", label: "EmptyState", group: "Feedback" },
  { id: "result", label: "Result", group: "Feedback" },
  { id: "loading-overlay", label: "LoadingOverlay", group: "Feedback" },
  { id: "alert-dialog", label: "AlertDialog", group: "Feedback" },
  { id: "context-menu", label: "ContextMenu", group: "Feedback" },
  { id: "command", label: "Command", group: "Feedback" },
  { id: "dropdown-menu", label: "DropdownMenu", group: "Feedback" },
  { id: "drawer", label: "Drawer", group: "Feedback" },
  { id: "hover-card", label: "HoverCard", group: "Feedback" },
  { id: "popover", label: "Popover", group: "Feedback" },
  { id: "progress", label: "Progress", group: "Feedback" },
  { id: "skeleton", label: "Skeleton", group: "Feedback" },
  { id: "spinner", label: "Spinner", group: "Feedback" },
  { id: "toast", label: "Toast", group: "Feedback" },
  { id: "tour", label: "Tour", group: "Feedback" },
  { id: "notification-center", label: "NotificationCenter", group: "Feedback" },
  { id: "tooltip", label: "Tooltip", group: "Feedback" },
] as const;

export type Page = (typeof pages)[number];

export type PageId = Page["id"];

export interface PageGroup {
  name: string;
  items: Page[];
}

/**
 * Groups the pages in first-appearance order, so the sidebar and the
 * overview index always agree with `pages`.
 */
export function groupPages(
  entries: readonly Page[] = pages
): PageGroup[] {
  const groups: PageGroup[] = [];

  for (const page of entries) {
    const group = groups.find(
      (entry) => entry.name === page.group
    );

    if (group) {
      group.items.push(page);
    } else {
      groups.push({
        name: page.group,
        items: [page],
      });
    }
  }

  return groups;
}

const FALLBACK: PageId = "overview";

export interface ResolvedRoute {
  id: PageId;

  /** The requested hash when it named an unknown route. */
  unknown?: string;
}

export function readRoute(): ResolvedRoute {
  const raw = window.location.hash.replace(/^#\/?/, "");

  if (!raw) return { id: FALLBACK };

  const known = pages.some((page) => page.id === raw);

  return known
    ? { id: raw as PageId }
    : { id: FALLBACK, unknown: raw };
}

export function pageHref(id: PageId): string {
  return `#/${id}`;
}

/**
 * Returns the current route and, when the hash named something that does not
 * exist, the requested value: a silent fallback makes a typo or a stale bundle
 * look like a page that was never written.
 */
export function usePage(): ResolvedRoute {
  const [route, setRoute] =
    useState<ResolvedRoute>(readRoute);

  useEffect(() => {
    function handleChange() {
      setRoute(readRoute());
    }

    window.addEventListener("hashchange", handleChange);

    return () =>
      window.removeEventListener("hashchange", handleChange);
  }, []);

  return route;
}
