"use client";

import { useState } from "react";
import { Button, Tooltip } from "@pimolu/react";

export function TooltipExample() {
  const [saved, setSaved] = useState(false);
  return <Tooltip content="Keep this idea in your workspace." placement="top" delay={150} arrow>
    <Button appearance="outline" aria-pressed={saved} onClick={() => setSaved(!saved)}>{saved ? "Idea saved" : "Save this idea"}</Button>
  </Tooltip>;
}
