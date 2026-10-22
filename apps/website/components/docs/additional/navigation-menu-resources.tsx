"use client";

import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent } from "@pimolu/react";

export function DemoExample() {

return (<NavigationMenu aria-label="Resource directory"><NavigationMenuList><NavigationMenuItem value="resources"><NavigationMenuTrigger>Resources</NavigationMenuTrigger><NavigationMenuContent><NavigationMenuLink href="/docs/installation" target="_top">Installation</NavigationMenuLink><NavigationMenuLink href="/docs/theming" target="_top">Themes</NavigationMenuLink></NavigationMenuContent></NavigationMenuItem></NavigationMenuList></NavigationMenu>);
}
