"use client";

import { Button, Image } from "@pimolu/react";
import { useState } from "react";

export function CustomizationExample() {
  const [cachedVisible, setCachedVisible] = useState(false);
  return (
    <>
      {
        (<>
          <div className="pg-stack">
            <Button
              appearance="outline"
              onClick={() => setCachedVisible((visible) => !visible)}
            >
              {
                cachedVisible
                  ? "Hide cached image"
                  : "Show cached image"
              }
            </Button>
            {
              cachedVisible && <Image
                src="/product.svg"
                alt="Cached Pimolu product"
                width={400}
                height={300}
                aspectRatio={4 / 3}
                classNames={{
                  root: "custom-image-root"
                }}
              />
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-image-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
