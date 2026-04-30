# Fixer Subagent Prompt Template

Use this template when dispatching a fresh fixer subagent after review findings.

```
Task tool:
  description: "Fix review findings for [implementation summary]"
  prompt: |
    You are fixing review findings for an already-implemented change.

    ## Implementation Context

    [Summary of the implemented change]

    ## Findings To Fix

    [Exact reviewer findings]

    ## Your Job

    1. Fix only the listed findings
    2. Keep the diff minimal
    3. Do not add new features
    4. Do not refactor unrelated code
    5. Re-run the relevant verification
    6. Report back

    ## If You Disagree

    If a finding appears incorrect or unsafe to apply as written, stop and report the disagreement.
    Do not silently ignore it.
    Do not guess at an alternative interpretation.

    ## Report Format

    - Status: DONE | BLOCKED | DISAGREEMENT
    - Findings addressed
    - Verification performed
    - Files changed
    - Any disagreements or blockers
```
