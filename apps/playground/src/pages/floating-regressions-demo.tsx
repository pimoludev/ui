import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  Popover,
  Select,
} from "@pimolu/react";

export function ResizingSelectExample() {
  const [narrow, setNarrow] = useState(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(() => {
      setNarrow((value) => !value);
      setPending(false);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [pending]);
  return (
    <div className="pg-stack">
      <Button onClick={() => setPending(true)} disabled={pending}>
        Resize in two seconds
      </Button>
      <p>
        Start the resize, then open the menu. Its width follows the field while
        it stays open.
      </p>
      <div style={{ width: narrow ? 180 : 320, maxWidth: "100%" }}>
        <Select label="Workspace" defaultValue="studio" fullWidth>
          <option value="studio">Studio</option>
          <option value="personal">Personal</option>
          <option value="team">Team</option>
        </Select>
      </div>
    </div>
  );
}

export function TallPopoverExample() {
  return (
    <Popover
      label="Release checklist"
      placement="right"
      content={
        <div className="pg-stack">
          <p>Release checklist</p>
          {Array.from({ length: 16 }, (_, index) => (
            <Checkbox key={index} label={`Review item ${index + 1}`} />
          ))}
        </div>
      }
    >
      <Button appearance="outline">Review the checklist</Button>
    </Popover>
  );
}

export function HiddenDialogActionExample() {
  const [showCancel, setShowCancel] = useState(false);
  return (
    <div className="pg-stack">
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
