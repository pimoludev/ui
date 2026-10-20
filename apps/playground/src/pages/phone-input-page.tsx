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
  PhoneInput,
  useForm,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   CONTROLLED EXAMPLE
========================================= */

function ControlledPhone() {
  const [phone, setPhone] = useState("+14155552671");
  const [country, setCountry] = useState("US");

  return (
    <div className="pg-stack">
      <PhoneInput
        label="Mobile number"
        value={phone}
        country={country}
        onCountryChange={(next) => setCountry(next.code)}
        onValueChange={setPhone}
        helperText={`E.164 value: "${phone || "empty"}"`}
        fullWidth
      />

      <div className="pg-row">
        <Button
          type="button"
          onClick={() => {
            setCountry("FR");
            setPhone("+33612345678");
          }}
        >
          Use a French number
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
   TWO-FACTOR EXAMPLE
========================================= */

interface ContactValues {
  name: string;
  phone: string;
}

function ContactForm() {
  const [saved, setSaved] = useState(false);

  const form = useForm<ContactValues>({
    defaultValues: {
      name: "",
      phone: "",
    },

    validate: (values) => {
      const errors: Partial<
        Record<keyof ContactValues, string>
      > = {};

      if (!values.name.trim()) {
        errors.name = "Add a contact name.";
      }

      if (values.phone.replace(/\D/g, "").length < 8) {
        errors.phone = "Enter a complete phone number.";
      }

      return errors;
    },

    onSubmit: async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      setSaved(true);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security contact</CardTitle>
        <CardDescription>
          The country selector and the national field share
          one E.164 value. FormError is wired through
          aria-describedby.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form form={form} className="pg-stack">
          <Input
            label="Contact name"
            required
            fullWidth
            {...form.register("name")}
          />

          <FormError name="name" />

          <PhoneInput
            label="Mobile number"
            defaultCountry="US"
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
            helperText="Used for sign-in codes only."
          />

          <FormError name="phone" />

          <FormSubmit>Save contact</FormSubmit>

          {saved && (
            <p role="status">
              Security contact saved for{" "}
              {form.values.name}.
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

const customCountries = [
  {
    code: "US",
    name: "United States",
    dialCode: "1",
    pattern: "(999) 999-9999",
  },
  {
    code: "FR",
    name: "France",
    dialCode: "33",
    pattern: "9 99 99 99 99",
  },
  {
    code: "BR",
    name: "Brazil",
    dialCode: "55",
    pattern: "(99) 99999-9999",
  },
];

export function PhoneInputPage() {
  return (
    <>
      <PageHeader
        title="PhoneInput"
        hint="A national number field with an accessible country selector. The default list ships a handful of countries and dial codes; pass countries to replace it. The field formats the national number, keeps the caret in place, and emits an E.164-ish +<dial><digits> value through onValueChange."
      />

      <Section
        title="Countries and formatting"
        hint="The country drives the dial prefix and the national pattern. An international value is matched to its country automatically."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-stack">
              <PhoneInput
                label="United States"
                defaultCountry="US"
                defaultValue="+14155552671"
                fullWidth
              />

              <PhoneInput
                label="France"
                defaultCountry="FR"
                defaultValue="+33612345678"
                fullWidth
              />

              <PhoneInput
                label="United Kingdom"
                defaultCountry="GB"
                defaultValue="+447911123456"
                fullWidth
              />

              <PhoneInput
                label="Brazil"
                defaultCountry="BR"
                defaultValue="+5521987654321"
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
              <PhoneInput
                size="sm"
                label="Small"
                defaultValue="+14155552671"
              />

              <PhoneInput
                size="md"
                label="Medium"
                defaultValue="+14155552671"
              />

              <PhoneInput
                size="lg"
                label="Large"
                defaultValue="+14155552671"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Controlled value and country"
        hint="Both the number and the country can be controlled. Selecting another country immediately re-emits the same national digits with the new dial code."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <ControlledPhone />
          </div>
        </div>
      </Section>

      <Section
        title="Custom country list"
        hint="Pass any { code, name, dialCode, pattern } array. Extra national digits are preserved when they exceed the pattern."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <PhoneInput
              label="Support line"
              countries={customCountries}
              defaultCountry="FR"
              placeholder="6 12 34 56 78"
              helperText="Only three countries are offered here."
              fullWidth
            />
          </div>
        </div>
      </Section>

      <Section
        title="States"
        hint="Error, required and disabled apply to the number field and the selector together."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-stack">
              <PhoneInput
                label="With error"
                defaultValue="+1415"
                errorMessage="Enter a complete phone number."
                fullWidth
              />

              <PhoneInput
                label="Required"
                required
                fullWidth
              />

              <PhoneInput
                label="Disabled"
                defaultValue="+14155552671"
                disabled
                fullWidth
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Example: security contact"
        hint="PhoneInput controlled by Form alongside a regular Input."
      >
        <ContactForm />
      </Section>
    </>
  );
}
