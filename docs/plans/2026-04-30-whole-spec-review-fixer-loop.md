# Whole-Spec Review/Fixer Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the subagent execution workflow so the full approved spec is implemented first, then reviewed in staged passes with fresh fixer agents handling review findings.

**Architecture:** Keep the orchestrator and spec/planning flow unchanged. Modify the subagent-driven-development skill and prompt templates so implementation happens for the whole approved spec before any review. Then run a spec-compliance review, fix with a narrow fixer role, re-review until clean, then run a code-quality review with the same fresh-fixer pattern. The skill becomes the contract for this multi-agent loop.

**Tech Stack:** Markdown skills, prompt templates, repository tests with `node:test`

---

### Task 1: Update tests to reflect whole-spec review/fixer behavior

**Files:**
- Modify: `tests/plugin.test.mjs`

- [ ] **Step 1: Add failing assertions**

Extend `tests/plugin.test.mjs` to verify:
- `skills/subagent-driven-development/SKILL.md` describes full-spec implementation before review
- the skill references a fresh fixer role
- the fixer role stops and reports disagreement instead of guessing

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL because the current skill still describes per-task review with the implementer fixing issues.

### Task 2: Update subagent-driven-development workflow contract

**Files:**
- Modify: `skills/subagent-driven-development/SKILL.md`

- [ ] **Step 1: Rewrite the process section**

Change the skill so it says:
- implementer builds the full approved spec first
- spec-compliance review runs after the full implementation pass
- a fresh fixer handles spec findings
- spec review repeats until clean
- code-quality review runs next
- a fresh fixer handles quality findings
- quality review repeats until clean

- [ ] **Step 2: Update rules and integration notes**

Make the rules explicit:
- reviewers run after full implementation, not after each task
- fixer is narrow and only addresses listed findings
- fixer stops and reports if it disagrees with a review finding
- original implementer does not fix review findings by default

- [ ] **Step 3: Run tests to check updated contract**

Run: `npm test`
Expected: PASS for the new workflow assertions.

### Task 3: Add a dedicated fixer prompt template

**Files:**
- Create: `skills/subagent-driven-development/fixer-prompt.md`
- Modify: `skills/subagent-driven-development/SKILL.md`

- [ ] **Step 1: Create the fixer prompt**

Add a narrow fixer template that says:
- fix only the listed findings
- do not add features
- do not refactor unrelated code
- if a finding appears wrong, stop and report disagreement
- re-run relevant verification before reporting back

- [ ] **Step 2: Reference the fixer prompt from the skill**

Update the skill to name `fixer-prompt.md` as the template used after reviews find issues.

- [ ] **Step 3: Re-run tests**

Run: `npm test`
Expected: PASS

### Task 4: Update existing reviewer/implementer prompt templates for the new loop

**Files:**
- Modify: `skills/subagent-driven-development/implementer-prompt.md`
- Modify: `skills/subagent-driven-development/spec-reviewer-prompt.md`
- Modify: `skills/subagent-driven-development/code-quality-reviewer-prompt.md`

- [ ] **Step 1: Adjust implementer prompt**

Make it clear the implementer is responsible for the full approved spec, not an isolated task review loop.

- [ ] **Step 2: Adjust reviewer prompts**

Make both reviewer prompts explicit about reviewing the full implementation pass and returning findings that a fresh fixer will consume.

- [ ] **Step 3: Verify prompt consistency**

Read all four prompt templates and confirm the roles are consistent:
- implementer builds
- spec reviewer checks scope correctness
- fixer applies only requested fixes
- code-quality reviewer checks implementation quality

### Task 5: Final verification

**Files:**
- Modify: none expected

- [ ] **Step 1: Run full tests**

Run: `npm test`
Expected: PASS with 0 failures.

- [ ] **Step 2: Review worktree**

Run: `git status --short`
Expected: Only the intended subagent workflow files are modified.
