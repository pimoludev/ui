"use client";

import { useState } from "react";
import { Avatar, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@pimolu/react";

export function CardExample() {
  const [saved, setSaved] = useState(false);
  return <div className="space-y-6">
    <Card appearance="outline" size="lg" fullWidth>
      <CardHeader><Avatar name="Morgan Lee" /><CardTitle className="mt-4">Room for a new idea.</CardTitle><CardDescription>A considered starting point for your next product.</CardDescription></CardHeader>
      <CardContent><Button aria-pressed={saved} onClick={() => setSaved(!saved)}>{saved ? "Saved to your ideas" : "Save this idea"}</Button></CardContent>
    </Card>
  </div>;
}
