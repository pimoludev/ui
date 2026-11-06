"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Image,
} from "@pimolu/react";

export function MagazineBlogBlock() {
  const [category, setCategory] = useState("All");
  const [article, setArticle] = useState<string | null>(null);
  const posts = [
    {
      title: "A slower kind of studio",
      category: "Spaces",
      image: "/images/blocks/studio-office.jpg",
      text:
        "A good workspace starts with light, space and a place to think. " +
        "Choose a few objects that serve your daily work, then let the " +
        "room breathe.",
    },
    {
      title: "Listening is a creative practice",
      category: "Objects",
      image: "/images/pimolu-studio.webp",
      text:
        "The objects we keep close shape our routines. Make room for " +
        "focused work, a favorite record and the pauses between ideas.",
    },
    {
      title: "Room for a new perspective",
      category: "Spaces",
      image: "/images/pimolu-atmosphere.webp",
      text:
        "A change in perspective can begin with a small experiment. " +
        "Sketch the unlikely idea, take a different route, and notice " +
        "what changes.",
    },
  ];
  return (
    <section className="mx-auto max-w-5xl space-y-8 p-6 sm:p-10">
      <header className="space-y-4">
        <Badge>THE WEEKEND JOURNAL</Badge>
        <h2 className="font-serif text-3xl sm:text-5xl">
          Notes from
          <br />a curious life.
        </h2>
      </header>
      <div className="flex flex-wrap gap-2">
        {["All", "Spaces", "Objects"].map((x) => (
          <Button
            key={x}
            aria-pressed={category === x}
            appearance={category === x ? "solid" : "ghost"}
            onClick={() => setCategory(x)}
          >
            {x}
          </Button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {posts
          .filter((p) => category === "All" || p.category === category)
          .map((p) => (
            <Card key={p.title} className="space-y-4 p-4">
              <Image
                src={p.image}
                alt=""
                aspectRatio="4 / 3"
                containerStyle={{
                  width: "100%",
                }}
              />
              <Badge>{p.category}</Badge>
              <h3 className="text-xl font-medium">{p.title}</h3>
              <Button
                appearance="ghost"
                onClick={(event) => {
                  event.currentTarget.focus();
                  setArticle(p.title);
                }}
              >
                Read {p.title}
              </Button>
            </Card>
          ))}
      </div>
      <Dialog
        open={article !== null}
        onOpenChange={(v) => {
          if (!v) setArticle(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{article}</DialogTitle>
          </DialogHeader>
          <p className="leading-relaxed">
            {posts.find((p) => p.title === article)?.text}
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
