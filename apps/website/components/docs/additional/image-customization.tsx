"use client";

import { Button, Image } from "@pimolu/react";
import { useState } from "react";

export function DemoExample() {
  const [cachedVisible, setCachedVisible] = useState(false);
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
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
                src="/images/pimolu-studio.webp"
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
    </div>
  );
}
