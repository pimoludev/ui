import { CustomizationExample } from "./label-customization-demo";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@pimolu/react";

import { labelSizes } from "../demo-data";
import { PageHeader, Section } from "../section";

export function LabelPage() {
  return (
    <>
      <PageHeader
        title="Label"
        hint="A native label with a required asterisk, an optional hint, a disabled state and three sizes. htmlFor still connects it to the control, so clicking the label focuses the input. Styles come from @pimolu/web-styles/label.css."
      />

      <Section
        title="States"
        hint="Required, optional and disabled labels; the asterisk is hidden from screen readers."
      >
        <div className="pg-stack">
          <div className="pg-stack">
            <Label htmlFor="label-required" required>
              Email
            </Label>

            <Input
              id="label-required"
              type="email"
              placeholder="ada@example.com"
            />
          </div>

          <div className="pg-stack">
            <Label
              htmlFor="label-optional"
              optional
              optionalLabel="Optional"
            >
              Phone
            </Label>

            <Input
              id="label-optional"
              type="tel"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div className="pg-stack">
            <Label htmlFor="label-disabled" disabled>
              Workspace
            </Label>

            <Input
              id="label-disabled"
              defaultValue="pimolu"
              disabled
            />
          </div>
        </div>
      </Section>

      <Section
        title="Sizes"
        hint="Enumerated from labelVariantMap: sm, md and lg."
      >
        <div className="pg-stack">
          {labelSizes.map((size) => (
            <div key={size} className="pg-stack">
              <Label htmlFor={`label-${size}`} size={size}>
                {size} label
              </Label>

              <Input
                id={`label-${size}`}
                placeholder={`A ${size} label`}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Labels linked to their fields with htmlFor.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <div className="pg-stack">
                  <Label htmlFor="login-email" required>
                    Email
                  </Label>

                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="pg-stack">
                  <Label htmlFor="login-password" required>
                    Password
                  </Label>

                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <Button>Sign in</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invite</CardTitle>
              <CardDescription>
                The optional hint makes the requirement explicit.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <div className="pg-stack">
                  <Label htmlFor="invite-email" required>
                    Email
                  </Label>

                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="teammate@example.com"
                  />
                </div>

                <div className="pg-stack">
                  <Label
                    htmlFor="invite-message"
                    optional
                    optionalLabel="Optional"
                  >
                    Message
                  </Label>

                  <Input
                    id="invite-message"
                    placeholder="Welcome to the team"
                  />
                </div>

                <Button appearance="outline">
                  Send invitation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
