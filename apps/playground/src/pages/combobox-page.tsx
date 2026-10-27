import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Combobox,
  type PimoluComboboxOption,
} from "@pimolu/react";

import {
  comboboxAppearances,
  comboboxSizes,
  comboboxVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

const sampleOptions: PimoluComboboxOption[] = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
];

const frameworks: PimoluComboboxOption[] = [
  { value: "react", label: "React", keywords: ["library"] },
  {
    value: "nextjs",
    label: "Next.js",
    keywords: ["React", "SSR", "fullstack"],
  },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue", keywords: ["JavaScript"] },
  { value: "svelte", label: "Svelte", disabled: true },
];

const languages: PimoluComboboxOption[] = [
  { value: "fr", label: "Français", keywords: ["French"] },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
];

const members: PimoluComboboxOption[] = [
  {
    value: "amelie",
    label: "Amélie Bernard",
    keywords: ["design", "tokens"],
  },
  {
    value: "lucas",
    label: "Lucas Moreau",
    keywords: ["frontend"],
  },
  {
    value: "sofia",
    label: "Sofia Rossi",
    keywords: ["design engineer"],
  },
];

function FrameworkExample() {
  const [framework, setFramework] = useState("nextjs");

  return (
    <div className="pg-stack">
      <Combobox
        label="Framework"
        name="framework"
        placeholder="Search a framework…"
        helperText="Try “ssr” or “javascript”; the search also reads keywords."
        options={frameworks}
        value={framework}
        onValueChange={setFramework}
        clearable
        fullWidth
      />

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
    <Combobox
      label="Language"
      name="language"
      placeholder="Search a language…"
      helperText="Type “francais” without the cedilla."
      options={languages}
      value={language}
      onValueChange={setLanguage}
      fullWidth
    />
  );
}

function AssigneeExample() {
  const [assignee, setAssignee] = useState("amelie");

  return (
    <Combobox
      label="Assignee"
      name="assignee"
      placeholder="Search a teammate…"
      options={members}
      value={assignee}
      onValueChange={setAssignee}
      clearable
      fullWidth
    />
  );
}

function CustomizedParts() {
  return (
    <>
      <Combobox
        label="Invite a teammate"
        placeholder="Search people..."
        options={[
          { value: "ada", label: "Ada Lovelace" },
          {
            value: "maya",
            label: "Maya Chen"
          }
        ]}
        classNames={{
          field: "parts-combo-field",
          listbox: "parts-combo-panel",
          option: "parts-combo-option"
        }}
      />
      <style>
        {
          `
.parts-combo-field {
  border-radius: 14px;
}
.parts-combo-panel {
  border-radius: 16px;
}
.parts-combo-option {
  padding-block: 12px;
}
`
        }
      </style>
    </>
  );
}


export function ComboboxPage() {
  return (
    <>
      <PageHeader
        title="Combobox"
        hint="A searchable single-select with a custom listbox. Filtering is accent-insensitive and also matches option keywords. Sizes, variants and appearances come from comboboxVariantMap; the styles come from @pimolu/web-styles/combobox.css."
      />

      <Section title="Sizes" hint="From xs to xxl.">
        <div className="pg-stack">
          {comboboxSizes.map((size) => (
            <Combobox
              key={size}
              size={size}
              label={size}
              options={sampleOptions}
              defaultValue="b"
              fullWidth
            />
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The semantic tone of the field."
      >
        <div className="pg-stack">
          {comboboxVariants.map((variant) => (
            <Combobox
              key={variant}
              variant={variant}
              label={variant}
              options={sampleOptions}
              defaultValue="b"
              fullWidth
            />
          ))}
        </div>
      </Section>

      <Section
        title="Appearances"
        hint="Outline, soft, filled and glass."
      >
        <div className="pg-stack">
          {comboboxAppearances.map((appearance) => (
            <Combobox
              key={appearance}
              appearance={appearance}
              label={appearance}
              options={sampleOptions}
              defaultValue="b"
              fullWidth
            />
          ))}
        </div>
      </Section>

      <Section
        title="States and content"
        hint="Placeholder, helper, error, invalid, required, disabled, clearable, empty message and a disabled option."
      >
        <div className="pg-stack">
          <Combobox
            label="With helper text"
            placeholder="Search…"
            helperText="Type to filter the options."
            options={sampleOptions}
            fullWidth
          />

          <Combobox
            label="With error"
            options={sampleOptions}
            defaultValue="a"
            errorMessage="This choice is not available."
            fullWidth
          />

          <Combobox
            label="Invalid without message"
            invalid
            options={sampleOptions}
            fullWidth
          />

          <Combobox
            label="Required"
            required
            placeholder="Required choice"
            options={sampleOptions}
            fullWidth
          />

          <Combobox
            label="Disabled"
            options={sampleOptions}
            defaultValue="a"
            disabled
            fullWidth
          />

          <Combobox
            label="Clearable"
            options={sampleOptions}
            defaultValue="b"
            clearable
            fullWidth
          />

          <Combobox
            label="Empty message"
            placeholder="Type anything…"
            emptyMessage="Aucun résultat."
            options={sampleOptions}
            fullWidth
          />

          <Combobox
            label="With a disabled option"
            options={frameworks}
            defaultValue="react"
            fullWidth
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
              <CardTitle>Choosing a stack</CardTitle>
              <CardDescription>
                Search by label or by keyword, with a clear button.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FrameworkExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>
                Accent-insensitive search.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignee</CardTitle>
              <CardDescription>
                A people picker with an initial selection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssigneeExample />
            </CardContent>
          </Card>
        </div>
      </Section>
      <Section title="Named-part customization" hint="Add classes directly to stable parts, including portalled panels. Existing className props keep their targets.">
        <CustomizedParts />
      </Section>
    </>
  );
}
