"use client";
import { useEffect, useState } from "react";
import { Select, Button } from "@pimolu/react";
export function DemoExample() {
  const [narrow, setNarrow] = useState(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(() => {
      setNarrow((value) => !value);
      setPending(false);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [pending]);
  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setPending(true)} disabled={pending}>
        Resize in two seconds
      </Button>
      <p>
        Start the resize, then open the menu. Its width follows the field while
        it stays open.
      </p>
      <div style={{ width: narrow ? 180 : 320, maxWidth: "100%" }}>
        <Select label="Workspace" defaultValue="studio" fullWidth>
          <option value="studio">Studio</option>
          <option value="personal">Personal</option>
          <option value="team">Team</option>
        </Select>
      </div>
    </div>
  );
}
