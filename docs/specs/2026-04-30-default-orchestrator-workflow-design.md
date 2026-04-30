# Default Orchestrator Workflow Design

**Status:** Draft
**Date:** 2026-04-30

## Goal

Make the default assistant in both OpenCode and Claude Code act as a quiet orchestrator that handles simple work directly, but routes non-trivial work through the full workflow: brainstorming, spec approval, planning, and subagent-driven implementation.

## Context

The repository already contains shared skills and agents for TDD, code review, docs maintenance, planning, and subagent-driven execution. The next step is to make the normal user experience feel cohesive: users should interact with one default assistant, not manually choose skills for every task.

The orchestrator should feel mostly invisible. It should only interrupt the user when:

- the task is large enough to require a spec review
- a destructive or risky command needs approval
- a real blocker prevents progress

The repository should stay intentionally small. It should support one strong default workflow for non-trivial work, use a conservative threshold for deciding when that workflow is needed, and avoid deep codebase inspection for routing. Stack cues should come from project docs such as `AGENTS.md`, `CLAUDE.md`, and `README.md`.

## Decision

Use a thin orchestrator as the default assistant behavior in both platforms.

### Direct execution

The orchestrator executes trivial tasks itself.

Trivial tasks are small, low-risk changes that do not need design work and do not benefit from subagent coordination. Typical examples:

- wording or docs fixes
- simple renames without behavior change
- formatting cleanup
- small config edits
- missing import or typo-level fixes
- narrow test fixes where intended behavior is already clear

Use a conservative threshold. Borderline tasks should go through the heavier workflow rather than being handled directly.

### Non-trivial workflow

For non-trivial work, the orchestrator should quietly route into this chain:

1. `brainstorming`
2. spec creation
3. user approval of the spec
4. `writing-plans`
5. immediate handoff to `subagent-driven-development`
6. staged review and fix loop
7. final review and docs maintenance when applicable

There is only one required human gate in this flow: spec approval. There is no separate approval step between plan creation and implementation.

### Post-implementation review loop

Once the full approved spec has been implemented, the workflow should review and fix the whole change in stages rather than reviewing each task independently.

The default loop is:

1. implementer completes the full approved spec
2. spec-compliance reviewer checks whether the implementation matches the spec
3. if issues exist, a fresh fixer agent addresses only those spec-review findings
4. spec-compliance review runs again until the change is spec-clean
5. code-quality reviewer checks the resulting implementation for bugs, risky assumptions, weak tests, and maintainability issues
6. if issues exist, a fresh fixer agent addresses only those code-quality findings
7. code-quality review runs again until the change is quality-clean

The same implementer should not fix review findings by default. A fresh fixer is preferred because it is less likely to defend the original implementation.

The fixer role should be narrow:

- fix only the listed review findings
- avoid unrelated refactors or feature additions
- stop and report if a review finding appears incorrect, rather than silently overriding it

### Routing behavior

The orchestrator should remain thin. It decides which workflow to use, but the actual behavior stays in the skills and agents.

Initial routing rules:

- trivial task: execute directly
- non-trivial feature or behavior change: `brainstorming -> writing-plans -> subagent-driven-development`
- review request: route to review flow
- docs-only request: route to docs flow
- debugging/fix work: direct or routed depending on complexity

### Stack selection

Stack selection should remain docs-driven and lightweight.

- prefer `AGENTS.md`
- then `CLAUDE.md`
- then `README.md`

Do not inspect the codebase deeply just to classify the stack.

### Capability scope

Keep the repository intentionally narrow:

- one shared general core
- one future first-class `.NET` path
- broad generic fallback for everything else

The orchestrator may work broadly across languages through the generic core, but should not pretend to have stack-specific expertise unless the repo docs declare it.

## Consequences

This keeps the default user experience simple while preserving a stronger workflow for larger work. Users get one main assistant, but non-trivial tasks still receive structured design, planning, and subagent execution.

The conservative threshold means some borderline tasks will go through more process than strictly necessary. That is acceptable because it reduces the risk of building the wrong thing or skipping useful design work.

Reviewing after the full spec implementation, rather than after every task, reduces token overhead while still giving the workflow multiple fresh-agent checks before completion. The tradeoff is that some issues are found later, but that is acceptable for the current autonomy and cost goals.

This also keeps the orchestrator from becoming a blob. Routing stays simple and skills remain the source of actual behavior.

## Out of Scope

- visual companion support
- user choice between multiple execution modes
- first-class support for additional language packs beyond the current generic core and future `.NET` specialization
- deep automatic stack detection from code

## Next Implementation Step

Implement the orchestrator as the default workflow behavior for both platforms so that:

- simple tasks continue to feel direct
- non-trivial tasks automatically enter the spec-approved workflow
- plan creation flows immediately into subagent-driven execution
- the user only sees the spec approval checkpoint, plus destructive-command confirmations and real blockers
