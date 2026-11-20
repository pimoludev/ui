import { describe, expect, it } from "vitest";
import { ensureTriggerFocusable } from "./trigger-focus";

describe("ensureTriggerFocusable", () => {
  it("makes a non-focusable clone reachable and named", () => {
    const element = document.createElement("div");
    ensureTriggerFocusable(element);
    expect(element.getAttribute("tabindex")).toBe("0");
    expect(element.getAttribute("role")).toBe("button");
  });

  it("leaves native controls and explicit choices untouched", () => {
    const button = document.createElement("button");
    ensureTriggerFocusable(button);
    expect(button.hasAttribute("tabindex")).toBe(false);
    expect(button.hasAttribute("role")).toBe(false);

    const custom = document.createElement("div");
    custom.setAttribute("tabindex", "-1");
    custom.setAttribute("role", "menuitem");
    ensureTriggerFocusable(custom);
    expect(custom.getAttribute("tabindex")).toBe("-1");
    expect(custom.getAttribute("role")).toBe("menuitem");
  });

  it("ignores a missing node", () => {
    expect(() => ensureTriggerFocusable(null)).not.toThrow();
  });
});
