import type { ComponentDoc } from "./docs.ts";

/** Separate references for existing exports of the Form family. */
export const formReferences: ComponentDoc[] = [
  {
    family: "form-submit",
    title: "FormSubmit",
    example: "FormSubmitExample",
    description: "A customizable submit button connected to the pending state of Form.",
    usage: [
      "Place FormSubmit inside Form. It renders a Button with type=submit and reads form.isSubmitting automatically. Return or await your asynchronous work in useForm's onSubmit so the pending state lasts until that work completes.",
      "Use Button's variant, appearance, size, radius, fullWidth, icons, disabled, className and style props. Do not pass type or loading: Form owns both. Prevent submission through validation rather than running business logic in onClick.",
      "loadingIndicator accepts a decorative Spinner or custom React content. Configure Spinner's appearance, size and variant to change its shape and color. Omission keeps the ring; null/false hides the visual while retaining disabled and aria-busy. This prop is local to the workspace and awaits the next npm release.",
      "Use classNames.root, label and spinner for named-part customization. Form-level classNames.submit styles the submit button; prefer the page's local classes when several forms need different treatments.",
    ],
    accessibility: [
      "Keep an explicit action label. During submission the button is disabled and exposes aria-busy. A decorative loader does not replace a readable pending or completion message.",
      "Use a polite status message for the result. Do not nest interactive controls inside loadingIndicator. Pimolu Spinner supports reduced motion; custom animations must honor that preference too.",
    ],
    related: ["components/form", "components/form-error", "components/button", "components/spinner"],
  },
  {
    family: "form-error",
    title: "FormError",
    example: "FormErrorExample",
    description: "Field-level validation and server feedback connected to Form state.",
    usage: [
      "Place FormError inside Form with a name matching a field key. It reads form.errors[name] and renders nothing when there is no message. Return an error map from validate or call form.setError(name, message) after a server response.",
      "Spread form.register(name) onto a native-event input such as Input. Registration connects aria-invalid and aria-describedby to the message. For controls exposing onValueChange, connect form.values, setValue and those ARIA attributes explicitly.",
      "Editing a registered field or calling setValue clears its error. clearErrors(name) removes one error; clearErrors() removes all. FormError only renders feedback: it does not run validation or submit the form.",
      "Customize the message with className or classNames.error, or provide Form-level classNames.error for shared styling. Preserve the generated id and alert role. The current API displays a text message; it does not accept arbitrary children or Button props.",
    ],
    accessibility: [
      "Keep the error next to its field and explain how to correct it. The message is a paragraph with role=alert and a stable id associated with the registered control.",
      "Do not rely on color alone. Validation does not automatically focus the first invalid field; decide how your application should handle focus and an error summary.",
    ],
    related: ["components/form", "components/form-submit", "components/form-field", "components/input", "components/select"],
  },
];
