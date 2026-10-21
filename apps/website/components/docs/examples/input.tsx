"use client";

import { useState } from "react";
import { Checkbox, Input } from "@pimolu/react";

export function InputExample() {
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  return <div className="space-y-5">
    <Input label="Email address" type="email" name="email" placeholder="you@example.com" value={value} onValueChange={setValue} clearable fullWidth helperText="Your workspace contact address." errorMessage={invalid ? "Enter a valid contact address." : undefined} />
    <Checkbox label="Show the invalid state" checked={invalid} onCheckedChange={setInvalid} />
  </div>;
}
