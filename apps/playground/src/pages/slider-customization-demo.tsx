"use client";

import { sliderVariantMap, Slider } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const sliderSizes = optionsOf(sliderVariantMap.size);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--start">
            {
              sliderSizes.map((size) => (
                <div key={size} className="pg-demo-item">
                  <Slider
                    label={`Size ${size}`}
                    size={size}
                    defaultValue={40}
                    showValue
                    classNames={{
                      root: "custom-slider-root",
                      label: "custom-slider-label"
                    }}
                  />
                  <span className="pg-meta">{size}</span>
                </div>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-slider-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-slider-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
