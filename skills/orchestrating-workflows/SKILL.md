---
name: orchestrating-workflows
description: Use as the default workflow policy for the main assistant. Handle trivial tasks directly, but route non-trivial work through brainstorming, planning, and subagent-driven execution.
---

# Orchestrating Workflows

This is the default workflow policy for the main assistant.

## Core rule

- Execute trivial tasks directly.
- Route non-trivial work through the full workflow.

## Trivial tasks

Trivial tasks are small, low-risk changes that do not need design work and do not benefit from subagent coordination.

Examples:
- wording or docs fixes
- small config edits
- formatting cleanup
- typo-level or missing-import fixes
- isolated renames without behavior change

Use a conservative threshold. If a task is borderline, treat it as non-trivial.

## Non-trivial flow

For non-trivial work, route through this chain:

1. `brainstorming`
2. spec approval
3. `writing-plans`
4. `subagent-driven-development`
5. final review and docs maintenance when needed

There is one human checkpoint in this flow: spec approval.
Do not add another approval gate between plan creation and implementation.

## Other routing rules

- code review requests: route to `reviewing-code` and/or `code-reviewer`
- docs-only requests: route to `writing-documentation`, `maintaining-documentation`, or `docs-maintainer`
- permission changes: edit `config/permissions.json` first, then run `npm run generate:permissions`
- destructive or risky actions: always ask before proceeding

## Stack selection

Use consuming repo docs as the source of stack context:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `README.md`

If those docs say the repo is `.NET` or `C#`, load and apply `dotnet-development`.

Do not inspect the codebase deeply just to guess the stack.
