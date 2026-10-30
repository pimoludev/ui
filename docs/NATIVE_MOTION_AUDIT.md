# Native motion coverage inventory

Source inspection: 2026-10-30. 135 website references cover 129 source families.
This inventory records CSS declarations and source composition; it is not a
claim that every interaction has been visually or assistive-technology audited.
See NATIVE_MOTION.md and the website progress for actual browser checks.

All references using styles.css/layered.css receive reduced-motion and scoped
opt-out rules. Static text/layout do not get arbitrary entrance animations.
Component-only stylesheet consumers can import the motion.css entry explicitly.

| Reference | Motion responsibility |
| --- | --- |
| theme-builder | Component CSS declares state feedback |
| button | Component CSS declares state feedback |
| button-group | Component CSS declares state feedback |
| split-button | Component CSS declares state feedback |
| toggle | Component CSS declares state feedback |
| toggle-group | Composes toggle |
| toolbar | Static surface; shared color/policy rules where relevant |
| popconfirm | Composes popover |
| tabs | Component CSS declares state feedback |
| segmented-control | Component CSS declares state feedback |
| link | Component CSS declares state feedback |
| accordion | Component CSS declares state feedback |
| breadcrumbs | Composes link |
| pagination | Component CSS declares state feedback |
| stepper | Component CSS declares state feedback |
| navigation-menu | Component CSS declares state feedback |
| menubar | Component CSS declares state feedback |
| table-of-contents | Component CSS declares state feedback |
| checkbox | Component CSS declares state feedback |
| combobox | Component CSS declares state feedback |
| form-field | Component CSS declares state feedback |
| input | Component CSS declares state feedback |
| label | Static structure/readability; child interactions keep their motion |
| multi-select | Component CSS declares state feedback |
| radio | Component CSS declares state feedback |
| range-slider | Component CSS declares state feedback |
| select | Component CSS declares state feedback |
| slider | Component CSS declares state feedback |
| switch | Component CSS declares state feedback |
| textarea | Component CSS declares state feedback |
| number-input | Component CSS declares state feedback |
| pin-input | Component CSS declares state feedback |
| tags-input | Component CSS declares state feedback |
| time-picker | Component CSS declares state feedback |
| calendar | Component CSS declares state feedback |
| date-picker | Component CSS declares state feedback |
| date-range-picker | Component CSS declares state feedback |
| file-upload | Component CSS declares state feedback |
| dropzone | Component CSS declares state feedback |
| color-picker | Component CSS declares state feedback |
| search-input | Component CSS declares state feedback |
| password-input | Component CSS declares state feedback |
| input-group | Component CSS declares state feedback |
| tree-select | Component CSS declares state feedback |
| signature | Component CSS declares state feedback |
| form | Component CSS declares state feedback |
| form-submit | Component CSS declares state feedback |
| form-error | Component CSS declares state feedback |
| masked-input | Component CSS declares state feedback |
| currency-input | Component CSS declares state feedback |
| phone-input | Component CSS declares state feedback |
| mentions | Component CSS declares state feedback |
| cascader | Component CSS declares state feedback |
| transfer | Component CSS declares state feedback |
| avatar | Static surface; shared color/policy rules where relevant |
| badge | Static surface; shared color/policy rules where relevant |
| card | Static surface; shared color/policy rules where relevant |
| list | Component CSS declares state feedback |
| description-list | Static structure/readability; child interactions keep their motion |
| table | Static surface; shared color/policy rules where relevant |
| data-table | Component CSS declares state feedback |
| data-grid | Component CSS declares state feedback |
| tree-table | Component CSS declares state feedback |
| bar-chart | Component CSS declares state feedback |
| line-chart | Component CSS declares state feedback |
| area-chart | Component CSS declares state feedback |
| donut-chart | Component CSS declares state feedback |
| sparkline | Component CSS declares state feedback |
| api-table | Static structure/readability; child interactions keep their motion |
| stat | Static structure/readability; child interactions keep their motion |
| timeline | Component CSS declares state feedback |
| rating | Component CSS declares state feedback |
| image | Component CSS declares state feedback |
| carousel | Component CSS declares state feedback |
| virtual-list | Static structure/readability; child interactions keep their motion |
| tree-view | Component CSS declares state feedback |
| kanban | Component CSS declares state feedback |
| scheduler | Component CSS declares state feedback |
| gantt | Component CSS declares state feedback |
| chat | Component CSS declares state feedback |
| file-manager | Component CSS declares state feedback |
| video-player | Component CSS declares state feedback |
| audio-player | Component CSS declares state feedback |
| pdf-viewer | Component CSS declares state feedback |
| lightbox | Component CSS declares state feedback |
| image-cropper | Component CSS declares state feedback |
| qr-code | Static surface; shared color/policy rules where relevant |
| typography | Static structure/readability; child interactions keep their motion |
| prose | Component CSS declares state feedback |
| anchor | Component CSS declares state feedback |
| code-block | Component CSS declares state feedback |
| code | Static structure/readability; child interactions keep their motion |
| navbar | Component CSS declares state feedback |
| sidebar | Component CSS declares state feedback |
| dashboard-layout | Static surface; shared color/policy rules where relevant |
| app-shell | Static surface; shared color/policy rules where relevant |
| page-header | Component CSS declares state feedback |
| hero | Static structure/readability; child interactions keep their motion |
| footer | Component CSS declares state feedback |
| docs-layout | Component CSS declares state feedback |
| watermark | Static structure/readability; child interactions keep their motion |
| box | Static structure/readability; child interactions keep their motion |
| stack | Static structure/readability; child interactions keep their motion |
| flex | Static structure/readability; child interactions keep their motion |
| grid | Static structure/readability; child interactions keep their motion |
| container | Static structure/readability; child interactions keep their motion |
| center | Static structure/readability; child interactions keep their motion |
| spacer | Static structure/readability; child interactions keep their motion |
| aspect-ratio | Static structure/readability; child interactions keep their motion |
| visually-hidden | Static structure/readability; child interactions keep their motion |
| focus-scope | Static structure/readability; child interactions keep their motion |
| resizable | Component CSS declares state feedback |
| scroll-area | Static structure/readability; child interactions keep their motion |
| separator | Static structure/readability; child interactions keep their motion |
| circular-progress | Component CSS declares state feedback |
| dialog | Component CSS declares state feedback |
| alert | Component CSS declares state feedback |
| banner | Component CSS declares state feedback |
| empty-state | Component CSS declares state feedback |
| result | Component CSS declares state feedback |
| loading-overlay | Component CSS declares state feedback |
| alert-dialog | Composes dialog |
| context-menu | Component CSS declares state feedback |
| command | Composes dialog |
| dropdown-menu | Component CSS declares state feedback |
| drawer | Component CSS declares state feedback |
| hover-card | Component CSS declares state feedback |
| popover | Component CSS declares state feedback |
| progress | Component CSS declares state feedback |
| skeleton | Component CSS declares state feedback |
| spinner | Component CSS declares state feedback |
| toast | Component CSS declares state feedback |
| tour | Component CSS declares state feedback |
| notification-center | Composes popover |
| tooltip | Component CSS declares state feedback |
