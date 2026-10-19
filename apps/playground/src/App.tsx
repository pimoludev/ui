import { PimoluProvider } from "@pimolu/react";

import { pages, usePage } from "./router";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

import { AvatarPage } from "./pages/avatar-page";
import { BadgePage } from "./pages/badge-page";
import { ButtonPage } from "./pages/button-page";
import { CardPage } from "./pages/card-page";
import { CheckboxPage } from "./pages/checkbox-page";
import { ComboboxPage } from "./pages/combobox-page";
import { CircularProgressPage } from "./pages/circular-progress-page";
import { InputPage } from "./pages/input-page";
import { MultiSelectPage } from "./pages/multi-select-page";
import { OverviewPage } from "./pages/overview-page";
import { ProgressPage } from "./pages/progress-page";
import { RadioPage } from "./pages/radio-page";
import { RangeSliderPage } from "./pages/range-slider-page";
import { SeparatorPage } from "./pages/separator-page";
import { SelectPage } from "./pages/select-page";
import { SkeletonPage } from "./pages/skeleton-page";
import { SliderPage } from "./pages/slider-page";
import { SpinnerPage } from "./pages/spinner-page";
import { TooltipPage } from "./pages/tooltip-page";
import { SwitchPage } from "./pages/switch-page";
import { TextareaPage } from "./pages/textarea-page";

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
  progress: ProgressPage,
  skeleton: SkeletonPage,
  spinner: SpinnerPage,
  tooltip: TooltipPage,
  switch: SwitchPage,
  checkbox: CheckboxPage,
  radio: RadioPage,
  "range-slider": RangeSliderPage,
  textarea: TextareaPage,
  select: SelectPage,
  slider: SliderPage,
  combobox: ComboboxPage,
  "multi-select": MultiSelectPage,
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
