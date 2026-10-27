import { CustomizationExample } from "./masked-input-customization-demo";
import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormError,
  FormSubmit,
  Input,
  MaskedInput,
  useForm,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   CONTROLLED EXAMPLE
========================================= */

function ControlledMask() {
  const [phone, setPhone] = useState("(415) 555-2671");

  return (
    <div className="pg-stack">
      <MaskedInput
        label="Phone"
        mask="(999) 999-9999"
        value={phone}
        onValueChange={setPhone}
        helperText={`Formatted value: "${phone}"`}
        fullWidth
      />

      <div className="pg-row">
        <Button
          type="button"
          onClick={() => setPhone("(212) 555-0100")}
        >
          Use New York number
        </Button>

        <Button
          type="button"
          appearance="ghost"
          onClick={() => setPhone("")}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

/* =========================================
   DELIVERY EXAMPLE
========================================= */

interface DeliveryValues {
  recipient: string;
  phone: string;
  postalCode: string;
}

function DeliveryForm() {
  const [confirmed, setConfirmed] = useState(false);

  const form = useForm<DeliveryValues>({
    defaultValues: {
      recipient: "",
      phone: "",
      postalCode: "",
    },

    validate: (values) => {
      const errors: Partial<
        Record<keyof DeliveryValues, string>
      > = {};

      if (!values.recipient.trim()) {
        errors.recipient = "Who should we ask for?";
      }

      if (values.phone.replace(/\D/g, "").length < 10) {
        errors.phone = "Enter the full 10-digit number.";
      }

      if (values.postalCode.replace(/[^a-z0-9]/gi, "").length < 6) {
        errors.postalCode = "Enter a complete postal code.";
      }

      return errors;
    },

    onSubmit: async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      setConfirmed(true);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery contact</CardTitle>
        <CardDescription>
          MaskedInput is controlled here and writes into the
          same form state as the regular inputs.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form form={form} className="pg-stack">
          <Input
            label="Recipient"
            required
            fullWidth
            {...form.register("recipient")}
          />

          <FormError name="recipient" />

          <MaskedInput
            label="Phone"
            mask="(999) 999-9999"
            required
            fullWidth
            value={form.values.phone}
            onValueChange={(value) =>
              form.setValue("phone", value)
            }
            invalid={Boolean(form.errors.phone)}
            aria-describedby={
              form.errors.phone
                ? `${form.formId}-phone-error`
                : undefined
            }
            helperText="We only call on delivery day."
          />

          <FormError name="phone" />

          <MaskedInput
            label="Postal code"
            mask="a9a 9a9"
            required
            fullWidth
            value={form.values.postalCode}
            onValueChange={(value) =>
              form.setValue("postalCode", value)
            }
            invalid={Boolean(form.errors.postalCode)}
            aria-describedby={
              form.errors.postalCode
                ? `${form.formId}-postalCode-error`
                : undefined
            }
          />

          <FormError name="postalCode" />

          <FormSubmit>Confirm delivery</FormSubmit>

          {confirmed && (
            <p role="status">
              Delivery contact saved for {form.values.recipient}.
            </p>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}

/* =========================================
   PAGE
========================================= */

export function MaskedInputPage() {
  return (
    <>
      <PageHeader
        title="MaskedInput"
        hint="A dependency-free pattern mask. `9` accepts a digit, `a` a letter and `*` a letter or digit; every other character is a literal. The value is always the formatted string, the caret is restored after typing and pasting, and the native control keeps type=text with a sensible inputMode."
      />

      <Section
        title="Patterns"
        hint="The same engine covers phone numbers, dates, postal codes and mixed alphanumeric references."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-stack">
              <MaskedInput
                label="Phone (US)"
                mask="(999) 999-9999"
                placeholder="(415) 555-2671"
                fullWidth
              />

              <MaskedInput
                label="Date"
                mask="99/99/9999"
                placeholder="31/12/2026"
                fullWidth
              />

              <MaskedInput
                label="Canadian postal code"
                mask="a9a 9a9"
                placeholder="K1A 0B1"
                fullWidth
              />

              <MaskedInput
                label="Mixed reference"
                mask="**-9999"
                placeholder="AB-1234"
                fullWidth
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Sizes"
        hint="sm, md and lg match the other text controls."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-stack">
              <MaskedInput
                size="sm"
                label="Small"
                mask="999-999"
                defaultValue="123456"
              />

              <MaskedInput
                size="md"
                label="Medium"
                mask="999-999"
                defaultValue="123456"
              />

              <MaskedInput
                size="lg"
                label="Large"
                mask="999-999"
                defaultValue="123456"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Controlled value and paste"
        hint="onValueChange receives the formatted string. Pasting a formatted value is normalized and the caret lands after the last accepted character."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <ControlledMask />
          </div>
        </div>
      </Section>

      <Section
        title="States"
        hint="Helper text, errors, required and disabled reuse the same tokens as Input."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-stack">
              <MaskedInput
                label="With helper"
                mask="99/99/9999"
                helperText="Day, month, then year."
              />

              <MaskedInput
                label="With error"
                mask="(999) 999-9999"
                defaultValue="(415"
                errorMessage="Enter a complete phone number."
              />

              <MaskedInput
                label="Required"
                mask="99999"
                required
                placeholder="ZIP code"
              />

              <MaskedInput
                label="Disabled"
                mask="(999) 999-9999"
                defaultValue="4155552671"
                disabled
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Example: delivery contact"
        hint="A real composition using Form for validation and two different masks."
      >
        <DeliveryForm />
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
