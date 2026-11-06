"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Navbar,
  NavbarBrand,
  NavbarItem,
  NavbarMenu,
  NavbarToggle,
} from "@pimolu/react";

export function MarketNavigationNavbarBlock() {
  const [message, setMessage] = useState("");
  const [active, setActive] = useState("Overview");
  const [open, setOpen] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Navbar</h2>
      </header>
      <Navbar appearance="floating" collapsible open={open} onOpenChange={setOpen}>
        <NavbarBrand>
          <strong>Studio / Store</strong>
        </NavbarBrand>
        <NavbarToggle aria-label="Toggle block navigation" />
        <NavbarMenu>
          {["Overview", "Collections", "Updates"].map((x) => (
            <NavbarItem
              key={x}
              href={"#" + x.toLowerCase()}
              active={active === x}
              onClick={(event) => {
                event.preventDefault();
                setActive(x);
                setOpen(false);
              }}
            >
              {x}
            </NavbarItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <Card className="space-y-4 p-6 sm:p-10">
        <Badge>{active}</Badge>
        <h3 className="font-serif text-3xl">A considered collection.</h3>
        <p className="text-muted">
          Navigation switches this local panel. Replace these actions with your real
          application routes.
        </p>
        <Button
          appearance="outline"
          onClick={() => setMessage(active + " action completed locally.")}
        >
          Explore {active}
        </Button>
      </Card>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
