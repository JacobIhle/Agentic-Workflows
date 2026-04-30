# Default Orchestrator Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the default assistant behavior in both OpenCode and Claude Code act as a quiet orchestrator that handles trivial tasks directly and routes non-trivial work through brainstorming, spec approval, planning, and subagent-driven execution.

**Architecture:** Add a dedicated orchestrator skill as the explicit routing policy, then make OpenCode load that policy automatically through plugin bootstrap. Keep Claude Code aligned through stronger ambient guidance in `CLAUDE.md`. The existing workflow skills remain modular and are invoked by the orchestrator rather than replacing it.

**Tech Stack:** Markdown skills, Node-based OpenCode plugin, repository tests with `node:test`

---

### Task 1: Add orchestrator skill and wire policy references

**Files:**
- Create: `skills/orchestrating-workflows/SKILL.md`
- Modify: `skills/feature-development-workflow/SKILL.md`
- Modify: `CLAUDE.md`
- Test: `tests/plugin.test.mjs`

- [ ] **Step 1: Write the failing tests**

Add assertions in `tests/plugin.test.mjs` that verify:
- `skills/orchestrating-workflows/SKILL.md` exists
- the orchestrator skill mentions trivial direct execution
- the orchestrator skill mentions the non-trivial chain `brainstorming`, `writing-plans`, and `subagent-driven-development`

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL because the orchestrator skill does not exist yet.

- [ ] **Step 3: Add the orchestrator skill**

Create `skills/orchestrating-workflows/SKILL.md` with routing rules:
- trivial tasks execute directly
- non-trivial tasks route through `brainstorming -> writing-plans -> subagent-driven-development`
- code review requests route to `reviewing-code` or `code-reviewer`
- docs-only requests route to documentation skills/agent
- destructive actions still require explicit confirmation

- [ ] **Step 4: Reference the orchestrator in ambient guidance**

Update `skills/feature-development-workflow/SKILL.md` and `CLAUDE.md` so the orchestrator is the default front door for non-trivial work and the existing chain remains the internal path.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

### Task 2: Make OpenCode bootstrap the orchestrator behavior by default

**Files:**
- Modify: `.opencode/plugins/agentic-workflows.js`
- Test: `tests/plugin.test.mjs`

- [ ] **Step 1: Write the failing tests**

Add assertions in `tests/plugin.test.mjs` that verify the plugin injects bootstrap guidance telling the default assistant to use the orchestrator skill as the main workflow entrypoint.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL because the plugin does not currently inject orchestrator bootstrap text.

- [ ] **Step 3: Implement bootstrap injection**

Extend `.opencode/plugins/agentic-workflows.js` to inject a small first-message bootstrap that:
- tells the assistant it should use `orchestrating-workflows` as the default workflow policy
- keeps the guidance quiet and minimal
- avoids duplicating the full skill body

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

### Task 3: Update repo docs to reflect the new default behavior

**Files:**
- Modify: `README.md`
- Modify: `.opencode/INSTALL.md`

- [ ] **Step 1: Update README**

Describe the orchestrator as the default assistant behavior and keep the explanation high-level.

- [ ] **Step 2: Update OpenCode install doc**

Keep install instructions short, but mention that the default assistant behavior is orchestrated by the plugin.

- [ ] **Step 3: Verify docs stay lightweight**

Read both files and confirm they do not become a full catalog of skills or internal workflow details.

### Task 4: Final verification

**Files:**
- Modify: none expected

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS with 0 failures.

- [ ] **Step 2: Verify no permission drift**

Run: `npm run generate:permissions && npm test`
Expected: PASS with `settings.json` still generated correctly.

- [ ] **Step 3: Review worktree**

Run: `git status --short`
Expected: Only the intended workflow files are modified.
