import { PimoluProvider } from "@pimolu/react";

import { pages, usePage } from "./router";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

import { AvatarPage } from "./pages/avatar-page";
import { AccordionPage } from "./pages/accordion-page";
import { BadgePage } from "./pages/badge-page";
import { BreadcrumbsPage } from "./pages/breadcrumbs-page";
import { ButtonPage } from "./pages/button-page";
import { CardPage } from "./pages/card-page";
import { CheckboxPage } from "./pages/checkbox-page";
import { CodePage } from "./pages/code-page";
import { ComboboxPage } from "./pages/combobox-page";
import { CircularProgressPage } from "./pages/circular-progress-page";
import { DescriptionListPage } from "./pages/description-list-page";
import { DialogPage } from "./pages/dialog-page";
import { FormFieldPage } from "./pages/form-field-page";
import { InputPage } from "./pages/input-page";
import { LabelPage } from "./pages/label-page";
import { LinkPage } from "./pages/link-page";
import { ListPage } from "./pages/list-page";
import { MultiSelectPage } from "./pages/multi-select-page";
import { NavbarPage } from "./pages/navbar-page";
import { NavigationMenuPage } from "./pages/navigation-menu-page";
import { OverviewPage } from "./pages/overview-page";
import { PaginationPage } from "./pages/pagination-page";
import { PopoverPage } from "./pages/popover-page";
import { ProgressPage } from "./pages/progress-page";
import { RadioPage } from "./pages/radio-page";
import { RangeSliderPage } from "./pages/range-slider-page";
import { ScrollAreaPage } from "./pages/scroll-area-page";
import { SegmentedControlPage } from "./pages/segmented-control-page";
import { SeparatorPage } from "./pages/separator-page";
import { SelectPage } from "./pages/select-page";
import { SidebarPage } from "./pages/sidebar-page";
import { SkeletonPage } from "./pages/skeleton-page";
import { SliderPage } from "./pages/slider-page";
import { SpinnerPage } from "./pages/spinner-page";
import { StepperPage } from "./pages/stepper-page";
import { SwitchPage } from "./pages/switch-page";
import { TabsPage } from "./pages/tabs-page";
import { TextareaPage } from "./pages/textarea-page";
import { TogglePage } from "./pages/toggle-page";
import { ToggleGroupPage } from "./pages/toggle-group-page";
import { TooltipPage } from "./pages/tooltip-page";
import { TreeViewPage } from "./pages/tree-view-page";
import { TypographyPage } from "./pages/typography-page";

import "./playground.css";

const pageComponents = {
  overview: OverviewPage,
  button: ButtonPage,
  input: InputPage,
  card: CardPage,
  badge: BadgePage,
  avatar: AvatarPage,
  separator: SeparatorPage,
  "circular-progress": CircularProgressPage,
  dialog: DialogPage,
  popover: PopoverPage,
  progress: ProgressPage,
  skeleton: SkeletonPage,
  spinner: SpinnerPage,
  tooltip: TooltipPage,
  tabs: TabsPage,
  toggle: TogglePage,
  "toggle-group": ToggleGroupPage,
  "segmented-control": SegmentedControlPage,
  link: LinkPage,
  switch: SwitchPage,
  checkbox: CheckboxPage,
  radio: RadioPage,
  "range-slider": RangeSliderPage,
  textarea: TextareaPage,
  select: SelectPage,
  slider: SliderPage,
  combobox: ComboboxPage,
  "multi-select": MultiSelectPage,
  label: LabelPage,
  "form-field": FormFieldPage,
  typography: TypographyPage,
  code: CodePage,
  accordion: AccordionPage,
  breadcrumbs: BreadcrumbsPage,
  pagination: PaginationPage,
  stepper: StepperPage,
  navbar: NavbarPage,
  sidebar: SidebarPage,
  "navigation-menu": NavigationMenuPage,
  "scroll-area": ScrollAreaPage,
  "tree-view": TreeViewPage,
  list: ListPage,
  "description-list": DescriptionListPage,
} as const;

function App() {
  const route = usePage();
  const Page = pageComponents[route.id];

  return (
    <PimoluProvider persist className="pg-root">
      <Toolbar />

      {route.unknown && (
        <p className="pg-notice" role="status">
          Unknown route <code>#/{route.unknown}</code> — showing
          Overview. Check the spelling, or reload the tab: a bundle
          opened before a page was added does not know it yet.
        </p>
      )}

      <div className="pg-layout">
        <Sidebar current={route.id} />

        <main className="pg-main">
          <Page />
        </main>
      </div>

      <footer className="pg-footer">
        <div className="pg-container">
          Pimolu UI · MIT License · {pages.length} pages · Adjust
          the theme and style in the toolbar; changes apply
          instantly.
        </div>
      </footer>
    </PimoluProvider>
  );
}

export default App;
