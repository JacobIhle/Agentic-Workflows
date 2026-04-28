---
name: reviewing-code
description: Use when reviewing code changes. Focused on correctness, stability, and security.
---

# Reviewing Code

Reviews focus on three categories: correctness, stability, security.

## Scope

Review the changes, not the whole codebase. Get the diff: `git diff <base>...HEAD` or read the files named by the caller. If a finding depends on surrounding code, read enough of it to judge - but do not expand scope.

## What to look for

### Correctness
- Does the code actually do what the change claims to do?
- Edge cases: null / empty / zero / negative inputs, boundaries, unicode, timezones, locale.
- Error paths: are failures handled, or swallowed, or rethrown without context?
- Concurrency: shared state without synchronization, races, deadlocks, async/await misuse, fire-and-forget tasks.
- Off-by-one, inverted conditions, copy-paste errors that didn't get fully renamed.

### Stability
- Resource leaks: disposables not disposed, connections / handles / streams not closed, event handlers not detached.
- Unbounded growth: loops without a termination condition tied to input, caches without eviction, allocations sized by untrusted input.
- Backwards compatibility on public APIs, wire formats, and persisted data.
- Crashes on paths that should degrade gracefully (for example, a background job that takes down the host process).
- Rollout safety: is the change safe under partial deploy, and reversible without a data fix-up?

### Security
- Input validation at trust boundaries (HTTP, IPC, file, DB, message bus).
- Injection: SQL, command, template, log, header, LDAP.
- Secrets in code, configs, logs, error messages, or thrown exceptions.
- AuthN / AuthZ: every privileged operation checks the right subject and the right permission, not just "is logged in".
- Crypto: standard primitives, correct mode, proper IV / nonce, no homegrown algorithms, no MD5/SHA-1 for security purposes.
- Path traversal, unsafe deserialization, SSRF, open-redirect targets, XXE.

## Reporting

Group findings by severity:

- **Critical** - must fix before merge. Real correctness, stability, or security risk. Include `path:line`, what's wrong, and what to do.
- **Worth considering** - likely worth addressing but not blocking. Same shape, lower urgency.

Be concrete. "This could be a problem" is not a finding; "this throws on empty input at `Foo.cs:42`, which the caller does not catch" is.

If there are no critical findings, say so plainly.
