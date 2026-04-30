# agentic-workflows

This file is the canonical shared context for agentic-workflows. Platform-specific context files should be generated from it instead of maintained manually.

## Default workflow for code-writing tasks

For any non-trivial production code change:

1. Use `brainstorming` to clarify the work and write a spec.
2. Get approval on the spec.
3. Use `writing-plans` to create the implementation plan.
4. Start `subagent-driven-development` immediately after the plan is written.
5. Dispatch the `docs-maintainer` subagent if the change affected anything user-visible.

Skip the pipeline for throwaway scripts, doc-only changes, and trivial mechanical edits. Honor explicit user opt-out.

## Temporary workspaces

When you need to clone an external repo, download reference material, or create scratch files for analysis, put them in `./tmp/` at the project root - never in `/tmp/` or other system directories. Reads inside the project are easier to access and cleanup stays local. The consuming project should have `tmp/` in its `.gitignore`.

## Code style

Style rules are derived from canonical example files and codified in the skills in this plugin. Until a more specific convention exists, follow the conventions of the surrounding code in the consuming project.

## Test strategy

Prefer tests that verify real behavior, generated output, or drift-prone contracts.

Favor tests that protect meaningful behavior or contracts. Be cautious about tests whose only assertion is that a file exists or that prose contains particular wording; keep those only when the text itself is the contract, such as generated output or injected bootstrap guidance.
