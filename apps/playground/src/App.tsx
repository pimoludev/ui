import { PimoluProvider } from "@pimolu/react";

import { pages, usePage } from "./router";
import { Toolbar } from "./toolbar";

import { ButtonPage } from "./pages/button-page";
import { InputPage } from "./pages/input-page";
import { OverviewPage } from "./pages/overview-page";

import "./playground.css";

const pageComponents = {
  overview: OverviewPage,
  button: ButtonPage,
  input: InputPage,
} as const;

function App() {
  const page = usePage();
  const Page = pageComponents[page];

  return (
    <PimoluProvider persist className="pg-root">
      <Toolbar current={page} />

      <main className="pg-main">
        <div className="pg-container">
          <Page />
        </div>
      </main>

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
