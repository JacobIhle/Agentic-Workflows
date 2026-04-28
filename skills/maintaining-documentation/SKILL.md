---
name: maintaining-documentation
description: Use when updating existing documentation to match recent code changes. Detects drift in README and ADRs and corrects it. Companion to the `docs-maintainer` agent. For greenfield doc writing, use `writing-documentation` instead.
---

# Maintaining Documentation

Use this skill when code has changed and existing docs may no longer match reality. The goal is to keep README and ADRs honest with minimal edits - not to rewrite or expand them.

## Process

1. **Read the diff.** `git diff <base>...HEAD` or the file list provided. Identify changes in user-visible terms:
   - Public API surface - methods, classes, signatures, return types.
   - CLI flags, environment variables, configuration keys.
   - Install / run / build steps.
   - Architectural shape - new components, removed components, changed data flow.
   - Behavior visible to consumers - error semantics, defaults, side effects.

2. **Compare against the README.** For each section, ask: does this still describe reality? If not, edit minimally - change the wrong thing, leave the rest alone.

3. **Compare against ADRs (if `docs/adr/` exists).** Look for ADRs whose decision is now contradicted by the code. If an ADR has been implicitly superseded, surface that as a finding - do not silently rewrite it. Superseding an ADR is a deliberate act for the user.

4. **Identify ADR candidates from the change.** A new non-obvious or hard-to-reverse decision in the code may warrant an ADR. Surface it as a candidate; do not write it unilaterally.

5. **Use the `writing-documentation` skill for any new content.** If a missing README section or a new ADR is needed, follow the templates and conventions there rather than restating them.

## Edit discipline

- **Minimal diffs.** Change only what's wrong. Don't restructure on the side.
- **Don't add what wasn't asked for.** No new sections unless reality demands it.
- **Don't restate the code.** If a paragraph is duplicating what's now in the source, link instead.
- **No timestamps.** Don't add "last updated" lines - git history is authoritative.

## Reporting

- **Updated** - files you changed, one-line per change.
- **ADR candidates** - decisions worth capturing, with a one-sentence reason each.
- **Superseded ADRs** - old ADRs whose decision is no longer in effect; surface for user confirmation, do not modify.
- **No-ops** - say so plainly if docs are still in sync.
