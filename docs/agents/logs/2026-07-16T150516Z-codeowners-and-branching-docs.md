# codeowners-and-branching-docs

**Date:** 2026-07-16T150516Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
ruleset are in place except for anything relating to codeowners. Please set that up, and add to the documentation 1) what the structure is, and 2) in the documentation describing how to make your first pr, describe the waht needs to happen before their edits hit develop
```

---

## Purpose

Add CODEOWNERS and document branch/review path into develop

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added .github/CODEOWNERS assigning @College-Success-Scholars/seniors. Documented develop/main teams and rulesets in docs/dev/onboarding/branching-and-reviews.md. Updated golden-path-first-pr with the branch→PR→senior approval→develop checklist; linked from onboarding README, ask-and-dont-touch, handbook home, and mkdocs nav.

---

## Code Changes

- `docs/dev/README.md`
- `docs/dev/onboarding/README.md`
- `docs/dev/onboarding/ask-and-dont-touch.md`
- `docs/dev/onboarding/golden-path-first-pr.md`
- `mkdocs.yml`
