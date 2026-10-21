"use client";

import { useState } from "react";
import { NotificationCenter } from "@pimolu/react";

export function DemoExample() {
const [items, setItems] = useState([{id:"review",title:"Review ready",description:"Two changes need a review.",read:false},{id:"invoice",title:"Invoice available",description:"Your billing summary is ready.",read:false}]);
return (<NotificationCenter notifications={items} showTabs onRead={(id) => setItems(items.map(item => item.id === id ? {...item,read:true} : item))} onReadAll={() => setItems(items.map(item => ({...item,read:true})))} onDismiss={(id) => setItems(items.filter(item => item.id !== id))} />);
}
