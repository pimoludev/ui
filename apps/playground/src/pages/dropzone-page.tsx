import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dropzone,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";
import {
  previewImageFile,
  previewPdfFile,
} from "../demo-files";

function BrandAssets() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="pg-stack">
      <Dropzone
        label="Brand assets"
        description="SVG, PNG, JPG or WEBP. Drop up to 6 files, 8 MB each."
        accept=".svg,image/png,image/jpeg,image/webp"
        multiple
        maxFiles={6}
        maxSize={8 * 1024 * 1024}
        files={files}
        onFilesChange={setFiles}
        validateFile={(file) =>
          file.name.toLowerCase().includes("placeholder")
            ? "Replace placeholder files with the final export."
            : null
        }
      />

      <div className="pg-row pg-row--between">
        <Badge
          variant={files.length === 0 ? "neutral" : "primary"}
        >
          {files.length === 0
            ? "Brand kit empty"
            : `${files.length} asset(s) added`}
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

export function DropzonePage() {
  return (
    <>
      <PageHeader
        title="Dropzone"
        hint="A drag-and-drop file zone that also opens the native picker on click, Enter or Space. The active drag state is visual, non-file drags are ignored and the same accept, multiple, maxFiles, maxSize and validateFile rules protect every entry point. Styles come from @pimolu/web-styles/dropzone.css."
      />

      <Section
        title="Controlled"
        hint="files and onFilesChange own the list. The zone stays visible so more assets can be added."
      >
        <div className="pg-grid pg-grid--two">
          <Card>
            <CardHeader>
              <CardTitle>Upload a brand kit</CardTitle>
              <CardDescription>
                Drag the exports into the zone or browse. A
                placeholder export is rejected with an
                explanation.
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
                multiple=false replaces the current image and
                keeps the zone ready for another drop.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Dropzone
                label="Team avatar"
                description="A square PNG or JPG, up to 2 MB."
                accept="image/png,image/jpeg"
                multiple={false}
                maxSize={2 * 1024 * 1024}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Image previews"
        hint="Dropped or selected images show a thumbnail from a local object URL; other files keep the document icon. showPreviews={false} opts out."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Press assets</CardTitle>
              <CardDescription>
                An SVG cover and a PDF fact sheet in the same
                dropzone.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Dropzone
                label="Press kit"
                description="SVG, PNG, JPG or PDF, up to 6 files."
                accept=".pdf,image/*"
                maxFiles={6}
                defaultFiles={[
                  previewImageFile,
                  previewPdfFile,
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Previews disabled</CardTitle>
              <CardDescription>
                showPreviews=false keeps the icon-only list.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Dropzone
                label="Archive"
                description="Images are listed without thumbnails."
                accept="image/*"
                defaultFiles={[previewImageFile]}
                showPreviews={false}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Uncontrolled"
        hint="defaultFiles seeds the list and the component keeps the next value itself."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Press kit</CardTitle>
              <CardDescription>
                Logos, screenshots and a fact sheet.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Dropzone
                label="Press kit files"
                description="PDF, PNG or JPG, up to 12 MB each."
                accept=".pdf,image/png,image/jpeg"
                maxFiles={5}
                maxSize={12 * 1024 * 1024}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice scan</CardTitle>
              <CardDescription>
                One PDF or image, with a per-file check.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Dropzone
                label="Invoice"
                description="PDF, PNG or JPG, up to 6 MB."
                accept=".pdf,image/png,image/jpeg"
                multiple={false}
                maxSize={6 * 1024 * 1024}
                validateFile={(file) =>
                  file.size === 0
                    ? "The file is empty."
                    : null
                }
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="States"
        hint="An external error marks the zone invalid; disabled keeps it visible but inert."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Required</CardTitle>
              <CardDescription>
                The audit needs at least one export.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Dropzone
                label="Accessibility audit"
                description="PDF or PNG."
                accept=".pdf,image/png"
                error="Drop the signed audit before continuing."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disabled</CardTitle>
              <CardDescription>
                Uploads are closed while the campaign runs.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Dropzone
                label="Campaign assets"
                description="Uploads reopen next Monday."
                disabled
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Example: design handoff"
        hint="A dropzone replaces a plain file field when the source of the assets is a design tool."
      >
        <Card>
          <CardHeader>
            <CardTitle>Hand off the final screens</CardTitle>
            <CardDescription>
              Drop the exported frames, then add a short note for
              the engineering team.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <BrandAssets />
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
