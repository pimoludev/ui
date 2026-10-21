"use client";

import { useState } from "react";
import { Button, Lightbox } from "@pimolu/react";

export function DemoExample() {
const [open, setOpen] = useState(false);
return (<div><Button onClick={() => setOpen(true)}>Inspect product image</Button><Lightbox open={open} onOpenChange={setOpen} images={[{src:"/demos/product.svg",alt:"Pimolu product illustration",caption:"Product illustration from the local demo assets"}]} closeOnOverlayClick={false} /></div>);
}
