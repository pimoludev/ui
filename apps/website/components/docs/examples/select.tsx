"use client";

import { useState } from "react";
import { Select } from "@pimolu/react";

export function SelectExample() {
  const [value, setValue] = useState("design");
  return <div className="space-y-4">
    <Select label="Team" name="team" value={value} onValueChange={setValue} fullWidth>
      <option value="design">Design</option><option value="engineering">Engineering</option><option value="research" disabled>Research (unavailable)</option>
    </Select>
    <p role="status">Selected team: {value}.</p>
  </div>;
}
