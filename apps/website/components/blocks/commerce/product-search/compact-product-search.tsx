"use client";

import { useState } from "react";
import { Badge, Button, Card, SearchInput, Select } from "@pimolu/react";

export function CompactProductSearchBlock() {
  const [message, setMessage] = useState("");
  const products = [
    {
      id: "studio",
      name: "Studio Headphones",
      price: 129,
      image: "/images/pimolu-studio.webp",
      category: "Audio",
    },
    {
      id: "orbit",
      name: "Orbit Art Print",
      price: 39,
      image: "/images/pimolu-atmosphere.webp",
      category: "Art",
    },
    {
      id: "edition",
      name: "Studio Limited",
      price: 159,
      image: "/images/pimolu-studio.webp",
      category: "Audio",
    },
  ];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const visible = products
    .filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.name.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "Price ascending"
        ? a.price - b.price
        : sort === "Price descending"
          ? b.price - a.price
          : 0,
    );
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Product search
        </h2>
      </header>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted">Popular searches</span>
        {["Studio", "Orbit", "Limited"].map((term) => (
          <Button
            key={term}
            appearance="ghost"
            onClick={() => {
              setQuery(term);
              setCategory("All");
            }}
          >
            {term}
          </Button>
        ))}
      </div>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
          <SearchInput
            label="Find a product"
            value={query}
            onValueChange={setQuery}
            className="w-full"
          />
          <Select
            label="Product category"
            value={category}
            onValueChange={setCategory}
            fullWidth
          >
            {["All", "Audio", "Art"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          <Select label="Sort products" value={sort} onValueChange={setSort} fullWidth>
            {["Featured", "Price ascending", "Price descending"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-3">
          {visible.map((p) => (
            <Card
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div>
                <Badge>{p.category}</Badge>
                <h3 className="mt-2 text-xl">{p.name}</h3>
              </div>
              <p>{"$" + p.price}</p>
              <Button
                appearance="outline"
                onClick={() => setMessage(p.name + " added locally.")}
              >
                Add {p.name}
              </Button>
            </Card>
          ))}
        </div>
      </div>
      {visible.length === 0 && (
        <Card className="space-y-3 p-6">
          <h3>No products found</h3>
          <Button
            appearance="outline"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Reset search
          </Button>
        </Card>
      )}
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
