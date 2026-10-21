"use client";

import { useState } from "react";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@pimolu/react";

export function DemoExample() {
const [action, setAction] = useState("Aucune commande sélectionnée");
return (<div className="pg-stack"><Menubar label="Édition"><MenubarMenu><MenubarTrigger>Fichier</MenubarTrigger><MenubarContent><MenubarItem onSelect={() => setAction("Brouillon créé")}>Nouveau brouillon</MenubarItem><MenubarItem disabled>Imprimer</MenubarItem></MenubarContent></MenubarMenu></Menubar><p role="status">{action}</p></div>);
}
