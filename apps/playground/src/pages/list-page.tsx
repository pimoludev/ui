import { CustomizationExample } from "./list-customization-demo";
import { useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  List,
  ListItem,
} from "@pimolu/react";

import { listSizes, listVariants } from "../demo-data";
import { PageHeader, Section } from "../section";

function SelectableList() {
  const [selected, setSelected] = useState("tokens");

  const rows = [
    {
      id: "tokens",
      title: "Design tokens",
      description: "Primitives and semantic aliases",
    },
    {
      id: "themes",
      title: "Themes",
      description: "Light, dark and six presets",
    },
    {
      id: "components",
      title: "Components",
      description: "React, CSS and playground pages",
    },
  ];

  return (
    <div className="pg-stack">
      <Badge variant="primary">{selected}</Badge>

      <List variant="bordered">
        {rows.map((row) => (
          <ListItem
            key={row.id}
            title={row.title}
            description={row.description}
            active={selected === row.id}
            end={
              selected === row.id ? (
                <Badge variant="success">selected</Badge>
              ) : undefined
            }
            onClick={() => setSelected(row.id)}
          />
        ))}
      </List>
    </div>
  );
}

export function ListPage() {
  return (
    <>
      <PageHeader
        title="List"
        hint="A semantic list with plain, divided and bordered treatments, three densities, start/end slots and an optional interactive row. The row stays a real button when onClick is present. Styles come from @pimolu/web-styles/list.css."
      />

      <Section
        title="Variants and sizes"
        hint="Enumerated from listVariantMap: plain, divided and bordered; sm, md and lg."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          {listVariants.map((variant) => (
            <Card key={variant}>
              <CardHeader>
                <CardTitle>{variant}</CardTitle>
              </CardHeader>

              <CardContent>
                <List variant={variant}>
                  <ListItem
                    title="Design tokens"
                    description="Colours and spacing"
                  />
                  <ListItem
                    title="Themes"
                    description="Light and dark"
                  />
                </List>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pg-stack">
          {listSizes.map((size) => (
            <div key={size} className="pg-stack">
              <span className="pg-meta">{size}</span>

              <List size={size} variant="divided">
                <ListItem
                  title="Design tokens"
                  description="Colours and spacing"
                />
                <ListItem
                  title="Themes"
                  description="Light and dark"
                />
              </List>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Interactive"
        hint="onClick turns the row into a button; active and disabled states stay explicit."
      >
        <SelectableList />
      </Section>

      <Section
        title="Examples"
        hint="Slots compose avatars, badges and trailing actions."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>
                Start slot with an avatar and a trailing badge.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <List>
                <ListItem
                  start={<Avatar size="sm" name="Ada Lovelace" />}
                  title="Ada Lovelace"
                  description="Design systems"
                  end={<Badge variant="success">active</Badge>}
                />

                <ListItem
                  start={<Avatar size="sm" name="Grace Hopper" />}
                  title="Grace Hopper"
                  description="Compiler"
                  end={<Badge variant="neutral">away</Badge>}
                />

                <ListItem
                  start={<Avatar size="sm" name="Tim Berners-Lee" />}
                  title="Tim Berners-Lee"
                  description="Web standards"
                />
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>
                A bordered list with trailing actions.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <List variant="bordered">
                <ListItem
                  title="pimolu.css"
                  description="126 kB"
                  end={
                    <Button size="sm" appearance="ghost">
                      Open
                    </Button>
                  }
                />

                <ListItem
                  title="tokens.json"
                  description="18 kB"
                  end={
                    <Button size="sm" appearance="ghost">
                      Open
                    </Button>
                  }
                />

                <ListItem
                  title="themes.json"
                  description="9 kB"
                  end={
                    <Button size="sm" appearance="ghost">
                      Open
                    </Button>
                  }
                />
              </List>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
