"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  Button,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="danger" appearance="soft">Delete workspace</Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              classNames={{
                root: "custom-alert-dialog-root",
                content: "custom-alert-dialog-content"
              }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
                <AlertDialogDescription>
                  Every project, deployment and token in this workspace will be
                  removed. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <Button appearance="outline">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction>
                  <Button variant="danger">Delete permanently</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>)
      }
      <style>
        {
          `
.custom-alert-dialog-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-alert-dialog-content {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
