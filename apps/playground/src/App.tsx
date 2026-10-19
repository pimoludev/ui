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
import { InputPage } from "./pages/input-page";
import { MultiSelectPage } from "./pages/multi-select-page";
import { OverviewPage } from "./pages/overview-page";
import { RadioPage } from "./pages/radio-page";
import { SeparatorPage } from "./pages/separator-page";
import { SelectPage } from "./pages/select-page";
import { SkeletonPage } from "./pages/skeleton-page";
import { SliderPage } from "./pages/slider-page";
import { SpinnerPage } from "./pages/spinner-page";
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
  skeleton: SkeletonPage,
  spinner: SpinnerPage,
  switch: SwitchPage,
  checkbox: CheckboxPage,
  radio: RadioPage,
  textarea: TextareaPage,
  select: SelectPage,
  slider: SliderPage,
  combobox: ComboboxPage,
  "multi-select": MultiSelectPage,
} as const;

function App() {
  const page = usePage();
  const Page = pageComponents[page];

  return (
    <PimoluProvider persist className="pg-root">
      <Toolbar />

      <div className="pg-layout">
        <Sidebar current={page} />

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
