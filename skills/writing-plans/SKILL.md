---
name: writing-plans
description: Use when you have an approved spec or clear requirements for a non-trivial task. Write a detailed implementation plan, then immediately start execution with subagent-driven-development.
---

# Writing Plans

Write a concrete implementation plan from an approved spec. The plan should be specific enough that an implementer can execute it without re-discovering the design.

## Inputs

- approved spec document, or
- explicit requirements already validated with the user

## Process

1. **Map the file structure first** - identify files to create or modify and their responsibilities.
2. **Break the work into tasks** - each task should be a coherent slice of work.
3. **Break each task into steps** - tests first, implementation, verification.
4. **Make steps actionable** - include exact files and concrete commands where useful.
5. **Self-review the plan** - remove placeholders, contradictions, and vague instructions.
6. **Save the plan** - write it to `docs/plans/YYYY-MM-DD-<topic>.md`.
7. **Immediately start implementation** - invoke `subagent-driven-development` as the default execution path.

## Plan rules

- Prefer small, testable tasks.
- Follow TDD in the steps for code changes.
- Keep the plan aligned to the approved spec.
- Do not add a second approval gate between plan and implementation.
- For repository-related scratch work, use `./tmp/` at the project root.
- Do not use `/tmp/` or other system temp directories for repository-related scratch work.

## Plan retention

- The plan is a temporary workflow artifact by default.
- Keep writing plans for non-trivial work and save them under `docs/plans/` during the workflow.
- Delete the plan by default after successful implementation and verification.
- Keep it when the user explicitly asks to keep it or when the content should become durable project documentation.
- Promote durable records into long-lived docs such as `docs/adr/` or maintained `README` content instead of leaving transient workflow artifacts behind.

## Plan review checklist

Before execution starts, verify:

- no placeholders or TODOs
- tasks cover the full spec
- steps are actionable and ordered
- file names and function names are consistent

## Execution handoff

After writing the plan, immediately start implementation with `subagent-driven-development`.

Do not ask the user to approve the plan again.
Do not ask "Which approach?".
Do not offer alternate execution modes in this workflow.
