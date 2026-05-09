---
name: brainstorming
description: Use before non-trivial feature work, new behavior, or meaningful design changes. Explore requirements, propose approaches, write a spec, and get approval before planning and implementation.
---

# Brainstorming Ideas Into Designs

Use this skill before non-trivial implementation work. Turn an idea into an approved spec through focused back-and-forth with the user.

## Hard gate

Do not write code, invoke implementation skills, or scaffold anything until you have:

1. explored the current project context
2. asked clarifying questions
3. proposed approaches
4. written a spec
5. gotten explicit user approval on that spec

## Process

1. **Explore project context** - check files, docs, and recent project shape.
2. **Ask clarifying questions** - one at a time. Understand purpose, constraints, and success criteria.
3. **Propose 2-3 approaches** - include trade-offs and a recommendation.
4. **Present the design** - cover architecture, components, data flow, error handling, and testing. Validate it with the user.
5. **Write the spec** - save it to `docs/specs/YYYY-MM-DD-<topic>-design.md`.
6. **Self-review the spec** - remove placeholders, contradictions, ambiguity, and scope drift.
7. **Ask for approval** - the spec approval is the only required human gate in this workflow.
8. **Invoke writing-plans skill** - once the user approves the spec, transition directly into planning.

## Questioning rules

- Ask questions one at a time.
- Prefer multiple choice when it helps the user answer quickly.
- Keep the discussion scoped to the current change.
- If the request is too large for one spec, split it into smaller sub-projects before continuing.

## Design rules

- Follow existing repo patterns.
- Keep the design small and intentional.
- Prefer clear boundaries and well-defined interfaces.
- Avoid speculative complexity.
- For repository-related scratch work, use `./tmp/` at the project root.
- Do not use `/tmp/` or other system temp directories for repository-related scratch work.

## Spec retention

- The spec is a temporary workflow artifact by default.
- Keep writing specs for non-trivial work and save them under `docs/specs/` during the workflow.
- Delete the spec by default after successful implementation and verification.
- Keep it when the user explicitly asks to keep it or when the content should become durable project documentation.
- Promote durable design records into long-lived docs such as `docs/adr/` instead of leaving transient workflow artifacts behind.

## Spec review checklist

Before asking for approval, verify:

- no `TODO`, `TBD`, or placeholders
- no internal contradictions
- requirements are specific enough for planning
- scope is small enough for a single plan

## Handoff

After the user approves the spec, invoke `writing-plans` immediately. Do not ask for another approval before planning starts.
