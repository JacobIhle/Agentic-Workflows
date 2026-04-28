---
name: feature-development-workflow
description: Use when implementing a new feature, fixing a bug, adding behavior, or otherwise writing new production code. Drives the default development pipeline: tests first, code, review, docs.
---

# Feature Development Workflow

This is the default pipeline for any non-trivial code-writing task. Follow it unless the user explicitly opts out, the task is a throwaway script, or the change is doc-only.

## Pipeline

1. **Write a failing test first.** Apply the `test-driven-development` skill. The test names the behavior you're about to add and proves it doesn't exist yet (red).
2. **Write the minimum code to pass.** No extras. Run the test to confirm green.
3. **Refactor with green tests.** Improve clarity, remove duplication, tighten naming. Tests stay green throughout.
4. **Repeat per behavior.** One test, one slice of code, one green run, before moving on.
5. **At the end of a coherent unit, dispatch the `code-reviewer` subagent.** A coherent unit is the smallest thing that stands on its own - a feature, bug fix, or refactor with a clear scope. The reviewer runs in a clean context: it has no memory of how the code was written, so it sees the result, not the journey.
6. **Address `Critical` findings before moving on.** `Worth considering` items go on a list for later or get raised with the user.
7. **Dispatch the `docs-maintainer` subagent** if the change affected anything user-visible: public API, CLI flags, install steps, architectural shape, configuration. Skip if the change is purely internal.

## Optional steps

- **Security review.** For changes that touch authentication, authorization, input handling at trust boundaries, secrets management, or cryptographic code, run the built-in `/security-review` skill (or invoke a security-reviewer subagent if one exists in this project) before merging.

## When to skip the pipeline

- **Explicit user opt-out.** "Just write this, no review needed" - honor it.
- **Throwaway scripts.** Spike code, scratch experiments, one-off automation.
- **Doc-only or config-only changes.** Skip TDD and review; docs-maintainer may still apply.
- **Trivial mechanical changes.** Renames, formatting, dependency bumps with no behavior change.

## What "dispatch" means

Use the Agent/Task tool to invoke the named subagent in a clean context. Pass the diff range or file list - don't dump conversation history.
