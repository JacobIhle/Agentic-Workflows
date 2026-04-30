---
name: subagent-driven-development
description: Use when executing an implementation plan in the current session. Dispatch a fresh subagent per task, review for spec compliance first, then review code quality.
---

# Subagent-Driven Development

Execute a plan by dispatching a fresh implementer subagent per task, then running two review stages after each task:

1. spec compliance review
2. code quality review

## Default use

This is the default execution path after `writing-plans` for non-trivial work.

## Process

1. Read the plan and extract all tasks with their full text.
2. For each task:
   - dispatch an implementer subagent using `implementer-prompt.md`
   - if the subagent asks questions, answer them before work continues
   - when implementation is done, dispatch a spec reviewer using `spec-reviewer-prompt.md`
   - if spec issues exist, have the implementer fix them and re-review
   - once spec compliance passes, dispatch a code quality reviewer using `code-quality-reviewer-prompt.md`
   - if quality issues exist, have the implementer fix them and re-review
3. After all tasks are done, dispatch the final `code-reviewer` agent for the overall change.

## Rules

- Use a fresh implementer subagent per task.
- Do not skip the spec compliance review.
- Do not start code quality review before spec compliance passes.
- Do not move to the next task while review issues remain open.
- The implementer may ask clarifying questions before or during work.
- The same implementer should fix issues found in review for that task.

## Integration

- Use after `writing-plans`
- Implementers should follow `test-driven-development`
- Final review uses the `code-reviewer` agent
