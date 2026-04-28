---
name: writing-documentation
description: Use when writing or updating a project README, or when capturing a non-trivial decision as an Architecture Decision Record (ADR).
---

# Writing Documentation

This project keeps written documentation narrow on purpose: a useful README, and ADRs for decisions that are non-obvious or hard to reverse. Anything else is overhead and rots fast.

## README

A README answers four questions, in this order:

1. **What is this?** - one or two sentences. What it does and who it's for.
2. **Why does it exist?** - the problem it solves. Skip if obvious from #1.
3. **How do I use it?** - install / run / configure, with copy-pasteable commands.
4. **Where do I go next?** - links to ADRs, deeper docs, or the entry-point code paths.

Guidelines:
- Write for someone who arrived from a search result, not someone already on the team.
- Don't restate what the code says. Link to it.
- Keep it short enough to read in one sitting. If a section is growing, it probably wants its own doc or ADR.
- Show, don't describe: a working example beats a paragraph of explanation.

## ADRs

Write an ADR when a decision is non-obvious, hard to reverse, or likely to be questioned later.

Store ADRs in `docs/adr/NNNN-short-title.md`, numbered sequentially starting at `0001`. Use this template:

```
# NNNN - Short title

**Status:** Proposed | Accepted | Superseded by ADR-NNNN
**Date:** YYYY-MM-DD

## Context
What forces are at play - constraints, requirements, prior decisions, goals. One or two short paragraphs.

## Decision
What we are doing. Phrase it as a directive, not a discussion.

## Consequences
What becomes easier, harder, or different because of this decision. Include the costs, not just the benefits.

## Alternatives considered
What else was on the table and why it was rejected. One or two sentences each.
```

Conventions:
- Keep ADRs to roughly one page. If more is needed, the ADR should link to a longer doc rather than become one.
- When superseding an ADR, mark the old one `Superseded by ADR-NNNN` and add a forward link. Do not delete the old one - the history is the value.
- Date is the date the decision was accepted, not drafted.
- An ADR is a record, not a proposal document. Once accepted, do not rewrite it; write a new ADR that supersedes it.
