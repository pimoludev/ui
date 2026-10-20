import { PimoluProvider, Toaster } from "@pimolu/react";

import { pages, usePage } from "./router";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

import { AvatarPage } from "./pages/avatar-page";
import { AccordionPage } from "./pages/accordion-page";
import { AlertPage } from "./pages/alert-page";
import { AlertDialogPage } from "./pages/alert-dialog-page";
import { AspectRatioPage } from "./pages/aspect-ratio-page";
import { BadgePage } from "./pages/badge-page";
import { BannerPage } from "./pages/banner-page";
import { BoxPage } from "./pages/box-page";
import { BreadcrumbsPage } from "./pages/breadcrumbs-page";
import { ButtonPage } from "./pages/button-page";
import { CalendarPage } from "./pages/calendar-page";
import { CardPage } from "./pages/card-page";
import { CarouselPage } from "./pages/carousel-page";
import { CenterPage } from "./pages/center-page";
import { CheckboxPage } from "./pages/checkbox-page";
import { CodePage } from "./pages/code-page";
import { ColorPickerPage } from "./pages/color-picker-page";
import { ComboboxPage } from "./pages/combobox-page";
import { CircularProgressPage } from "./pages/circular-progress-page";
import { CommandPage } from "./pages/command-page";
import { ContainerPage } from "./pages/container-page";
import { ContextMenuPage } from "./pages/context-menu-page";
import { DataTablePage } from "./pages/data-table-page";
import { DatePickerPage } from "./pages/date-picker-page";
import { DateRangePickerPage } from "./pages/date-range-picker-page";
import { DescriptionListPage } from "./pages/description-list-page";
import { DesignLabPage } from "./pages/design-lab-page";
import { DialogPage } from "./pages/dialog-page";
import { DrawerPage } from "./pages/drawer-page";
import { DropdownMenuPage } from "./pages/dropdown-menu-page";
import { DropzonePage } from "./pages/dropzone-page";
import { EmptyStatePage } from "./pages/empty-state-page";
import { FileUploadPage } from "./pages/file-upload-page";
import { FlexPage } from "./pages/flex-page";
import { FocusScopePage } from "./pages/focus-scope-page";
import { FormFieldPage } from "./pages/form-field-page";
import { GridPage } from "./pages/grid-page";
import { HoverCardPage } from "./pages/hover-card-page";
import { ImagePage } from "./pages/image-page";
import { InputPage } from "./pages/input-page";
import { LabelPage } from "./pages/label-page";
import { LinkPage } from "./pages/link-page";
import { ListPage } from "./pages/list-page";
import { LoadingOverlayPage } from "./pages/loading-overlay-page";
import { MultiSelectPage } from "./pages/multi-select-page";
import { NavbarPage } from "./pages/navbar-page";
import { NavigationMenuPage } from "./pages/navigation-menu-page";
import { NumberInputPage } from "./pages/number-input-page";
import { OverviewPage } from "./pages/overview-page";
import { PaginationPage } from "./pages/pagination-page";
import { PinInputPage } from "./pages/pin-input-page";
import { PopoverPage } from "./pages/popover-page";
import { ProgressPage } from "./pages/progress-page";
import { RadioPage } from "./pages/radio-page";
import { RangeSliderPage } from "./pages/range-slider-page";
import { RatingPage } from "./pages/rating-page";
import { ResizablePage } from "./pages/resizable-page";
import { ResultPage } from "./pages/result-page";
import { ScrollAreaPage } from "./pages/scroll-area-page";
import { SegmentedControlPage } from "./pages/segmented-control-page";
import { SeparatorPage } from "./pages/separator-page";
import { SelectPage } from "./pages/select-page";
import { SidebarPage } from "./pages/sidebar-page";
import { SkeletonPage } from "./pages/skeleton-page";
import { SliderPage } from "./pages/slider-page";
import { SpacerPage } from "./pages/spacer-page";
import { SpinnerPage } from "./pages/spinner-page";
import { StackPage } from "./pages/stack-page";
import { StatPage } from "./pages/stat-page";
import { StepperPage } from "./pages/stepper-page";
import { SwitchPage } from "./pages/switch-page";
import { TablePage } from "./pages/table-page";
import { TabsPage } from "./pages/tabs-page";
import { TagsInputPage } from "./pages/tags-input-page";
import { TextareaPage } from "./pages/textarea-page";
import { TimePickerPage } from "./pages/time-picker-page";
import { TimelinePage } from "./pages/timeline-page";
import { ToastPage } from "./pages/toast-page";
import { TogglePage } from "./pages/toggle-page";
import { ToggleGroupPage } from "./pages/toggle-group-page";
import { TooltipPage } from "./pages/tooltip-page";
import { TreeViewPage } from "./pages/tree-view-page";
import { TypographyPage } from "./pages/typography-page";
import { VirtualListPage } from "./pages/virtual-list-page";
import { VisuallyHiddenPage } from "./pages/visually-hidden-page";

import "./playground.css";

const pageComponents = {
  overview: OverviewPage,
  "design-lab": DesignLabPage,
  button: ButtonPage,
  input: InputPage,
  card: CardPage,
  badge: BadgePage,
  avatar: AvatarPage,
  separator: SeparatorPage,
  "circular-progress": CircularProgressPage,
  dialog: DialogPage,
  alert: AlertPage,
  banner: BannerPage,
  "empty-state": EmptyStatePage,
  result: ResultPage,
  "loading-overlay": LoadingOverlayPage,
  "alert-dialog": AlertDialogPage,
  "context-menu": ContextMenuPage,
  command: CommandPage,
  "dropdown-menu": DropdownMenuPage,
  drawer: DrawerPage,
  "hover-card": HoverCardPage,
  popover: PopoverPage,
  progress: ProgressPage,
  skeleton: SkeletonPage,
  spinner: SpinnerPage,
  toast: ToastPage,
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
  table: TablePage,
  "data-table": DataTablePage,
  stat: StatPage,
  timeline: TimelinePage,
  rating: RatingPage,
  "number-input": NumberInputPage,
  "pin-input": PinInputPage,
  "tags-input": TagsInputPage,
  "time-picker": TimePickerPage,
  calendar: CalendarPage,
  "date-picker": DatePickerPage,
  "date-range-picker": DateRangePickerPage,
  "file-upload": FileUploadPage,
  dropzone: DropzonePage,
  "color-picker": ColorPickerPage,
  box: BoxPage,
  stack: StackPage,
  flex: FlexPage,
  grid: GridPage,
  container: ContainerPage,
  center: CenterPage,
  spacer: SpacerPage,
  "aspect-ratio": AspectRatioPage,
  "visually-hidden": VisuallyHiddenPage,
  "focus-scope": FocusScopePage,
  image: ImagePage,
  carousel: CarouselPage,
  resizable: ResizablePage,
  "virtual-list": VirtualListPage,
} as const;

function App() {
  const route = usePage();
  const Page = pageComponents[route.id];
  const isDesignLab = route.id === "design-lab";

  return (
    <PimoluProvider
      persist
      className={`pg-root ${isDesignLab ? "pg-root--design-lab" : ""}`}
    >
      <Toolbar />

      {route.unknown && (
        <p className="pg-notice" role="status">
          Unknown route <code>#/{route.unknown}</code> — showing
          Overview. Check the spelling, or reload the tab: a bundle
          opened before a page was added does not know it yet.
        </p>
      )}

      <div
        className={`pg-layout ${isDesignLab ? "pg-layout--design-lab" : ""}`}
      >
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

      <Toaster position="bottom-right" />
    </PimoluProvider>
  );
}

export default App;
