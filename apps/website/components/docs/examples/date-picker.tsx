"use client";

import { useState } from "react";
import { DatePicker } from "@pimolu/react";

export function DatePickerExample() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 9, 21));
  return <div className="space-y-4">
    <DatePicker label="Launch date" name="launch-date" value={value} onChange={setValue} locale="en-US" weekStartsOn={1} fullWidth />
    <p role="status">{value ? `Launch date: ${value.toLocaleDateString("en-US")}` : "No launch date selected."}</p>
  </div>;
}
