"use client";
import { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@pimolu/react";
export function DemoExample() {
  const [showCancel, setShowCancel] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <Checkbox
        label="Show the optional cancel action"
        checked={showCancel}
        onCheckedChange={setShowCancel}
      />
      <Dialog>
        <DialogTrigger>
          <Button>Review settings</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Ready to save?</DialogTitle>
          <p>
            Tab and Shift+Tab stay on visible actions. Escape closes this
            dialog.
          </p>
          <DialogFooter>
            <DialogClose>
              <Button
                appearance="ghost"
                style={{ display: showCancel ? undefined : "none" }}
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose>
              <Button>Save settings</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
