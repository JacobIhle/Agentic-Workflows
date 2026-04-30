# 0001 - .NET-first with generic fallback

**Status:** Accepted
**Date:** 2026-04-29

## Context

This repository is intended to be reused across many consuming projects, but it should not turn into a large catalog of half-supported language packs. The immediate need is stronger support for .NET repositories, while still remaining usable in repositories written in other languages.

The plugin already shares skills and agents across OpenCode and Claude Code. The next design pressure is capability coverage: how to support more kinds of work without creating unnecessary bloat or forcing the system to reason about every language equally well.

The consuming repositories are expected to declare their stack in project documentation such as `AGENTS.md`, `CLAUDE.md`, or `README.md`. We do not want deep codebase inspection for stack routing because that adds noise and token cost.

## Decision

Adopt a .NET-first strategy with a broad generic fallback.

The repository will keep a small general workflow core that is usable across languages, plus one first-class .NET capability layer. Stack selection should be driven by explicit project documentation, with `AGENTS.md` preferred, then `CLAUDE.md`, then `README.md`.

The generic fallback may support broad development work in other languages, but it must stay language-agnostic and avoid pretending to have stack-specific expertise when the repository has not declared it. Additional first-class language packs are not added until they are justified by repeated real usage.

## Consequences

This keeps the repository useful in mixed environments without forcing an early taxonomy of Python, Node, React, Go, and other packs. It also creates a clear place to invest depth: .NET first.

The downside is that non-.NET repositories will initially get broad generic behavior rather than polished language-specific workflows. That is intentional. A new stack should only be promoted to first-class support when the generic fallback proves insufficient often enough to justify the maintenance cost.

This also means future routing work should remain lightweight and docs-driven. If routing logic grows complex or starts inspecting code deeply, it is a sign the design is drifting away from this decision.

## Alternatives considered

General-first with rich multi-language support. Rejected because it would encourage bloat and produce shallow support across too many stacks too early.

.NET-only support. Rejected because the repository should still be usable in other projects, even if that support starts generic rather than specialized.
