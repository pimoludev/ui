import { Suspense, lazy } from "react";
import { PimoluProvider, Toaster } from "@pimolu/react";

import { pages, usePage } from "./router";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

import "./playground.css";

const pageComponents = {
  overview: lazy(() => import("./pages/overview-page").then(({ OverviewPage }) => ({ default: OverviewPage }))),
  "design-lab": lazy(() => import("./pages/design-lab-page").then(({ DesignLabPage }) => ({ default: DesignLabPage }))),
  button: lazy(() => import("./pages/button-page").then(({ ButtonPage }) => ({ default: ButtonPage }))),
  input: lazy(() => import("./pages/input-page").then(({ InputPage }) => ({ default: InputPage }))),
  card: lazy(() => import("./pages/card-page").then(({ CardPage }) => ({ default: CardPage }))),
  badge: lazy(() => import("./pages/badge-page").then(({ BadgePage }) => ({ default: BadgePage }))),
  avatar: lazy(() => import("./pages/avatar-page").then(({ AvatarPage }) => ({ default: AvatarPage }))),
  separator: lazy(() => import("./pages/separator-page").then(({ SeparatorPage }) => ({ default: SeparatorPage }))),
  "circular-progress": lazy(() => import("./pages/circular-progress-page").then(({ CircularProgressPage }) => ({ default: CircularProgressPage }))),
  dialog: lazy(() => import("./pages/dialog-page").then(({ DialogPage }) => ({ default: DialogPage }))),
  alert: lazy(() => import("./pages/alert-page").then(({ AlertPage }) => ({ default: AlertPage }))),
  banner: lazy(() => import("./pages/banner-page").then(({ BannerPage }) => ({ default: BannerPage }))),
  "empty-state": lazy(() => import("./pages/empty-state-page").then(({ EmptyStatePage }) => ({ default: EmptyStatePage }))),
  result: lazy(() => import("./pages/result-page").then(({ ResultPage }) => ({ default: ResultPage }))),
  "loading-overlay": lazy(() => import("./pages/loading-overlay-page").then(({ LoadingOverlayPage }) => ({ default: LoadingOverlayPage }))),
  "alert-dialog": lazy(() => import("./pages/alert-dialog-page").then(({ AlertDialogPage }) => ({ default: AlertDialogPage }))),
  "context-menu": lazy(() => import("./pages/context-menu-page").then(({ ContextMenuPage }) => ({ default: ContextMenuPage }))),
  command: lazy(() => import("./pages/command-page").then(({ CommandPage }) => ({ default: CommandPage }))),
  "dropdown-menu": lazy(() => import("./pages/dropdown-menu-page").then(({ DropdownMenuPage }) => ({ default: DropdownMenuPage }))),
  drawer: lazy(() => import("./pages/drawer-page").then(({ DrawerPage }) => ({ default: DrawerPage }))),
  "hover-card": lazy(() => import("./pages/hover-card-page").then(({ HoverCardPage }) => ({ default: HoverCardPage }))),
  popover: lazy(() => import("./pages/popover-page").then(({ PopoverPage }) => ({ default: PopoverPage }))),
  progress: lazy(() => import("./pages/progress-page").then(({ ProgressPage }) => ({ default: ProgressPage }))),
  skeleton: lazy(() => import("./pages/skeleton-page").then(({ SkeletonPage }) => ({ default: SkeletonPage }))),
  spinner: lazy(() => import("./pages/spinner-page").then(({ SpinnerPage }) => ({ default: SpinnerPage }))),
  toast: lazy(() => import("./pages/toast-page").then(({ ToastPage }) => ({ default: ToastPage }))),
  tooltip: lazy(() => import("./pages/tooltip-page").then(({ TooltipPage }) => ({ default: TooltipPage }))),
  tabs: lazy(() => import("./pages/tabs-page").then(({ TabsPage }) => ({ default: TabsPage }))),
  toggle: lazy(() => import("./pages/toggle-page").then(({ TogglePage }) => ({ default: TogglePage }))),
  "toggle-group": lazy(() => import("./pages/toggle-group-page").then(({ ToggleGroupPage }) => ({ default: ToggleGroupPage }))),
  "segmented-control": lazy(() => import("./pages/segmented-control-page").then(({ SegmentedControlPage }) => ({ default: SegmentedControlPage }))),
  link: lazy(() => import("./pages/link-page").then(({ LinkPage }) => ({ default: LinkPage }))),
  switch: lazy(() => import("./pages/switch-page").then(({ SwitchPage }) => ({ default: SwitchPage }))),
  checkbox: lazy(() => import("./pages/checkbox-page").then(({ CheckboxPage }) => ({ default: CheckboxPage }))),
  radio: lazy(() => import("./pages/radio-page").then(({ RadioPage }) => ({ default: RadioPage }))),
  "range-slider": lazy(() => import("./pages/range-slider-page").then(({ RangeSliderPage }) => ({ default: RangeSliderPage }))),
  textarea: lazy(() => import("./pages/textarea-page").then(({ TextareaPage }) => ({ default: TextareaPage }))),
  select: lazy(() => import("./pages/select-page").then(({ SelectPage }) => ({ default: SelectPage }))),
  slider: lazy(() => import("./pages/slider-page").then(({ SliderPage }) => ({ default: SliderPage }))),
  combobox: lazy(() => import("./pages/combobox-page").then(({ ComboboxPage }) => ({ default: ComboboxPage }))),
  "multi-select": lazy(() => import("./pages/multi-select-page").then(({ MultiSelectPage }) => ({ default: MultiSelectPage }))),
  label: lazy(() => import("./pages/label-page").then(({ LabelPage }) => ({ default: LabelPage }))),
  "form-field": lazy(() => import("./pages/form-field-page").then(({ FormFieldPage }) => ({ default: FormFieldPage }))),
  typography: lazy(() => import("./pages/typography-page").then(({ TypographyPage }) => ({ default: TypographyPage }))),
  code: lazy(() => import("./pages/code-page").then(({ CodePage }) => ({ default: CodePage }))),
  accordion: lazy(() => import("./pages/accordion-page").then(({ AccordionPage }) => ({ default: AccordionPage }))),
  breadcrumbs: lazy(() => import("./pages/breadcrumbs-page").then(({ BreadcrumbsPage }) => ({ default: BreadcrumbsPage }))),
  pagination: lazy(() => import("./pages/pagination-page").then(({ PaginationPage }) => ({ default: PaginationPage }))),
  stepper: lazy(() => import("./pages/stepper-page").then(({ StepperPage }) => ({ default: StepperPage }))),
  navbar: lazy(() => import("./pages/navbar-page").then(({ NavbarPage }) => ({ default: NavbarPage }))),
  sidebar: lazy(() => import("./pages/sidebar-page").then(({ SidebarPage }) => ({ default: SidebarPage }))),
  "navigation-menu": lazy(() => import("./pages/navigation-menu-page").then(({ NavigationMenuPage }) => ({ default: NavigationMenuPage }))),
  "scroll-area": lazy(() => import("./pages/scroll-area-page").then(({ ScrollAreaPage }) => ({ default: ScrollAreaPage }))),
  "tree-view": lazy(() => import("./pages/tree-view-page").then(({ TreeViewPage }) => ({ default: TreeViewPage }))),
  list: lazy(() => import("./pages/list-page").then(({ ListPage }) => ({ default: ListPage }))),
  "description-list": lazy(() => import("./pages/description-list-page").then(({ DescriptionListPage }) => ({ default: DescriptionListPage }))),
  "dashboard-layout": lazy(() => import("./pages/dashboard-layout-page").then(({ DashboardLayoutPage }) => ({ default: DashboardLayoutPage }))),
  table: lazy(() => import("./pages/table-page").then(({ TablePage }) => ({ default: TablePage }))),
  "data-table": lazy(() => import("./pages/data-table-page").then(({ DataTablePage }) => ({ default: DataTablePage }))),
  stat: lazy(() => import("./pages/stat-page").then(({ StatPage }) => ({ default: StatPage }))),
  timeline: lazy(() => import("./pages/timeline-page").then(({ TimelinePage }) => ({ default: TimelinePage }))),
  rating: lazy(() => import("./pages/rating-page").then(({ RatingPage }) => ({ default: RatingPage }))),
  "number-input": lazy(() => import("./pages/number-input-page").then(({ NumberInputPage }) => ({ default: NumberInputPage }))),
  "pin-input": lazy(() => import("./pages/pin-input-page").then(({ PinInputPage }) => ({ default: PinInputPage }))),
  "tags-input": lazy(() => import("./pages/tags-input-page").then(({ TagsInputPage }) => ({ default: TagsInputPage }))),
  "time-picker": lazy(() => import("./pages/time-picker-page").then(({ TimePickerPage }) => ({ default: TimePickerPage }))),
  calendar: lazy(() => import("./pages/calendar-page").then(({ CalendarPage }) => ({ default: CalendarPage }))),
  "date-picker": lazy(() => import("./pages/date-picker-page").then(({ DatePickerPage }) => ({ default: DatePickerPage }))),
  "date-range-picker": lazy(() => import("./pages/date-range-picker-page").then(({ DateRangePickerPage }) => ({ default: DateRangePickerPage }))),
  "file-upload": lazy(() => import("./pages/file-upload-page").then(({ FileUploadPage }) => ({ default: FileUploadPage }))),
  dropzone: lazy(() => import("./pages/dropzone-page").then(({ DropzonePage }) => ({ default: DropzonePage }))),
  "color-picker": lazy(() => import("./pages/color-picker-page").then(({ ColorPickerPage }) => ({ default: ColorPickerPage }))),
  box: lazy(() => import("./pages/box-page").then(({ BoxPage }) => ({ default: BoxPage }))),
  stack: lazy(() => import("./pages/stack-page").then(({ StackPage }) => ({ default: StackPage }))),
  flex: lazy(() => import("./pages/flex-page").then(({ FlexPage }) => ({ default: FlexPage }))),
  grid: lazy(() => import("./pages/grid-page").then(({ GridPage }) => ({ default: GridPage }))),
  container: lazy(() => import("./pages/container-page").then(({ ContainerPage }) => ({ default: ContainerPage }))),
  center: lazy(() => import("./pages/center-page").then(({ CenterPage }) => ({ default: CenterPage }))),
  spacer: lazy(() => import("./pages/spacer-page").then(({ SpacerPage }) => ({ default: SpacerPage }))),
  "aspect-ratio": lazy(() => import("./pages/aspect-ratio-page").then(({ AspectRatioPage }) => ({ default: AspectRatioPage }))),
  "visually-hidden": lazy(() => import("./pages/visually-hidden-page").then(({ VisuallyHiddenPage }) => ({ default: VisuallyHiddenPage }))),
  "focus-scope": lazy(() => import("./pages/focus-scope-page").then(({ FocusScopePage }) => ({ default: FocusScopePage }))),
  image: lazy(() => import("./pages/image-page").then(({ ImagePage }) => ({ default: ImagePage }))),
  carousel: lazy(() => import("./pages/carousel-page").then(({ CarouselPage }) => ({ default: CarouselPage }))),
  resizable: lazy(() => import("./pages/resizable-page").then(({ ResizablePage }) => ({ default: ResizablePage }))),
  "virtual-list": lazy(() => import("./pages/virtual-list-page").then(({ VirtualListPage }) => ({ default: VirtualListPage }))),
  "app-shell": lazy(() => import("./pages/app-shell-page").then(({ AppShellPage }) => ({ default: AppShellPage }))),
  "audio-player": lazy(() => import("./pages/audio-player-page").then(({ AudioPlayerPage }) => ({ default: AudioPlayerPage }))),
  cascader: lazy(() => import("./pages/cascader-page").then(({ CascaderPage }) => ({ default: CascaderPage }))),
  chart: lazy(() => import("./pages/chart-page").then(({ ChartPage }) => ({ default: ChartPage }))),
  chat: lazy(() => import("./pages/chat-page").then(({ ChatPage }) => ({ default: ChatPage }))),
  "currency-input": lazy(() => import("./pages/currency-input-page").then(({ CurrencyInputPage }) => ({ default: CurrencyInputPage }))),
  "data-grid": lazy(() => import("./pages/data-grid-page").then(({ DataGridPage }) => ({ default: DataGridPage }))),
  "file-manager": lazy(() => import("./pages/file-manager-page").then(({ FileManagerPage }) => ({ default: FileManagerPage }))),
  form: lazy(() => import("./pages/form-page").then(({ FormPage }) => ({ default: FormPage }))),
  gantt: lazy(() => import("./pages/gantt-page").then(({ GanttPage }) => ({ default: GanttPage }))),
  "image-cropper": lazy(() => import("./pages/image-cropper-page").then(({ ImageCropperPage }) => ({ default: ImageCropperPage }))),
  kanban: lazy(() => import("./pages/kanban-page").then(({ KanbanPage }) => ({ default: KanbanPage }))),
  lightbox: lazy(() => import("./pages/lightbox-page").then(({ LightboxPage }) => ({ default: LightboxPage }))),
  "masked-input": lazy(() => import("./pages/masked-input-page").then(({ MaskedInputPage }) => ({ default: MaskedInputPage }))),
  menubar: lazy(() => import("./pages/menubar-page").then(({ MenubarPage }) => ({ default: MenubarPage }))),
  mentions: lazy(() => import("./pages/mentions-page").then(({ MentionsPage }) => ({ default: MentionsPage }))),
  "notification-center": lazy(() => import("./pages/notification-center-page").then(({ NotificationCenterPage }) => ({ default: NotificationCenterPage }))),
  "pdf-viewer": lazy(() => import("./pages/pdf-viewer-page").then(({ PDFViewerPage }) => ({ default: PDFViewerPage }))),
  "phone-input": lazy(() => import("./pages/phone-input-page").then(({ PhoneInputPage }) => ({ default: PhoneInputPage }))),
  popconfirm: lazy(() => import("./pages/popconfirm-page").then(({ PopconfirmPage }) => ({ default: PopconfirmPage }))),
  "qr-code": lazy(() => import("./pages/qr-code-page").then(({ QRCodePage }) => ({ default: QRCodePage }))),
  scheduler: lazy(() => import("./pages/scheduler-page").then(({ SchedulerPage }) => ({ default: SchedulerPage }))),
  toolbar: lazy(() => import("./pages/toolbar-page").then(({ ToolbarPage }) => ({ default: ToolbarPage }))),
  tour: lazy(() => import("./pages/tour-page").then(({ TourPage }) => ({ default: TourPage }))),
  transfer: lazy(() => import("./pages/transfer-page").then(({ TransferPage }) => ({ default: TransferPage }))),
  "tree-table": lazy(() => import("./pages/tree-table-page").then(({ TreeTablePage }) => ({ default: TreeTablePage }))),
  "video-player": lazy(() => import("./pages/video-player-page").then(({ VideoPlayerPage }) => ({ default: VideoPlayerPage }))),
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
          <Suspense fallback={<div className="pg-page-loading" role="status">Loading page…</div>}>
            <Page />
          </Suspense>
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
