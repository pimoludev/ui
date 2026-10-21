"use client";

import { Button, toast, Toaster } from "@pimolu/react";

export function DemoExample() {

return (<div><Button onClick={() => toast({title:"Brief status update", description:"Local documentation notification.", variant:"default", duration:1500})}>Show notification</Button><Toaster position="bottom-right" label="Example notifications" /></div>);
}
