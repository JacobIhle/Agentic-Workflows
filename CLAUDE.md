# agentic-workflows

This file ships with the `agentic-workflows` plugin. It restates the conventions the plugin's skills enforce, as ambient reinforcement when `CLAUDE.md` is loaded.

## Default workflow for code-writing tasks

For any non-trivial production code change, follow the `feature-development-workflow` skill:

1. Use `brainstorming` to clarify the work and write a spec.
2. Get approval on the spec.
3. Use `writing-plans` to create the implementation plan.
4. Start `subagent-driven-development` immediately after the plan is written.
5. Dispatch the `docs-maintainer` subagent if the change affected anything user-visible.

Skip the pipeline for throwaway scripts, doc-only changes, and trivial mechanical edits. Honor explicit user opt-out.

## Temporary workspaces

When you need to clone an external repo, download reference material, or create scratch files for analysis, put them in `./tmp/` at the project root - never in `/tmp/` or other system directories. Reads inside the project are auto-allowed; reads outside are not, so keeping scratch work in-repo avoids permission churn and makes cleanup straightforward. The consuming project should have `tmp/` in its `.gitignore`.

## Code style

Style rules are derived from canonical example files and codified in the skills in this plugin. Until a more specific convention exists, follow the conventions of the surrounding code in the consuming project.

## Test strategy

Prefer tests that verify real behavior, generated output, or drift-prone contracts.

Favor tests that protect meaningful behavior or contracts. Be cautious about tests whose only assertion is that a file exists or that prose contains particular wording; keep those only when the text itself is the contract, such as generated output or injected bootstrap guidance.
