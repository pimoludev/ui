"use client";

import { useState } from "react";
import { Button, toast, Toaster } from "@pimolu/react";

export function DemoExample() {
const [archived, setArchived] = useState(false);
return (<div className="pg-stack"><Button disabled={archived} onClick={() => { setArchived(true); toast({title:"Draft archived", duration:0, action:{label:"Undo",onClick:() => setArchived(false)}}); }}>Archive draft</Button><p role="status">{archived ? "Draft archived." : "Draft available."}</p><Toaster position="bottom-right" label="Draft notifications" /></div>);
}
