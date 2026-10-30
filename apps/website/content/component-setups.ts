import { compoundSetups } from "./compound-setups.ts";
import { navbarMenuSetup } from "./navbar-menu-setup.ts";

export function setupExampleId(filename: string) {
  return "setup-" + filename.replace(/\.tsx$/, "").replace(/[^a-z0-9-]/gi, "-");
}

export interface ComponentSetup {
  title: string;
  paragraphs: string[];
  examples: Array<{
    id?: string;
    outlineLabel?: string;
    filename: string;
    title?: string;
    paragraphs?: string[];
    code: string;
  }>;
  notes?: string[];
}

/** Authored setup snippets. Each code block is a complete, independently checked module. */
export const componentSetups: Record<string, ComponentSetup> = {
  ...compoundSetups,
  navbar: navbarMenuSetup,
  button: {
    title: "Choose your loading indicator",
    paragraphs: [
      "Set loading to disable the button and expose aria-busy. loadingIndicator replaces only the decorative visual. A Pimolu Spinner can choose its appearance, size and color; you can also provide your own non-interactive React content.",
      "Omit loadingIndicator to keep the existing ring. Pass null or false to hide the visual while keeping the busy state. classNames.spinner targets the default loader or the custom indicator's wrapper. Keep a meaningful button label while loading.",
    ],
    examples: [{ filename: "button-loading.tsx", code: `"use client";

import { useState } from "react";
import { Button, Checkbox, Spinner } from "@pimolu/react";

export function ButtonLoading() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="grid gap-4">
      <Checkbox
        label="Preview loading state"
        checked={loading}
        onCheckedChange={setLoading}
      />
      <div className="flex flex-wrap gap-3">
        <Button loading={loading}>Default ring</Button>
        <Button
          loading={loading}
          loadingIndicator={<Spinner appearance="dots" size="sm" decorative />}
        >
          Dots
        </Button>
        <Button
          loading={loading}
          loadingIndicator={<Spinner
            appearance="arc"
            size="sm"
            variant="warning"
            decorative
          />}
        >
          Colored arc
        </Button>
        <Button loading={loading} loadingIndicator={<span>⌛</span>}>
          Custom content
        </Button>
        <Button loading={loading} loadingIndicator={null}>Text only</Button>
      </div>
    </div>
  );
}
` }],
    notes: [
      "This additive prop is available in 0.1.0-beta.4. The default Button loader and existing loading calls keep their behavior. Custom indicators sit in an aria-hidden wrapper; use decorative on Spinner to express that purpose directly.",
    ],
  },
  toast: {
    title: "Set up once, notify anywhere",
    paragraphs: [
      "`toast()` creates a notification. `Toaster` renders the stack, controls its position and provides its accessible live region. Notifications become visible when a Toaster is mounted.",
      "Mount one Toaster inside PimoluProvider near your application root so it stays mounted across page changes. In Next.js, render this Providers component from app/layout.tsx. Load the shared stylesheet once from globals.css.",
    ],
    examples: [
      { filename: "app/providers.tsx", code: `"use client";

import type { ReactNode } from "react";
import { PimoluProvider, Toaster } from "@pimolu/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PimoluProvider defaultTheme="system">
      {children}
      <Toaster position="bottom-right" label="Notifications" />
    </PimoluProvider>
  );
}
` },
      { filename: "confirmation-button.tsx", code: `"use client";

import { Button, toast } from "@pimolu/react";

export function ConfirmationButton() {
  return (
    <Button
      onClick={() => toast({
        title: "Your confirmation is ready",
        variant: "success",
      })}
    >
      Show confirmation
    </Button>
  );
}
` },
    ],
    notes: [
      "Call toast from event handlers or client effects. Each notification owns its content, tone and duration; the root Toaster displays them all.",
      "Each preview below includes its own Toaster because previews run independently. In your application, keep the single root instance rather than adding one per button or page.",
      "The basic setup above works with 0.1.0-beta.4. Loading, promise helpers and advanced icon controls shown below ship in 0.1.0-beta.4.",
    ],
  },
  form: {
    title: "Read and use your form data",
    paragraphs: [
      "Read submitted data from the `values` argument of `onSubmit`. For example, values.name contains the current name and values.email contains the current email when a valid form is submitted. Use this object in your application logic or send it to your API.",
      "Read `form.values` to access the current values while the user types. Submission runs validation first; onSubmit is called only when validate returns no field errors. The submitted object is a snapshot; later edits update form.values until the next submission.",
      "`useForm` creates the state. `<Form form={form}>` renders the HTML form and connects submission. `<FormError name=\"email\" />` displays that field's validation message only when one exists. `<FormSubmit>` renders the visible submit button and reflects isSubmitting while an asynchronous onSubmit runs. Keep both inside Form.",
    ],
    examples: [{
      filename: "contact-form.tsx",
      title: "1. Get the submitted values",
      paragraphs: [
        "Fill the fields, then submit. The callback receives an object such as { name: 'Ada', email: 'ada@example.com' }. Here we store a JSON representation in React state to display exactly what was received. Replace that state update with the operation your application needs.",
      ],
      code: `"use client";

import { useState } from "react";
import { CodeBlock, Form, FormError, FormSubmit, Input, useForm } from "@pimolu/react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState("");
  const form = useForm({
    defaultValues: { name: "", email: "" },
    validate: (values) => {
      const errors: { name?: string; email?: string } = {};
      if(!values.name.trim()) errors.name = "Enter your name.";
      if(!values.email.trim()) errors.email = "Enter your email address.";
      return errors;
    },
    onSubmit: (values) => {
      // Read values.name and values.email here.
      setSubmitted(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="grid gap-4">
      <Form form={form} autoComplete="off" className="grid gap-4">
        <Input label="Name" {...form.register("name")} />
        <FormError name="name" />
        <Input label="Email" type="email" {...form.register("email")} />
        <FormError name="email" />
        <FormSubmit>Submit form</FormSubmit>
      </Form>
      <p>Current name: {form.values.name}</p>
      <p role="status">{submitted ? "Form data received." : "Waiting for submission."}</p>
      {submitted && <CodeBlock code={submitted} language="json" />}
    </div>
  );
}
` }, {
      filename: "profile-api-form.tsx",
      title: "2. Send the values to your API",
      paragraphs: [
        "Use an async onSubmit and serialize values as JSON in the request body. FormSubmit shows its loading state while this Promise runs. Handle network failures inside the callback so the user receives feedback.",
        "The preview makes a real request to Pimolu's demo endpoint. It validates the name and returns a response without storing a profile. In your application, replace /api/demo/profile with your own backend endpoint and implement server validation and authorization.",
      ],
      code: `"use client";

import { useState } from "react";
import { Form, FormError, FormSubmit, Input, useForm } from "@pimolu/react";

export function ProfileApiForm() {
  const [message, setMessage] = useState("");
  const form = useForm({
    defaultValues: { name: "" },
    validate: (values) => values.name.trim()
      ? {}
      : { name: "Enter your name." },
    onSubmit: async (values) => {
      setMessage("");
      try {
        const response = await fetch(
          "/api/demo/profile",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        if(!response.ok) throw new Error("Save failed.");
        setMessage("Request accepted. This demo does not store a profile.");
      } catch {
        setMessage("Could not save your profile. Please try again.");
      }
    },
  });

  return (
    <Form form={form} autoComplete="off" className="grid gap-4">
      <Input label="Name" {...form.register("name")} />
      <FormError name="name" />
      <FormSubmit>Save profile</FormSubmit>
      <p role="status">{message}</p>
    </Form>
  );
}
` }, {
      filename: "role-form.tsx",
      title: "3. Read values from a styled Select",
      paragraphs: [
        "For controls that report onValueChange, connect value to form.values and the callback to form.setValue. Their values then appear in the same onSubmit object as registered inputs. register is intended for controls emitting native onChange events.",
      ],
      code: `"use client";

import { useState } from "react";
import { Form, FormError, FormSubmit, Select, useForm } from "@pimolu/react";

export function RoleForm() {
  const [selectedRole, setSelectedRole] = useState("");
  const form = useForm({
    defaultValues: { role: "" },
    validate: (values) => values.role ? {} : { role: "Choose a role." },
    onSubmit: (values) => setSelectedRole(values.role),
  });

  return (
    <Form form={form} autoComplete="off" className="grid gap-4">
      <Select
        label="Role"
        name="role"
        value={form.values.role}
        onValueChange={(value) => form.setValue("role", value)}
        aria-invalid={Boolean(form.errors.role)}
        aria-describedby={form.errors.role ? form.formId + "-role-error" : undefined}
      >
        <option value="" disabled>Choose a role</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </Select>
      <FormError name="role" />
      <FormSubmit>Confirm role</FormSubmit>
      <p role="status">{selectedRole && "Submitted role: " + selectedRole}</p>
    </Form>
  );
}
` }],
    notes: [
      "Form and FormError do not create extra visible panels: Form is the HTML form wrapper, and FormError is hidden when its field has no error. FormSubmit looks like a Pimolu button bearing the label you provide. Open the Code tab in the preview to see their JSX names.",
      "Enter values in the live preview below to compare form.values with the last onSubmit result. Submitting empty fields demonstrates FormError. The example checks required values; add the format and business validation your application needs.",
      "These demonstrations set autoComplete=off on Form to request that the browser avoid saved suggestions. Browsers and password managers may still apply their own policies. For a real account form, use descriptive autocomplete tokens such as name, email and current-password on its fields.",
      "FormField handles field presentation and accessible associations. Form and useForm handle application form state and validation; each can be used independently.",
    ],
  },
  "form-submit": {
    title: "Customize the pending indicator",
    paragraphs: ["Create the form state with useForm, then keep FormSubmit inside Form. This complete example awaits a local operation and replaces the default ring with a colored dots Spinner."],
    examples: [{
      id: "form-submit",
      outlineLabel: "FormSubmit",
      filename: "custom-submit.tsx",
      title: "FormSubmit — a submit button with a custom loader",
      paragraphs: [
        "FormSubmit belongs inside Form and inherits Button's presentation props: variant, appearance, size, radius, fullWidth, icons, className, style and classNames. Form owns type=submit and loading through isSubmitting, so an asynchronous onSubmit drives the pending state automatically.",
        "Provide loadingIndicator to replace the ring. Configure the Spinner's appearance and variant to change its shape and color, or supply your own decorative content. classNames.spinner styles its wrapper independently of the label. Omit the prop for the default ring, or pass null to hide the visual. This new prop awaits the next package release.",
      ],
      code: `"use client";

import { useState } from "react";
import { Form, FormSubmit, Input, Spinner, useForm } from "@pimolu/react";

export function CustomSubmit() {
  const [message, setMessage] = useState("");
  const form = useForm({
    defaultValues: { name: "Ada" },
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMessage("Saved locally: " + values.name);
    },
  });
  return (
    <Form form={form} autoComplete="off" className="grid gap-4">
      <Input label="Name" {...form.register("name")} />
      <FormSubmit
        appearance="solid"
        loadingIndicator={<Spinner
          appearance="dots"
          size="sm"
          variant="warning"
          decorative
        />}
      >
        {form.isSubmitting ? "Saving…" : "Save locally"}
      </FormSubmit>
      <p role="status">{message}</p>
    </Form>
  );
}
`,
    }],
    notes: ["The loadingIndicator prop is available in 0.1.0-beta.4. See Usage and API reference below for the supported inherited Button props."],
  },
  "form-error": {
    title: "Connect validation and server errors",
    paragraphs: ["FormError reads a field message from Form. Use validation, setError and clearErrors to manage its content, and named-part classes to customize its presentation."],
    examples: [{
      id: "form-error",
      outlineLabel: "FormError",
      filename: "field-error.tsx",
      title: "FormError — show and customize field feedback",
      paragraphs: [
        "FormError reads errors[name] from its parent Form. Its required name must match the registered field key. It renders a role=alert paragraph only when that field has a message; register connects the field's aria-describedby and aria-invalid attributes to it.",
        "Return messages from validate or call form.setError(name, message) for a server response. Editing a registered field clears its error; clearErrors removes the message explicitly. Use className or classNames.error to style the message while preserving its association and alert role.",
      ],
      code: `"use client";

import { Button, Form, FormError, FormSubmit, Input, useForm } from "@pimolu/react";

export function FieldError() {
  const form = useForm({
    defaultValues: { name: "" },
    validate: (values) => values.name.trim() ? {} : { name: "Enter your name." },
  });
  return (
    <Form form={form} autoComplete="off" className="grid gap-4">
      <Input label="Name" {...form.register("name")} />
      <FormError name="name" classNames={{ error: "profile-error" }} />
      <div className="flex flex-wrap gap-3">
        <FormSubmit>Validate</FormSubmit>
        <Button
          onClick={() => form.setError(
            "name",
            "This name is already used (simulated server response)."
          )}
        >
          Simulate server error
        </Button>
        <Button appearance="ghost" onClick={() => form.clearErrors("name")}>Clear error</Button>
      </div>
      <style>
        {
          \`.profile-error {
  font-weight: 600;
  border-inline-start: 3px solid currentColor;
  padding-inline-start: 12px;
}\`
        }
      </style>
    </Form>
  );
}
`,
    }],
  },
  "form-field": {
    title: "Connect the label, control and message",
    paragraphs: [
      "FormField provides the label and helper or error text. Place one control inside FormControl so it receives the generated id, aria-describedby, aria-invalid, required and disabled attributes automatically.",
      "The hierarchy is `FormField → FormControl → Input`. Keep FormControl inside its FormField, and use a control that forwards these attributes to its actual input. Pimolu Input and Textarea support this.",
    ],
    examples: [{ filename: "email-field.tsx", code: `"use client";

import { FormControl, FormField, Input } from "@pimolu/react";

export function EmailField() {
  return (
    <FormField
      label="Email address"
      helperText="We will send your receipt here."
      required
    >
      <FormControl>
        <Input type="email" name="email" />
      </FormControl>
    </FormField>
  );
}
` }],
    notes: [
      "Give the label to FormField when composing this pattern. Supplying another label on Input creates a second visible label. Set errorMessage on FormField when validation finds an error.",
      "FormField supplies field layout and associations; connect value changes and validation through your application or useForm when needed.",
    ],
  },
  command: {
    title: "Choose an inline search or an application palette",
    paragraphs: [
      "Command renders an inline searchable list of actions. CommandPalette wraps that search in a dialog and can register a Cmd/Ctrl shortcut. A shared application palette usually stays mounted near the application root.",
      "Set `shortcut=\"k\"` on CommandPalette to register Cmd/Ctrl+K. The shortcut field on an individual item is only a displayed keyboard hint; implement that item's shortcut in your application if needed. Keep one owner for each global shortcut.",
    ],
    examples: [{ filename: "workspace-palette.tsx", code: `"use client";

import { useState } from "react";
import { Button, CommandPalette } from "@pimolu/react";

export function WorkspacePalette() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <Button onClick={() => setOpen(true)}>Search actions</Button>
      <CommandPalette
        label="Workspace actions"
        shortcut="k"
        open={open}
        onOpenChange={setOpen}
        items={[{ id: "draft", label: "Prepare a draft" }]}
        onSelect={(item) => setMessage(item.label + " selected.")}
      />
      <p role="status">{message}</p>
    </>
  );
}
` }],
    notes: [
      "CommandPalette supplies its own Dialog and closes after selection. Run your navigation or business action in onSelect. For an inline Command, set autoFocus={false} when mounting should preserve the user's current focus.",
    ],
  },
  "theme-builder": {
    title: "Apply appearance choices to your application",
    paragraphs: [
      "ThemeBuilder applies its selection to its own preview. To update the surrounding application, connect its callbacks to your PimoluProvider's appearance state.",
      "The example uses usePimoluTheme inside an existing PimoluProvider. Its setter updates that provider's entire subtree. Preset ids must match real Pimolu presets; start with the two shown here, then add the ones your product offers.",
    ],
    examples: [{ filename: "appearance-settings.tsx", code: `"use client";

import { ThemeBuilder, usePimoluTheme } from "@pimolu/react";

export function AppearanceSettings() {
  const {
    stylePreset,
    setStylePreset,
    resolvedTheme,
    setTheme,
    brandColor,
    setBrandColor,
    radius,
    setRadius,
    density,
    setDensity,
  } = usePimoluTheme();

  return (
    <ThemeBuilder
      presets={[
        { id: "default", label: "Default" },
        { id: "monochrome", label: "Monochrome" },
      ]}
      value={stylePreset}
      onValueChange={(preset) => {
        if(preset === "default" || preset === "monochrome") {
          setStylePreset(preset);
        }
      }}
      theme={resolvedTheme}
      onThemeChange={setTheme}
      brandColor={brandColor}
      onBrandColorChange={setBrandColor}
      radius={radius ?? "medium"}
      onRadiusChange={(value) => {
        if(value === "sharp" || value === "medium" || value === "round") {
          setRadius(value);
        }
      }}
      density={density ?? "comfortable"}
      onDensityChange={(value) => {
        if(value === "compact" || value === "comfortable" || value === "spacious") {
          setDensity(value);
        }
      }}
    />
  );
}
` }],
    notes: [
      "All five controls now update the enclosing provider: preset, color mode, brand color, radius and density. The medium/comfortable fallbacks give explicit initial choices when the provider inherits those dimensions from its preset.",
      "usePimoluTheme requires an ancestor PimoluProvider. If that provider is controlled, update the state supplied through its change callbacks too. ThemeBuilder's color-mode choices are light and dark; use the provider's system mode for device preferences.",
    ],
  },
  "notification-center": {
    title: "Supply the inbox and update it through callbacks",
    paragraphs: [
      "NotificationCenter displays the notifications array you supply. Your state owns read status, removal and persistence. Its callbacks report which item the user acted on; update the array to show the result.",
      "The bell, panel and optional filter tabs are included. Toast messages and this inbox have separate data; explicitly add an inbox record if the same event needs both forms of feedback.",
    ],
    examples: [{ filename: "notification-inbox.tsx", code: `"use client";

import { useState } from "react";
import { NotificationCenter, type PimoluNotification } from "@pimolu/react";

export function NotificationInbox() {
  const [notifications, setNotifications] = useState<PimoluNotification[]>([
    { id: "review", title: "Your review is ready", read: false },
  ]);

  return (
    <NotificationCenter
      notifications={notifications}
      showTabs
      onRead={(id) => setNotifications((items) => items.map((item) =>
        item.id === id ? { ...item, read: true } : item
      ))}
      onReadAll={() => setNotifications((items) => items.map((item) =>
        ({ ...item, read: true })
      ))}
      onDismiss={(id) => setNotifications((items) =>
        items.filter((item) => item.id !== id)
      )}
    />
  );
}
` }],
    notes: [
      "These changes stay in React state in this example. Connect the callbacks to your own service to retain an inbox across sessions. open/onOpenChange optionally lets the application control the panel independently of its data.",
    ],
  },
  tour: {
    title: "Open a tour with real targets",
    paragraphs: [
      "Place Tour in the screen it describes and supply ordered steps. Each target can be a ref, a CSS selector or a resolver returning an element. A ref keeps the connection explicit when several instances share the page.",
      "Use open/onOpenChange to start and close the tour from your own button. onFinish and onSkip report the outcome; store completion in your application if the introduction should only appear once.",
    ],
    examples: [{ filename: "screen-tour.tsx", code: `"use client";

import { useRef, useState } from "react";
import { Button, Tour } from "@pimolu/react";

export function ScreenTour() {
  const target = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <Button onClick={() => setOpen(true)}>Start introduction</Button>
      <div ref={target}>Your project activity appears here.</div>
      <Tour
        open={open}
        onOpenChange={setOpen}
        steps={[{
          target,
          title: "Follow your projects",
          description: "Find the latest activity in this section.",
        }]}
        onFinish={() => setMessage("Introduction completed.")}
        onSkip={() => setMessage("Introduction skipped.")}
      />
      <p role="status">{message}</p>
    </>
  );
}
` }],
    notes: [
      "Mount route-specific targets before opening the tour. A missing target still shows the step card without its highlight. Keep a visible exit path and let users revisit onboarding when useful.",
    ],
  },
  "table-of-contents": {
    title: "Connect headings and the current section",
    paragraphs: [
      "Supply items whose ids match actual headings. TableOfContents creates anchor links; activeId identifies the current section. Your application supplies scroll tracking when the highlight should follow reading.",
      "This example uses IntersectionObserver to track two headings, updates activeId when a link is selected and disconnects the observer on unmount. Scope observation with refs when multiple articles share a page.",
    ],
    examples: [{ filename: "article-outline.tsx", code: `"use client";

import { useEffect, useRef, useState } from "react";
import { TableOfContents } from "@pimolu/react";

export function ArticleOutline() {
  const article = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState("overview");

  useEffect(
    () => {
      const headings = article.current?.querySelectorAll("h2[id]");
      if(!headings) return;

      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if(visible[0]) setActiveId(visible[0].target.id);
      }, { rootMargin: "0px 0px -60% 0px" });

      headings.forEach((heading) => observer.observe(heading));
      return () => observer.disconnect();
    },
    []
  );

  return (
    <>
      <TableOfContents
        items={[
          { id: "overview", label: "Overview" },
          { id: "details", label: "Details" },
        ]}
        activeId={activeId}
        onNavigate={(item) => setActiveId(item.id)}
      />
      <article ref={article}>
        <section style={{ minHeight: "60vh" }}>
          <h2 id="overview">Overview</h2>
          <p>Introduce your topic here.</p>
        </section>
        <section style={{ minHeight: "60vh" }}>
          <h2 id="details">Details</h2>
          <p>Explain the details here.</p>
        </section>
      </article>
    </>
  );
}
` }],
    notes: [
      "Give headings unique ids and use scroll-margin-top when a sticky header would cover them. For a nested scrolling article, pass its scroll container as the observer's root. Adjust rootMargin for your layout and fixed-header height.",
    ],
  },
};
