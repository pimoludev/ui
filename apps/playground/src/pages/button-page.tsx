import { Button } from "@pimolu/react";

import {
  buttonAppearances,
  buttonRadii,
  buttonSizes,
  buttonVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

function CustomizedParts() {
  return (
    <>
      <Button
        classNames={{
          root: "parts-button",
          label: "parts-button-label",
          startIcon: "parts-button-icon"
        }}
        startIcon={<span aria-hidden="true">+</span>}
      >
        Create project
      </Button>
      <style>
        {
          `
.parts-button {
  border-radius: 16px;
  gap: 16px;
}
.parts-button:hover:enabled {
  background: var(--pimolu-success);
  color: var(--pimolu-success-foreground);
}
.parts-button-label {
  font-weight: 600;
}
.parts-button-icon {
  display: inline-flex;
  align-items: center;
}
`
        }
      </style>
    </>
  );
}


export function ButtonPage() {
  return (
    <>
      <PageHeader
        title="Button"
        hint="Semantic variants, appearances, sizes, shapes and states. Every option is enumerated from the component's own variant map."
      />

      <Section
        title="Variants"
        hint="Semantic meaning carried by each button tone."
      >
        <div className="pg-row">
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </Section>

      <Section
        title="Appearances"
        hint="The same variant, from solid to fully transparent."
      >
        <div className="pg-row">
          {buttonAppearances.map((appearance) => (
            <Button key={appearance} appearance={appearance}>
              {appearance}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Sizes" hint="From xs to xxl.">
        <div className="pg-row">
          {buttonSizes.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </div>
      </Section>

      <Section
        title="Shapes"
        hint="Radius variants, from square to fully rounded."
      >
        <div className="pg-row">
          {buttonRadii.map((radius) => (
            <Button key={radius} radius={radius}>
              {radius}
            </Button>
          ))}
        </div>
      </Section>

      <Section
        title="States and content"
        hint="Loading, disabled, icons and icon-only buttons."
      >
        <div className="pg-row">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button startIcon={<span>＋</span>}>Add item</Button>
          <Button endIcon={<span>→</span>}>Continue</Button>
          <Button
            iconOnly
            aria-label="Add"
            startIcon={<span>＋</span>}
          />
        </div>
      </Section>

      <Section
        title="Example: project actions"
        hint="A primary action and a quiet escape route in a compact toolbar."
      >
        <div className="pg-panel">
          <div className="pg-row pg-row--between pg-example-actions">
            <div>
              <strong>New project</strong>
              <p>Review the details before creating your workspace.</p>
            </div>
            <div className="pg-row pg-example-actions__buttons">
              <Button appearance="ghost">Cancel</Button>
              <Button variant="primary">Create project</Button>
            </div>
          </div>
        </div>
      </Section>
      <Section title="Named-part customization" hint="Add classes directly to stable parts, including portalled panels. Existing className props keep their targets.">
        <CustomizedParts />
      </Section>
    </>
  );
}
