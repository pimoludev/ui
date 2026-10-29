"use client";

import { useState } from "react";
import { Checkbox, Input } from "@pimolu/react";

export function InputExample() {
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [allowSuggestions, setAllowSuggestions] = useState(false);
  return <div className="space-y-5">
    <Input label="Email address" type="email" name="email" autoComplete={allowSuggestions ? "email" : "off"} placeholder="you@example.com" value={value} onValueChange={setValue} clearable fullWidth helperText="Try typing or accepting a browser suggestion. Autofill keeps the field surface." errorMessage={invalid ? "Enter a valid contact address." : undefined} />
    <Checkbox label="Allow browser suggestions" checked={allowSuggestions} onCheckedChange={setAllowSuggestions} />
    <Checkbox label="Show the invalid state" checked={invalid} onCheckedChange={setInvalid} />
  </div>;
}
