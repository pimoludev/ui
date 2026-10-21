"use client";

import { useState } from "react";
import { Avatar, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, cardVariantMap, Select } from "@pimolu/react";

export function CardExample() {
  const [appearance, setAppearance] = useState<keyof typeof cardVariantMap.appearance>("outline");
  const [saved, setSaved] = useState(false);
  return <div className="space-y-6">
    <Select label="Surface" value={appearance} onValueChange={(value) => setAppearance(value as keyof typeof cardVariantMap.appearance)}>{Object.keys(cardVariantMap.appearance).map((value) => <option key={value} value={value}>{value}</option>)}</Select>
    <Card appearance={appearance} size="lg" fullWidth>
      <CardHeader><Avatar name="Morgan Lee" /><CardTitle className="mt-4">Room for a new idea.</CardTitle><CardDescription>A considered starting point for your next product.</CardDescription></CardHeader>
      <CardContent><Button aria-pressed={saved} onClick={() => setSaved(!saved)}>{saved ? "Saved to your ideas" : "Save this idea"}</Button></CardContent>
    </Card>
  </div>;
}
