import {
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chat,
  type PimoluChatMessage,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   DATA
========================================= */

const currentUser = {
  id: "maya",
  name: "Maya Chen",
};

const lucas = {
  id: "lucas",
  name: "Lucas Moreau",
};

const sofia = {
  id: "sofia",
  name: "Sofia Rossi",
};

const noah = {
  id: "noah",
  name: "Noah Dubois",
};

const initialMessages: PimoluChatMessage[] = [
  {
    id: "m1",
    author: lucas,
    body: "I published the semantic aliases for the next preview. The old token names still resolve, so nothing breaks yet.",
    time: "17:42",
    date: "2026-10-19",
    dateLabel: "Yesterday",
  },
  {
    id: "m2",
    author: currentUser,
    body: "Perfect. The dark theme resolves the surface and border aliases without a flash on first paint.",
    time: "17:45",
    date: "2026-10-19",
    status: "sent",
  },
  {
    id: "m3",
    author: sofia,
    body: "Here is the contrast audit. Two amber badges still fail AA against the glass preset.",
    time: "09:12",
    date: "2026-10-20",
    dateLabel: "Today",
    attachments: [
      {
        id: "attachment-audit",
        name: "contrast-audit.pdf",
        href: "#contrast-audit",
        size: 184320,
      },
    ],
  },
  {
    id: "m4",
    author: lucas,
    body: "Thanks Sofia. The two amber badges are the only blockers, so I will fix them before the preview build.",
    time: "09:15",
    date: "2026-10-20",
  },
  {
    id: "m5",
    author: currentUser,
    body: "I'll take the chart pass this morning and report back with the updated screenshots.",
    time: "09:17",
    date: "2026-10-20",
    status: "sending",
  },
];

const archivedMessages: PimoluChatMessage[] = [
  {
    id: "archived-1",
    author: noah,
    body: "This conversation is archived. Reopen it from the project settings to reply.",
    time: "16:04",
    date: "2026-10-18",
    dateLabel: "18 October",
  },
];

/* =========================================
   HELPERS
========================================= */

function nowTime() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function todayIso() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

/* =========================================
   PAGE
========================================= */

export function ChatPage() {
  const [messages, setMessages] =
    useState<PimoluChatMessage[]>(initialMessages);
  const [emptyMessages, setEmptyMessages] = useState<
    PimoluChatMessage[]
  >([]);
  const [typing, setTyping] = useState(true);
  const [notice, setNotice] = useState(
    "Enter sends · Shift + Enter adds a line."
  );

  function appendMessage(
    setter: Dispatch<SetStateAction<PimoluChatMessage[]>>,
    body: string
  ) {
    setter((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        author: currentUser,
        body,
        time: nowTime(),
        date: todayIso(),
        status: "sent",
      },
    ]);

    setNotice("Message appended locally; connect onSend to your API.");
  }

  return (
    <>
      <PageHeader
        title="Chat"
        hint="A data-driven conversation with an accessible message log, date separators, delivery states, attachments, a typing indicator and a composer that sends on Enter. The header is a slot; the styles come from @pimolu/web-styles/chat.css."
      />

      <Section
        title="Team conversation"
        hint="Messages are grouped by date and announce themselves through role=log. Outgoing messages align right, use the primary bubble and show their delivery state. The typing indicator is optional."
      >
        <div className="pg-stack">
          <div className="pg-row pg-row--between">
            <p className="pg-meta">{notice}</p>

            <Button
              size="sm"
              appearance="outline"
              onClick={() =>
                setTyping((value) => !value)
              }
            >
              {typing
                ? "Hide typing indicator"
                : "Show typing indicator"}
            </Button>
          </div>

          <Chat
            messages={messages}
            currentUserId={currentUser.id}
            onSend={(body) =>
              appendMessage(setMessages, body)
            }
            typingUsers={
              typing ? [sofia.name, lucas.name] : []
            }
            onAttach={() =>
              setNotice(
                "Attachment picker requested (demo). Wire onAttach to your file flow."
              )
            }
            header={
              <>
                <div className="pg-row">
                  <AvatarGroup
                    max={3}
                    size="sm"
                    aria-label="Conversation members"
                  >
                    <Avatar name={currentUser.name} />
                    <Avatar name={lucas.name} />
                    <Avatar name={sofia.name} />
                    <Avatar name={noah.name} />
                  </AvatarGroup>

                  <div>
                    <strong>Design system</strong>
                    <div className="pg-meta">
                      #general · 4 members
                    </div>
                  </div>
                </div>

                <Badge variant="success" dot>
                  Online
                </Badge>
              </>
            }
          />
        </div>
      </Section>

      <Section
        title="Empty and loading"
        hint="The empty state still keeps the composer available, while loading announces a polite status and disables the composer until the conversation is ready."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>New conversation</CardTitle>

              <CardDescription>
                Send the first message to open the thread.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Chat
                messages={emptyMessages}
                currentUserId={currentUser.id}
                onSend={(body) =>
                  appendMessage(setEmptyMessages, body)
                }
                aria-label="New conversation"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loading history</CardTitle>

              <CardDescription>
                A short placeholder while messages arrive.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Chat
                messages={[]}
                currentUserId={currentUser.id}
                onSend={() => {}}
                loading
                aria-label="Loading conversation"
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Read-only conversation"
        hint="The disabled prop turns the composer off while the archive stays readable. Status labels remain available to assistive technology."
      >
        <Card>
          <CardHeader>
            <CardTitle>Archived thread</CardTitle>

            <CardDescription>
              Reopen the project to reply.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Chat
              messages={archivedMessages}
              currentUserId={currentUser.id}
              onSend={() => {}}
              disabled
              aria-label="Archived conversation"
            />
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
