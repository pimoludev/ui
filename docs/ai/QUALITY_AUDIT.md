# Quality audit in progress

This is an evidence log for stabilising the existing Playground and React
components before adding more families. It does not mark the visual or
accessibility review as complete.

## Playground and visual coverage

- The router currently has **131 pages**. The generated CSS and presets expose
  **seven** styles: default, adaptive, cartoon, glass, luxury, monochrome and
  neo-brutalism. Keep adaptive during this review.
- A Chromium smoke scan mounted the **113 routes present at the time** and
  performed **2,147 layout checks**: every style in light/dark at 1440 px, plus
  default forced colors, reduced motion and RTL at 1440 px, and default
  light/dark at 390 px. It found no page load error, runtime exception or
  page-level horizontal overflow. The 18 documentation, action and marketing
  components added afterwards still need the same scan. This scan did **not**
  judge contrast, spacing, motion, keyboard behavior or individual component
  overflow.
- The DashboardLayout collapsed sidebar was inspected at desktop and mobile
  widths. A contact sheet covers its seven presets in light/dark. The rail now
  keeps navigable shortcuts visible at desktop width; mobile uses an opening
  bar. The other 112 pages still need a detailed visual review in each mode.
- The Playground loads its pages lazily. The largest minified JavaScript chunk
  fell from about 1.14 MB to about 664 kB. Vite still warns above 500 kB;
  analyse the shared React/component chunk before splitting it further.

## Browser media and generated output

- VideoPlayer uses an original 4.1-second WebM and captions. The video is
  silent. Playback, seekable duration and the timeline were exercised in
  Chromium. AudioPlayer uses three original local narrated WAV samples;
  playback and duration were checked. Both players now synchronise duration
  when metadata is already cached before React receives its event.
- PDFViewer uses a real two-page local PDF; Chromium displayed page 2 via the
  viewer and both pages from the PDF itself.
- ImageCropper produced a PNG Blob from its crop button. The Playground's
  initial crop readout was aligned with the component's `defaultCrop`.
- QRCode was exercised in Chromium; changing the input changed the rendered
  SVG path. These are manual browser checks, not repeatable automated E2E
  tests yet.

## Complex-component accessibility review

The seven components have unit tests and CSS sections for visible focus,
forced colors and reduced motion. Those facts do not establish complete
screen-reader or keyboard quality across all presets.

| Component | Evidence checked | Remaining focused review |
| --- | --- | --- |
| DataGrid | Sort, filter, selection, grouping, resize and visibility tests; named resize separator with value and keyboard handler. | Screen-reader table navigation, large-data focus behavior, RTL resizing and contrast across presets. |
| Scheduler | Named grid, cells, event buttons and navigation tests. | Full keyboard traversal of dense time slots and events, overlapping event reading order, RTL and localized announcements. |
| Gantt | Semantic table rows, named task actions and navigation/zoom tests. | Screen-reader timeline comprehension and keyboard navigation through many bars. |
| Kanban | Keyboard/menu card moves, announcements and drag tests. | RTL horizontal move direction, focus after drag and high-density board navigation. |
| Tour | Dialog semantics, focus trap, Escape and focus-return tests. | Real-browser focus loop, spotlight contrast and RTL arrow direction. |
| Menubar | Roving focus, portal focus return, disabled-item skip and Escape tests. RTL horizontal trigger navigation is now covered. | Browser keyboard pass and contrast in every preset. |
| FileManager | List/grid modes, selection, file actions and keyboard handlers tested. The visual tile view now exposes listbox/options, matching its sequential keyboard model rather than claiming a single-row ARIA grid. | Screen-reader check of tile selection and navigation at narrow widths. |

## Next work, in order

1. Review the 131 pages visually, page by page, in seven presets and both
   modes; add targeted RTL, forced-colors and reduced-motion interaction checks.
2. Complete the seven focused browser and assistive-technology audits above
   with regression tests.
3. Make the four media/canvas browser checks repeatable without silently
   adding a new dependency or test runner.
4. Reduce the remaining shared Playground chunk after measuring its modules.
5. Keep the DataTable/DataGrid and AppShell/DashboardLayout use cases distinct
   as documented in `DEVELOPMENT_GUIDE.md`.
6. Only then assess new families such as RichTextEditor, MarkdownEditor, CodeEditor
   and DiffViewer. Chart interactions and DataGrid virtualization, pinning and
   reordering need separate API and accessibility designs.
