---
name: feature-development-workflow
description: Use when implementing a new feature, fixing a bug, adding behavior, or otherwise writing new production code. Drives the default development pipeline: tests first, code, review, docs.
---

# Feature Development Workflow

This is the default pipeline for any non-trivial code-writing task. Follow it unless the user explicitly opts out, the task is a throwaway script, the change is doc-only, or the work is trivial enough to not justify planning overhead.

## Pipeline

1. **Start with `brainstorming`.** Clarify requirements, ask focused questions, propose approaches, and write a spec.
2. **Get spec approval.** The approved spec is the human checkpoint for non-trivial work.
3. **Invoke `writing-plans`.** Turn the approved spec into an implementation plan.
4. **Start execution immediately.** `writing-plans` should hand off directly to `subagent-driven-development` without asking for another approval.
5. **Implement through task-by-task subagents.** Each task is implemented, checked for spec compliance, then reviewed for code quality.
6. **Dispatch the final `code-reviewer` subagent.** Review the overall change after implementation is complete.
7. **Dispatch the `docs-maintainer` subagent** if the change affected anything user-visible: public API, CLI flags, install steps, architectural shape, or configuration.

## During execution

- Subagents should follow `test-driven-development` for the code they write.
- Permission changes must start in `config/permissions.json`, then run `npm run generate:permissions`.
- Review loops are part of the workflow. Do not move on with open review findings.
- Tests should favor real runtime behavior and drift-prone contracts. Prefer tests that protect meaningful behavior or contracts over tests that only assert file presence or specific prose, unless that text is itself the contract being protected.
- Distinguish verification levels: local or mocked verification, local integration verification, and live external verification. Only claim the highest level actually verified.
- The first real external request in a task requires approval, including read-only or conventional `GET` requests.
- Once the user approves a live verification request shape, the approved live verification request may be reused within the same task without asking again. If the method, endpoint, auth scope, or request shape changes materially, ask again.
- Do not claim a live external integration works unless an approved live verification request succeeded. If only local or mocked verification ran, say that local or mocked verification passed and live external behavior remains unconfirmed.

## Optional steps

- **Security review.** For changes that touch authentication, authorization, input handling at trust boundaries, secrets management, or cryptographic code, run the built-in `/security-review` skill (or invoke a security-reviewer subagent if one exists in this project) before merging.
- **Permission changes.** If the task changes command access or tool permissions, edit `config/permissions.json` first, then run `npm run generate:permissions`. Do not edit `settings.json` directly.

## When to skip the pipeline

- **Explicit user opt-out.** "Just write this, no review needed" - honor it.
- **Throwaway scripts.** Spike code, scratch experiments, one-off automation.
- **Doc-only or config-only changes.** Skip TDD and review; docs-maintainer may still apply.
- **Trivial mechanical changes.** Renames, formatting, dependency bumps with no behavior change.

## What "dispatch" means

Use the Agent/Task tool to invoke the named subagent in a clean context. Pass the diff range or file list - don't dump conversation history.
