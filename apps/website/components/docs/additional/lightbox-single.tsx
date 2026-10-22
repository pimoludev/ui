"use client";

import { useState } from "react";
import { Button, Lightbox } from "@pimolu/react";

export function DemoExample() {
const [open, setOpen] = useState(false);
return (<div><Button onClick={() => setOpen(true)}>Inspect product image</Button><Lightbox open={open} onOpenChange={setOpen} images={[{src:"/images/pimolu-studio.webp",alt:"Pimolu Studio headphones with the p emblem",caption:"Original Pimolu Studio product visual"}]} closeOnOverlayClick={false} /></div>);
}
