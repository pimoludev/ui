import { CustomizationExample } from "./textarea-customization-demo";
import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Textarea,
} from "@pimolu/react";

import {
  textareaAppearances,
  textareaResizes,
  textareaSizes,
  textareaVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

function CommentExample() {
  const [comment, setComment] = useState("");

  return (
    <div className="pg-stack">
      <Textarea
        aria-label="Your comment"
        placeholder="Write a comment…"
        value={comment}
        onValueChange={setComment}
        maxLength={280}
        showCount
        rows={3}
        resize="none"
        fullWidth
      />

      <div className="pg-row pg-row--between">
        <span className="pg-meta">
          {comment.length === 0
            ? "Nothing to send yet."
            : "Ready to send."}
        </span>

        <Button size="sm" disabled={comment.length === 0}>
          Send
        </Button>
      </div>
    </div>
  );
}

export function TextareaPage() {
  return (
    <>
      <PageHeader
        title="Textarea"
        hint="A multi-line text field with the same conventions as Input. Sizes, variants, appearances and resize modes are enumerated from textareaVariantMap; the styles come from @pimolu/web-styles/textarea.css."
      />

      <Section
        title="Sizes"
        hint="From xs to xxl."
      >
        <div className="pg-stack">
          {textareaSizes.map((size) => (
            <Textarea
              key={size}
              size={size}
              label={size}
              placeholder="Placeholder"
              rows={2}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The semantic tone of the field."
      >
        <div className="pg-stack">
          {textareaVariants.map((variant) => (
            <Textarea
              key={variant}
              variant={variant}
              label={variant}
              placeholder="Placeholder"
              rows={2}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Appearances"
        hint="Outline, soft, filled and glass."
      >
        <div className="pg-stack">
          {textareaAppearances.map((appearance) => (
            <Textarea
              key={appearance}
              appearance={appearance}
              label={appearance}
              placeholder="Placeholder"
              rows={2}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Resize"
        hint="The native resize handle, controlled by CSS only."
      >
        <div className="pg-stack">
          {textareaResizes.map((resize) => (
            <Textarea
              key={resize}
              resize={resize}
              label={resize}
              placeholder="Drag the corner"
              rows={2}
            />
          ))}
        </div>
      </Section>

      <Section
        title="States and content"
        hint="Helper, error, invalid, required, disabled, read-only, counter and full width."
      >
        <div className="pg-stack">
          <Textarea
            label="With helper text"
            placeholder="Describe your project…"
            helperText="Explain what your application does."
            rows={2}
          />

          <Textarea
            label="With error"
            defaultValue="Too short"
            errorMessage="Please write at least 20 characters."
            rows={2}
          />

          <Textarea
            label="Invalid without message"
            invalid
            rows={2}
          />

          <Textarea
            label="Required"
            required
            rows={2}
          />

          <Textarea
            label="Disabled"
            disabled
            defaultValue="Unavailable"
            rows={2}
          />

          <Textarea
            label="Read only"
            readOnly
            defaultValue="This value cannot be edited."
            rows={2}
          />

          <Textarea
            label="With counter"
            maxLength={120}
            showCount
            rows={2}
          />

          <Textarea
            label="Full width"
            fullWidth
            showCount
            rows={2}
          />
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
              <CardDescription>
                A message field with a limit and a live count.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                label="Message"
                placeholder="How can we help?"
                helperText="We usually answer within a day."
                maxLength={500}
                showCount
                rows={5}
                fullWidth
              />
            </CardContent>
            <CardFooter>
              <Button size="sm">Send message</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project description</CardTitle>
              <CardDescription>
                A fixed-height field with a filled surface.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                label="Description"
                appearance="filled"
                resize="none"
                defaultValue="Pimolu is a cross-platform design system."
                helperText="Visible on your public profile."
                rows={4}
                fullWidth
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comment</CardTitle>
              <CardDescription>
                A controlled field where the count drives the action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommentExample />
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
