import { CustomizationExample } from "./toast-customization-demo";
import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  toast,
  Toaster,
  Select,
  type PimoluToastPosition,
} from "@pimolu/react";

import { toastVariants } from "../demo-data";
import { PageHeader, Section } from "../section";

const descriptions: Record<string, string> = {
  default: "A neutral notification.",
  success: "The deployment finished.",
  warning: "The token is close to its limit.",
  danger: "The deployment failed.",
  info: "A new workspace update is available.",
  loading: "Waiting for the operation to finish. Dismiss to cancel this notification.",
};

export function ToastPage() {
  const [pending, setPending] = useState<string>();
  const [archived, setArchived] = useState(false);
  const [saved, setSaved] = useState(false);
  const [position, setPosition] = useState<PimoluToastPosition>("bottom-right");
  const [lastDismissed, setLastDismissed] = useState("No notifications dismissed yet.");
  return (
    <>
      <PageHeader
        title="Toast"
        hint="Temporary notifications with semantic icons, persistent loading states, promises and actions. Mount one Toaster; notifications pause while hovered or focused."
      />

      <Section
        title="Variants"
        hint="Enumerated from toastVariantMap. This page mounts one Toaster with a configurable position."
      >
        <div className="pg-row">
          {toastVariants.map((variant) => (
            <Button
              key={variant}
              variant={variant === "danger" ? "danger" : "primary"}
              appearance={variant === "default" ? "outline" : "soft"}
              onClick={() =>
                toast({
                  title: `${variant} toast`,
                  description: descriptions[variant],
                  variant,
                  duration: 4000,
                })
              }
            >
              {variant}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Loading and updates" hint="Loading does not expire. Complete the operation to update the same notification and start its dismissal delay.">
        <div className="pg-row">
          <Button onClick={() => setPending(toast.loading("Uploading the project…", {
            id: "project-upload", description: "Keep working while your files are prepared.",
          }))}>Start upload</Button>
          <Button appearance="outline" disabled={!pending} onClick={() => {
            if (pending) toast.update(pending, { title: "Project uploaded", description: "All files are ready to share.", variant: "success" });
            setPending(undefined);
          }}>Complete upload</Button>
          <Button appearance="ghost" disabled={!pending} onClick={() => {
            if (pending) toast.dismiss(pending);
            setPending(undefined);
          }}>Dismiss upload</Button>
        </div>
      </Section>

      <Section title="Promise feedback" hint="One notification follows a local asynchronous task. Both success and rejection replace loading in place.">
        <div className="pg-row">
          <Button onClick={() => toast.promise(new Promise<string>((resolve) => {
            setTimeout(() => resolve("Quarterly report"), 1600);
          }), { loading: "Preparing your export…", success: (name) => `${name} is ready`, error: "Export failed" })}>Export report</Button>
          <Button appearance="outline" onClick={() => toast.promise(new Promise((_, reject) => {
            setTimeout(() => reject(new Error("The connection was interrupted.")), 1600);
          }), { loading: "Connecting…", success: "Connected", error: (error) => error instanceof Error ? error.message : "Connection failed" })}>Simulate a failure</Button>
        </div>
      </Section>

      <Section title="Icons and controls" hint="Use a decorative custom icon, hide it with icon: null, localize dismissal or complete a non-dismissible notification programmatically.">
        <div className="pg-row">
          <Button appearance="outline" onClick={() => toast({ title: "Invitation received", icon: <span>✉</span>, dismissLabel: "Close invitation" })}>Custom icon</Button>
          <Button appearance="outline" onClick={() => toast.info("A quiet update", { icon: null })}>Without icon</Button>
          <Button appearance="outline" onClick={() => toast.success("Preferences saved", { dismissible: false, duration: 2500 })}>Without close button</Button>
          <Button appearance="outline" onClick={() => toast.warning("Not paused by pointer", { pauseOnHover: false, pauseOnFocus: false })}>Disable timer pause</Button>
          <Button appearance="ghost" onClick={() => toast.dismiss()}>Dismiss all</Button>
          <Button appearance="outline" onClick={() => toast.info("Dismissal feedback", {
            onDismiss: () => setLastDismissed("The notification was dismissed."),
          })}>Track dismissal</Button>
        </div>
        <p className="pg-muted" role="status">{lastDismissed}</p>
      </Section>

      <Section title="Position" hint="Left/right positions follow writing direction; centered notifications stay centered in RTL too.">
        <Select label="Notification position" value={position} onValueChange={(value) => setPosition(value as PimoluToastPosition)}>
          <option value="top-left">Top start</option>
          <option value="top-center">Top center</option>
          <option value="top-right">Top end</option>
          <option value="bottom-left">Bottom start</option>
          <option value="bottom-center">Bottom center</option>
          <option value="bottom-right">Bottom end</option>
        </Select>
        <Button appearance="outline" onClick={() => toast.info("Your notification appears here", { duration: 3000 })}>Show position</Button>
      </Section>

      <Section
        title="Duration"
        hint="duration is in milliseconds; 0 keeps the toast until it is dismissed."
      >
        <div className="pg-row">
          <Button
            appearance="outline"
            onClick={() =>
              toast({
                title: "Short",
                description: "Gone in one second.",
                duration: 1000,
              })
            }
          >
            1 second
          </Button>

          <Button
            appearance="outline"
            onClick={() =>
              toast({
                title: "Persistent",
                description: "Close it with the X button.",
                duration: 0,
              })
            }
          >
            duration 0
          </Button>
        </div>
      </Section>

      <Section
        title="Action"
        hint="The action runs before the toast dismisses."
      >
        <Button
          appearance="outline"
          onClick={() => {
            setArchived(true);
            toast({
              title: "Project archived",
              description: "You can restore it from the trash.",
              duration: 6000,
              action: {
                label: "Undo",
                onClick: () => setArchived(false),
              },
            });
          }}
        >
          Archive project
        </Button>
        <p className="pg-muted" role="status">{archived ? "Project archived." : "Project available."}</p>
      </Section>

      <Section
        title="Examples"
        hint="Real notifications usually combine a variant, a description and an action."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Deployment</CardTitle>
              <CardDescription>
                Success and failure use the semantic tones.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-row">
                <Button
                  size="sm"
                  onClick={() =>
                    toast({
                      title: "Deployment ready",
                      description: "production · fde3d86",
                      variant: "success",
                    })
                  }
                >
                  Success
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  appearance="soft"
                  onClick={() =>
                    toast({
                      title: "Deployment failed",
                      description: "Check the build logs.",
                      variant: "danger",
                    })
                  }
                >
                  Failure
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Save with undo</CardTitle>
              <CardDescription>
                A reversible action with a persistent toast.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                size="sm"
                appearance="outline"
                onClick={() => {
                  setSaved(true);
                  toast({
                    title: "Draft saved",
                    duration: 0,
                    action: {
                      label: "Undo",
                      onClick: () => setSaved(false),
                    },
                  });
                }}
              >
                Save draft
              </Button>
              <p className="pg-muted" role="status">{saved ? "Draft saved." : "Unsaved draft."}</p>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
    <Toaster position={position} />
</>
  );
}
