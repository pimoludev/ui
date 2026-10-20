# React component inventory

The paths below are relative to the repository root. Every listed family is
exported from `registry/react/index.ts`, has a stylesheet in
`packages/web-styles/src/`, tests inside its React folder and a page in
`apps/playground/src/pages/`. "Present and tested" attests an implementation and
its tests, not an exhaustive accessibility certification or a frozen API.

| Family | React source | Role | State |
| --- | --- | --- | --- |
| Button | `registry/react/button/` | Actions, appearances and states | Present and tested |
| Input | `registry/react/input/` | Text entry, actions and validation | Present and tested |
| Card | `registry/react/card/` | Surface and sub-components | Present and tested |
| Badge | `registry/react/badge/` | Compact status | Present and tested |
| Avatar, AvatarGroup | `registry/react/avatar/` | Identity and group | Present and tested |
| Separator | `registry/react/separator/` | Content separation | Present and tested |
| Skeleton | `registry/react/skeleton/` | Pending content | Present and tested |
| Spinner | `registry/react/spinner/` | Activity | Present and tested |
| Switch | `registry/react/switch/` | Binary choice | Present and tested |
| Checkbox | `registry/react/checkbox/` | Multiple choice | Present and tested |
| Radio, RadioGroup | `registry/react/radio/` | Exclusive choice | Present and tested |
| Textarea | `registry/react/textarea/` | Multi-line entry | Present and tested |
| Select | `registry/react/select/` | Native or styled selection | Present and tested |
| Combobox | `registry/react/combobox/` | Search and selection | Present and tested |
| MultiSelect | `registry/react/multi-select/` | Multiple selection | Present and tested |
| Slider | `registry/react/slider/` | Value on a track | Present and tested |
| RangeSlider | `registry/react/range-slider/` | Interval | Present and tested |
| Progress | `registry/react/progress/` | Linear progress | Present and tested |
| CircularProgress | `registry/react/circular-progress/` | Circular progress | Present and tested |
| Tooltip | `registry/react/tooltip/` | Contextual help | Present and tested |
| Popover | `registry/react/popover/` | Anchored interactive panel | Present and tested |
| Dialog | `registry/react/dialog/` | Modal panel, focus trap and scroll lock | Present and tested |
| Tabs | `registry/react/tabs/` | Roving tabs, segmented controls and scrollable bars | Present and tested |
| Toggle | `registry/react/toggle/` | Pressable on/off button | Present and tested |
| ToggleGroup | `registry/react/toggle-group/` | Single or multiple toggle set | Present and tested |
| SegmentedControl | `registry/react/segmented-control/` | Compact exclusive selection | Present and tested |
| Link | `registry/react/link/` | Styled navigation and external links | Present and tested |
| Typography | `registry/react/typography/` | Text, Paragraph and Heading scale | Present and tested |
| Code, Kbd | `registry/react/code/` | Inline code, blocks and keys | Present and tested |
| Label | `registry/react/label/` | Form labels and required hints | Present and tested |
| FormField | `registry/react/form-field/` | Field, control, message, group and fieldset | Present and tested |
| Accordion | `registry/react/accordion/` | Collapsible sections | Present and tested |
| Breadcrumbs | `registry/react/breadcrumbs/` | Path to the current page | Present and tested |
| Pagination | `registry/react/pagination/` | Page navigation with ellipses | Present and tested |
| Stepper | `registry/react/stepper/` | Multi-step progress | Present and tested |
| Navbar | `registry/react/navbar/` | Top navigation shell with item alignment and an optional collapsible menu | Present and tested |
| Sidebar | `registry/react/sidebar/` | Grouped side navigation | Present and tested |
| DashboardLayout | `registry/react/dashboard-layout/` | Sidebar, navbar, main content and optional aside shell | Present and tested |
| NavigationMenu | `registry/react/navigation-menu/` | Menus with disclosure panels and a labelled navigation landmark | Present and tested |
| ScrollArea | `registry/react/scroll-area/` | Styled scroll viewport | Present and tested |
| TreeView | `registry/react/tree-view/` | Keyboard-driven tree | Present and tested |
| List, ListItem | `registry/react/list/` | Visual list rows | Present and tested |
| DescriptionList | `registry/react/description-list/` | Term/details properties | Present and tested |
| AlertDialog | `registry/react/alert-dialog/` | Explicit modal confirmation | Present and tested |
| DropdownMenu | `registry/react/dropdown-menu/` | Anchored action menu | Present and tested |
| Toast, Toaster | `registry/react/toast/` | Temporary notifications | Present and tested |
| Drawer | `registry/react/drawer/` | Modal panel sliding from a side | Present and tested |
| ContextMenu | `registry/react/context-menu/` | Pointer-positioned action menu | Present and tested |
| HoverCard | `registry/react/hover-card/` | Rich hover/focus preview | Present and tested |
| Command, CommandPalette | `registry/react/command/` | Searchable command list and modal palette | Present and tested |
| Alert | `registry/react/alert/` | Inline information or error message | Present and tested |
| Banner | `registry/react/banner/` | Page-level message | Present and tested |
| EmptyState | `registry/react/empty-state/` | No-data interface | Present and tested |
| Result | `registry/react/result/` | Success or failure screen | Present and tested |
| LoadingOverlay | `registry/react/loading-overlay/` | Loading layer over content | Present and tested |
| Table | `registry/react/table/` | Styled semantic table | Present and tested |
| DataTable | `registry/react/data-table/` | Sorting, filtering, selection and pagination | Present and tested |
| Stat | `registry/react/stat/` | Metric and trend | Present and tested |
| Timeline | `registry/react/timeline/` | Event chronology | Present and tested |
| Rating | `registry/react/rating/` | Star rating | Present and tested |
| NumberInput | `registry/react/number-input/` | Numeric field with steppers | Present and tested |
| PinInput | `registry/react/pin-input/` | Multi-cell code entry | Present and tested |
| TagsInput | `registry/react/tags-input/` | Tag creation and removal | Present and tested |
| TimePicker | `registry/react/time-picker/` | Time selection | Present and tested |
| Calendar | `registry/react/calendar/` | Month grid, single and range selection | Present and tested |
| DatePicker | `registry/react/date-picker/` | Date field with calendar panel | Present and tested |
| DateRangePicker | `registry/react/date-range-picker/` | Two-date range selection | Present and tested |
| FileUpload | `registry/react/file-upload/` | File selection and validation | Present and tested |
| Dropzone | `registry/react/dropzone/` | Drag-and-drop file selection | Present and tested |
| ColorPicker | `registry/react/color-picker/` | Hex color and preset selection | Present and tested |
| Box | `registry/react/box/` | Generic layout container | Present and tested |
| Stack, HStack, VStack | `registry/react/stack/` | One-dimensional layout | Present and tested |
| Flex | `registry/react/flex/` | Flexbox layout | Present and tested |
| Grid | `registry/react/grid/` | Responsive grid | Present and tested |
| Container | `registry/react/container/` | Responsive max width | Present and tested |
| Center | `registry/react/center/` | Centering container | Present and tested |
| Spacer | `registry/react/spacer/` | Flexible or fixed space | Present and tested |
| AspectRatio | `registry/react/aspect-ratio/` | Controlled proportions | Present and tested |
| VisuallyHidden | `registry/react/visually-hidden/` | Screen-reader-only content | Present and tested |
| FocusScope | `registry/react/focus-scope/` | Reusable focus management | Present and tested |
| Image | `registry/react/image/` | Image with loading and error states | Present and tested |
| Carousel | `registry/react/carousel/` | Slide navigation | Present and tested |
| Resizable | `registry/react/resizable/` | Draggable split panels | Present and tested |
| VirtualList | `registry/react/virtual-list/` | Windowed large lists | Present and tested |
| DataGrid | `registry/react/data-grid/` | Server mode, resizable and hideable columns, grouping | Present and tested |
| TreeTable | `registry/react/tree-table/` | Hierarchical tree grid | Present and tested |
| Charts | `registry/react/chart/` | Bar, line, area, donut and sparkline charts | Present and tested |
| Form | `registry/react/form/` | Validation, submission and field registration | Present and tested |
| MaskedInput | `registry/react/masked-input/` | Pattern-masked text input | Present and tested |
| CurrencyInput | `registry/react/currency-input/` | Locale-aware currency field | Present and tested |
| PhoneInput | `registry/react/phone-input/` | Country-aware phone field | Present and tested |
| Mentions | `registry/react/mentions/` | Triggered mention suggestions | Present and tested |
| Cascader | `registry/react/cascader/` | Hierarchical single selection | Present and tested |
| Transfer | `registry/react/transfer/` | Two-list selection transfer | Present and tested |
| VideoPlayer | `registry/react/video-player/` | Accessible custom video controls | Present and tested |
| AudioPlayer | `registry/react/audio-player/` | Accessible custom audio controls | Present and tested |
| PDFViewer | `registry/react/pdf-viewer/` | Embedded PDF document viewer | Present and tested |
| Lightbox | `registry/react/lightbox/` | Modal image gallery | Present and tested |
| ImageCropper | `registry/react/image-cropper/` | Pointer and keyboard crop editor | Present and tested |
| QRCode | `registry/react/qr-code/` | Offline SVG QR encoder | Present and tested |
| AppShell | `registry/react/app-shell/` | Header, sidebar, main, aside and footer shell | Present and tested |
| Menubar | `registry/react/menubar/` | Horizontal application menus | Present and tested |
| Toolbar | `registry/react/toolbar/` | Grouped action toolbar | Present and tested |
| Popconfirm | `registry/react/popconfirm/` | Anchored confirmation | Present and tested |
| Tour | `registry/react/tour/` | Step-by-step onboarding spotlight | Present and tested |
| NotificationCenter | `registry/react/notification-center/` | Bell panel with read state | Present and tested |
| Kanban | `registry/react/kanban/` | Drag-and-drop board | Present and tested |
| Chat | `registry/react/chat/` | Message log and composer | Present and tested |
| Scheduler | `registry/react/scheduler/` | Day and week event calendar | Present and tested |
| Gantt | `registry/react/gantt/` | Task timeline with dependencies | Present and tested |
| FileManager | `registry/react/file-manager/` | File browser with list/grid views | Present and tested |

The provider lives in `registry/react/provider/`; the positioning and portal
utilities in `registry/react/internal/`. `Portal` is also exported publicly as a
low-level utility. The playground pages cover the 111 families (AvatarGroup and
RadioGroup are shown with their family).
`registry/native/`, `registry/angular/` and `registry/web/` are empty
placeholders: no component from those platforms may be announced as existing.

To know the exact props, variants, sizes and states of a component, read its
`.types.ts`, `.variants.ts` and `.tsx` files, its tests and its CSS; the axes
differ per family. Manual reviews of keyboard, screen readers, RTL, forced
colors and responsive behaviour remain necessary before calling the whole set
finished.
