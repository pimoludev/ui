import { CustomizationExample } from "./toast-customization-demo";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  toast,
} from "@pimolu/react";

import { toastVariants } from "../demo-data";
import { PageHeader, Section } from "../section";

const descriptions: Record<string, string> = {
  default: "A neutral notification.",
  success: "The deployment finished.",
  warning: "The token is close to its limit.",
  danger: "The deployment failed.",
};

export function ToastPage() {
  return (
    <>
      <PageHeader
        title="Toast"
        hint="Temporary notifications rendered by the global Toaster. Toasts live in an external store, survive page changes, auto-dismiss after a duration, and can carry an action. The live region is polite and each toast has an explicit close button. Styles come from @pimolu/web-styles/toast.css."
      />

      <Section
        title="Variants"
        hint="Enumerated from toastVariantMap. The Toaster is mounted once by the playground shell."
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
          onClick={() =>
            toast({
              title: "Project archived",
              description: "You can restore it from the trash.",
              duration: 6000,
              action: {
                label: "Undo",
                onClick: () => {},
              },
            })
          }
        >
          Archive project
        </Button>
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
                onClick={() =>
                  toast({
                    title: "Draft saved",
                    duration: 0,
                    action: {
                      label: "Undo",
                      onClick: () => {},
                    },
                  })
                }
              >
                Save draft
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
