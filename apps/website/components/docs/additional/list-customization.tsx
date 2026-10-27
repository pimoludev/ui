"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  List,
  ListItem
} from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
          >
            <Card>
              <CardHeader>
                <CardTitle>plain</CardTitle>
              </CardHeader>
              <CardContent>
                <List
                  variant="plain"
                  classNames={{
                    root: "custom-list-root",
                    title: "custom-list-title"
                  }}
                >
                  <ListItem title="Design tokens" description="Colours and spacing" />
                  <ListItem title="Themes" description="Light and dark" />
                </List>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>divided</CardTitle>
              </CardHeader>
              <CardContent>
                <List
                  variant="divided"
                  classNames={{
                    root: "custom-list-root",
                    title: "custom-list-title"
                  }}
                >
                  <ListItem title="Design tokens" description="Colours and spacing" />
                  <ListItem title="Themes" description="Light and dark" />
                </List>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>bordered</CardTitle>
              </CardHeader>
              <CardContent>
                <List
                  variant="bordered"
                  classNames={{
                    root: "custom-list-root",
                    title: "custom-list-title"
                  }}
                >
                  <ListItem title="Design tokens" description="Colours and spacing" />
                  <ListItem title="Themes" description="Light and dark" />
                </List>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-5 min-w-0">
            <div className="grid gap-5 min-w-0">
              <span className="text-sm text-muted leading-relaxed">sm</span>
              <List
                size="sm"
                variant="divided"
                classNames={{
                  root: "custom-list-root",
                  title: "custom-list-title"
                }}
              >
                <ListItem title="Design tokens" description="Colours and spacing" />
                <ListItem title="Themes" description="Light and dark" />
              </List>
            </div>
            <div className="grid gap-5 min-w-0">
              <span className="text-sm text-muted leading-relaxed">md</span>
              <List
                size="md"
                variant="divided"
                classNames={{
                  root: "custom-list-root",
                  title: "custom-list-title"
                }}
              >
                <ListItem title="Design tokens" description="Colours and spacing" />
                <ListItem title="Themes" description="Light and dark" />
              </List>
            </div>
            <div className="grid gap-5 min-w-0">
              <span className="text-sm text-muted leading-relaxed">lg</span>
              <List
                size="lg"
                variant="divided"
                classNames={{
                  root: "custom-list-root",
                  title: "custom-list-title"
                }}
              >
                <ListItem title="Design tokens" description="Colours and spacing" />
                <ListItem title="Themes" description="Light and dark" />
              </List>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-list-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-list-title {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
