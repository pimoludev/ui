import { CustomizationExample } from "./input-group-customization-demo";
import { useState } from "react";

import {
  Badge,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function InviteForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="pg-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <InputGroup aria-label="Invite a teammate">
        <InputGroupAddon align="inline-start">
          @
        </InputGroupAddon>

        <InputGroupInput
          aria-label="Teammate email"
          type="email"
          name="email"
          placeholder="teammate@company.com"
          autoComplete="email"
          onChange={() => setSent(false)}
          required
        />

        <InputGroupButton type="submit">
          Send invite
        </InputGroupButton>
      </InputGroup>

      <div className="pg-row">
        <Badge variant={sent ? "success" : "neutral"}>
          {sent ? "Invite queued" : "No invite sent"}
        </Badge>

        <span className="pg-meta">
          The button uses type="submit" here because the
          form owns the action.
        </span>
      </div>
    </form>
  );
}

export function InputGroupPage() {
  return (
    <>
      <PageHeader
        title="InputGroup"
        hint="A compound field: addons, a native input and buttons share one border, one focus ring and one disabled state. InputGroupInput forwards every native input prop."
      />

      <Section
        title="Addons"
        hint="Static prefixes and suffixes on either inline edge."
      >
        <div className="pg-grid">
          <InputGroup aria-label="Website">
            <InputGroupAddon align="inline-start">
              https://
            </InputGroupAddon>

            <InputGroupInput
              aria-label="Website address"
              placeholder="pimolu.dev"
              autoComplete="url"
            />
          </InputGroup>

          <InputGroup aria-label="Unit price">
            <InputGroupInput
              aria-label="Price amount"
              placeholder="49.99"
              inputMode="decimal"
            />

            <InputGroupAddon align="inline-end">
              USD
            </InputGroupAddon>
          </InputGroup>

          <InputGroup aria-label="Domain">
            <InputGroupInput
              aria-label="Domain name"
              placeholder="pimolu"
            />

            <InputGroupText>.dev</InputGroupText>
          </InputGroup>
        </div>
      </Section>

      <Section
        title="Buttons"
        hint="InputGroupButton defaults to type=button so it never submits a surrounding form by accident."
      >
        <div className="pg-grid">
          <InputGroup aria-label="Search">
            <InputGroupAddon align="inline-start">
              🔍
            </InputGroupAddon>

            <InputGroupInput
              aria-label="Search components"
              type="search"
              placeholder="Search components"
            />

            <InputGroupButton aria-label="Run search">
              Search
            </InputGroupButton>
          </InputGroup>

          <InputGroup aria-label="API key">
            <InputGroupInput
              aria-label="API key"
              readOnly
              defaultValue="pimolu_live_5f4a9c"
            />

            <InputGroupButton aria-label="Copy API key">
              Copy
            </InputGroupButton>
          </InputGroup>
        </div>
      </Section>

      <Section
        title="Sizes"
        hint="Sizes only set the shared height, padding and font size; every child follows."
      >
        <div className="pg-grid">
          <InputGroup size="sm" aria-label="Small field">
            <InputGroupAddon>sm</InputGroupAddon>
            <InputGroupInput
              aria-label="Small field value"
              placeholder="Small"
            />
          </InputGroup>

          <InputGroup size="md" aria-label="Medium field">
            <InputGroupAddon>md</InputGroupAddon>
            <InputGroupInput
              aria-label="Medium field value"
              placeholder="Medium"
            />
          </InputGroup>

          <InputGroup size="lg" aria-label="Large field">
            <InputGroupAddon>lg</InputGroupAddon>
            <InputGroupInput
              aria-label="Large field value"
              placeholder="Large"
            />
          </InputGroup>
        </div>
      </Section>

      <Section
        title="Orientation"
        hint="Vertical groups stack the addon, the input and the action into a compact block."
      >
        <div className="pg-row">
          <InputGroup
            orientation="vertical"
            aria-label="Coupon code"
          >
            <InputGroupAddon align="inline-start">
              Coupon code
            </InputGroupAddon>

            <InputGroupInput
              aria-label="Coupon code value"
              placeholder="PIMOLU20"
            />

            <InputGroupButton>
              Apply coupon
            </InputGroupButton>
          </InputGroup>
        </div>
      </Section>

      <Section
        title="States"
        hint="disabled disables the input and every button; invalid styles the shared border and sets aria-invalid on the input."
      >
        <div className="pg-grid">
          <InputGroup
            disabled
            aria-label="Disabled field"
          >
            <InputGroupAddon>https://</InputGroupAddon>

            <InputGroupInput
              aria-label="Disabled website"
              defaultValue="pimolu.dev"
            />

            <InputGroupButton>Open</InputGroupButton>
          </InputGroup>

          <InputGroup invalid aria-label="Invalid field">
            <InputGroupInput
              aria-label="Invalid email"
              defaultValue="not-an-email"
            />

            <InputGroupAddon align="inline-end">
              !
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Section>

      <Section
        title="Example: invite a teammate"
        hint="A real form where the action button submits and the group behaves as a single field."
      >
        <div className="pg-panel">
          <InviteForm />
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
