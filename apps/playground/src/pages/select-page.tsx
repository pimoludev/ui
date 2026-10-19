import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Select,
} from "@pimolu/react";

import {
  selectAppearances,
  selectSizes,
  selectVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

const frameworks = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "angular", label: "Angular" },
];

function FrameworkExample() {
  const [framework, setFramework] = useState("");

  return (
    <div className="pg-stack">
      <Select
        label="Framework"
        name="framework"
        placeholder="Choose a framework"
        helperText="Used for the generated project."
        value={framework}
        onValueChange={setFramework}
        fullWidth
      >
        {frameworks.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <p className="pg-meta">
        Selected value:{" "}
        <strong>{framework === "" ? "none" : framework}</strong>
      </p>
    </div>
  );
}

function LanguageExample() {
  const [language, setLanguage] = useState("");

  return (
    <div className="pg-stack">
      <Select
        label="Language"
        name="language"
        placeholder="Select a language"
        required
        value={language}
        onValueChange={setLanguage}
        fullWidth
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
      </Select>

      <Button size="sm" disabled={language === ""}>
        Continue
      </Button>
    </div>
  );
}

export function SelectPage() {
  return (
    <>
      <PageHeader
        title="Select"
        hint="A native select for choosing one option, with the same conventions as Input and Textarea. Sizes, variants and appearances are enumerated from selectVariantMap; the styles come from @pimolu/web-styles/select.css."
      />

      <Section title="Sizes" hint="From xs to xxl.">
        <div className="pg-stack">
          {selectSizes.map((size) => (
            <Select
              key={size}
              size={size}
              label={size}
              defaultValue="a"
              fullWidth
            >
              <option value="a">Option A</option>
              <option value="b">Option B</option>
            </Select>
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The semantic tone of the field."
      >
        <div className="pg-stack">
          {selectVariants.map((variant) => (
            <Select
              key={variant}
              variant={variant}
              label={variant}
              defaultValue="a"
              fullWidth
            >
              <option value="a">Option A</option>
              <option value="b">Option B</option>
            </Select>
          ))}
        </div>
      </Section>

      <Section
        title="Appearances"
        hint="Outline, soft, filled and glass."
      >
        <div className="pg-stack">
          {selectAppearances.map((appearance) => (
            <Select
              key={appearance}
              appearance={appearance}
              label={appearance}
              defaultValue="a"
              fullWidth
            >
              <option value="a">Option A</option>
              <option value="b">Option B</option>
            </Select>
          ))}
        </div>
      </Section>

      <Section
        title="States and content"
        hint="Placeholder, helper, error, invalid, required, disabled and grouped options."
      >
        <div className="pg-stack">
          <Select
            label="With helper text"
            placeholder="Choose an option"
            helperText="The placeholder is a real option with an empty value."
            fullWidth
          >
            <option value="a">Option A</option>
            <option value="b">Option B</option>
          </Select>

          <Select
            label="With error"
            defaultValue="a"
            errorMessage="This choice is not available."
            fullWidth
          >
            <option value="a">Option A</option>
          </Select>

          <Select
            label="Invalid without message"
            invalid
            fullWidth
          >
            <option value="a">Option A</option>
          </Select>

          <Select
            label="Required with placeholder"
            placeholder="Required choice"
            required
            fullWidth
          >
            <option value="a">Option A</option>
            <option value="b">Option B</option>
          </Select>

          <Select
            label="Disabled"
            defaultValue="a"
            disabled
            fullWidth
          >
            <option value="a">Option A</option>
          </Select>

          <Select
            label="Grouped options"
            placeholder="Choose a technology"
            fullWidth
          >
            <optgroup label="UI libraries">
              <option value="react">React</option>
              <option value="vue">Vue</option>
            </optgroup>

            <optgroup label="Frameworks">
              <option value="nextjs">Next.js</option>
              <option value="angular">Angular</option>
            </optgroup>
          </Select>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Project setup</CardTitle>
              <CardDescription>
                A controlled select whose value is echoed below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FrameworkExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Region</CardTitle>
              <CardDescription>
                Grouped options with a default selection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                label="Data region"
                name="region"
                defaultValue="eu-west"
                helperText="Where your data is stored."
                fullWidth
              >
                <optgroup label="Europe">
                  <option value="eu-west">
                    Europe (Ireland)
                  </option>
                  <option value="eu-central">
                    Europe (Frankfurt)
                  </option>
                </optgroup>

                <optgroup label="Americas">
                  <option value="us-east">
                    US East (Virginia)
                  </option>
                  <option value="us-west">
                    US West (Oregon)
                  </option>
                </optgroup>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>
                A required select that gates the next step.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageExample />
            </CardContent>
            <CardFooter>
              <span className="pg-meta">
                The placeholder cannot be submitted while the field
                is required.
              </span>
            </CardFooter>
          </Card>
        </div>
      </Section>
    </>
  );
}
