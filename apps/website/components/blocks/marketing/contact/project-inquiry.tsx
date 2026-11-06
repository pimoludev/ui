"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Textarea,
} from "@pimolu/react";

export function ProjectInquiryBlock() {
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto grid max-w-5xl gap-8 p-5 sm:p-8 md:grid-cols-2">
      <header className="space-y-5">
        <Badge variant="success">Open for a conversation</Badge>
        <h2 className="text-4xl font-medium">
          Tell us what
          <br />
          you have in mind.
        </h2>
        <p className="max-w-sm text-muted">
          A new product, a fresh direction or a detail worth getting right. Start with a
          few words.
        </p>
      </header>
      <Card size="lg">
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              setMessage(
                `Brief prepared for ${data.get("name")}: ${data.get("projectType")}. Local preview; nothing sent.`,
              );
            }}
          >
            <Input name="name" label="Your name" required fullWidth />
            <Input name="email" type="email" label="Contact email" required fullWidth />
            <Select
              name="projectType"
              label="Project type"
              defaultValue="Product design"
              fullWidth
            >
              <option>Product design</option>
              <option>Website</option>
              <option>Design system</option>
            </Select>
            <Textarea
              name="brief"
              label="A few words about your project"
              required
              minLength={10}
              rows={4}
              fullWidth
            />
            <Button type="submit" fullWidth>
              Prepare inquiry
            </Button>
            <p role="status" className="text-sm text-muted">
              {message || "This demo does not contact a team."}
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
