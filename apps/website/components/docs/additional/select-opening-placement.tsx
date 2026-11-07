"use client";

import { useState } from "react";
import { Select } from "@pimolu/react";

export function DemoExample() {
  const [model, setModel] = useState("balanced");

  return (
    <div className="grid gap-4">
      <Select label="Model" value={model} onValueChange={setModel} fullWidth>
        <option value="fast">Fast</option>
        <option value="balanced">Balanced</option>
        <option value="reasoning">Reasoning</option>
      </Select>
      <p role="status">Selected model: {model}.</p>
    </div>
  );
}
