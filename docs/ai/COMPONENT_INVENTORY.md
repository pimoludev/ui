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
| Navbar | `registry/react/navbar/` | Top navigation shell | Present and tested |
| Sidebar | `registry/react/sidebar/` | Grouped side navigation | Present and tested |
| NavigationMenu | `registry/react/navigation-menu/` | Menus with disclosure panels | Present and tested |
| ScrollArea | `registry/react/scroll-area/` | Styled scroll viewport | Present and tested |
| TreeView | `registry/react/tree-view/` | Keyboard-driven tree | Present and tested |
| List, ListItem | `registry/react/list/` | Visual list rows | Present and tested |
| DescriptionList | `registry/react/description-list/` | Term/details properties | Present and tested |

The provider lives in `registry/react/provider/`; the positioning and portal
utilities in `registry/react/internal/`. The playground pages cover the 42
families (AvatarGroup and RadioGroup are shown with their family).
`registry/native/`, `registry/angular/` and `registry/web/` are empty
placeholders: no component from those platforms may be announced as existing.

To know the exact props, variants, sizes and states of a component, read its
`.types.ts`, `.variants.ts` and `.tsx` files, its tests and its CSS; the axes
differ per family. Manual reviews of keyboard, screen readers, RTL, forced
colors and responsive behaviour remain necessary before calling the whole set
finished.
