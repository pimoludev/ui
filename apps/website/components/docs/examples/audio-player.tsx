"use client";

import { useState } from "react";
import { AudioPlayer, Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@pimolu/react";

export function DemoExample() {
  const [track, setTrack] = useState("action-game");
  return <div className="grid gap-6 sm:grid-cols-2">
    <Card><CardHeader><Badge appearance="soft">Pimolu / Play</Badge><CardTitle>Find your rhythm</CardTitle></CardHeader><CardContent>
      <AudioPlayer key={track} src={`/sounds/${track}.mp3`} title={track === "action-game" ? "Action game" : "Pixel art game"} subtitle="Local soundtrack" preload="none" />
      <div className="mt-5 flex flex-wrap gap-3"><Button appearance="outline" aria-pressed={track === "action-game"} onClick={() => setTrack("action-game")}>Action game</Button><Button appearance="outline" aria-pressed={track === "pixel-art-game"} onClick={() => setTrack("pixel-art-game")}>Pixel art game</Button></div>
    </CardContent></Card>
    <Card><CardHeader><CardTitle>A moment to play</CardTitle></CardHeader><CardContent><AudioPlayer src="/sounds/pixel-art-game.mp3" title="Pixel art game" subtitle="Volume and timeline controls" preload="none" /></CardContent></Card>
  </div>;
}
