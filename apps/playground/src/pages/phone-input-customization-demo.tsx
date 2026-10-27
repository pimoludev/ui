"use client";

import { PhoneInput } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid">
            <div className="pg-panel">
              <div className="pg-stack">
                <PhoneInput
                  label="United States"
                  defaultCountry="US"
                  defaultValue="+14155552671"
                  fullWidth
                  classNames={{
                    root: "custom-phone-input-root",
                    label: "custom-phone-input-label"
                  }}
                />
                <PhoneInput
                  label="France"
                  defaultCountry="FR"
                  defaultValue="+33612345678"
                  fullWidth
                  classNames={{
                    root: "custom-phone-input-root",
                    label: "custom-phone-input-label"
                  }}
                />
                <PhoneInput
                  label="United Kingdom"
                  defaultCountry="GB"
                  defaultValue="+447911123456"
                  fullWidth
                  classNames={{
                    root: "custom-phone-input-root",
                    label: "custom-phone-input-label"
                  }}
                />
                <PhoneInput
                  label="Brazil"
                  defaultCountry="BR"
                  defaultValue="+5521987654321"
                  fullWidth
                  classNames={{
                    root: "custom-phone-input-root",
                    label: "custom-phone-input-label"
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
.custom-phone-input-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-phone-input-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
