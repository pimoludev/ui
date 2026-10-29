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

function CustomizedParts() {
  return (
    <>
      <Input
        label="Project name"
        helperText="Shared with your team."
        placeholder="Pimolu workspace"
        clearable
        defaultValue="Design system"
        classNames={{
          wrapper: "parts-input-wrapper",
          control: "parts-input-control",
          message: "parts-input-message"
        }}
      />
      <style>
        {
          `
.parts-input-wrapper {
  border-radius: 16px;
}
.parts-input-control {
  font-weight: 600;
}
.parts-input-message {
  font-style: italic;
}
`
        }
      </style>
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
        title="Browser autofill"
        hint="autoComplete controls the browser hint. Suggestions belong to the browser; accepted autofill keeps the Input wrapper's surface, including glass. Focus remains visible."
      >
        <div className="pg-grid">
          <form className="pg-panel pg-stack" onSubmit={(event) => event.preventDefault()}>
            <Input label="Full name" name="name" autoComplete="name" fullWidth />
            <Input label="Email address" name="email" type="email" autoComplete="email" fullWidth />
            <Input label="Glass email" name="glass-email" type="email" autoComplete="section-glass email" appearance="glass" fullWidth />
            <Button type="submit">Try autofill</Button>
          </form>
          <form autoComplete="off" className="pg-panel pg-stack" onSubmit={(event) => event.preventDefault()}>
            <Input label="Local demo value" name="demo-value" autoComplete="off" helperText="Requests no saved suggestions; the browser may override this hint." fullWidth />
            <Button type="submit">Use local value</Button>
          </form>
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
      <Section title="Named-part customization" hint="Add classes directly to stable parts, including portalled panels. Existing className props keep their targets.">
        <CustomizedParts />
      </Section>
    </>
  );
}
