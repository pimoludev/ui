import { useState } from "react";

import { Button, Input } from "@pimolu/react";

import {
  inputAppearances,
  inputSizes,
  inputVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

function ClearableInputs() {
  const [value, setValue] = useState("Hello Pimolu");
  const [cleared, setCleared] = useState(0);

  return (
    <>
      <Input
        label="Uncontrolled"
        defaultValue="Type, then clear"
        clearable
      />

      <Input
        label="Controlled"
        value={value}
        clearable
        placeholder="Type, then clear"
        onValueChange={setValue}
        onClear={() => setCleared((count) => count + 1)}
        helperText={`value: "${value}" · cleared ${cleared} time(s)`}
      />

      <Input
        label="Search"
        type="search"
        clearable
        clearLabel="Clear the search"
        defaultValue="Neo-brutalism"
      />
    </>
  );
}

export function InputPage() {
  return (
    <>
      <PageHeader
        title="Input"
        hint="Sizes, semantic variants, appearances, validation, clear and password toggles. Styled from the shared @pimolu/web-styles layer."
      />

      <Section
        title="Sizes"
        hint="From xs to xxl, like the Button."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-stack">
              {inputSizes.map((size) => (
                <Input
                  key={size}
                  size={size}
                  label={size}
                  placeholder="Placeholder"
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The semantic tone of the field."
      >
        <div className="pg-grid">
          {inputVariants.map((variant) => (
            <div key={variant} className="pg-panel">
              <div className="pg-stack">
                <Input
                  variant={variant}
                  label={variant}
                  placeholder="Placeholder"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Appearances"
        hint="Outline, soft, filled and glass."
      >
        <div className="pg-grid">
          {inputAppearances.map((appearance) => (
            <div key={appearance} className="pg-panel">
              <div className="pg-stack">
                <Input
                  appearance={appearance}
                  label={appearance}
                  placeholder="Placeholder"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="States and content"
        hint="Helper, error, required, icons and disabled."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-stack">
              <Input
                label="Helper"
                placeholder="you@example.com"
                helperText="We never share your email."
              />

              <Input
                label="Error"
                defaultValue="not-an-email"
                errorMessage="Please enter a valid email."
              />

              <Input
                label="Required"
                placeholder="Required field"
                required
              />

              <Input
                label="Icons"
                placeholder="username"
                startIcon={<span>@</span>}
                endIcon={<span>✓</span>}
              />

              <Input
                label="Disabled"
                placeholder="Unavailable"
                disabled
              />

              <Input
                label="Full width"
                placeholder="Full width"
                fullWidth
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Clearable"
        hint="The clear button appears only when the field is not empty; controlled fields need onValueChange or onClear."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-stack">
              <ClearableInputs />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Password"
        hint="The visibility toggle only renders for type=password and never when disabled."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-stack">
              <Input
                label="Password"
                type="password"
                passwordToggle
                placeholder="Your password"
              />

              <Input
                label="Custom labels"
                type="password"
                passwordToggle
                defaultValue="secret123"
                showPasswordLabel="Reveal password"
                hidePasswordLabel="Conceal password"
                helperText="Pre-filled so the toggle is visible."
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Example: account sign in"
        hint="Native form fields, autofill and a clear primary action."
      >
        <div className="pg-grid">
          <form
            className="pg-panel pg-stack"
            onSubmit={(event) => event.preventDefault()}
          >
            <Input
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              autoComplete="email"
              required
              fullWidth
            />
            <Input
              name="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              passwordToggle
              required
              fullWidth
            />
            <Button type="submit">Sign in</Button>
          </form>
        </div>
      </Section>
    </>
  );
}
