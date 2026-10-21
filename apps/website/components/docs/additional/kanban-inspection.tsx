"use client";

import { useState } from "react";
import { Kanban } from "@pimolu/react";

export function DemoExample() {
const [selected, setSelected] = useState("Activate a card to inspect it.");
return (<div className="pg-stack"><Kanban defaultColumns={[{id:"inbox",title:"Inbox",cards:[{id:"review",title:"Review contrast",priority:"high"}]},{id:"done",title:"Reviewed",cards:[]}]} onCardClick={(card) => setSelected(card.title)} aria-label="Accessibility review board" /><p role="status">{selected}</p></div>);
}
