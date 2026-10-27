import { CustomizationExample } from "./password-input-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Input,
  PasswordInput,
} from "@pimolu/react";

import { inputSizes } from "../demo-data";
import { PageHeader, Section } from "../section";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const passwordIsValid = password.length >= 8;

  return (
    <form
      className="pg-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Input
        label="Work email"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
        value={email}
        onValueChange={setEmail}
        required
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        value={password}
        onValueChange={(nextValue) => {
          setPassword(nextValue);
          setSubmitted(false);
        }}
        description="At least 8 characters."
        error={
          submitted && !passwordIsValid
            ? "Use at least 8 characters."
            : undefined
        }
        required
      />

      <div className="pg-row">
        <Button
          type="submit"
          disabled={!email || !password}
        >
          Sign in
        </Button>

        <Badge
          variant={
            submitted && passwordIsValid
              ? "success"
              : "neutral"
          }
        >
          {submitted && passwordIsValid
            ? "Credentials accepted"
            : "Not signed in"}
        </Badge>
      </div>
    </form>
  );
}

export function PasswordInputPage() {
  return (
    <>
      <PageHeader
        title="PasswordInput"
        hint="A password field with a labelled visibility toggle. The toggle exposes aria-pressed, swaps between Show and Hide labels, and restores the caret when the input type changes."
      />

      <Section
        title="Anatomy"
        hint="A visible label, an optional description and the eye toggle."
      >
        <div className="pg-grid">
          <PasswordInput
            label="Current password"
            placeholder="Enter your password"
            autoComplete="current-password"
            description="Use the toggle to check what you typed."
          />

          <PasswordInput
            label="New password"
            placeholder="Create a password"
            autoComplete="new-password"
            defaultValue="correct horse battery"
          />
        </div>
      </Section>

      <Section
        title="Sizes"
        hint="From xs to xxl, matching the Input scale."
      >
        <div className="pg-grid">
          {inputSizes.map((size) => (
            <PasswordInput
              key={size}
              size={size}
              label={size}
              placeholder="Password"
              autoComplete="current-password"
            />
          ))}
        </div>
      </Section>

      <Section
        title="Validation"
        hint="An error message marks the field invalid, replaces the description and is announced as an alert."
      >
        <div className="pg-grid">
          <PasswordInput
            label="Password"
            defaultValue="short"
            error="Use at least 8 characters."
          />

          <PasswordInput
            label="Password without a message"
            invalid
            defaultValue="unknown"
            description="This field is invalid for another reason."
          />
        </div>
      </Section>

      <Section
        title="States"
        hint="Disabled and read-only fields keep their value; only a disabled field disables the toggle."
      >
        <div className="pg-grid">
          <PasswordInput
            label="Disabled"
            defaultValue="not-editable"
            disabled
          />

          <PasswordInput
            label="Read only"
            defaultValue="visible-but-locked"
            readOnly
          />

          <PasswordInput
            label="Required"
            placeholder="Required field"
            autoComplete="current-password"
            required
          />
        </div>
      </Section>

      <Section
        title="Example: sign in"
        hint="A realistic controlled form: the password length drives the validation message and the submit state."
      >
        <div className="pg-panel">
          <SignInForm />
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
