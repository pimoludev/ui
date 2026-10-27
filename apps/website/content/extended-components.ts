// Curated compositions from the real Playground. Sources remain authoritative.
export const extendedComponents = [
  {
    "family": "theme-builder",
    "selection": {
      "helper": "ControlledBuilder"
    },
    "description": "An appearance panel whose selection belongs to the application.",
    "usage": [
      "ThemeBuilder reports a choice; connect it to your application's appearance state deliberately."
    ],
    "accessibility": [
      "Keep preset names visible, and check the contrast of the resulting theme."
    ]
  },
  {
    "family": "button-group",
    "selection": {
      "section": "Example: editor toolbar"
    },
    "description": "Related formatting actions in a compact editor toolbar.",
    "usage": [
      "Group actions that share a task; let individual buttons own activation and disabled states."
    ],
    "accessibility": [
      "Give icon actions names and do not use visual grouping as the only explanation."
    ]
  },
  {
    "family": "split-button",
    "selection": {
      "helper": "PublishControl"
    },
    "description": "Publish now or choose an alternative deployment action.",
    "usage": [
      "Keep the primary action predictable and put secondary choices in the associated menu."
    ],
    "accessibility": [
      "Name both the main action and the menu trigger; verify Escape returns focus."
    ]
  },
  {
    "family": "toggle",
    "selection": {
      "helper": "ControlledToggle"
    },
    "description": "A formatting option with an observable pressed state.",
    "usage": [
      "Use pressed state for an on/off command, rather than modelling it as navigation."
    ],
    "accessibility": [
      "Keep the accessible name stable as aria-pressed changes."
    ]
  },
  {
    "family": "toggle-group",
    "selection": {
      "helper": "ControlledMultipleGroup"
    },
    "description": "Choose several formatting options in one group.",
    "usage": [
      "Use the multiple-selection model for independent choices and single selection for exclusive modes."
    ],
    "accessibility": [
      "Name the group and verify arrow navigation without relying on color for selection."
    ]
  },
  {
    "family": "toolbar",
    "selection": {
      "section": "Editor toolbar"
    },
    "description": "An editor toolbar with formatting and alignment commands.",
    "usage": [
      "Keep related commands together and use groups or separators to clarify their relationship."
    ],
    "accessibility": [
      "Check roving focus, disabled-item skipping and the names of every icon button."
    ]
  },
  {
    "family": "popconfirm",
    "selection": {
      "section": "Destructive confirmation"
    },
    "description": "Confirm a destructive action beside its trigger.",
    "usage": [
      "Use a brief question and explicit confirm/cancel labels. Persist deletion only after confirmation."
    ],
    "accessibility": [
      "Keep a keyboard-accessible cancel path and verify focus restoration after dismissal."
    ]
  },
  {
    "family": "segmented-control",
    "selection": {
      "helper": "ControlledSegmented"
    },
    "description": "Switch between a few mutually exclusive views.",
    "usage": [
      "Keep options short and use a Select when the list becomes long.",
      "The workspace adds a CSS sliding indicator. Use animated=false to disable it, classNames.indicator to customize its surface, and --pimolu-segmented-indicator-duration / --pimolu-segmented-indicator-easing for timing. Reduced motion always wins.",
      "Options stay on one track and overflow remains scrollable. showScrollbar changes only the native bar visibility, never wrapping or scroll access. For vertical scrolling, use orientation=vertical and a bounded style.maxHeight. These additions await the next npm release."
    ],
    "accessibility": [
      "Name the control and ensure selected state remains clear without color."
    ]
  },
  {
    "family": "accordion",
    "selection": {
      "helper": "ControlledAccordion"
    },
    "description": "Application-controlled disclosure of related content.",
    "usage": [
      "Choose single or multiple expansion according to whether users compare panels."
    ],
    "accessibility": [
      "Keep heading order meaningful and verify Enter/Space activation on the triggers."
    ]
  },
  {
    "family": "breadcrumbs",
    "selection": {
      "section": "Long path"
    },
    "description": "A path through nested application information.",
    "usage": [
      "Use real destinations for ancestors and a clear label for the current location."
    ],
    "accessibility": [
      "Provide a navigation label and keep separators decorative."
    ]
  },
  {
    "family": "pagination",
    "selection": {
      "helper": "ControlledPagination"
    },
    "description": "Move through pages while the application owns the data.",
    "usage": [
      "Update the displayed dataset when the selected page changes; the control does not fetch data."
    ],
    "accessibility": [
      "Name pagination, expose the current page and keep disabled boundaries non-operable."
    ]
  },
  {
    "family": "stepper",
    "selection": {
      "helper": "ControlledStepper"
    },
    "description": "A controlled onboarding sequence with back and next actions.",
    "usage": [
      "Keep completion validation in the application; a step change is not proof a form is valid."
    ],
    "accessibility": [
      "Name the sequence and identify the active step in text as well as appearance."
    ]
  },
  {
    "family": "navigation-menu",
    "selection": {
      "section": "Basic"
    },
    "description": "Grouped destinations for a product navigation bar.",
    "usage": [
      "Use navigation links with actual destinations rather than command handlers."
    ],
    "accessibility": [
      "Label the navigation region and check keyboard opening, dismissal and focus return."
    ]
  },
  {
    "family": "menubar",
    "selection": {
      "section": "Application menu"
    },
    "description": "Desktop-style application commands with local feedback.",
    "usage": [
      "Use Menubar for commands, and Navbar or NavigationMenu for destinations."
    ],
    "accessibility": [
      "Verify arrow navigation, disabled-item skipping, Escape and focus return at a scrolled position."
    ]
  },
  {
    "family": "table-of-contents",
    "selection": {
      "section": "Interactive guide"
    },
    "description": "A controlled outline of a long document.",
    "usage": [
      "Supply stable heading ids and update activeId from your own navigation or scroll tracking."
    ],
    "accessibility": [
      "Every link must reach a real heading; distinguish the current location without color alone."
    ]
  },
  {
    "family": "checkbox",
    "selection": {
      "helper": "SelectAllExample"
    },
    "description": "Select individual records or the whole set.",
    "usage": [
      "Compute the mixed state from the selected records and keep the application dataset authoritative."
    ],
    "accessibility": [
      "Provide visible labels and verify the indeterminate state with a screen reader."
    ]
  },
  {
    "family": "combobox",
    "selection": {
      "helper": "AssigneeExample"
    },
    "description": "Search and choose an assignee from named options.",
    "usage": [
      "Keep option values stable when labels change; filter according to the component's supported contract."
    ],
    "accessibility": [
      "Name the input and test arrows, Enter, Escape and an empty search result."
    ]
  },
  {
    "family": "form-field",
    "selection": {
      "section": "Examples"
    },
    "description": "Label and feedback compositions for profile fields.",
    "usage": [
      "Connect the field's id to its label and descriptive feedback rather than duplicating labels."
    ],
    "accessibility": [
      "Keep help and errors associated with the input and explain errors in text."
    ]
  },
  {
    "family": "label",
    "selection": {
      "section": "Examples"
    },
    "description": "Visible field labels in a sign-in composition.",
    "usage": [
      "Associate each Label with the exact input id; labels do not implement form state."
    ],
    "accessibility": [
      "Clicking a label should focus its control. Do not replace it with placeholder text."
    ]
  },
  {
    "family": "multi-select",
    "selection": {
      "helper": "StackExample"
    },
    "description": "Choose a technology stack with an application-owned limit.",
    "usage": [
      "Use stable option values and apply selection limits deliberately; display the resulting state nearby."
    ],
    "accessibility": [
      "Name the field and check chip removal, clear-all, listbox navigation and disabled choices."
    ]
  },
  {
    "family": "radio",
    "selection": {
      "helper": "FrameworkExample"
    },
    "description": "Choose one framework in a named radio group.",
    "usage": [
      "Use one shared group name for mutually exclusive choices and meaningful submitted values."
    ],
    "accessibility": [
      "Give the group context and each radio a label; verify arrow and Tab behavior."
    ]
  },
  {
    "family": "range-slider",
    "selection": {
      "helper": "PriceBracket"
    },
    "description": "Set a lower and upper price boundary.",
    "usage": [
      "Keep formatting and numeric state separate, and validate the allowed range in your application. A vertical page pan starting on the track does not change the bounds; a completed tap moves the nearest handle. Native thumbs remain draggable and the fill mirrors in RTL."
    ],
    "accessibility": [
      "Name both endpoints and provide an understandable numeric value, including units."
    ]
  },
  {
    "family": "slider",
    "selection": {
      "helper": "PriceFilter"
    },
    "description": "Adjust a price filter with visible numeric feedback.",
    "usage": [
      "Keep bounds and step meaningful for the task; do not force fine precision through pointer dragging alone. The native input and its filled track follow the surrounding text direction."
    ],
    "accessibility": [
      "Verify arrow keys and Home/End, and offer a typed alternative for exact amounts when needed."
    ]
  },
  {
    "family": "switch",
    "selection": {
      "helper": "AppearanceSwitches"
    },
    "description": "Controlled appearance preferences with supporting descriptions.",
    "usage": [
      "Use Switch for an immediately applied setting; keep persistence in the application."
    ],
    "accessibility": [
      "Give every setting a visible label and check checked/disabled states with keyboard input."
    ]
  },
  {
    "family": "textarea",
    "selection": {
      "helper": "CommentExample"
    },
    "description": "Write a comment with application-owned text.",
    "usage": [
      "Use a named textarea for form submission and keep character limits consistent with backend rules."
    ],
    "accessibility": [
      "Associate labels, help and validation; preserve multiline editing keyboard behavior."
    ]
  },
  {
    "family": "number-input",
    "selection": {
      "helper": "SeatPicker"
    },
    "description": "Choose a number of seats and see the resulting quantity.",
    "usage": [
      "Use min/max/step appropriate to the domain and validate submitted values independently."
    ],
    "accessibility": [
      "Name increment/decrement actions and test typed values as well as the stepper buttons."
    ]
  },
  {
    "family": "pin-input",
    "selection": {
      "helper": "VerificationCard"
    },
    "description": "A one-time verification code split into coordinated cells.",
    "usage": [
      "Keep verification and server errors outside the input; completion only reports local input."
    ],
    "accessibility": [
      "Label the code entry, test paste/backspace and do not prevent password-manager or OTP autofill."
    ]
  },
  {
    "family": "tags-input",
    "selection": {
      "helper": "ArticleTags"
    },
    "description": "Create and remove tags for an article.",
    "usage": [
      "Normalize and validate tags according to the application's domain before persisting them."
    ],
    "accessibility": [
      "Name the input and each removal action; check Enter and keyboard deletion."
    ]
  },
  {
    "family": "time-picker",
    "selection": {
      "helper": "BookingTime"
    },
    "description": "Choose a booking time with visible selection feedback.",
    "usage": [
      "Treat the result as a time value; combine it with a date and timezone deliberately."
    ],
    "accessibility": [
      "Label hours/minutes, preserve keyboard editing and explain unavailable times in text."
    ]
  },
  {
    "family": "calendar",
    "selection": {
      "helper": "BookingExample"
    },
    "description": "Select dates for a booking in a standalone calendar.",
    "usage": [
      "Keep local calendar-day semantics and apply availability limits explicitly."
    ],
    "accessibility": [
      "Verify arrow navigation, disabled dates, locale labels and the selected-date announcement."
    ]
  },
  {
    "family": "date-range-picker",
    "selection": {
      "helper": "BookingExample"
    },
    "description": "Pick arrival and departure dates for a reservation.",
    "usage": [
      "Validate ordering and availability in the application; avoid UTC conversions that shift calendar days."
    ],
    "accessibility": [
      "Label the range, make both endpoints understandable and verify clear/open/close focus behavior."
    ]
  },
  {
    "family": "file-upload",
    "selection": {
      "helper": "RequestAttachments"
    },
    "description": "Attach supporting documents to a request.",
    "usage": [
      "Accepted types and size checks improve feedback; validate uploads again on the server."
    ],
    "accessibility": [
      "Keep a labelled file-input path, clear rejection messages and accessible removal actions."
    ]
  },
  {
    "family": "dropzone",
    "selection": {
      "helper": "BrandAssets"
    },
    "description": "Upload and review a collection of brand assets.",
    "usage": [
      "Support file selection as well as dragging, and keep upload/network state in the application."
    ],
    "accessibility": [
      "Keyboard users need the same file-picker path and rejection information as pointer users."
    ]
  },
  {
    "family": "color-picker",
    "selection": {
      "helper": "BrandStudio"
    },
    "description": "Edit two brand colors with a live visual preview.",
    "usage": [
      "Use presets for suggestions and the editable color value for additional choices."
    ],
    "accessibility": [
      "Give color values readable names and verify contrast after customization; a swatch alone is not a label."
    ]
  },
  {
    "family": "search-input",
    "selection": {
      "helper": "DocumentationSearch"
    },
    "description": "Filter a documentation list with controlled search text.",
    "usage": [
      "Keep the query and result set synchronized, including the clear action."
    ],
    "accessibility": [
      "Label search and expose result feedback without announcing every keystroke assertively."
    ]
  },
  {
    "family": "password-input",
    "selection": {
      "helper": "SignInForm"
    },
    "description": "A password field in an application-owned sign-in form.",
    "usage": [
      "Keep authentication and password validation on the server; visibility is a local preference."
    ],
    "accessibility": [
      "Preserve autocomplete and label the reveal action without exposing the secret in feedback."
    ]
  },
  {
    "family": "input-group",
    "selection": {
      "helper": "InviteForm"
    },
    "description": "Invite a teammate using a composed field and adjacent action.",
    "usage": [
      "Keep the input's form semantics intact when adding prefixes, suffixes or buttons."
    ],
    "accessibility": [
      "Associate the input label and give adjacent icon actions independent names."
    ]
  },
  {
    "family": "tree-select",
    "selection": {
      "helper": "TicketRoutingExample"
    },
    "description": "Route a ticket through a hierarchical selection.",
    "usage": [
      "Keep node identities stable and distinguish selectable leaves from structural groups. Touch scrolling does not move the active node; tap a label to select it or its arrow to expand a branch."
    ],
    "accessibility": [
      "Check expansion, selection, search and disabled nodes with the keyboard."
    ]
  },
  {
    "family": "signature",
    "selection": {
      "helper": "ContractSignature"
    },
    "description": "Capture a signature for a contract workflow.",
    "usage": [
      "A canvas result is image data; legal consent, identity verification and storage belong to the application.",
      "Clear and Undo accept a completed touch tap after drawing, even when the browser suppresses a compatibility click. Moving a finger across an action does not activate it."
    ],
    "accessibility": [
      "Provide clear/reset controls and an alternative signing workflow for users who cannot draw."
    ]
  },
  {
    "family": "masked-input",
    "selection": {
      "helper": "DeliveryForm"
    },
    "description": "Guide entry of formatted delivery information.",
    "usage": [
      "Separate display formatting from the value your backend expects and validate the complete input."
    ],
    "accessibility": [
      "Explain the expected format outside the placeholder and allow paste and correction."
    ]
  },
  {
    "family": "currency-input",
    "selection": {
      "helper": "BudgetForm"
    },
    "description": "Enter a budget with locale-aware currency formatting.",
    "usage": [
      "Keep numeric amounts, currency and locale explicit; do not treat a display string as financial arithmetic."
    ],
    "accessibility": [
      "Name the currency/amount and preserve typed editing and validation feedback."
    ]
  },
  {
    "family": "phone-input",
    "selection": {
      "helper": "ContactForm"
    },
    "description": "Choose a calling code and enter a contact number.",
    "usage": [
      "Country selection and formatting do not prove that a phone number exists or is reachable."
    ],
    "accessibility": [
      "Label the country selector and number separately, and preserve telephone autocomplete."
    ]
  },
  {
    "family": "mentions",
    "selection": {
      "helper": "ProjectUpdateExample"
    },
    "description": "Mention teammates while writing a project update.",
    "usage": [
      "Use stable mention ids and validate referenced users on the server."
    ],
    "accessibility": [
      "Name the editor and verify suggestion navigation, Escape and text editing without a pointer."
    ]
  },
  {
    "family": "cascader",
    "selection": {
      "helper": "ShippingExample"
    },
    "description": "Choose a shipping destination through nested levels.",
    "usage": [
      "Use Cascader for a path and TreeSelect when users need a broader tree view. Mouse hover can open columns; on touch screens, scroll first and complete a tap to expand a branch."
    ],
    "accessibility": [
      "Keep the hierarchy understandable and verify back navigation and disabled choices."
    ]
  },
  {
    "family": "transfer",
    "selection": {
      "helper": "AccessExample"
    },
    "description": "Assign a subset of available permissions.",
    "usage": [
      "Keep transferred ids authoritative and avoid treating transfer selection as authorization."
    ],
    "accessibility": [
      "Name both lists and transfer actions; expose selection and counts without color alone."
    ]
  },
  {
    "family": "avatar",
    "selection": {
      "section": "Examples"
    },
    "description": "People and teams with image and fallback identities.",
    "usage": [
      "Use fallbacks for unavailable images and keep group overflow informative."
    ],
    "accessibility": [
      "Provide useful names when the avatar conveys identity; decorative portraits can have empty alternative text."
    ]
  },
  {
    "family": "list",
    "selection": {
      "helper": "SelectableList"
    },
    "description": "Select entries in an application-owned list.",
    "usage": [
      "Use List for a linear collection; choose Table when columns carry meaningful relationships."
    ],
    "accessibility": [
      "Check the selectable pattern's keyboard model and give each item an understandable name."
    ]
  },
  {
    "family": "description-list",
    "selection": {
      "section": "Examples"
    },
    "description": "Workspace metadata expressed as terms and descriptions.",
    "usage": [
      "Use this pattern for name/value details rather than a grid of unrelated labels."
    ],
    "accessibility": [
      "Keep terms associated with their descriptions and preserve a sensible reading order."
    ]
  },
  {
    "family": "tree-table",
    "selection": {
      "helper": "SelectableExplorer"
    },
    "description": "A folder hierarchy with columns and controlled selection.",
    "usage": [
      "Stable row ids preserve expansion and selection across data updates. Set selectionMode=\"cascade\" to select a folder and all enabled descendants, including collapsed rows. Partially selected folders expose a mixed checkbox; selecting all descendants also selects their parent. The default independent mode selects individual rows.",
      "The example uses cascade selection and archives only local demonstration data. Restore files resets that example. The table caption appears as a structured heading above the rows."
    ],
    "accessibility": [
      "Test expand/collapse and row selection by keyboard; ensure hierarchy and column context are announced."
    ]
  },
  {
    "family": "api-table",
    "selection": {
      "section": "Component props"
    },
    "description": "A compact reference of property contracts.",
    "usage": [
      "Provide accurate types, defaults and descriptions; an empty default is not proof of runtime behavior."
    ],
    "accessibility": [
      "Keep row/column headings and contained scrolling available on small screens."
    ]
  },
  {
    "family": "stat",
    "selection": {
      "section": "Examples"
    },
    "description": "A billing snapshot with values, trends and context.",
    "usage": [
      "Use label, value and supporting context consistently; distinguish period change from an absolute value."
    ],
    "accessibility": [
      "State the direction and meaning in text, including when a decrease is favorable."
    ]
  },
  {
    "family": "timeline",
    "selection": {
      "section": "Example"
    },
    "description": "A sequence of security-review events.",
    "usage": [
      "Use meaningful event titles and explicit times; distinguish process state from chronological order."
    ],
    "accessibility": [
      "Keep the reading order coherent and explain statuses without relying on marker color."
    ]
  },
  {
    "family": "rating",
    "selection": {
      "helper": "InteractiveRating"
    },
    "description": "An editable product rating with local feedback.",
    "usage": [
      "Keep the numeric rating separate from the number of reviews and define the scale clearly."
    ],
    "accessibility": [
      "Name the rating control and check keyboard selection; do not communicate the value only with stars."
    ]
  },
  {
    "family": "image",
    "selection": {
      "section": "Examples"
    },
    "description": "A product image inside a composed product card.",
    "usage": [
      "Use meaningful dimensions and a fallback appropriate to the content."
    ],
    "accessibility": [
      "Write alternative text for informative imagery and avoid repeating adjacent text unnecessarily."
    ]
  },
  {
    "family": "carousel",
    "selection": {
      "section": "Product gallery"
    },
    "description": "A browsable product gallery with image descriptions.",
    "usage": [
      "Keep navigation explicit; autoplay must be optional and pauseable when enabled. Touch swipes, dots and controls stay synchronized in RTL; horizontal arrow keys mirror the reading direction."
    ],
    "accessibility": [
      "Test previous/next and slide announcements, and respect reduced-motion preferences."
    ]
  },
  {
    "family": "virtual-list",
    "selection": {
      "section": "Searchable directory"
    },
    "description": "Search a large directory without mounting every visible record at once.",
    "usage": [
      "Keep item identities and estimated dimensions stable; virtualization changes which rows exist in the DOM."
    ],
    "accessibility": [
      "Verify focus does not disappear on scroll and provide search or another route to offscreen items."
    ]
  },
  {
    "family": "tree-view",
    "selection": {
      "helper": "ControlledTree"
    },
    "description": "Browse an application-controlled file hierarchy.",
    "usage": [
      "Separate expansion from selection and use stable ids when nodes are updated."
    ],
    "accessibility": [
      "Verify the tree's arrow-key model, focus position and disabled branches."
    ]
  },
  {
    "family": "kanban",
    "selection": {
      "section": "Sprint board"
    },
    "description": "Move work through a sprint board with local state.",
    "usage": [
      "Keep column/task ids stable and persist moves in your own data layer."
    ],
    "accessibility": [
      "A full column blocks incoming moves and additions. Existing cards remain enabled so users can move them out.",
      "Provide a keyboard move path and announce the resulting destination; do not require drag and drop."
    ]
  },
  {
    "family": "scheduler",
    "selection": {
      "helper": "WeekSchedulerExample"
    },
    "description": "Review and create events in a weekly schedule.",
    "usage": [
      "Keep event ids stable and decide timezone, overlap and persistence rules in the application. Use maxHeight to bound the timetable while keeping day headings visible. Short events use a compact title; the full date and time remain in the accessible name and hover title."
    ],
    "accessibility": [
      "The grid has one Tab entry. Arrows navigate dates and hours (including RTL), Home/End reach row edges, Control+Home/End reach grid edges. Enter activates a slot; F2 enters cell actions and Escape returns to the cell. Timed event buttons remain reachable separately.",
      "Check event focus, date controls and keyboard alternatives to pointer-only scheduling."
    ]
  },
  {
    "family": "gantt",
    "selection": {
      "helper": "RoadmapExample"
    },
    "description": "A project roadmap across a time axis.",
    "usage": [
      "Treat dates, dependency validation and progress updates as application data."
    ],
    "accessibility": [
      "Keep task names and dates available in text and provide keyboard access to selectable tasks."
    ]
  },
  {
    "family": "chat",
    "selection": {
      "section": "Team conversation"
    },
    "description": "Send messages in a local team conversation.",
    "usage": [
      "Keep transport, authentication and delivery status in your own messaging service."
    ],
    "accessibility": [
      "Label the composer and announce new messages without repeatedly reading the whole history."
    ]
  },
  {
    "family": "file-manager",
    "selection": {
      "helper": "ProjectAssetsExample"
    },
    "description": "Browse and manage a project's assets.",
    "usage": [
      "Select one entry and use the Open toolbar action on touch screens. Double click and Enter remain available. Folders navigate internally; files require onOpen to enable opening. File actions report application intent; connect them to real permissions and storage before shipping."
    ],
    "accessibility": [
      "Test selection, contextual actions, rename/delete confirmation and focus after a file disappears."
    ]
  },
  {
    "family": "video-player",
    "selection": {
      "section": "Product tour"
    },
    "description": "Play the bundled Pimolu tour with captions.",
    "usage": [
      "Serve real media with suitable codecs and caption tracks; handle unavailable playback explicitly."
    ],
    "accessibility": [
      "Provide captions, keyboard-operable controls and a transcript for essential spoken content."
    ]
  },
  {
    "family": "audio-player",
    "selection": {
      "section": "Playlist"
    },
    "description": "Browse and play locally bundled design-note episodes.",
    "usage": [
      "Keep the playlist state and current track synchronized; avoid unsolicited audio playback."
    ],
    "accessibility": [
      "Name playback and seeking controls and offer a transcript for spoken audio."
    ]
  },
  {
    "family": "pdf-viewer",
    "selection": {
      "section": "Brand guidelines"
    },
    "description": "Read the bundled brand-guidelines document.",
    "usage": [
      "The viewer uses the browser PDF capability; keep a direct document link and useful fallback."
    ],
    "accessibility": [
      "Tag the source PDF accessibly and provide an HTML alternative for essential information."
    ]
  },
  {
    "family": "lightbox",
    "selection": {
      "section": "Basic gallery"
    },
    "description": "Open a gallery at its selected image.",
    "usage": [
      "Use useful alternative text and preserve the selected index in controlled workflows."
    ],
    "accessibility": [
      "Verify Escape, previous/next controls, modal focus containment and return to the originating thumbnail."
    ]
  },
  {
    "family": "image-cropper",
    "selection": {
      "section": "Profile photo"
    },
    "description": "Crop a profile image and inspect the exported result.",
    "usage": [
      "Canvas export requires a readable image source; cross-origin images need compatible CORS headers."
    ],
    "accessibility": [
      "Provide keyboard-operable crop controls and a non-drag alternative for essential image tasks."
    ]
  },
  {
    "family": "qr-code",
    "selection": {
      "section": "Live value"
    },
    "description": "Create a QR code from an editable value.",
    "usage": [
      "Validate the target destination and choose an appropriate size/error-correction level."
    ],
    "accessibility": [
      "Always provide the encoded destination as readable text or a link, not only a visual code."
    ]
  },
  {
    "family": "typography",
    "selection": {
      "section": "Examples"
    },
    "description": "Readable article text with a deliberate hierarchy.",
    "usage": [
      "Choose semantic heading levels independently from visual size."
    ],
    "accessibility": [
      "Preserve document order, sufficient line height and zoom without clipping."
    ]
  },
  {
    "family": "prose",
    "selection": {
      "section": "Full article"
    },
    "description": "Long-form editorial content with shared typography.",
    "usage": [
      "Use Prose for content flow while keeping controls as real Pimolu components."
    ],
    "accessibility": [
      "Maintain heading order and meaningful link text, and verify code/table overflow at narrow widths."
    ]
  },
  {
    "family": "anchor",
    "selection": {
      "section": "Inside Prose"
    },
    "description": "Permalinks associated with article headings.",
    "usage": [
      "Use stable unique heading ids and meaningful destinations."
    ],
    "accessibility": [
      "Keep the permalink keyboard reachable and provide a clear accessible name for icon-only links."
    ]
  },
  {
    "family": "code-block",
    "selection": {
      "section": "Example: release note"
    },
    "description": "A release note with a copyable code sample.",
    "usage": [
      "Display the exact working source and choose wrapping or scrolling for long lines."
    ],
    "accessibility": [
      "Keep code readable at zoom and confirm that copy feedback is announced without moving focus."
    ]
  },
  {
    "family": "code",
    "selection": {
      "section": "Examples"
    },
    "description": "Inline technical values and shortcut notation.",
    "usage": [
      "Use Code for short fragments and Kbd for keys; neither registers a keyboard shortcut."
    ],
    "accessibility": [
      "Explain shortcuts in readable text and avoid depending on punctuation alone."
    ]
  },
  {
    "family": "app-shell",
    "selection": {
      "section": "Full application chrome"
    },
    "description": "Application regions with a header, rails and footer.",
    "usage": [
      "Choose AppShell for generic application structure and DashboardLayout for its opinionated workspace composition."
    ],
    "accessibility": [
      "Name navigation/aside regions and verify one main landmark in the standalone document."
    ]
  },
  {
    "family": "page-header",
    "selection": {
      "section": "Complete composition"
    },
    "description": "A page introduction with context and actions.",
    "usage": [
      "Keep one main page title and use description/actions to clarify the current task. Use size=\"sm\" for application panels, the default md for reference pages, and lg for a larger introduction. Typography follows the available container width; pageHeaderVariantMap exposes the supported sizes."
    ],
    "accessibility": [
      "Preserve heading hierarchy and ensure breadcrumb/action labels remain understandable on mobile."
    ]
  },
  {
    "family": "hero",
    "selection": {
      "helper": "HeroPreview"
    },
    "description": "A composed product introduction with calls to action.",
    "usage": [
      "Make primary and secondary actions lead to real destinations in your product."
    ],
    "accessibility": [
      "Keep the heading order correct and retain text contrast over any visual media."
    ]
  },
  {
    "family": "footer",
    "selection": {
      "section": "Complete footer"
    },
    "description": "Grouped product links and legal information.",
    "usage": [
      "Choose surface (default), transparent for a seamless page, or floating for a framed section. bordered controls the top divider; floating retains its frame.",
      "Use actual destinations and keep secondary navigation distinct from primary tasks."
    ],
    "accessibility": [
      "Label multiple navigation regions and keep link groups in a coherent reading order."
    ]
  },
  {
    "family": "docs-layout",
    "selection": {
      "section": "Complete shell"
    },
    "description": "A documentation shell with navigation and article content.",
    "usage": [
      "Keep layout responsibilities separate from the content and search implementation."
    ],
    "accessibility": [
      "Verify landmarks and heading order; the live preview is isolated to avoid nested main regions."
    ]
  },
  {
    "family": "watermark",
    "selection": {
      "section": "Text"
    },
    "description": "A repeated visual mark on document content.",
    "usage": [
      "Watermarks are decorative attribution, not a security mechanism or access control."
    ],
    "accessibility": [
      "Keep the mark from reducing text contrast or obstructing interaction."
    ]
  },
  {
    "family": "box",
    "selection": {
      "section": "Examples"
    },
    "description": "A plan summary built from a token-aware surface primitive.",
    "usage": [
      "Use Box for layout and surface composition, not as a substitute for a semantic button or link."
    ],
    "accessibility": [
      "Choose the appropriate underlying semantic element and preserve reading order."
    ]
  },
  {
    "family": "stack",
    "selection": {
      "section": "Examples"
    },
    "description": "A notification composition with consistent spacing.",
    "usage": [
      "Use horizontal/vertical stacks to express content flow and let them wrap where appropriate."
    ],
    "accessibility": [
      "Ensure the visual order matches the DOM reading and keyboard order."
    ]
  },
  {
    "family": "flex",
    "selection": {
      "section": "Examples"
    },
    "description": "A flexible toolbar that adapts to available space.",
    "usage": [
      "Use wrapping rather than squeezing labels or clipping actions."
    ],
    "accessibility": [
      "Keep source order logical and verify all controls remain reachable at narrow widths."
    ]
  },
  {
    "family": "grid",
    "selection": {
      "section": "Examples"
    },
    "description": "A responsive collection arranged in a grid.",
    "usage": [
      "Choose minimum column widths that fit the content; stack cards when they no longer fit."
    ],
    "accessibility": [
      "Do not use visual placement to change the apparent reading order."
    ]
  },
  {
    "family": "container",
    "selection": {
      "section": "Examples"
    },
    "description": "Constrain a composition's reading width.",
    "usage": [
      "Use Container for page width and application layout, leaving component spacing local."
    ],
    "accessibility": [
      "Verify content reflows at zoom and does not create a horizontal page scrollbar."
    ]
  },
  {
    "family": "center",
    "selection": {
      "section": "Examples"
    },
    "description": "An empty-state composition centered within a surface.",
    "usage": [
      "Provide enough height for the task and let content expand instead of forcing fixed dimensions."
    ],
    "accessibility": [
      "Keep the semantic reading order intact and avoid clipping at text zoom."
    ]
  },
  {
    "family": "spacer",
    "selection": {
      "section": "Examples"
    },
    "description": "Separate groups of actions in a responsive app bar.",
    "usage": [
      "Use flexible space between groups and ordinary gap within related controls."
    ],
    "accessibility": [
      "Do not hide or push essential controls outside the viewport on small screens."
    ]
  },
  {
    "family": "aspect-ratio",
    "selection": {
      "section": "Examples"
    },
    "description": "Keep product media in a predictable frame.",
    "usage": [
      "Choose a ratio appropriate to the media without distorting its content."
    ],
    "accessibility": [
      "Provide image alternatives and retain a usable layout if the image fails."
    ]
  },
  {
    "family": "visually-hidden",
    "selection": {
      "section": "Examples"
    },
    "description": "Visible controls with additional screen-reader context.",
    "usage": [
      "Use visually hidden text for necessary names, not to conceal essential instructions from sighted users."
    ],
    "accessibility": [
      "Confirm hidden text contributes to the accessible name without becoming a duplicate announcement."
    ]
  },
  {
    "family": "focus-scope",
    "selection": {
      "section": "Examples"
    },
    "description": "An inline confirmation with deliberate focus handling.",
    "usage": [
      "Use a scope only when the interaction calls for managed focus; avoid trapping ordinary page content."
    ],
    "accessibility": [
      "Check the initial focus target, Tab boundaries, Escape handling and restoration."
    ]
  },
  {
    "family": "resizable",
    "selection": {
      "section": "Examples"
    },
    "description": "A workspace inspector with resizable panels.",
    "usage": [
      "Set useful minimum sizes and keep panel state in the surrounding workspace when persistence is needed."
    ],
    "accessibility": [
      "Verify separator keyboard resizing and keep content usable at its minimum size."
    ]
  },
  {
    "family": "scroll-area",
    "selection": {
      "section": "Vertical"
    },
    "description": "A bounded, scrollable activity list.",
    "usage": [
      "Constrain the region deliberately rather than clipping content or the entire page."
    ],
    "accessibility": [
      "Make the region discoverable and ensure keyboard users can reach all its content."
    ]
  },
  {
    "family": "separator",
    "selection": {
      "section": "Examples"
    },
    "description": "Separate account-setting groups without extra content.",
    "usage": [
      "Use a separator for meaningful grouping; use layout gap for ordinary spacing."
    ],
    "accessibility": [
      "Keep decorative separators out of the reading order and label structural regions when needed."
    ]
  },
  {
    "family": "circular-progress",
    "selection": {
      "section": "Examples"
    },
    "description": "Show upload progress with a numeric value.",
    "usage": [
      "Use determinate progress for a known total and indeterminate presentation when the total is unknown. With showValue, sm places the readout beside the ring; md and lg keep it centered. max must be positive and finite; invalid ranges render an empty 0/100 gauge."
    ],
    "accessibility": [
      "Provide an accessible label and a meaningful value or busy message."
    ]
  },
  {
    "family": "banner",
    "selection": {
      "helper": "DismissibleBannerDemo"
    },
    "description": "A dismissible application-wide message.",
    "usage": [
      "Keep persistent critical notices discoverable after dismissal and store dismissal preferences deliberately."
    ],
    "accessibility": [
      "Choose announcement urgency carefully and give the dismiss action a clear name."
    ]
  },
  {
    "family": "empty-state",
    "selection": {
      "section": "Examples"
    },
    "description": "Guide users toward creating their first project.",
    "usage": [
      "Explain why the view is empty and offer an actionable next step."
    ],
    "accessibility": [
      "Do not rely on illustration alone; keep a clear heading and keyboard-accessible action."
    ]
  },
  {
    "family": "result",
    "selection": {
      "section": "Examples"
    },
    "description": "A checkout outcome with a meaningful next action.",
    "usage": [
      "Differentiate success, pending and failure using explicit text and useful recovery paths."
    ],
    "accessibility": [
      "Keep outcome text readable without color or icon recognition."
    ]
  },
  {
    "family": "loading-overlay",
    "selection": {
      "helper": "ControlledLoadingDemo"
    },
    "description": "Block a local action while work is in progress.",
    "usage": [
      "Use a loading overlay for an actual pending task and always provide completion/error recovery."
    ],
    "accessibility": [
      "Announce busy state without trapping focus indefinitely or concealing critical cancellation controls."
    ]
  },
  {
    "family": "alert-dialog",
    "selection": {
      "section": "Destructive confirmation"
    },
    "description": "An explicit decision before deleting a resource.",
    "usage": [
      "Reserve interruptive confirmation for consequential actions and use precise button labels."
    ],
    "accessibility": [
      "Check the named alert dialog, safe initial focus, Escape and restoration to the trigger."
    ]
  },
  {
    "family": "context-menu",
    "selection": {
      "section": "Examples"
    },
    "description": "Contextual commands for a project row.",
    "usage": [
      "Offer the same actions through a visible alternative because right click is not universally discoverable."
    ],
    "accessibility": [
      "Verify the keyboard context-menu path, menu navigation, dismissal and focus return."
    ]
  },
  {
    "family": "dropdown-menu",
    "selection": {
      "helper": "ActionsMenu"
    },
    "description": "Commands attached to a record action trigger.",
    "usage": [
      "Use commands for mutations and links for navigation; show the outcome near the affected content."
    ],
    "accessibility": [
      "Name the trigger and check arrow navigation, disabled items and Escape restoration."
    ]
  },
  {
    "family": "drawer",
    "selection": {
      "helper": "RightDrawer"
    },
    "description": "A side panel for editing details without leaving context.",
    "usage": [
      "Keep essential fields and actions reachable when the viewport is short or narrow."
    ],
    "accessibility": [
      "Provide a title, a close path and verify focus containment and restoration."
    ]
  },
  {
    "family": "hover-card",
    "selection": {
      "helper": "ProfileCard"
    },
    "description": "Supplementary profile information on a named trigger.",
    "usage": [
      "Keep essential actions available without hover; choose Popover or Dialog for required interactions."
    ],
    "accessibility": [
      "Test keyboard focus and touch access, and avoid hiding necessary information from non-hover users."
    ]
  },
  {
    "family": "popover",
    "selection": {
      "helper": "FilterPopover"
    },
    "description": "Edit local filters in a compact anchored panel.",
    "usage": [
      "Use a titled panel for interactive content and apply changes through application-owned state."
    ],
    "accessibility": [
      "Verify keyboard opening, Escape and focus return; avoid treating it as a tooltip."
    ]
  },
  {
    "family": "progress",
    "selection": {
      "helper": "StorageUsage"
    },
    "description": "Explain storage usage with a labelled progress meter.",
    "usage": [
      "Match value/max and the displayed unit; provide explicit text for thresholds."
    ],
    "accessibility": [
      "Give the meter a name and do not rely on bar color to explain remaining capacity."
    ]
  },
  {
    "family": "skeleton",
    "selection": {
      "section": "Examples"
    },
    "description": "An article placeholder while real content loads.",
    "usage": [
      "Match the approximate structure and reserve space to reduce layout shift."
    ],
    "accessibility": [
      "Keep placeholder shapes decorative and announce loading once on the containing region."
    ]
  },
  {
    "family": "spinner",
    "selection": {
      "section": "Examples"
    },
    "description": "A pending form action with visible saving feedback.",
    "usage": [
      "Pair indefinite activity with explanatory text and disable duplicate submissions deliberately."
    ],
    "accessibility": [
      "Provide a useful busy message and respect reduced motion without losing status information."
    ]
  },
  {
    "family": "tour",
    "selection": {
      "section": "Guided product tour"
    },
    "description": "A controlled product tour with real targets.",
    "usage": [
      "Keep targets mounted and provide an exit path; onboarding must not block essential tasks."
    ],
    "accessibility": [
      "Verify dialog names, step focus, Escape, completion and missing-target behavior."
    ]
  },
  {
    "family": "notification-center",
    "selection": {
      "section": "Workspace inbox"
    },
    "description": "A controlled inbox with read and dismiss actions.",
    "usage": [
      "Keep notification state in the application; callbacks report intent rather than persisting data."
    ],
    "accessibility": [
      "Name the bell and panel, verify tabs and item actions, and keep dismiss actions separate from reading."
    ]
  },
  {"family":"link","selection":{"section":"Examples"},"description":"Navigation links with consistent tone and emphasis.","usage":["Use Link for a destination and Button for a command; preserve href and normal browser link behavior."],"accessibility":["Write meaningful link text and explain external destinations when needed without relying on an icon alone."]}
];
