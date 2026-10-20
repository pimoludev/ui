import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CurrencyInput,
  Form,
  FormError,
  FormSubmit,
  useForm,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   CONTROLLED EXAMPLE
========================================= */

function ControlledAmount() {
  const [amount, setAmount] = useState<number | null>(129.9);

  return (
    <div className="pg-stack">
      <CurrencyInput
        label="Amount"
        value={amount}
        onValueChange={setAmount}
        min={0}
        max={10000}
        helperText={
          amount === null
            ? "Empty: onValueChange reported null."
            : `Numeric value: ${amount}`
        }
        fullWidth
      />

      <div className="pg-row">
        <Button
          type="button"
          onClick={() => setAmount(2499.99)}
        >
          Set 2,499.99
        </Button>

        <Button
          type="button"
          appearance="ghost"
          onClick={() => setAmount(null)}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

/* =========================================
   BUDGET EXAMPLE
========================================= */

interface BudgetValues {
  budget: number | null;
}

function BudgetForm() {
  const [saved, setSaved] = useState(false);

  const form = useForm<BudgetValues>({
    defaultValues: { budget: 2500 },

    validate: (values) => {
      if (values.budget === null) {
        return { budget: "Enter a monthly budget." };
      }

      if (values.budget < 500) {
        return {
          budget: "The minimum monthly budget is $500.",
        };
      }

      return undefined;
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
        <CardTitle>Campaign budget</CardTitle>
        <CardDescription>
          The currency field clamps on blur, while Form
          validates the business rule on submit.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form form={form} className="pg-stack">
          <CurrencyInput
            label="Monthly budget"
            currency="USD"
            locale="en-US"
            min={0}
            max={50000}
            value={form.values.budget}
            onValueChange={(value) =>
              form.setValue("budget", value)
            }
            invalid={Boolean(form.errors.budget)}
            aria-describedby={
              form.errors.budget
                ? `${form.formId}-budget-error`
                : undefined
            }
            helperText="Between $0 and $50,000."
            required
            fullWidth
          />

          <FormError name="budget" />

          <FormSubmit>Save budget</FormSubmit>

          {saved && form.values.budget !== null && (
            <p role="status">
              Budget saved: {form.values.budget.toLocaleString(
                "en-US",
                {
                  style: "currency",
                  currency: "USD",
                }
              )}
              .
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

export function CurrencyInputPage() {
  return (
    <>
      <PageHeader
        title="CurrencyInput"
        hint="A numeric field formatted with Intl.NumberFormat. It shows the amount with its symbol when idle, switches to plain editable digits on focus, accepts typing and pasting with either decimal separator, and reports number | null through onValueChange. min, max and decimals are applied on blur."
      />

      <Section
        title="Locales and currencies"
        hint="The same value formats differently: symbol placement, grouping and fraction digits all come from Intl."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-stack">
              <CurrencyInput
                label="US dollars (default)"
                defaultValue={1234.5}
                fullWidth
              />

              <CurrencyInput
                label="Euros, French formatting"
                currency="EUR"
                locale="fr-FR"
                defaultValue={1234.5}
                fullWidth
              />

              <CurrencyInput
                label="Pounds, UK formatting"
                currency="GBP"
                locale="en-GB"
                defaultValue={1234.5}
                fullWidth
              />

              <CurrencyInput
                label="Yen, zero decimals"
                currency="JPY"
                locale="ja-JP"
                defaultValue={1235}
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
              <CurrencyInput
                size="sm"
                label="Small"
                defaultValue={25}
              />

              <CurrencyInput
                size="md"
                label="Medium"
                defaultValue={25}
              />

              <CurrencyInput
                size="lg"
                label="Large"
                defaultValue={25}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Controlled value, min and max"
        hint="Focus the field to see the raw number; blur to format it. Values outside min/max are clamped on blur, and an empty field reports null."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <ControlledAmount />
          </div>
        </div>
      </Section>

      <Section
        title="Decimals, negatives and states"
        hint="allowNegative is off by default. Error, required and disabled reuse the same tokens as Input."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-stack">
              <CurrencyInput
                label="Zero decimals"
                decimals={0}
                defaultValue={1234.56}
              />

              <CurrencyInput
                label="Refund (negative allowed)"
                allowNegative
                defaultValue={-45.5}
                helperText="A negative amount credits the customer."
              />

              <CurrencyInput
                label="With error"
                defaultValue={0}
                errorMessage="The amount must be greater than zero."
              />

              <CurrencyInput
                label="Disabled"
                defaultValue={99}
                disabled
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Example: campaign budget"
        hint="CurrencyInput controlled by Form, with both UI and business validation."
      >
        <BudgetForm />
      </Section>
    </>
  );
}
