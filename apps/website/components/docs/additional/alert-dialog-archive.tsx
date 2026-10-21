"use client";

import { useState } from "react";
import { Button, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@pimolu/react";

export function DemoExample() {
const [archived, setArchived] = useState(false);
return (<div className="pg-stack"><AlertDialog><AlertDialogTrigger><Button appearance="outline">Archive workspace</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Archive this workspace?</AlertDialogTitle><AlertDialogDescription>You can restore it later. This preview only changes local state.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel><Button appearance="outline">Keep workspace</Button></AlertDialogCancel><AlertDialogAction><Button onClick={() => setArchived(true)}>Archive</Button></AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog><p role="status">{archived ? "Workspace archived." : "Workspace active."}</p></div>);
}
