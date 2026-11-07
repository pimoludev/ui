import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getFocusable } from "./focusable";

afterEach(() => vi.restoreAllMocks());

describe("visible keyboard targets", () => {
  it("reads a shared ancestor's computed style once per traversal", () => {
    const { container } = render(<section data-testid="shared">
      {Array.from({ length: 100 }, (_, index) => <button key={index}>Action {index}</button>)}
    </section>);
    const shared = screen.getByTestId("shared");
    const computed = vi.spyOn(window, "getComputedStyle");
    expect(getFocusable(container)).toHaveLength(100);
    expect(computed.mock.calls.filter(([node]) => node === shared)).toHaveLength(1);
    expect(new Set(computed.mock.calls.map(([node]) => node)).size).toBe(computed.mock.calls.length);
    shared.style.display = "none";
    computed.mockClear();
    expect(getFocusable(container)).toHaveLength(0);
    expect(computed.mock.calls.filter(([node]) => node === shared)).toHaveLength(1);
    shared.style.display = "block";
    expect(getFocusable(container)).toHaveLength(100);
  });

  it("excludes hidden controls, hidden ancestors and inert subtrees", () => {
    const { container } = render(<div>
      <button>Visible</button>
      <button hidden>Hidden attribute</button>
      <button style={{ display: "none" }}>Hidden display</button>
      <div style={{ display: "none" }}><button>Hidden parent</button></div>
      <button style={{ visibility: "hidden" }}>Hidden visibility</button>
      <div inert><button>Inert parent</button></div>
      <button disabled>Disabled</button>
      <fieldset disabled><button>Disabled fieldset</button></fieldset>
      <button tabIndex={-1}>Programmatic only</button>
    </div>);
    expect(getFocusable(container)).toEqual([screen.getByRole("button", { name: "Visible" })]);
  });

  it("keeps visible overrides, editable surfaces and only the summary of closed details", () => {
    const { container } = render(<div>
      <div style={{ visibility: "hidden" }}><button style={{ visibility: "visible" }}>Visible override</button></div>
      <div contentEditable suppressContentEditableWarning>Editor</div>
      <details><summary>Details</summary><button>Closed content</button></details>
    </div>);
    expect(getFocusable(container).map((node) => node.textContent)).toEqual(["Visible override", "Editor", "Details"]);
  });
});
