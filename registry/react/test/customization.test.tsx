import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button/button";
import { Input } from "../input/input";
import { Select } from "../select/select";
import { Combobox } from "../combobox/combobox";
import { MultiSelect } from "../multi-select/multi-select";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../dialog/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "../drawer/drawer";

const options = [
  { value: "one", label: "First" },
  { value: "two", label: "Unavailable", disabled: true },
];

describe("additive named-part customization", () => {
  it("keeps Button legacy classes, refs and disabled/loading semantics", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <Button ref={ref} className="legacy" classNames={{ root: "root-hook", label: "label-hook", startIcon: "icon-hook" }} startIcon="+" onClick={onClick}>Save</Button>,
    );
    expect(ref.current).toHaveClass("pimolu-button", "legacy", "root-hook");
    expect(screen.getByText("Save")).toHaveClass("label-hook");
    expect(screen.getByText("+")).toHaveClass("icon-hook");
    await user.click(ref.current!);
    expect(onClick).toHaveBeenCalledOnce();
    rerender(<Button loading classNames={{ spinner: "spinner-hook" }} onClick={onClick}>Save</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    expect(document.querySelector(".spinner-hook")).toHaveClass("pimolu-button__spinner");
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("keeps Input control/container targets and clear focus behavior", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" defaultValue="hello" clearable helperText="Work address" className="legacy-control" containerClassName="legacy-root" classNames={{ root: "field-root", control: "field-control", wrapper: "field-wrapper", clearButton: "field-clear", message: "field-message" }} />);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveClass("legacy-control", "field-control");
    expect(input.closest(".legacy-root")).toHaveClass("field-root");
    expect(input.parentElement).toHaveClass("field-wrapper");
    expect(screen.getByText("Work address")).toHaveClass("field-message");
    await user.click(screen.getByRole("button", { name: "Clear Email" }));
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("targets Select portal parts per instance and retains keyboard/disabled behavior", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<><Select label="Styled" style={{ borderRadius: 19 }} className="old-control" containerClassName="old-root" classNames={{ root: "select-root", control: "select-control", listbox: "local-panel", option: "local-option" }} onValueChange={change}><option value="one">First</option><option value="two" disabled>Unavailable</option><option value="three">Third</option></Select><Select label="Other"><option>Other option</option></Select></>);
    const trigger = screen.getByRole("combobox", { name: "Styled" });
    expect(trigger).toHaveClass("old-control", "select-control");
    expect(trigger).toHaveStyle({ borderRadius: "19px" });
    expect(trigger.closest(".old-root")).toHaveClass("select-root");
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toHaveClass("local-panel", "pimolu-select__listbox");
    expect(screen.getByRole("option", { name: "Unavailable" })).toHaveClass("local-option");
    await user.click(screen.getByRole("option", { name: "Unavailable" }));
    expect(change).not.toHaveBeenCalled();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(change).toHaveBeenCalledWith("three");
    await user.click(screen.getByRole("combobox", { name: "Other" }));
    expect(screen.getByRole("listbox")).not.toHaveClass("local-panel");
    expect(trigger).not.toHaveAttribute("classNames");
  });

  it("keeps native Select styling hooks and form submission intact", () => {
    render(<form aria-label="Form"><Select native name="choice" label="Choice" defaultValue="one" classNames={{ root: "native-root", control: "native-control" }}><option value="one">First</option></Select></form>);
    expect(screen.getByRole("combobox")).toHaveClass("native-control");
    expect(new FormData(screen.getByRole("form") as HTMLFormElement).get("choice")).toBe("one");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it.each(["combobox", "multi-select"] as const)("keeps %s root/input aliases, portal parts and selection", async (kind) => {
    const user = userEvent.setup();
    const change = vi.fn();
    const Component = kind === "combobox" ? Combobox : MultiSelect;
    render(<Component label="Choices" options={options} className="old-root" inputClassName="old-input" classNames={{ root: "custom-root", control: "custom-input", listbox: "custom-panel", option: "custom-option" }} onValueChange={change} />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveClass("old-input", "custom-input");
    expect(input.closest(".old-root")).toHaveClass("custom-root");
    await user.click(input);
    expect(screen.getByRole("listbox")).toHaveClass("custom-panel");
    const disabled = screen.getByRole("option", { name: /Unavailable/ });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled).toHaveClass("custom-option");
    await user.click(disabled);
    expect(change).not.toHaveBeenCalled();
    await user.click(screen.getByRole("option", { name: /First/ }));
    expect(change).toHaveBeenCalledWith(kind === "combobox" ? "one" : ["one"]);
  });

  it.each(["dialog", "drawer"] as const)("styles %s portal parts without changing focus, Escape or panel aliases", async (kind) => {
    const user = userEvent.setup();
    const Root = kind === "dialog" ? Dialog : Drawer;
    const Trigger = kind === "dialog" ? DialogTrigger : DrawerTrigger;
    const Content = kind === "dialog" ? DialogContent : DrawerContent;
    const Title = kind === "dialog" ? DialogTitle : DrawerTitle;
    render(<Root><Trigger><Button>Open</Button></Trigger><Content className="old-panel" style={{ borderRadius: 23 }} classNames={{ root: "modal-root", content: "modal-panel", overlay: "modal-overlay", closeButton: "modal-close" }}><Title>Settings</Title><Button>Body action</Button></Content></Root>);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const panel = await screen.findByRole("dialog");
    expect(panel).toHaveClass("old-panel", "modal-panel");
    expect(panel).toHaveStyle({ borderRadius: "23px" });
    expect(panel.closest(".modal-root")).toBeTruthy();
    expect(document.querySelector(".modal-overlay")).toHaveClass(`pimolu-${kind}__overlay`);
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("modal-close");
    await waitFor(() => expect(screen.getByRole("button", { name: "Body action" })).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
  });
});
