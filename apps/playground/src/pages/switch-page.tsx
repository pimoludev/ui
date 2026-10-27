import { CustomizationExample } from "./switch-customization-demo";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
} from "@pimolu/react";

import { switchSizes, switchVariants } from "../demo-data";
import { PageHeader, Section } from "../section";

function AppearanceSwitches() {
  const [darkMode, setDarkMode] = useState(true);
  const [autoTheme, setAutoTheme] = useState(false);

  return (
    <div className="pg-stack">
      <Switch
        label="Dark mode"
        description="Use a dark palette everywhere."
        checked={darkMode}
        onCheckedChange={setDarkMode}
      />

      <Switch
        label="Follow the system"
        description="Match the operating system preference."
        checked={autoTheme}
        onCheckedChange={setAutoTheme}
      />
    </div>
  );
}

export function SwitchPage() {
  return (
    <>
      <PageHeader
        title="Switch"
        hint="A native checkbox with role=switch, for settings that turn on or off. Sizes and variants are enumerated from switchVariantMap; the styles come from @pimolu/web-styles/switch.css."
      />

      <Section title="Sizes" hint="sm, md and lg.">
        <div className="pg-stack">
          {switchSizes.map((size) => (
            <Switch
              key={size}
              size={size}
              label={size}
              defaultChecked
            />
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The color of the active track."
      >
        <div className="pg-stack">
          {switchVariants.map((variant) => (
            <Switch
              key={variant}
              variant={variant}
              label={variant}
              defaultChecked
            />
          ))}
        </div>
      </Section>

      <Section
        title="States"
        hint="Disabled, required and described switches."
      >
        <div className="pg-stack">
          <Switch label="Enabled" defaultChecked />
          <Switch label="Disabled, on" disabled defaultChecked />
          <Switch label="Disabled, off" disabled />
          <Switch label="Required" required />
          <Switch
            label="With a description"
            description="Receive important updates."
            defaultChecked
          />
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Uncontrolled switches with sensible defaults.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <Switch
                  label="Email"
                  description="A digest once a day."
                  defaultChecked
                />
                <Switch
                  label="Push"
                  description="Immediate alerts on your devices."
                  defaultChecked
                />
                <Switch
                  label="Weekly summary"
                  description="Every Monday morning."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Controlled switches driven by the app state.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceSwitches />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                A danger tone and an unavailable option.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <Switch
                  label="Sync automatically"
                  description="Push your changes in the background."
                  defaultChecked
                />
                <Switch
                  label="Delete local copies on sign out"
                  description="Frees disk space on shared devices."
                  variant="danger"
                />
                <Switch
                  label="Advanced mode"
                  description="Coming soon."
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
