"use client";

import { Button, toast, Toaster } from "@pimolu/react";

export function DemoExample() {

return (<div><Button onClick={() => toast({title:"Persistent warning", description:"Local documentation notification.", variant:"warning", duration:0})}>Show notification</Button><Toaster position="bottom-right" label="Example notifications" /></div>);
}
