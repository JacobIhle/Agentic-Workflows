# OP Dev Superpowers

An OpenCode plugin version of the `CC-Dev-Superpowers` methodology.

It packages the same development workflow for OpenCode:

- tests first
- clean-context code review
- documentation maintenance when user-visible behavior changes

## Install

See `.opencode/INSTALL.md`.

Install it at the project level in the consuming repository's `opencode.json`.

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

## OpenCode adaptation

The original Claude Code repo used Claude plugin packaging. This repo keeps the methodology content, but exposes it through OpenCode's plugin system:

- `skills/` is registered through the plugin at runtime
- `agents/*.md` are loaded into OpenCode agent config at runtime

No `using-superpowers`-style bootstrap behavior is added.
