"use client";

import { CurrencyInput } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid">
            <div className="pg-panel">
              <div className="pg-stack">
                <CurrencyInput
                  label="US dollars (default)"
                  defaultValue={1234.5}
                  fullWidth
                  classNames={{
                    root: "custom-currency-input-root",
                    label: "custom-currency-input-label"
                  }}
                />
                <CurrencyInput
                  label="Euros, French formatting"
                  currency="EUR"
                  locale="fr-FR"
                  defaultValue={1234.5}
                  fullWidth
                  classNames={{
                    root: "custom-currency-input-root",
                    label: "custom-currency-input-label"
                  }}
                />
                <CurrencyInput
                  label="Pounds, UK formatting"
                  currency="GBP"
                  locale="en-GB"
                  defaultValue={1234.5}
                  fullWidth
                  classNames={{
                    root: "custom-currency-input-root",
                    label: "custom-currency-input-label"
                  }}
                />
                <CurrencyInput
                  label="Yen, zero decimals"
                  currency="JPY"
                  locale="ja-JP"
                  defaultValue={1235}
                  fullWidth
                  classNames={{
                    root: "custom-currency-input-root",
                    label: "custom-currency-input-label"
                  }}
                />
              </div>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-currency-input-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-currency-input-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
