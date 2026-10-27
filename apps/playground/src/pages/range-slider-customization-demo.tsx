"use client";

import { rangeSliderVariantMap, RangeSlider } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const rangeSliderSizes = optionsOf(
  rangeSliderVariantMap.size,
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--start">
            {
              rangeSliderSizes.map((size) => (
                <div key={size} className="pg-demo-item">
                  <RangeSlider
                    label={`Size ${size}`}
                    size={size}
                    defaultValue={[25, 75]}
                    showValue
                    classNames={{
                      root: "custom-range-slider-root",
                      label: "custom-range-slider-label"
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
.custom-range-slider-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-range-slider-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
