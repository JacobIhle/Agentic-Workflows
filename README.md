# agentic-workflows

Portable development workflows for OpenCode and Claude Code.

It provides a shared development workflow across both toolchains:

- tests first
- clean-context code review
- documentation maintenance when user-visible behavior changes

## Capability strategy

This repository stays intentionally small:

- one shared general workflow core
- one first-class .NET path
- broad generic fallback for everything else

Project stack selection is expected to come from consuming repo docs, with `AGENTS.md` preferred, then `CLAUDE.md`, then `README.md`.

See `docs/adr/0001-dotnet-first-with-generic-fallback.md` for the current direction.

## Install

### OpenCode

See `.opencode/INSTALL.md`.

Install it at the project level in the consuming repository's `opencode.json`.

### Claude Code

Install the plugin from the repository:

```text
/plugin install https://github.com/JacobIhle/agentic-workflows
```

## What's in the plugin

### Agents

- `code-reviewer` - reviews changes for correctness, stability, and security.
- `docs-maintainer` - keeps README and ADRs in sync with code changes.

### Skills

- `feature-development-workflow` - the default pipeline (TDD -> review -> docs).
- `test-driven-development` - red/green/refactor methodology.
- `reviewing-code` - used by the code-reviewer agent.
- `writing-documentation` - README and ADR conventions.
- `maintaining-documentation` - used by the docs-maintainer agent for in-sync edits.

## Platform support

This repo keeps the shared methodology content in `skills/` and `agents/`, then exposes it through both plugin systems:

- OpenCode: `skills/` is registered through the plugin at runtime and `agents/*.md` are loaded into OpenCode agent config.
- Claude Code: `.claude-plugin/`, `settings.json`, and `CLAUDE.md` provide the Claude-compatible plugin layer.

No extra bootstrap behavior is added.

## Updating permissions

Permission changes are intentionally centralized.

- Edit `config/permissions.json`
- Run `npm run generate:permissions`

That keeps both platforms aligned:

- OpenCode reads agent permissions from `config/permissions.json` at runtime
- Claude Code uses the generated `settings.json`

When using either agent system to make permission changes, the agent should update `config/permissions.json` first, then regenerate derived files rather than editing `settings.json` directly.
