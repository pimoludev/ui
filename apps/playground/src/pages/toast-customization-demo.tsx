"use client";

import { toastVariantMap, Button, toast } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const toastVariants = optionsOf(
  toastVariantMap.variant,
);

const descriptions: Record<string, string> = {
  default: "A neutral notification.",
  success: "The deployment finished.",
  warning: "The token is close to its limit.",
  danger: "The deployment failed.",
  info: "A new workspace update is available.",
  loading: "Dismiss this notification when you are done.",
};

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-row">
            {
              toastVariants.map((variant) => (
                <Button
                  key={variant}
                  variant={variant === "danger" ? "danger" : "primary"}
                  appearance={variant === "default" ? "outline" : "soft"}
                  onClick={() =>
                    toast({
                      classNames: {
                        root: "custom-toast-root",
                        title: "custom-toast-title"
                      },
                      title: `${variant} toast`,
                      description: descriptions[variant],
                      variant,
                      duration: 4000,
                    })
                  }
                >
                  {variant}
                </Button>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-toast-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-toast-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
