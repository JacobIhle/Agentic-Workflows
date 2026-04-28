---
name: test-driven-development
description: Use when writing new code or fixing a bug. Tests come first; implementation follows. Loaded by `feature-development-workflow` and applicable on its own when adding a regression test for a fix.
---

# Test-Driven Development

Red, green, refactor. One behavior at a time, in tight loops.

## The loop

1. **Red.** Write the smallest test that names the behavior you want and currently fails. Run it. Confirm it fails for the right reason - not a typo, not a missing import, but the absent behavior. If it fails for the wrong reason, fix the test before going further.
2. **Green.** Write the minimum implementation that makes the test pass. Resist completing more of the feature than this test exercises. Run the full test suite - confirm green.
3. **Refactor.** With tests green, improve the code: extract, rename, deduplicate, simplify. Re-run after each change. Tests stay green throughout.
4. **Loop.** Pick the next behavior. Write the next test. Repeat.

## Test selection

- **Behavior, not implementation.** Test what the code is supposed to do, not how it does it. Tests that assert on internals lock in details and break during refactors.
- **One behavior per test.** Multiple assertions are fine when they describe one behavior; keep tests focused so a failure points at one thing.
- **Edge cases get their own tests.** Null/empty/zero/negative/boundary inputs are separate behaviors.
- **Bugs get a regression test first.** Before fixing, write a test that reproduces the bug. Confirm it fails. Then fix. The test stays as a regression guard.

## Anti-patterns

- **Writing implementation before the test.** This is not TDD; it's writing tests after, which usually produces tests that mirror the implementation rather than describe behavior.
- **Skipping red.** "I know it'll fail, let me just write the code." You don't actually know - sometimes the test is wrong, or the behavior already exists somewhere unexpected.
- **Refactoring while red.** Get green first. Refactor only with the safety net active.
- **One huge test that covers everything.** Tests should fail for one reason. A test that asserts ten things hides which one broke.

## When TDD doesn't fit

- **Exploratory spikes.** Throwaway code to learn a library or shape an API. Discard the spike and write tests when starting real implementation.
- **Configuration / glue.** Wiring up DI, registering routes - tests that mostly verify the framework is wired up are usually low-value.
- **UI rendering details.** Snapshot or visual tests can substitute; classical assertions are awkward.

When you skip TDD, say so explicitly so the choice is visible.
