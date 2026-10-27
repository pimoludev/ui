"use client";

import { Footer } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div className="grid gap-5 min-w-0">
              <span
                className="text-sm text-muted leading-relaxed"
              >surface</span>
              <Footer
                appearance="surface"
                bordered={true}
                brand="Pimolu"
                description="One system. Your identity."
                columns={[{
                  title: "Explore",
                  links: [
                    {
                      label: "Components",
                      href: "#/button"
                    },
                    {
                      label: "Documentation",
                      href: "#/overview"
                    }
                  ]
                }]}
                copyright="Example workspace"
                classNames={{
                  root: "custom-footer-root",
                  item: "custom-footer-item"
                }}
              />
            </div>
            <div className="grid gap-5 min-w-0">
              <span
                className="text-sm text-muted leading-relaxed"
              >transparent</span>
              <Footer
                appearance="transparent"
                bordered={false}
                brand="Pimolu"
                description="One system. Your identity."
                columns={[{
                  title: "Explore",
                  links: [
                    {
                      label: "Components",
                      href: "#/button"
                    },
                    {
                      label: "Documentation",
                      href: "#/overview"
                    }
                  ]
                }]}
                copyright="Example workspace"
                classNames={{
                  root: "custom-footer-root",
                  item: "custom-footer-item"
                }}
              />
            </div>
            <div className="grid gap-5 min-w-0">
              <span
                className="text-sm text-muted leading-relaxed"
              >floating</span>
              <Footer
                appearance="floating"
                bordered={true}
                brand="Pimolu"
                description="One system. Your identity."
                columns={[{
                  title: "Explore",
                  links: [
                    {
                      label: "Components",
                      href: "#/button"
                    },
                    {
                      label: "Documentation",
                      href: "#/overview"
                    }
                  ]
                }]}
                copyright="Example workspace"
                classNames={{
                  root: "custom-footer-root",
                  item: "custom-footer-item"
                }}
              />
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-footer-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-footer-item {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
