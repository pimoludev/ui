"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Dropzone,
  Badge,
  Button
} from "@pimolu/react";
import { useState } from "react";

function BrandAssets() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="grid gap-5 min-w-0">
      <Dropzone
        label="Brand assets"
        description="SVG, PNG, JPG or WEBP. Drop up to 6 files, 8 MB each."
        accept=".svg,image/png,image/jpeg,image/webp"
        multiple
        maxFiles={6}
        maxSize={8 * 1024 * 1024}
        files={files}
        onFilesChange={setFiles}
        validateFile={(file) => file.name.toLowerCase().includes("placeholder")
          ? "Replace placeholder files with the final export."
          : null}
        classNames={{
          root: "custom-dropzone-root",
          label: "custom-dropzone-label"
        }}
      />
      <div className="flex flex-wrap items-center gap-3 min-w-0 justify-between">
        <Badge variant={files.length === 0 ? "neutral" : "primary"}>
          {
            files.length === 0
              ? "Brand kit empty"
              : `${files.length} asset(s) added`
          }
        </Badge>
        <Button
          type="button"
          size="sm"
          appearance="ghost"
          disabled={files.length === 0}
          onClick={() => setFiles([])}
        >
          Clear assets
        </Button>
      </div>
    </div>
  );
}

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0"
          >
            <Card>
              <CardHeader>
                <CardTitle>Upload a brand kit</CardTitle>
                <CardDescription>
                  Drag the exports into the zone or browse. A placeholder export
                  is rejected with an explanation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BrandAssets />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>One avatar</CardTitle>
                <CardDescription>
                  multiple=false replaces the current image and keeps the zone
                  ready for another drop.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dropzone
                  label="Team avatar"
                  description="A square PNG or JPG, up to 2 MB."
                  accept="image/png,image/jpeg"
                  multiple={false}
                  maxSize={2 * 1024 * 1024}
                  classNames={{
                    root: "custom-dropzone-root",
                    label: "custom-dropzone-label"
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-dropzone-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-dropzone-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
