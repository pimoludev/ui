"use client";

import { useState } from "react";
import { Button } from "@pimolu/react";

export function ButtonExample() {
  const [count, setCount] = useState(0);
  return <div className="space-y-6">
    <div className="flex flex-wrap gap-3"><Button onClick={() => setCount(count + 1)}>Add a little progress</Button><Button disabled>Unavailable</Button></div>
    <p role="status">{count} step{count === 1 ? "" : "s"} forward.</p>
  </div>;
}
