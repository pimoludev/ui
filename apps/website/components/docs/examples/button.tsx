"use client";

import { useState } from "react";
import { Button, buttonVariantMap, Select } from "@pimolu/react";

export function ButtonExample() {
  const [appearance, setAppearance] = useState<keyof typeof buttonVariantMap.appearance>("solid");
  const [count, setCount] = useState(0);
  return <div className="space-y-6">
    <Select label="Appearance" value={appearance} onValueChange={(value) => setAppearance(value as keyof typeof buttonVariantMap.appearance)}>
      {Object.keys(buttonVariantMap.appearance).map((value) => <option key={value} value={value}>{value}</option>)}
    </Select>
    <div className="flex flex-wrap gap-3"><Button appearance={appearance} onClick={() => setCount(count + 1)}>Add a little progress</Button><Button disabled>Unavailable</Button></div>
    <p role="status">{count} step{count === 1 ? "" : "s"} forward.</p>
  </div>;
}
