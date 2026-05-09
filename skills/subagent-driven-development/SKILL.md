---
name: subagent-driven-development
description: Use when executing an implementation plan in the current session. Implement the full approved spec first, then review for spec compliance and code quality with fresh fixer passes.
---

# Subagent-Driven Development

Execute a plan by dispatching an implementer for the full approved spec, then running staged review passes with fresh fixer agents:

1. spec compliance review
2. code quality review

## Default use

This is the default execution path after `writing-plans` for non-trivial work.

## Process

1. Read the plan and approved spec, then extract the full implementation scope.
2. Dispatch one implementer using `implementer-prompt.md` to build the full approved spec.
3. If the implementer asks questions, answer them before work continues.
4. After the full approved spec is implemented, dispatch a spec reviewer using `spec-reviewer-prompt.md`.
5. If spec issues exist, dispatch a fresh fixer using `fixer-prompt.md`, then re-run spec review until the implementation is spec-clean.
6. Once spec compliance passes, dispatch a code quality reviewer using `code-quality-reviewer-prompt.md`.
7. If code quality issues exist, dispatch a fresh fixer using `fixer-prompt.md`, then re-run code quality review until the implementation is quality-clean.
8. After both review stages pass, dispatch the final `code-reviewer` agent for the overall change.

## Rules

- The implementer builds the full approved spec before review begins.
- Do not skip the spec compliance review.
- Do not start code quality review before spec compliance passes.
- Do not treat the implementation as complete while review issues remain open.
- The implementer may ask clarifying questions before or during work.
- Use a fresh fixer by default when review findings must be addressed.
- The fixer is narrow: fix only the listed findings, avoid unrelated changes, and stop and report if a finding appears incorrect.
- Fresh fixer passes are preferred over sending review findings back to the original implementer.
- For repository-related scratch work, use `./tmp/` at the project root.
- Do not use `/tmp/` or other system temp directories for repository-related scratch work.

## Integration

- Use after `writing-plans`
- Implementers should follow `test-driven-development`
- Final review uses the `code-reviewer` agent
