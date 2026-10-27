import { CustomizationExample } from "./avatar-customization-demo";
import {
  Avatar,
  AvatarGroup,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@pimolu/react";

import {
  avatarGroupSpacings,
  avatarShapes,
  avatarSizes,
} from "../demo-data";
import { PageHeader, Section } from "../section";

const members = [
  { name: "Amélie Bernard", role: "Product designer" },
  { name: "Lucas Moreau", role: "Front-end engineer" },
  { name: "Sofia Rossi", role: "Design engineer" },
];

const widerTeam = [
  "Jean Dupont",
  "Marie Laurent",
  "Pimolu Developer",
  "Nicolas Martin",
  "Sophie Bernard",
];

export function AvatarPage() {
  return (
    <>
      <PageHeader
        title="Avatar"
        hint="A user, team or profile picture with automatic initials, plus AvatarGroup to overlap several avatars behind a +N counter. Sizes, shapes and spacings are enumerated from the variant maps; the styles come from @pimolu/web-styles."
      />

      <Section title="Sizes" hint="xs, sm, md, lg and xl.">
        <div className="pg-row">
          {avatarSizes.map((size) => (
            <Avatar key={size} name="Jean Dupont" size={size} />
          ))}
        </div>
      </Section>

      <Section
        title="Shapes"
        hint="circle, rounded and square."
      >
        <div className="pg-row">
          {avatarShapes.map((shape) => (
            <Avatar
              key={shape}
              name="Marie Laurent"
              size="xl"
              shape={shape}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Image and states"
        hint="The initials stay visible until the picture is ready; a broken image falls back to them."
      >
        <div className="pg-row">
          <Avatar
            name="Jean Dupont"
            src="/avatars/jean.svg"
            size="xl"
          />

          <Avatar
            name="Marie Laurent"
            src="/avatars/missing.svg"
            size="xl"
          />

          <Avatar
            name="Pimolu"
            fallback="P"
            size="xl"
            shape="rounded"
          />

          <Avatar name="Pimolu" size="xl" shape="square" />

          <Avatar
            name="Jean Dupont"
            src="/avatars/jean.svg"
            size="xl"
            loading="eager"
          />
        </div>
      </Section>

      <Section
        title="Group"
        hint="AvatarGroup overlaps the avatars, forces a common size and shape, and turns the extra members into a single counter."
      >
        <div className="pg-stack">
          <div className="pg-row">
            {avatarGroupSpacings.map((spacing) => (
              <AvatarGroup
                key={spacing}
                spacing={spacing}
                size="lg"
                aria-label={`Team, ${spacing} spacing`}
              >
                {widerTeam.map((name) => (
                  <Avatar key={name} name={name} />
                ))}
              </AvatarGroup>
            ))}
          </div>

          <div className="pg-row">
            <AvatarGroup
              max={3}
              size="lg"
              aria-label="Capped at three"
            >
              {widerTeam.map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </AvatarGroup>

            <AvatarGroup
              max={0}
              size="lg"
              aria-label="Count only"
              getOverflowLabel={(count) =>
                `${count} membres supplémentaires`
              }
            >
              {widerTeam.map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </AvatarGroup>
          </div>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>
                Members of the design system team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                {members.map((member) => (
                  <div key={member.name} className="pg-row">
                    <Avatar name={member.name} size="sm" />

                    <div>
                      <p>{member.name}</p>
                      <p className="pg-meta">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                Author of the latest reply.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-row">
                <Avatar
                  name="Amélie Bernard"
                  src="/avatars/jean.svg"
                  size="sm"
                />

                <div>
                  <p>
                    Amélie Bernard{" "}
                    <span className="pg-meta">· 2 h ago</span>
                  </p>
                  <p className="pg-meta">
                    The initials stay readable until the picture
                    finishes loading.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project members</CardTitle>
              <CardDescription>
                Five people, three visible, the rest counted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarGroup
                max={3}
                aria-label="Project members"
              >
                {widerTeam.map((name) => (
                  <Avatar key={name} name={name} />
                ))}
              </AvatarGroup>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
