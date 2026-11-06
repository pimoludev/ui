"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
} from "@pimolu/react";

const questions = [
  {
    id: "start",
    title: "Can I try it with my team?",
    answer:
      "Start with a small project, invite a few teammates and adapt the workspace together. Replace this sample answer with your product policy.",
  },
  {
    id: "import",
    title: "Can we bring our existing projects?",
    answer:
      "Plan an import flow for your existing data. This composition supplies the FAQ interface; it does not include an import service.",
  },
  {
    id: "cancel",
    title: "What happens if we change plans?",
    answer:
      "Explain your billing and cancellation terms here, including access to existing work and data exports.",
  },
  {
    id: "support",
    title: "Where can we get help?",
    answer:
      "Add your actual support channels, response expectations and documentation links to this answer.",
  },
];

export function ProductQuestionsBlock() {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 p-5 sm:p-10 md:grid-cols-2">
      <header className="space-y-4">
        <Badge variant="primary">A little clarity</Badge>
        <h2 className="text-3xl font-medium">
          Good questions.
          <br />
          Straight answers.
        </h2>
        <p className="text-muted">The essentials, before your next step.</p>
      </header>
      <Accordion collapsible defaultValue="start">
        {questions.map((question) => (
          <AccordionItem key={question.id} value={question.id}>
            <AccordionTrigger>{question.title}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm leading-relaxed text-muted">{question.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
