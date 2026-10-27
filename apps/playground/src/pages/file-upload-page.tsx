import { CustomizationExample } from "./file-upload-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FileUpload,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";
import {
  previewImageFile,
  previewPdfFile,
} from "../demo-files";

function RequestAttachments() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <form
      className="pg-stack"
      onSubmit={(event) => event.preventDefault()}
    >
      <FileUpload
        label="Project attachments"
        description="Brief, references and signed scope. PDF, PNG or JPG, up to 5 MB each."
        accept=".pdf,image/png,image/jpeg"
        multiple
        maxFiles={4}
        maxSize={5 * 1024 * 1024}
        files={files}
        onFilesChange={setFiles}
        validateFile={(file) =>
          file.name.toLowerCase().includes("draft")
            ? "Draft files cannot be submitted."
            : null
        }
      />

      <div className="pg-row pg-row--between">
        <span className="pg-meta">
          {files.length === 0
            ? "No attachment ready."
            : `${files.length} attachment(s) ready.`}
        </span>

        <div className="pg-row">
          <Button
            type="button"
            appearance="ghost"
            size="sm"
            disabled={files.length === 0}
            onClick={() => setFiles([])}
          >
            Clear
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={files.length === 0}
          >
            Submit request
          </Button>
        </div>
      </div>
    </form>
  );
}

function SinglePhoto() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="pg-stack">
      <FileUpload
        label="Profile photo"
        description="A square PNG or JPG, up to 2 MB. Choosing a new one replaces the current photo."
        accept="image/png,image/jpeg"
        multiple={false}
        maxSize={2 * 1024 * 1024}
        files={files}
        onFilesChange={setFiles}
        buttonLabel={
          files.length === 0
            ? "Choose a photo"
            : "Replace photo"
        }
      />

      <div className="pg-row">
        <Badge
          variant={files.length === 0 ? "neutral" : "success"}
        >
          {files.length === 0
            ? "Not provided"
            : "Photo ready"}
        </Badge>
      </div>
    </div>
  );
}

export function FileUploadPage() {
  return (
    <>
      <PageHeader
        title="FileUpload"
        hint="A click-to-select file field with an empty state, a selected-file list, accessible removal and per-file validation. Accept, multiple, maxFiles, maxSize and a custom validator are shared by the native picker and the reported rejections. Styles come from @pimolu/web-styles/file-upload.css."
      />

      <Section
        title="Controlled"
        hint="files and onFilesChange own the list; rejected files stay out of it and are explained below the field."
      >
        <div className="pg-grid pg-grid--two">
          <Card>
            <CardHeader>
              <CardTitle>Attach project files</CardTitle>
              <CardDescription>
                Four files at most, 5 MB each. Names containing
                “draft” are refused by validateFile.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <RequestAttachments />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Single photo</CardTitle>
              <CardDescription>
                multiple=false turns the trigger into a replace
                action and keeps one file.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SinglePhoto />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Image previews"
        hint="Image files show a local object URL thumbnail; other formats keep the document icon. showPreviews={false} restores the icon-only list."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Brand cover and notes</CardTitle>
              <CardDescription>
                The SVG is previewed; the PDF keeps the document
                icon until it is removed.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FileUpload
                label="Campaign assets"
                description="SVG, PNG or JPG, plus a short PDF."
                accept=".pdf,image/*"
                maxFiles={3}
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
                showPreviews=false keeps the compact file icon.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FileUpload
                label="Archive"
                description="The file list stays icon-only."
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
        hint="defaultFiles seeds the list; without a files prop the component owns every change and still calls onFilesChange."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Brand documents</CardTitle>
              <CardDescription>
                The field keeps its own list; the page only
                listens for a summary.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FileUpload
                label="Brand documents"
                description="Logos, typography and usage notes."
                accept=".pdf,.doc,.docx"
                maxFiles={3}
                maxSize={10 * 1024 * 1024}
                onFilesChange={() => undefined}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receipt</CardTitle>
              <CardDescription>
                A single image with the same validation surface.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FileUpload
                label="Receipt"
                description="PNG or JPG, up to 4 MB."
                accept="image/png,image/jpeg"
                multiple={false}
                maxSize={4 * 1024 * 1024}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="States"
        hint="An external error marks the field invalid; disabled removes the trigger, the input and every remove button from the form."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Required</CardTitle>
              <CardDescription>
                A submitted request needs at least one signed
                document.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FileUpload
                label="Signed contract"
                description="PDF only."
                accept=".pdf"
                multiple={false}
                error="A signed contract is required."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disabled</CardTitle>
              <CardDescription>
                The field is locked while the request is archived.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FileUpload
                label="Supporting files"
                description="Unavailable for archived requests."
                disabled
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Example: grant application"
        hint="A real form pairs the field with a clear limit and a primary action."
      >
        <Card>
          <CardHeader>
            <CardTitle>Apply for the community grant</CardTitle>
            <CardDescription>
              Attach the budget and two references. The application
              cannot be sent without them.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <RequestAttachments />
          </CardContent>
        </Card>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
