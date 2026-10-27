"use client";

import { footerVariantMap, Footer } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              Object.keys(footerVariantMap.appearance).map((value) => {
                const appearance = value as keyof typeof footerVariantMap.appearance; return (
                  <div
                    key={value}
                    className="pg-stack"
                  >
                    <span
                      className="pg-meta"
                    >{
                        value
                      }</span>
                    <Footer
                      appearance={appearance}
                      bordered={appearance !== "transparent"}
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
                );
              })
            }
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
    </>
  );
}
