"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Button,
  Chat,
  type PimoluChatMessage,
  AvatarGroup,
  Avatar,
  Badge
} from "@pimolu/react";

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
    body: (
      "I published the semantic aliases for the next preview. The old " +
      "token names still resolve, so nothing breaks yet."
    ),
    time: "17:42",
    date: "2026-10-19",
    dateLabel: "Yesterday",
  },
  {
    id: "m2",
    author: currentUser,
    body: (
      "Perfect. The dark theme resolves the surface and border aliases " +
      "without a flash on first paint."
    ),
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
    body: (
      "Thanks Sofia. The two amber badges are the only blockers, so I " +
      "will fix them before the preview build."
    ),
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

export function CustomizationExample() {
  const [messages, setMessages] =
    useState<PimoluChatMessage[]>(initialMessages);
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
      {
        (<>
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
                {
                  typing
                    ? "Hide typing indicator"
                    : "Show typing indicator"
                }
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
              classNames={{ root: "custom-chat-root", content: "custom-chat-content" }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-chat-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-chat-content {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
