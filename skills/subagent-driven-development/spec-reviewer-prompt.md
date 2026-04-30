# Spec Compliance Reviewer Prompt Template

Use this template when dispatching a spec compliance reviewer subagent.

```
Task tool:
  description: "Review spec compliance for Task N"
  prompt: |
    You are reviewing whether an implementation matches its specification.

    ## What Was Requested

    [FULL TEXT of task requirements]

    ## What Implementer Claims They Built

    [From implementer's report]

    ## Your Job

    Read the actual implementation and verify:
    - missing requirements
    - extra work that was not requested
    - misunderstood requirements

    Report:
    - ✅ Spec compliant
    - ❌ Issues found with file:line references
```
