"use client";

import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@pimolu/react";

export function DemoExample() {

return (<NavigationMenu aria-label="Direct destinations"><NavigationMenuList><NavigationMenuItem value="0"><NavigationMenuLink href="/docs" target="_top">Documentation</NavigationMenuLink></NavigationMenuItem><NavigationMenuItem value="1"><NavigationMenuLink href="/components" target="_top">Component catalogue</NavigationMenuLink></NavigationMenuItem></NavigationMenuList></NavigationMenu>);
}
