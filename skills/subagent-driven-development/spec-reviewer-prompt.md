# Spec Compliance Reviewer Prompt Template

Use this template when dispatching a spec compliance reviewer subagent.

```
Task tool:
  description: "Review spec compliance for full implementation"
  prompt: |
    You are reviewing whether an implementation matches its specification.

    ## What Was Requested

    [FULL TEXT of the approved spec]

    ## What Implementer Claims They Built

    [From implementer's report for the full implementation]

    ## Your Job

    Read the full implementation and verify:
    - missing requirements
    - extra work that was not requested
    - misunderstood requirements

    Report:
    - ✅ Spec compliant
    - ❌ Issues found with file:line references
```
