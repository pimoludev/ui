import { CustomizationExample } from "./form-field-customization-demo";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Fieldset,
  FormControl,
  FormField,
  FormGroup,
  FormMessage,
  Input,
  Textarea,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

export function FormFieldPage() {
  return (
    <>
      <PageHeader
        title="FormField"
        hint="FormField owns the label, the generated id, the helper or error message and the aria wiring. FormControl passes those values to one control; FormGroup and Fieldset group related fields. Styles come from @pimolu/web-styles/form-field.css."
      />

      <Section
        title="Field"
        hint="The label, the control and the message are wired together: htmlFor, id, aria-describedby and aria-invalid."
      >
        <div className="pg-stack">
          <FormField
            label="Email"
            helperText="We only use it for account notices."
            required
          >
            <FormControl>
              <Input type="email" placeholder="ada@example.com" />
            </FormControl>
          </FormField>

          <FormField
            label="Workspace"
            helperText="This value comes from the plan."
            disabled
          >
            <FormControl>
              <Input defaultValue="pimolu" />
            </FormControl>
          </FormField>
        </div>
      </Section>

      <Section
        title="Error and optional"
        hint="errorMessage replaces helperText, marks the control invalid and is announced as an alert."
      >
        <div className="pg-stack">
          <FormField
            label="Email"
            errorMessage="Enter a valid email address."
          >
            <FormControl>
              <Input
                type="email"
                defaultValue="not-an-email"
                invalid
              />
            </FormControl>
          </FormField>

          <FormField
            label="Phone"
            optional
            optionalLabel="Optional"
            helperText="Include the country code."
          >
            <FormControl>
              <Input type="tel" placeholder="+33 6 12 34 56 78" />
            </FormControl>
          </FormField>
        </div>
      </Section>

      <Section
        title="Message"
        hint="FormMessage also works on its own for a short hint or an error."
      >
        <div className="pg-stack">
          <FormMessage>
            This is a helper message.
          </FormMessage>

          <FormMessage variant="error">
            This is an error message.
          </FormMessage>
        </div>
      </Section>

      <Section
        title="Group and fieldset"
        hint="FormGroup lays fields out together; Fieldset adds a native legend and disables every control inside."
      >
        <div className="pg-stack">
          <FormGroup
            label="Contact"
            description="How we reach you."
            orientation="horizontal"
          >
            <FormField label="First name">
              <FormControl>
                <Input placeholder="Ada" />
              </FormControl>
            </FormField>

            <FormField label="Last name">
              <FormControl>
                <Input placeholder="Lovelace" />
              </FormControl>
            </FormField>
          </FormGroup>

          <Fieldset
            legend="Notifications"
            description="Choose what we send."
          >
            <FormField
              label="Email"
              helperText="Deployment failures and mentions."
            >
              <FormControl>
                <Input
                  type="email"
                  placeholder="ada@example.com"
                />
              </FormControl>
            </FormField>

            <FormField
              label="Weekly summary"
              helperText="A digest every Monday."
            >
              <FormControl>
                <Textarea rows={2} placeholder="Optional notes" />
              </FormControl>
            </FormField>
          </Fieldset>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              A complete form: required fields, a helper, an
              error, a grouped pair and an action.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="pg-stack">
              <FormField
                label="Display name"
                required
                helperText="Shown on your public profile."
              >
                <FormControl>
                  <Input defaultValue="Ada Lovelace" />
                </FormControl>
              </FormField>

              <FormField
                label="Email"
                required
                errorMessage="This address is already in use."
              >
                <FormControl>
                  <Input
                    type="email"
                    defaultValue="ada@example.com"
                    invalid
                  />
                </FormControl>
              </FormField>

              <FormGroup
                label="Social"
                description="Optional links."
                orientation="horizontal"
              >
                <FormField label="GitHub">
                  <FormControl>
                    <Input placeholder="ada" />
                  </FormControl>
                </FormField>

                <FormField label="Website">
                  <FormControl>
                    <Input placeholder="https://" />
                  </FormControl>
                </FormField>
              </FormGroup>

              <FormField
                label="Bio"
                optional
                optionalLabel="Optional"
              >
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="A short introduction"
                  />
                </FormControl>
              </FormField>

              <div className="pg-row">
                <Button>Save profile</Button>

                <Button appearance="ghost">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
