"use client";

import { PhoneInput } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0"
          >
            <div className="min-w-0 rounded-lg border border-border p-6">
              <div className="grid gap-5 min-w-0">
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
    </div>
  );
}
