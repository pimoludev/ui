---
name: github-issue
description: Publish necessary, verified Pimolu UI GitHub issues with complete English and French sections. Use when the user asks to create, report, publish or update an issue, document a fixed bug for users, or decide whether an issue is warranted.
---

# github-issue

## Activation

Use when the user asks to:

- create, report or publish a GitHub issue;
- explain an upgrade to users through an issue;
- document a verified regression or compatibility problem;
- decide whether a finding needs a public issue.

Do **not** use for support questions, unverified hypotheses, internal TODOs,
ordinary refactors or every release. An issue is a public artifact, not a
commit log.

## Authorization

Creating an issue publishes it publicly. Require an explicit user request or
approval for that issue. A request to investigate, audit or fix does not
authorize publishing an issue.

The skill prepares and validates the issue, then publishes only when the user has
asked for publication. If the user only asks whether an issue is needed, stop
after the recommendation.

## Necessity gate

Publish only when **all** of these are true:

1. The problem is verified and reproducible, or the release is already fixed and
   users of a published version need the upgrade path.
2. It has user-facing impact: broken behavior, accessibility, compatibility,
   migration or a documented contract.
3. It is not a support question, an internal task, a guess, or a duplicate.
4. The issue adds information that release notes or documentation alone do not
   make discoverable, or the user explicitly asks for a public issue.

Typical necessary cases:

- a published version has a regression that users must upgrade away from;
- a compatibility problem with a common integration (Tailwind, Next.js, Vite);
- an accessibility or data-loss bug;
- a public API contract is broken and users need a workaround.

Typical cases that must **not** become issues:

- "this could maybe fail";
- a personal setup error;
- an internal refactor;
- a detail already covered by an open issue;
- a task that belongs in a pull request or changelog only.

## Bilingual contract

Every issue has English **and** French:

- title: `English title / Titre français`;
- body: `## English` then `## Français`, with the same sections and facts;
- no untranslated placeholder, no summary in only one language;
- French is properly accented (`é`, `è`, `à`, `ç`, …), not ASCII-folded;
- commands, versions, URLs and code are identical in both sections.

Keep the two sections equivalent. Do not add a claim in one language that the
other omits.

## Required content

Use [`references/issue-template.md`](references/issue-template.md). Include:

- summary and user impact;
- affected and fixed versions;
- why users should upgrade or act;
- environment and minimal reproduction;
- expected and actual behavior;
- root cause when known;
- fix, upgrade command or workaround;
- verification actually executed;
- release, changelog and documentation links;
- labels from the existing repository labels only.

Never include secrets, tokens, private customer data or unredacted logs.

## Publishing workflow

1. Confirm the repository and authentication:
   ```bash
   gh auth status
   gh repo view --json nameWithOwner,url
   ```
2. Search open and closed issues before drafting:
   ```bash
   gh issue list --state all --search "<keywords>" --limit 20
   ```
   If a matching issue exists, comment with new evidence or update it instead of
   opening a duplicate.
3. Write the body to a UTF-8 file outside the repository, based on
   `references/issue-template.md`.
4. Validate both `## English` and `## Français` sections, the version numbers,
   commands and links.
5. Publish with an existing label:
   ```bash
   gh issue create \
     --title "English title / Titre français" \
     --body-file <file> \
     --label bug
   ```
   Use `bug`, `documentation`, `enhancement`, `accessibility`, `question`,
   `good first issue`, `help wanted` or another label that already exists.
6. If the problem is already fixed in a published release, add a bilingual
   closing comment with the upgrade command and release link, then close:
   ```bash
   gh issue comment <number> --body-file <comment-file>
   gh issue close <number> --reason completed
   ```
7. Verify the rendered result:
   ```bash
   gh issue view <number> --json number,title,state,stateReason,url,labels,body
   ```
   Confirm both languages are present and the issue is in the intended state.
8. Report the issue URL and state. Do not claim publication from the command
   alone; read it back.

## Fixed-issue upgrade guidance

When the issue exists to explain an upgrade:

- state the affected version and the fixed version near the top;
- include the exact install command;
- show the supported integration order or configuration;
- give the old-version workaround only if it is safe;
- use a bilingual closing comment and `stateReason: COMPLETED`.

## Failure conditions

Abort or ask before publishing when:

- the issue has no verified reproduction or no user-facing impact;
- English or French is missing or the two sections disagree;
- a duplicate exists;
- the version or fix is not actually published;
- the body contains secrets or private data;
- the user has not authorized publication;
- a label would have to be invented.

## Validation criteria

- The necessity gate is satisfied and documented.
- The issue is bilingual, factual and self-contained.
- Duplicate search was executed.
- Labels already exist.
- The issue was read back after creation.
- Fixed issues include an upgrade path and are closed as completed when appropriate.

## Report format

```
GITHUB ISSUE
- number: <number or "not published">
- title: <bilingual title>
- state: <open/closed> (<reason>)
- labels: <list>
- necessity: <why this needed a public issue>
- duplicate check: <query and result>
- verification: <what was checked>
- url: <url or "not published">
```

## Never

- Publish an issue without an explicit request or approval.
- Create an issue for every commit or release.
- Open a duplicate without checking closed issues.
- Publish English-only or French-only content.
- Invent labels, versions, reproductions or test results.
- Include tokens, customer data or unredacted logs.
- Close a fixed issue without the release link and upgrade command.
