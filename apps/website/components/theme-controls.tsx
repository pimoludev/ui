"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, usePimoluTheme, type PimoluStylePreset } from "@pimolu/react";
import { presetNames } from "@/lib/preferences";

export function ThemeControls() {
  const { stylePreset, setStylePreset } = usePimoluTheme();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-5">
        <h2 className="text-2xl">Make it yours.</h2>
        <p className="text-muted leading-relaxed">Choose a visual preset. Your preference applies across the site and is remembered on your next visit.</p>
        <Select label="Visual preset" value={stylePreset} onValueChange={(value) => setStylePreset(value as PimoluStylePreset)} fullWidth>
          {presetNames.map((preset) => <option value={preset} key={preset}>{preset}</option>)}
        </Select>
      </div>
      <Card>
        <CardHeader><CardTitle>Your next project</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); setMessage(`Ready to build ${name.trim() || "something new"}.`); }}>
            <Input label="Project name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Studio workspace" />
            <Button type="submit">Try this style</Button>
            <p role="status" className="min-h-6 text-sm text-muted">{message}</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
