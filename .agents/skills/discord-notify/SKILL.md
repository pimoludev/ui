---
name: discord-notify
description: Compose, validate and maintain Pimolu UI Discord webhook messages and release embeds. Use when the user asks for a Discord notification, webhook payload, release announcement or a change to .github/workflows/discord-release.yml.
---

# discord-notify

## Activation

Use when the user asks to:

- add or change a Discord notification for a release or a new version;
- compose or review a webhook embed (title, description, fields, footer);
- edit `.github/workflows/discord-release.yml`;
- verify a Discord webhook end to end.

Do not use for GitHub issues (`github-issue`) or for choosing a release version
(`release-manager`).

## Authorization

Posting to Discord is an external side effect. Require an explicit user request
before a test post and before adding a new notification target.

Never ask the user to paste the webhook URL in chat and never write it in a
tracked file. It lives in the repository secret `DISCORD_WEBHOOK_URL`. If it is
exposed, rotate it in Discord and update the secret.

A `workflow_dispatch` trigger is allowed only for a bounded verification, with
a dated comment in the workflow. Remove it as soon as the maintainer confirms
the message; a permanent manual test trigger is not acceptable.

## Current integration

- `.github/workflows/discord-release.yml` triggers on
  `release: types: [published]`. Prereleases are included.
- Event values are passed through `env` from `github.event.release.name`,
  `body`, `html_url`, `tag_name` and `prerelease`. Never interpolate them into
  the shell command.
- The JSON payload is built with `jq -n --arg ... --argjson color ...` and sent
  with `curl --fail --silent --show-error`.
- The job exits cleanly when `DISCORD_WEBHOOK_URL` is unset.
- `docs/ai/PROJECT_CONTEXT.md` records the workflow and its secret.

## Message contract

- `title`: release name; fall back to the tag when the name is empty.
- `description`: release body truncated to 4,096 characters; fall back to
  `Release notes: <url>` when the body is empty. Keep at least one actionable
  fact in the first lines.
- `url`: release `html_url`.
- `fields`: `Tag` (inline) and `Install` (not inline). Use `@beta` for a
  prerelease and `@latest` for a stable release.
- `color`: `0x4F46E5` (decimal `5195493`).
- `footer`: `Pimolu UI · GitHub Release`.
- Bilingual copy follows the repository convention: English first, then French,
  with equivalent facts. The release body carries both sections, so the embed
  description is copied verbatim and truncated only at the Discord limit.

## Validation

1. Run `pnpm skills:check` and parse the workflow YAML with `js-yaml` before
   pushing any workflow change.
2. `gh secret list` must show `DISCORD_WEBHOOK_URL` by name only.
3. For a bounded test, temporarily add `workflow_dispatch` with explicit
   defaults, push both `dev` and `main` (the default branch), then run
   `gh workflow run discord-release.yml --ref main`.
4. Check `gh run list --workflow discord-release.yml` and
   `gh run view <id> --log`: the env values must match the test inputs and the
   `curl` step must succeed.
5. Ask the maintainer to confirm the message in the Discord channel. An exit
   code 0 is not proof that the message looks right.
6. After confirmation, remove `workflow_dispatch` and its input fallbacks,
   repush `dev` and `main`, and confirm no further test message is posted.

## Abort conditions

- No explicit approval for a test post.
- Webhook URL exposed in a tracked file or in chat.
- Empty description, missing URL or payload above Discord's embed limits.
- Workflow fails with a missing secret without the expected clean skip.
