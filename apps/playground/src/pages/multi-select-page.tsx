import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  MultiSelect,
  type PimoluMultiSelectOption,
} from "@pimolu/react";

import {
  multiSelectAppearances,
  multiSelectSizes,
  multiSelectVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

const sampleOptions: PimoluMultiSelectOption[] = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
  { value: "d", label: "Option D" },
];

const technologies: PimoluMultiSelectOption[] = [
  { value: "react", label: "React", keywords: ["ui"] },
  { value: "nextjs", label: "Next.js", keywords: ["ssr"] },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue", keywords: ["javascript"] },
  { value: "svelte", label: "Svelte", disabled: true },
  { value: "nuxt", label: "Nuxt" },
];

const categories: PimoluMultiSelectOption[] = [
  { value: "design", label: "Design", keywords: ["ui", "ux"] },
  { value: "frontend", label: "Front-end", keywords: ["web"] },
  { value: "backend", label: "Back-end", keywords: ["api"] },
  { value: "mobile", label: "Mobile", keywords: ["native"] },
  { value: "devops", label: "DevOps", keywords: ["ci"] },
];

const permissions: PimoluMultiSelectOption[] = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "deploy", label: "Deploy" },
  { value: "admin", label: "Admin" },
];

function StackExample() {
  const [stack, setStack] = useState<string[]>([
    "react",
    "nextjs",
  ]);

  return (
    <div className="pg-stack">
      <MultiSelect
        label="Tech stack"
        name="stack"
        placeholder="Search technologies…"
        helperText="Up to four technologies."
        options={technologies}
        value={stack}
        onValueChange={setStack}
        maxSelected={4}
        fullWidth
      />

      <p className="pg-meta">
        {stack.length === 0
          ? "Nothing selected yet."
          : `Selected: ${stack.join(", ")}`}
      </p>
    </div>
  );
}

function PermissionsExample() {
  const [permissionsValue, setPermissionsValue] =
    useState<string[]>(["read"]);

  return (
    <MultiSelect
      label="Permissions"
      name="permissions"
      placeholder="Add a permission…"
      options={permissions}
      value={permissionsValue}
      onValueChange={setPermissionsValue}
      clearable
      fullWidth
    />
  );
}

export function MultiSelectPage() {
  return (
    <>
      <PageHeader
        title="MultiSelect"
        hint="A searchable multi-select that keeps your selections as removable tags. Filtering is accent-insensitive and matches option keywords. Sizes, variants and appearances come from multiSelectVariantMap; the styles come from @pimolu/web-styles/multi-select.css."
      />

      <Section title="Sizes" hint="From xs to xxl.">
        <div className="pg-stack">
          {multiSelectSizes.map((size) => (
            <MultiSelect
              key={size}
              size={size}
              label={size}
              options={sampleOptions}
              defaultValue={["a", "b"]}
              fullWidth
            />
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The semantic tone of the field and its tags."
      >
        <div className="pg-stack">
          {multiSelectVariants.map((variant) => (
            <MultiSelect
              key={variant}
              variant={variant}
              label={variant}
              options={sampleOptions}
              defaultValue={["a", "b"]}
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
          {multiSelectAppearances.map((appearance) => (
            <MultiSelect
              key={appearance}
              appearance={appearance}
              label={appearance}
              options={sampleOptions}
              defaultValue={["a", "b"]}
              fullWidth
            />
          ))}
        </div>
      </Section>

      <Section
        title="States and content"
        hint="Helper, error, invalid, required, disabled, empty message, a selection limit and a disabled option."
      >
        <div className="pg-stack">
          <MultiSelect
            label="With helper text"
            placeholder="Search…"
            helperText="Type to filter the options."
            options={sampleOptions}
            fullWidth
          />

          <MultiSelect
            label="With error"
            options={sampleOptions}
            defaultValue={["a"]}
            errorMessage="These groups cannot be combined."
            fullWidth
          />

          <MultiSelect
            label="Invalid without message"
            invalid
            options={sampleOptions}
            fullWidth
          />

          <MultiSelect
            label="Required"
            required
            placeholder="Pick at least one"
            options={sampleOptions}
            fullWidth
          />

          <MultiSelect
            label="Disabled"
            options={sampleOptions}
            defaultValue={["a"]}
            disabled
            fullWidth
          />

          <MultiSelect
            label="Empty message"
            placeholder="Type anything…"
            emptyMessage="Aucun résultat."
            options={sampleOptions}
            fullWidth
          />

          <MultiSelect
            label="Limited to two"
            options={sampleOptions}
            defaultValue={["a", "b"]}
            maxSelected={2}
            fullWidth
          />

          <MultiSelect
            label="With a disabled option"
            options={technologies}
            defaultValue={["react"]}
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
              <CardTitle>Tech stack</CardTitle>
              <CardDescription>
                A controlled selection capped at four, echoed below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StackExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Search by label or keyword, results as tags.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultiSelect
                label="Categories"
                name="categories"
                placeholder="Search a category…"
                helperText="Try “ux”, “api” or “native”."
                options={categories}
                defaultValue={["design", "frontend"]}
                fullWidth
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                A short controlled list, clearable at once.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionsExample />
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
