"use client";

import { Button, toast, Toaster } from "@pimolu/react";

const descriptions: Record<string, string> = {
  default: "A neutral notification.",
  success: "The deployment finished.",
  warning: "The token is close to its limit.",
  danger: "The deployment failed.",
};

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <Button
              variant="primary"
              appearance="outline"
              onClick={() => toast({
                classNames: {
                  root: "custom-toast-root",
                  title: "custom-toast-title"
                },
                title: "default toast",
                description: descriptions["default"],
                variant: "default",
                duration: 4000,
              })}
            >
              default
            </Button>
            <Button
              variant="primary"
              appearance="soft"
              onClick={() => toast({
                classNames: {
                  root: "custom-toast-root",
                  title: "custom-toast-title"
                },
                title: "success toast",
                description: descriptions["success"],
                variant: "success",
                duration: 4000,
              })}
            >
              success
            </Button>
            <Button
              variant="primary"
              appearance="soft"
              onClick={() => toast({
                classNames: {
                  root: "custom-toast-root",
                  title: "custom-toast-title"
                },
                title: "warning toast",
                description: descriptions["warning"],
                variant: "warning",
                duration: 4000,
              })}
            >
              warning
            </Button>
            <Button
              variant="danger"
              appearance="soft"
              onClick={() => toast({
                classNames: {
                  root: "custom-toast-root",
                  title: "custom-toast-title"
                },
                title: "danger toast",
                description: descriptions["danger"],
                variant: "danger",
                duration: 4000,
              })}
            >
              danger
            </Button>
          </div>
        </>)
      }
      <Toaster position="bottom-right" label="Customized notifications" />
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
    </div>
  );
}
