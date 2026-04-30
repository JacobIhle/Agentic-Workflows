# Implementer Subagent Prompt Template

Use this template when dispatching an implementer subagent.

```
Task tool:
  description: "Implement approved spec: [feature name]"
  prompt: |
    You are implementing the approved spec for: [feature name]

    ## Approved Spec

    [FULL TEXT of the approved spec - paste it here]

    ## Implementation Plan

    [Relevant plan summary or task list]

    ## Context

    [Where this fits, dependencies, and architectural context]

    ## Before You Begin

    Ask questions now if anything is unclear.

    ## Your Job

    1. Implement the full approved spec
    2. Write tests and follow TDD where appropriate
    3. Verify the implementation works
    4. Self-review your work
    5. Report back

    ## Report Format

    - Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - What you implemented
    - What you tested and test results
    - Files changed
    - Self-review findings
    - Issues or concerns
```
