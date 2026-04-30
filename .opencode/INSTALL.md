# Installing agentic-workflows for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

Add the plugin to the `plugin` array in your project's `opencode.json`:

```json
{
  "plugin": ["agentic-workflows@git+https://github.com/JacobIhle/agentic-workflows.git"]
}
```

Restart OpenCode.

This plugin is intended to be installed per project, not globally.

The default assistant behavior is quietly orchestrated by the plugin: trivial work stays direct, while non-trivial work is routed into the full workflow.

## What gets installed

This plugin packages the OpenCode workflow bundle:

- Skills:
  - `feature-development-workflow`
  - `test-driven-development`
  - `reviewing-code`
  - `writing-documentation`
  - `maintaining-documentation`
- Agents:
  - `code-reviewer`
  - `docs-maintainer`

## How it works

The plugin does two things:

1. Registers this repo's `skills/` directory so OpenCode discovers the packaged skills.
2. Registers the packaged agents from `agents/*.md` into OpenCode's runtime agent config.

No extra bootstrap behavior is injected beyond making the original methodology available in OpenCode.

## Usage

Use OpenCode's native `skill` tool to load the methodology skills when needed.

You can invoke the packaged subagents by name with `@code-reviewer` and `@docs-maintainer`.

## Updating

OpenCode refreshes Git plugins on restart.

To pin a version:

```json
{
  "plugin": ["agentic-workflows@git+https://github.com/JacobIhle/agentic-workflows.git#v0.2.0"]
}
```
